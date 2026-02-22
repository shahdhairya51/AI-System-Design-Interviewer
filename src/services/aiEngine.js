import { GoogleGenerativeAI } from '@google/generative-ai'
import Groq from 'groq-sdk'
import { COMPANY_STYLES, INTERVIEW_PHASES } from '../data/questions'
import { formatProblemContext, getProblemKnowledge } from '../data/problemKnowledge'
import { getRelevantFundamentals } from '../data/fundamentals'

const API_KEY = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) || (typeof process !== 'undefined' && process.env?.VITE_GEMINI_API_KEY)
const GROQ_API_KEY = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GROQ_API_KEY) || (typeof process !== 'undefined' && process.env?.VITE_GROQ_API_KEY)

let genAI = null
let groq = null
let chatSession = null
let activeModel = null
let messageHistory = [] // CC-4: Track message count for context window management
let apiHealthy = true   // CC-15: Track API health state
let currentConfig = null // AI Interviewer 2.0: Unified config state

// ═══════════════════════════════════════════════════════
//  AI Interviewer 2.0: Cognitive Engine State
//  Owned by aiEngine.js (Strict single-session isolation)
// ═══════════════════════════════════════════════════════
let candidateDesignState = {
    newDecisions: [],
    mathClaims: [],
    contradictions: []
}

let coverageMap = {
    functionalRequirements: 0,
    nonFunctionalRequirements: 0,
    scaleEstimation: 0,
    highLevelArchitecture: 0,
    databaseDesign: 0,
    cachingStrategy: 0,
    apiDesign: 0,
    failureHandling: 0,
    tradeoffs: 0,
    scalability: 0,
    security: 0,
    'technical-depth': 0, // AI Interviewer 2.0: LLD specific
    'solution-design': 0,  // AI Interviewer 2.0: LLD specific
    concurrency: 0,
    'data-structures': 0
}

let stateHistory = [] // For Interview Replay and Coachability scoring
let turnsSinceLastChallenge = 0
let totalChallengesIssued = 0 // AI Interviewer 2.0: Cap challenges
const MAX_CHALLENGES = 4

const COVERAGE_AREAS = [
    'functionalRequirements', 'nonFunctionalRequirements', 'scaleEstimation',
    'highLevelArchitecture', 'databaseDesign', 'cachingStrategy',
    'apiDesign', 'failureHandling', 'tradeoffs', 'scalability', 'security',
    'technical-depth', 'solution-design', 'concurrency', 'data-structures'
]

const FEATURES = {
    extractionPass: true,
    mathValidation: true,
    curveballInjection: true,
    organicSteering: true
}

function getClient() {
    if (!genAI && API_KEY) {
        genAI = new GoogleGenerativeAI(API_KEY)
    }
    return genAI
}

function getGroqClient() {
    if (!groq && GROQ_API_KEY) {
        groq = new Groq({
            apiKey: GROQ_API_KEY,
            dangerouslyAllowBrowser: true // Vite environment
        })
    }
    return groq
}

/**
 * AI Interviewer 2.0: Extraction Pass
 * Analyzes candidate message using Groq Llama 3.3 for lightning speed.
 */
async function extractDesignTokens(userMessage) {
    if (!FEATURES.extractionPass) return null;
    const client = getGroqClient();
    if (!client) return null;

    const extractionPrompt = `You are a structured data extractor for a system design interview.
Return ONLY valid JSON matching this schema: 
{ 
    "newDecisions": [{"component": "string", "choice": "string", "reason": "string"}], 
    "mathClaims": [{"expression": "string", "operands": [number], "statedResult": number}], 
    "coverageSignals": [{"area": "string", "depth": number}], 
    "contradictions": [{"current": "string", "prior": "string"}] 
}

RULES:
1. Extract only explicitly stated decisions.
2. coverageSignals area MUST be one of: [${COVERAGE_AREAS.join(', ')}].
3. For depth: 1 = mentioned, 2 = detailed explanation.
4. contradictions: Compare "current" message with "prior content".
   - ONLY flag if the candidate significantly changes a decision for the SAME component.
   - NOT a contradiction: "I'd use S3 for uploads" followed by "thumbnails go to S3" (Same tech, different use cases).
   - IS a contradiction: "PostgreSQL for metadata" followed by "I'll switch to Cassandra for metadata" (Mutually exclusive choices for the same component).
5. mathClaims: Extract clear arithmetic calculations about scale, storage, or traffic.
   Example: "2 billion users watching 5 videos each = 10 billion views" -> {"expression": "2B * 5 = 10B", "operands": [2000000000, 5], "statedResult": 10000000000}

Prior content: ${JSON.stringify(candidateDesignState)}
Candidate message: "${userMessage}"`;

    try {
        // Enforce 1200ms timeout for extraction to prevent blocking
        const extractionPromise = client.chat.completions.create({
            messages: [{ role: 'user', content: extractionPrompt }],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" },
        });

        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Extraction Timeout')), 1200)
        );

        const chatCompletion = await Promise.race([extractionPromise, timeoutPromise]);
        const result = JSON.parse(chatCompletion.choices[0].message.content);

        console.log('Extraction result:', JSON.stringify(result, null, 2));

        // Update local state
        if (result.newDecisions) {
            candidateDesignState.newDecisions.push(...result.newDecisions);
        }
        if (result.mathClaims) {
            candidateDesignState.mathClaims.push(...result.mathClaims);
        }
        if (result.contradictions) {
            candidateDesignState.contradictions.push(...result.contradictions);
        }
        if (result.coverageSignals) {
            result.coverageSignals.forEach(signal => {
                if (COVERAGE_AREAS.includes(signal.area)) {
                    coverageMap[signal.area] = Math.max(coverageMap[signal.area], signal.depth);
                }
            });
        }

        // Store snapshot for replay
        stateHistory.push({
            timestamp: Date.now(),
            userMessage,
            extractionResult: result,
            totalCoverage: { ...coverageMap }
        });

        return result;
    } catch (error) {
        console.warn('Extraction Pass skipped/failed:', error.message);
        return null;
    }
}

/**
 * AI Interviewer 2.0: Design Ledger Formatter
 * Formats the raw state into a human-readable block for the AI.
 */
function buildLedgerInjection(state, coverage) {
    return `
[MEMORY_SYNC - DESIGN LEDGER]
Current Decisions: ${state.newDecisions.length > 0 ? state.newDecisions.join(', ') : 'None yet'}
Active Contradictions: ${state.contradictions.length > 0 ? state.contradictions.map(c => `${c.prior} vs ${c.current}`).join(' | ') : 'None'}
Topic Coverage: ${Object.entries(coverage).filter(([_, v]) => v > 0).map(([k, v]) => `${k}:${v}`).join(', ') || 'Requirements only'}
`.trim();
}

/**
 * AI Interviewer 2.0: Math Audit
 * Validates extracted math claims using JS.
 * Returns an array of correction strings for the AI to mention.
 */
function auditMathClaims(mathClaims) {
    if (!FEATURES.mathValidation || !mathClaims || mathClaims.length === 0) return [];

    const corrections = [];
    mathClaims.forEach(claim => {
        const { operands, statedResult, expression } = claim;
        // Bug 5: Strengthen guards
        if (!operands || operands.length < 2 || operands.some(o => typeof o !== 'number') || statedResult === undefined) return;

        // Common pattern: Multiplication (QPS * seconds, Users * storage)
        const product = operands.reduce((a, b) => a * b, 1);
        const ratio = operands[0] / (operands[1] || 1);

        // Check if statedResult is significantly different from product or ratio
        const isProductMatch = Math.abs(product - statedResult) / (product || 1) < 0.1;
        const isRatioMatch = Math.abs(ratio - statedResult) / (ratio || 1) < 0.1;

        if (!isProductMatch && !isRatioMatch) {
            corrections.push(`The candidate stated that "${expression}" is ${statedResult.toLocaleString()}, but the math looks off. (Expected ~${product.toLocaleString()} if multiplying).`);
        }
    });
    return corrections;
}

const genericConflictBank = [
    // HLD Focus
    { type: 'hld', area: 'databaseDesign', challenge: "What happens if your primary database goes down for 30 seconds during a peak write period?" },
    { type: 'hld', area: 'scaleEstimation', challenge: "Your traffic just spiked 10x in 2 minutes because of a viral event. What breaks first?" },
    { type: 'hld', area: 'highLevelArchitecture', challenge: "We need to support multi-region availability. How does that change your current design?" },
    { type: 'hld', area: 'cachingStrategy', challenge: "Your cache hit rate just dropped from 90% to 10% due to a change in user patterns. How does the system handle the DB load?" },
    { type: 'hld', area: 'apiDesign', challenge: "A third-party developer is accidentally DDOSing your public API. How do you protect individual user performance?" },
    // LLD Focus (Quality 2)
    { type: 'lld', area: 'apiDesign', challenge: "What if we need to support undo/redo on this operation? How does your current design handle that?" },
    { type: 'lld', area: 'technical-depth', challenge: "Two threads call this method simultaneously with the same input. What happens?" },
    { type: 'lld', area: 'solution-design', challenge: "If we need to add a new type of entity tomorrow, how many classes do you need to modify?" }
];

// ═══════════════════════════════════════════════════════
//  CC-1: Retry with exponential backoff
// ═══════════════════════════════════════════════════════
async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const result = await fn()
            apiHealthy = true // CC-15: Mark healthy on success
            return result
        } catch (err) {
            const isRateLimit = err?.status === 429 || err?.message?.includes('429') || err?.message?.includes('quota')
            const isAuthError = err?.status === 401 || err?.status === 403 || err?.message?.includes('API_KEY') || err?.message?.includes('permission')

            // CC-15: Auth errors — don't retry, mark unhealthy
            if (isAuthError) {
                apiHealthy = false
                console.error('Gemini API key error:', err.message)
                throw err
            }

            // Last attempt — throw
            if (attempt === maxRetries - 1) {
                console.error(`Gemini API failed after ${maxRetries} attempts:`, err.message)
                throw err
            }

            // Backoff delay — longer for rate limits
            const delay = isRateLimit
                ? baseDelay * Math.pow(3, attempt) // 1s, 3s, 9s for rate limits
                : baseDelay * Math.pow(2, attempt)  // 1s, 2s, 4s for other errors
            console.warn(`Gemini API attempt ${attempt + 1} failed, retrying in ${delay}ms...`)
            await new Promise(r => setTimeout(r, delay))
        }
    }
}

// ═══════════════════════════════════════════════════════
//  CC-2: Response validation
// ═══════════════════════════════════════════════════════
function validateResponse(text) {
    if (!text || typeof text !== 'string') return false
    const trimmed = text.trim()
    if (trimmed.length < 10) return false
    // Reject responses that are just markdown artifacts or code blocks with no content
    if (/^```[\s\S]*```$/.test(trimmed) && trimmed.length < 30) return false
    // Reject if it starts with system-like prefix (model leaking)
    if (trimmed.startsWith('[System]') || trimmed.startsWith('```json')) return false
    return true
}

// ═══════════════════════════════════════════════════════
//  CC-5: Short input detection
// ═══════════════════════════════════════════════════════
function isShortInput(message) {
    const cleaned = message.replace(/[^a-zA-Z0-9\s]/g, '').trim()
    const wordCount = cleaned.split(/\s+/).filter(w => w.length > 0).length
    const shortPhrases = ['ok', 'okay', 'yes', 'no', 'sure', 'hmm', 'yeah', 'yep', 'nope', 'right', 'got it', 'i see', 'makes sense', 'sounds good', 'alright', 'fine', 'cool', 'continue', 'go on', 'next', 'go ahead']
    return wordCount <= 3 && shortPhrases.some(p => cleaned.toLowerCase().includes(p))
}

function getShortInputPrompt(userMessage) {
    return `[The candidate said: "${userMessage}" — this is very brief. As a real interviewer would, either ask them to elaborate on what they mean, OR if they're clearly agreeing with your previous point, naturally transition to the next topic or ask a probing follow-up. Don't just repeat your last question. Respond conversationally.]\n\nCandidate: ${userMessage}`
}

/**
 * Build the system prompt for the AI interviewer
 * AI Interviewer 2.0: Focuses on identity and stylistic instructions
 */
function buildSystemPrompt(config) {
    const company = COMPANY_STYLES.find(c => c.id === config.companyStyle) || COMPANY_STYLES[5]
    const problemTitle = config.question?.title || 'a system described in the job description'
    const problemDesc = config.question?.description || 'Based on the candidate\'s JD, design a relevant system.'
    const keyTopics = config.question?.keyTopics?.join(', ') || 'architecture, scalability, reliability'
    const difficultyMap = { junior: 'Junior (L3)', mid: 'Mid-Level (L4)', senior: 'Senior (L5)', staff: 'Staff+' }
    const diffLabel = difficultyMap[config.difficulty] || 'Mid-Level'
    const isLLD = config.type === 'lld'

    let jdContext = ''
    if (config.mode === 'jd' && config.jdText) {
        jdContext = `\n\nJOB DESCRIPTION PROVIDED BY CANDIDATE:\n"""${config.jdText.slice(0, 3000)}"""\n\nAnalyze this JD to tailor the interview: extract the company name, role level, tech stack, and domain. Generate a system design problem that is relevant to this role and company.`
    }

    const companyPersonality = {
        google: `You embody Google's engineering culture. Probe for elegant, scalable solutions. Care about fault tolerance and graceful degradation. Ask "What happens under failure?" Value creativity. Occasionally reference Google-scale numbers.`,
        amazon: `You embody Amazon's Leadership Principles. Naturally weave in Customer Obsession ("How does this impact the end user?"), Ownership ("Who owns this?"), Bias for Action ("What's the simplest thing we can ship first?"), and Frugality ("Can we reduce cost?"). Value practical solutions.`,
        meta: `You embody Meta's culture. Push for data-intensive solutions at FB/IG/WhatsApp scale. Ask about efficiency. Value "move fast." Reference social-graph-scale challenges.`,
        netflix: `You embody Netflix culture. Emphasize high availability, Chaos Monkey, multi-region. Discuss streaming challenges. Value operational excellence.`,
        apple: `You embody Apple's culture. Emphasize user experience, privacy, security. Ask "How would the user perceive this?" Value quality over speed.`,
        generic: `You are a balanced senior interviewer. Evaluate across all system design dimensions equally.`,
    }

    const difficultyBehavior = {
        junior: `JUNIOR BEHAVIOR: Be patient and guiding. Offer hints when stuck. Praise fundamentals. Don't require deep distributed systems knowledge. Focus on basic architecture and simple database choices.`,
        mid: `MID BEHAVIOR: Expect solid fundamentals. Probe one level deeper on each decision. They should do basic scale estimation with guidance.`,
        senior: `SENIOR BEHAVIOR: They should drive the conversation. Challenge every decision. They MUST do scale estimation. Introduce complex failure scenarios.`,
        staff: `STAFF+ BEHAVIOR: Peer discussion. Evaluate system-wide architectural thinking. Probe cross-team impact, org alignment, multi-year evolution.`,
    }

    const typeInstructions = isLLD ? `
LLD INTERVIEW: Evaluate class hierarchy, SOLID principles, design patterns, thread safety, extensibility.
Probe: "Show me your class diagram.", "Which pattern did you use? Why?", "Is this thread-safe?", "What if we add X feature?"
Watch for: God classes, primitive obsession, deep inheritance, mutable shared state.
` : `
HLD INTERVIEW: Evaluate architecture, scale estimation, database choices, caching, CAP theorem, failure handling.
If they skip scale estimation: "Before we design, can you estimate the QPS and storage needs?"
Challenge database choices: "Why SQL here? What about write throughput at scale?"
Challenge caching: "Cache-aside or write-through? What about invalidation?"
Ask about consistency: "Where on the CAP spectrum does this fall?"
Always trace data flow: "Walk me through a complete request path."
`

    return `You are a world-class ${company.name} Staff Engineer conducting a ${isLLD ? 'low-level design' : 'system design'} interview.

CRITICAL BEHAVIORAL RULES:
1. You are a REAL HUMAN INTERVIEWER. You LISTEN to what the candidate says and RESPOND to it directly.
2. If the candidate asks YOU a question (like "can you give me more context?"), ANSWER their question naturally. Provide more context about the problem. Don't ignore them.
3. If the candidate asks for help or says 'give me a hint', 'I'm not sure', or 'I don't know', provide a guiding, Socratic question that points toward the answer without giving it away. Never ignore a direct request for help.
4. If the candidate asks for clarification about the problem, GIVE IT — describe use cases, expected scale, constraints. This is NORMAL in real interviews.
5. NEVER ignore what the candidate just said. Always acknowledge and respond to THEIR actual words first.
6. Ask ONE question at a time. Keep responses to 2-4 sentences. The candidate should talk more than you.
7. Use natural speech: "Interesting.", "I see.", "Fair point.", "Walk me through that.", "Good question — let me clarify."
8. NEVER break character. Never say "As an AI." You ARE a senior engineer.
9. NEVER use [NEXT_PHASE] tags or announce phases. Your steering must be ORGANIC.
10. If a [CONTRADICTION] is flagged in your ledger, you MUST challenge the candidate on it politely but firmly.${jdContext}

INTERVIEW CONFIGURATION:
Role: ${diffLabel}
Company: ${company.name}
${companyPersonality[company.id] || companyPersonality.generic}
${difficultyBehavior[config.difficulty] || difficultyBehavior.mid}

PROBLEM:
${problemTitle}
${problemDesc}

${typeInstructions}

${config.question?.id ? formatProblemContext(config.question.id) : ''}
${getRelevantFundamentals(config.question?.keyTopics || [])}
${jdContext}

Start the interview naturally.`
}

/**
 * Initialize a new chat session for an interview
 */
export async function initializeInterview(config) {
    const client = getClient()
    currentConfig = config // AI Interviewer 2.0: Persist session config
    if (!client) {
        console.warn('No Gemini API key. Using fallback mode.')
        apiHealthy = false
        return null
    }

    messageHistory = [] // CC-4: Reset on new interview

    // AI Interviewer 2.0: Reset design state
    candidateDesignState = {
        newDecisions: [],
        mathClaims: [],
        contradictions: []
    }
    coverageMap = {
        functionalRequirements: 0,
        nonFunctionalRequirements: 0,
        scaleEstimation: 0,
        highLevelArchitecture: 0,
        databaseDesign: 0,
        cachingStrategy: 0,
        apiDesign: 0,
        failureHandling: 0,
        tradeoffs: 0,
        'technical-depth': 0,
        'solution-design': 0,
        concurrency: 0,
        'data-structures': 0
    }
    stateHistory = []
    turnsSinceLastChallenge = 0
    totalChallengesIssued = 0 // Bug 3: Reset

    currentConfig = config // AI Interviewer 2.0: Unified state management

    try {
        const model = client.getGenerativeModel({
            model: 'gemini-2.0-flash-lite',
            generationConfig: {
                temperature: 0.85,
                topP: 0.92,
                topK: 40,
                maxOutputTokens: 500,
            },
        })

        activeModel = model
        const systemPrompt = buildSystemPrompt(currentConfig)

        chatSession = model.startChat({
            history: [],
            systemInstruction: { role: 'user', parts: [{ text: systemPrompt }] },
        })

        const companyName = config.companyData?.name || COMPANY_STYLES.find(c => c.id === config.companyStyle)?.name || 'the company'
        const isLLD = config.type === 'lld'

        let openingPrompt
        if (config.mode === 'jd') {
            openingPrompt = `The interview begins now. Read the JD above, pick a relevant design problem, introduce yourself as a senior engineer at ${companyName}, state the problem in 1 sentence, and invite them to start. Keep it under 4 natural sentences. Sound human.`
        } else if (isLLD) {
            openingPrompt = `The interview begins now. Introduce yourself briefly as a senior engineer at ${companyName}. Present "${config.question?.title}" — describe what the system should do in 1 sentence. Ask them to start by identifying the core entities and clarifying requirements. Under 4 sentences. Be warm, natural.`
        } else {
            openingPrompt = `The interview begins now. Introduce yourself briefly as a senior engineer at ${companyName}. Present "${config.question?.title}" — give a 1-sentence description. Give them some context about the scale or usage if helpful, and ask where they'd like to start. Under 4 sentences. Sound like a real human.`
        }

        // CC-1: Use retry for the initial message too
        const text = await retryWithBackoff(async () => {
            const result = await chatSession.sendMessage(openingPrompt)
            const t = result.response.text()
            if (!validateResponse(t)) throw new Error('Invalid response from model')
            return t
        })

        messageHistory.push({ role: 'ai', content: text })
        return text
    } catch (err) {
        console.error('Gemini init error:', err)
        return null
    }
}

/**
 * Send a message to the AI interviewer and get a response
 * Supports multimodal: text + optional canvas image + code content
 * Includes: retry (CC-1), validation (CC-2), multimodal fallback (CC-3),
 *           context management (CC-4), short-input handling (CC-5)
 */
export async function sendMessageToAI(userMessage, context = {}) {
    if (!chatSession) {
        return getFallbackResponse(context.phaseId, context.messageCount, userMessage)
    }

    // AI Interviewer 2.0: Bug 2: Non-blocking parallel extraction
    // We fire extraction but don't await it here. It will update state for the NEXT turn.
    extractDesignTokens(userMessage).catch(err => console.warn('Extraction Pass failed:', err));

    // CC-4: Track messages for context window management
    messageHistory.push({ role: 'user', content: userMessage.slice(0, 500) })
    turnsSinceLastChallenge++;

    try {
        // Build the text part
        const phase = INTERVIEW_PHASES.find(p => p.id === context.phaseId)
        const timeStr = context.timeRemaining ? `${context.timeRemaining} min left` : ''

        // AI Interviewer 2.0: Behavior Triggers
        // Note: These use the state from the START of the turn (from previous extraction)
        let behaviorInjection = '';

        // Bug 5 & Quality: Handle Contradictions and Math Audit explicitly
        const ledgerInjection = buildLedgerInjection(candidateDesignState, coverageMap);

        if (candidateDesignState.contradictions.length > 0) {
            const latest = candidateDesignState.contradictions[candidateDesignState.contradictions.length - 1];
            behaviorInjection += `\n[DIRECTIVE: CONTRADICTION DETECTED] The candidate said "${latest.current}" but earlier stated "${latest.prior}". You MUST address this conflict before moving on.\n`;
        }

        const mathCorrections = auditMathClaims(candidateDesignState.mathClaims.slice(-3));
        if (mathCorrections.length > 0) {
            behaviorInjection += `\n[MATH_AUDIT_WARNING]: The following errors were detected in the candidate's last calculations: ${mathCorrections.join(' ')}\n`;
        }

        // Defensible Challenge Trigger (Bug 3: Capped)
        const designLedger = buildLedgerInjection(candidateDesignState, coverageMap)

        // Use currentConfig instead of undefined config
        const isLLD = currentConfig?.type === 'lld';
        const areasDeepEnough = Object.entries(coverageMap)
            .filter(([_, depth]) => depth >= 2)
            .map(([area, _]) => area);

        if (FEATURES.curveballInjection && areasDeepEnough.length > 0 &&
            turnsSinceLastChallenge >= 3 && totalChallengesIssued < MAX_CHALLENGES &&
            candidateDesignState.newDecisions.length > 0) {

            // AI Interviewer 2.0: Specialized Challenge Logic
            const problemKnowledge = getProblemKnowledge(currentConfig?.question?.id);
            const specializedChallenges = problemKnowledge?.conflictBank || [];

            // Filter specialized challenges by area if possible, else allow any from the bank
            const problemSpecific = specializedChallenges.filter(c => areasDeepEnough.includes(c.area));

            let challenge;
            if (problemSpecific.length > 0) {
                challenge = problemSpecific[Math.floor(Math.random() * problemSpecific.length)].challenge;
            } else {
                const relevantChallenges = genericConflictBank.filter(c => c.type === (isLLD ? 'lld' : 'hld'));
                if (relevantChallenges.length > 0) {
                    const areaToChallenge = areasDeepEnough[Math.floor(Math.random() * areasDeepEnough.length)];
                    challenge = relevantChallenges.find(c => c.area === areaToChallenge)?.challenge
                        || relevantChallenges[0].challenge;
                } else {
                    challenge = "Tell me more about the scalability of your design."; // Fallback
                }
            }

            behaviorInjection += `\n[ACTION: CHALLENGE]: Issue this challenge to the candidate naturally: "${challenge}"\n`;
            turnsSinceLastChallenge = 0;
            totalChallengesIssued++;
        }

        const company = COMPANY_STYLES.find(c => c.id === currentConfig?.companyStyle) || COMPANY_STYLES[5]
        const coverageContext = `\n[COVERAGE MAP]\n${Object.entries(coverageMap).map(([area, depth]) => `- ${area}: ${['Not Started', 'Mentioned', 'Detailed', 'Challenged'][depth]}`).join('\n')}`;
        const signatureProbes = company.signatureProbes ? `\n\n[COMPANY SIGNATURE PROBES]\n${company.signatureProbes.map(p => `- ${p}`).join('\n')}` : '';

        // AI Interviewer 2.0: State Injection
        const fullInjection = `
${ledgerInjection}
${coverageContext}
${signatureProbes}
${behaviorInjection}
`.trim();

        // CC-5: Short input handling
        let textPart
        if (isShortInput(userMessage)) {
            textPart = `[${phase?.name || ''}${timeStr ? ' | ' + timeStr : ''}]\n${fullInjection}\n\n${getShortInputPrompt(userMessage)}`
        } else {
            textPart = `[${phase?.name || ''}${timeStr ? ' | ' + timeStr : ''}]\n${fullInjection}\n\nCandidate: ${userMessage}`
        }

        // Add code context if present
        if (context.codeContent && context.codeContent.trim().length > 20) {
            textPart += `\n\n[Candidate's code editor currently shows:\n\`\`\`\n${context.codeContent.slice(0, 2000)}\n\`\`\`]`
        }

        // CC-4: Trim very long messages
        if (textPart.length > 4000) {
            textPart = textPart.slice(0, 4000) + '\n[... truncated for brevity]'
        }

        let responseText

        // CC-3: Try multimodal, fall back to text-only if it fails
        if (context.canvasImageBase64 && activeModel) {
            textPart += `\n\n[A snapshot of the candidate's whiteboard is attached. LOOK at it and reference specific things you see — boxes, labels, arrows, components, text. Comment on their diagram naturally.]`

            try {
                responseText = await retryWithBackoff(async () => {
                    const result = await chatSession.sendMessage([
                        { text: textPart },
                        { inlineData: { mimeType: 'image/png', data: context.canvasImageBase64 } },
                    ])
                    return result.response.text()
                }, 2) // Only 2 retries for multimodal (large payload)
            } catch (multimodalErr) {
                // CC-3: Fallback to text-only
                console.warn('Multimodal send failed, falling back to text-only:', multimodalErr.message)
                textPart = textPart.replace('[A snapshot of the candidate\'s whiteboard is attached. LOOK at it and reference specific things you see — boxes, labels, arrows, components, text. Comment on their diagram naturally.]',
                    '[The candidate has a diagram on their whiteboard showing their system architecture.]')
                responseText = await retryWithBackoff(async () => {
                    const result = await chatSession.sendMessage(textPart)
                    return result.response.text()
                })
            }
        } else {
            // Text-only path
            if (context.hasDrawing) {
                textPart += `\n\n[The candidate has a diagram on their whiteboard.]`
            }

            responseText = await retryWithBackoff(async () => {
                const result = await chatSession.sendMessage(textPart)
                return result.response.text()
            })
        }

        // CC-2: Validate response
        if (!validateResponse(responseText)) {
            console.warn('Invalid AI response, retrying once...')
            try {
                const retryResult = await chatSession.sendMessage('Please respond naturally to what the candidate just said. Keep it conversational, 2-4 sentences.')
                responseText = retryResult.response.text()
            } catch (e) {
                // Fall through to fallback
            }
            if (!validateResponse(responseText)) {
                responseText = getFallbackResponse(context.phaseId, context.messageCount, userMessage)
            }
        }

        // CC-4: Track AI response
        messageHistory.push({ role: 'ai', content: responseText.slice(0, 500) })

        // CC-4: Context window management — if too many messages, warn in console
        if (messageHistory.length > 80) {
            console.warn(`Interview has ${messageHistory.length} messages. Context window may be nearing limit.`)
        }

        return responseText
    } catch (err) {
        console.error('Gemini chat error:', err)

        // CC-15: Check if this is an auth error
        if (err?.status === 401 || err?.status === 403 || err?.message?.includes('API_KEY')) {
            apiHealthy = false
        }

        return getFallbackResponse(context.phaseId, context.messageCount, userMessage)
    }
}

/**
 * Send a time's-up message to the AI (CC-11 support)
 */
export async function sendTimesUpToAI() {
    if (!chatSession) return null
    try {
        const result = await chatSession.sendMessage(
            '[SYSTEM: Time is up for this interview. Please wrap up naturally with ONE brief closing remark — acknowledge what they covered, mention one thing they did well, and say goodbye. Keep it to 2-3 sentences. Do NOT ask any more questions.]'
        )
        return result.response.text()
    } catch (err) {
        return "That's our time! Thanks for walking me through your design — you covered some solid ground. Best of luck!"
    }
}

/**
 * Generate comprehensive scoring using Gemini
 * CC-9: Hardened JSON parsing with cleanup and retry
 */
export async function generateAIScoring(messages, config) {
    const client = getClient()
    if (!client) return null
    if (config) currentConfig = config; // Update if provided

    // CC-10: Handle too-short interviews
    if (!messages || messages.length < 4) {
        return {
            tooShort: true,
            dimensions: [
                { id: 'problem-navigation', score: 0, feedback: 'Interview was too short to evaluate requirements gathering.' },
                { id: 'solution-design', score: 0, feedback: 'Interview was too short to evaluate solution design.' },
                { id: 'technical-depth', score: 0, feedback: 'Interview was too short to evaluate technical depth.' },
                { id: 'tradeoff-analysis', score: 0, feedback: 'Interview was too short to evaluate trade-off analysis.' },
                { id: 'communication', score: 0, feedback: 'Interview was too short to evaluate communication skills.' },
            ],
            softSkills: [
                { id: 'clarity', score: 0 },
                { id: 'structure', score: 0 },
                { id: 'pressure', score: 0 },
                { id: 'listening', score: 0 },
                { id: 'confidence', score: 0 },
            ],
            strengths: ['Interview was too brief for a meaningful evaluation'],
            improvements: ['Aim for at least 10-15 minutes of conversation for comprehensive feedback'],
            overallVerdict: 'The interview was too short to provide a meaningful assessment. We recommend completing at least 10-15 minutes of discussion covering requirements, architecture, and a deep dive for a proper evaluation.',
        }
    }

    try {
        const model = client.getGenerativeModel({
            model: 'gemini-2.0-flash-lite',
            generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 2000,
                responseMimeType: 'application/json',
            },
        })

        const transcript = messages.map(m =>
            `${m.role === 'ai' ? 'Interviewer' : 'Candidate'}: ${m.content}`
        ).join('\n\n')

        const isLLD = config?.type === 'lld' || currentConfig?.type === 'lld' // Bug 1: Fix scope
        const designStateSummary = JSON.stringify(candidateDesignState);
        const historySummary = stateHistory.map(h => ({
            turn: h.timestamp,
            extract: h.extractionResult,
            progress: h.totalCoverage
        })).slice(-10); // Last 10 snapshots for context

        const scoringCriteria = isLLD
            ? `Evaluate this LOW-LEVEL DESIGN interview:
- "problem-navigation": Requirements, entity identification, scoping
- "solution-design": Class hierarchy, interfaces, abstractions, design patterns
- "technical-depth": Code quality, methods, data structures, thread safety, concurrency handling
- "tradeoff-analysis": SOLID principles, extensibility, pattern trade-offs
- "coachability": Did they listen to feedback? Did they fix contradictions? (Detailed in HISTORY)
- "communication": Explained decisions clearly, thought process visible`
            : `Evaluate this HIGH-LEVEL DESIGN interview:
- "problem-navigation": Requirements, scale estimation, scope definition
- "solution-design": Architecture, components, data flow, justified choices
- "technical-depth": Database design, caching, APIs, algorithms, deep component dives
- "tradeoff-analysis": CAP theorem, consistency models, failure handling, cost
- "coachability": Did they listen to feedback? Did they fix contradictions or math errors? (Detailed in HISTORY)
- "communication": Structured approach, trade-off explanations, handled pushback`

        const prompt = `You are a senior engineering hiring manager scoring a ${isLLD ? 'low-level design' : 'system design'} interview.

CONTEXT:
- Problem: ${config?.question?.title || currentConfig?.question?.title || 'JD-Based'}
- Type: ${config?.type?.toUpperCase() || currentConfig?.type?.toUpperCase()}
- Difficulty: ${config?.difficulty || currentConfig?.difficulty}
- Final Design State: ${designStateSummary}

DESIGN HISTORY (Snapshots):
${JSON.stringify(historySummary)}

TRANSCRIPT:
"""
${transcript.slice(0, 8000)}
"""

${scoringCriteria}

CRITICAL RULES FOR SCORING:
1. **CHECK COVERAGE:** Read the transcript to see which phases the candidate actually reached.
   - If they only did "Requirements Gathering", you CANNOT score "Solution Design", "Technical Depth", or "Trade-off Analysis".
   - **FOR UNREACHED SECTIONS:** Return a score of 0 and feedback "Not reached in this session."
2. **HINT NUANCE (Coachability):** Asking for hints is acceptable and normal in FAANG interviews. 
   - DO NOT penalize for asking for a hint. 
   - ONLY penalize if they repeatedly ignore hints, or ask for hints on core basics without any prior attempt to reason through them.
3. **DO NOT HALLUCINATE:** Do not invent feedback for topics that were not discussed.
4. **SHORT SESSIONS:** If the session is short (<10 mins) and they only covered requirements, give normal scores for "problem-navigation" and "communication", but 0s for everything else.

Return JSON:
{
  "dimensions": [
    {"id": "problem-navigation", "score": <1-10>, "feedback": "<feedback>"},
    {"id": "solution-design", "score": <0-10>, "feedback": "<feedback>"},
    {"id": "technical-depth", "score": <0-10>, "feedback": "<feedback>"},
    {"id": "tradeoff-analysis", "score": <0-10>, "feedback": "<feedback>"},
    {"id": "coachability", "score": <0-10>, "feedback": "<feedback based on contradiction resolution>"},
    {"id": "communication", "score": <1-10>, "feedback": "<feedback>"}
  ],
  "softSkills": [
    {"id": "clarity", "score": <1-10>},
    {"id": "structure", "score": <1-10>},
    {"id": "pressure", "score": <1-10>},
    {"id": "listening", "score": <1-10>},
    {"id": "confidence", "score": <1-10>}
  ],
  "strengths": ["<specific strength>", "<specific strength>", "<specific strength>"],
  "improvements": ["<specific improvement>", "<specific improvement>", "<specific improvement>"],
  "overallVerdict": "<1 paragraph: hire/lean-hire/lean-no-hire/no-hire recommendation with justification>"
}

Guidelines: 8-10 = exceptional, 6-7 = solid, 4-5 = below expectations, 1-3 = not ready, 0 = Not covered. Reference SPECIFIC things the candidate said.`

        // CC-9: Retry scoring with JSON parse hardening
        return await retryWithBackoff(async () => {
            const result = await model.generateContent(prompt)
            let text = result.response.text()

            // CC-9: Clean up common JSON issues
            text = text.trim()
            // Strip markdown code fences
            if (text.startsWith('```json')) text = text.slice(7)
            if (text.startsWith('```')) text = text.slice(3)
            if (text.endsWith('```')) text = text.slice(0, -3)
            text = text.trim()
            // Fix trailing commas before } or ]
            text = text.replace(/,\s*([\]}])/g, '$1')

            const parsed = JSON.parse(text)

            // Validate the structure
            if (!parsed.dimensions || !Array.isArray(parsed.dimensions) || parsed.dimensions.length < 5) {
                throw new Error('Invalid scoring structure')
            }

            return parsed
        }, 2) // 2 retries for scoring
    } catch (err) {
        console.error('Scoring error:', err)
        return null
    }
}

/**
 * Parse a JD to extract company info
 */
export async function parseJobDescription(jdText) {
    const client = getClient()
    if (!client) return null

    try {
        const model = client.getGenerativeModel({
            model: 'gemini-2.0-flash-lite',
            generationConfig: { temperature: 0.2, maxOutputTokens: 500, responseMimeType: 'application/json' },
        })

        const prompt = `Extract key information from this job description and return JSON:
{
  "companyName": "<company name>",
  "roleLevel": "<junior|mid|senior|staff>",
  "techStack": ["<tech1>", "<tech2>"],
  "domain": "<industry/domain>",
  "suggestedProblem": "<a system design problem relevant to this role>",
  "suggestedDescription": "<1-2 sentence description of the problem>"
}

JD: """${jdText.slice(0, 3000)}"""`

        return await retryWithBackoff(async () => {
            const result = await model.generateContent(prompt)
            let text = result.response.text().trim()
            if (text.startsWith('```json')) text = text.slice(7)
            if (text.startsWith('```')) text = text.slice(3)
            if (text.endsWith('```')) text = text.slice(0, -3)
            return JSON.parse(text.trim())
        }, 2)
    } catch (err) {
        console.error('JD parse error:', err)
        return null
    }
}

/**
 * Fallback responses — context-aware and conversational
 */
function getFallbackResponse(phaseId, messageCount, userMessage = '') {
    const msg = userMessage.toLowerCase()

    // If candidate asks a question, respond naturally
    if (msg.includes('?') || msg.includes('context') || msg.includes('clarify') || msg.includes('more about') || msg.includes('explain') || msg.includes('tell me') || msg.includes('what do you mean') || msg.includes('can you')) {
        const clarifications = [
            "Sure, happy to clarify. Think about this system from the perspective of a large-scale internet service — we're talking millions of users, global reach, and the need for both high availability and decent latency. What features would you consider essential for the core MVP?",
            "Good question! Let's frame it this way — imagine you're building this for a tech company that needs to handle significant traffic. Start by thinking about the core user flows. What does a typical user journey look like? That'll help us define the functional requirements together.",
            "Absolutely, let me give you some more context. This system needs to work at internet scale. Think about what the primary operations are, who the users are, and what quality of service they expect. Once you have a mental model of that, walk me through your initial requirements.",
        ]
        return clarifications[Math.floor(Math.random() * clarifications.length)]
    }

    // If candidate mentions specific technology, engage with it
    if (msg.includes('database') || msg.includes('sql') || msg.includes('mongo') || msg.includes('postgres') || msg.includes('dynamo')) {
        return "Interesting choice. Can you walk me through your reasoning? What are the **read-to-write patterns** you expect, and how does that influence your database selection here?"
    }
    if (msg.includes('redis') || msg.includes('cache') || msg.includes('memcache')) {
        return "Good thinking on the caching layer. Walk me through the strategy — are you thinking **cache-aside** or **write-through**? And what's your invalidation approach when the underlying data changes?"
    }
    if (msg.includes('api') || msg.includes('endpoint') || msg.includes('rest') || msg.includes('grpc')) {
        return "Good, let's dig into that API design. What does the request and response look like for the primary operations? And how would you handle **authentication** and **rate limiting**?"
    }
    if (msg.includes('kafka') || msg.includes('queue') || msg.includes('async') || msg.includes('event') || msg.includes('pub') || msg.includes('subscribe')) {
        return "I like that you're thinking about async processing. What guarantees do you need here — **at-least-once** or **exactly-once** delivery? And how would you handle messages that fail to process?"
    }
    if (msg.includes('load balancer') || msg.includes('nginx') || msg.includes('gateway')) {
        return "Good call on the load balancing. What algorithm would you use — **round robin**, **least connections**, or something more sophisticated? And are you thinking **L4 or L7** balancing here?"
    }
    if (msg.includes('class') || msg.includes('interface') || msg.includes('abstract') || msg.includes('inherit') || msg.includes('pattern')) {
        return "I see you're thinking about the class structure. Can you walk me through the **key relationships** between these classes? Are there any **design patterns** you'd apply here?"
    }
    if (msg.includes('scale') || msg.includes('million') || msg.includes('billion') || msg.includes('rps') || msg.includes('qps')) {
        return "Good, let's nail down those numbers. Can you do some **back-of-envelope math** for me? How many requests per second, and how much storage would we need per year?"
    }

    // If candidate seems stuck or unsure
    if (msg.includes('not sure') || msg.includes('don\'t know') || msg.includes('maybe') || msg.includes('i think') || msg.includes('hmm') || msg.includes('let me think')) {
        return "Take your time — there's no single right answer here. Think about what the **most critical path** is for the user. Start there and we can iterate on the rest."
    }

    // Short acknowledgments
    if (isShortInput(userMessage)) {
        const nudges = [
            "Could you elaborate on that a bit? I'd love to hear your reasoning in more detail.",
            "I see. What specific aspect are you thinking about? Walk me through your thought process.",
            "Got it. Let's keep moving — what would you tackle next in the design?",
        ]
        return nudges[Math.floor(Math.random() * nudges.length)]
    }

    // Phase-specific fallbacks
    const responses = {
        requirements: [
            "That's a solid start on the requirements. I'd love to hear your thoughts on the non-functional side too — what **latency targets** and **availability guarantees** should we aim for?",
            "Good thinking. Let's also nail down the scale — roughly how many daily active users are we designing for, and what's the expected **read-to-write ratio**?",
            "Those are the right questions to ask. Before we move on, do you have thoughts on the **consistency model** we need? Does every operation need to be strongly consistent?",
            "Solid requirements. One more thing — what about **data retention**? How long do we keep this data, and what are the storage implications at scale?",
        ],
        'high-level': [
            "I like the direction you're heading. Could you trace the **data flow** for the main use case? Start from the user's request and walk me through each component until we get a response.",
            "Interesting architecture. What made you choose this approach over the alternatives? I'm curious about the **trade-offs** you considered.",
            "Solid foundation. How are these services going to **communicate**? Synchronous REST, async messaging, or a mix? And what happens when one of them is unavailable?",
            "Good components. Let's talk about the **database layer** — what would your schema look like? What are the key tables and relationships?",
            "I see the architecture. Tell me about the **load balancer** — what algorithm would you use and how would you handle session affinity?",
        ],
        'deep-dive': [
            "Let's zoom into the most critical part of your design. Can you walk me through the **database schema**? What tables, what indexes, and how would you handle the hottest queries?",
            "You mentioned caching — tell me more about the strategy. **Cache-aside or write-through?** What's your invalidation approach?",
            "Good design so far. What happens when this component is under heavy load — say a **hot partition** scenario? How does your architecture handle it?",
            "Tell me about **failure handling** here. What happens when this component crashes mid-operation? Is the operation idempotent?",
        ],
        tradeoffs: [
            "Imagine traffic **increases 10x** next quarter. Where's the first bottleneck in your current design, and how would you address it?",
            "What if an entire **data center goes down** during peak hours? Walk me through your failover strategy.",
            "If we needed to **cut infrastructure costs by 40%**, where would you start making trade-offs without significantly hurting user experience?",
        ],
        wrapup: [
            "Great discussion! If you could **start over** with what you know now, what would you design differently?",
            "Final question — what's the **biggest risk** in your current design, and how would you mitigate it?",
        ],
    }
    const pool = responses[phaseId] || responses.requirements
    const idx = Math.min(Math.floor((messageCount || 0) / 2), pool.length - 1)
    return pool[idx]
}

// CC-15: Expose API health status
export function isAPIConfigured() {
    return !!API_KEY
}

export function isAPIHealthy() {
    return apiHealthy
}

export function getMessageCount() {
    return messageHistory.length
}

/**
 * AI Interviewer 2.0: Expose coverage and state for UI and Replay
 */
export function getCurrentCoverage() {
    return { ...coverageMap };
}

export function getDesignState() {
    return { ...candidateDesignState };
}

export function getStateHistory() {
    return [...stateHistory];
}

/**
 * Calculates total interview progress (0-100) based on coverage depth.
 * Used for organic phase steering in the UI.
 */
export function getInterviewProgress() {
    const totalPossibleDepth = COVERAGE_AREAS.length * 2; // 0-2 scale for progress mapping
    const currentDepth = Object.values(coverageMap).reduce((sum, d) => sum + Math.min(d, 2), 0);
    return Math.round((currentDepth / totalPossibleDepth) * 100);
}
