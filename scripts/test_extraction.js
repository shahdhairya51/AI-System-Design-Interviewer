import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const groq = new Groq({
    apiKey: process.env.VITE_GROQ_API_KEY,
});

const COVERAGE_AREAS = [
    'functionalRequirements', 'nonFunctionalRequirements', 'scaleEstimation',
    'highLevelArchitecture', 'databaseDesign', 'cachingStrategy',
    'apiDesign', 'failureHandling', 'tradeoffs'
];

const testCases = [
    {
        name: "Basic Decision",
        message: "I'll use Cassandra for high write throughput.",
        priorState: {},
    },
    {
        name: "Contradiction (SQL -> NoSQL)",
        message: "Actually, let's go with MongoDB instead of PostgreSQL since we need flexibility.",
        priorState: {
            newDecisions: [{ component: "database", choice: "PostgreSQL", reason: "ACID compliance" }]
        }
    },
    {
        name: "Math Claim (Correct)",
        message: "10 million users with 10 requests each is 100 million requests per day.",
        priorState: {}
    },
    {
        name: "Math Claim (Incorrect)",
        message: "With 1M users and 100 requests each, that's roughly 10,000 QPS.",
        priorState: {} // 1M * 100 / 86400 is ~1157 QPS, not 10k
    },
    {
        name: "Uncertainty/Signal",
        message: "Maybe we should use Redis for caching, I'm not sure yet.",
        priorState: {}
    },
    {
        name: "Contradiction (Consistency)",
        message: "We absolutely need strong consistency for the ledger.",
        priorState: {
            newDecisions: [{ component: "database", choice: "Cassandra", reason: "availability" }]
        } // Cassandra is AP, contradiction to strong consistency.
    },
    {
        name: "Coverage Signals",
        message: "Let's talk about the database schema and how partitioning works.",
        priorState: {}
    }
];

async function runTest(testCase) {
    console.log(`\nTesting: ${testCase.name}`);
    console.log(`Message: "${testCase.message}"`);

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
4. contradictions: compare "current" message with "prior content".

Prior content: ${JSON.stringify(testCase.priorState)}
Candidate message: "${testCase.message}"`;

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: extractionPrompt }],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" },
        });

        const result = JSON.parse(chatCompletion.choices[0].message.content);
        console.log('Result:', JSON.stringify(result, null, 2));
        return result;
    } catch (error) {
        console.error('Extraction Failed:', error.message);
        return null;
    }
}

import fs from 'fs';

async function main() {
    console.log("Starting Extraction Pass Isolated Testing...");
    const allResults = [];
    for (const test of testCases) {
        const result = await runTest(test);
        allResults.push({ name: test.name, message: test.message, result });
        await new Promise(r => setTimeout(r, 500));
    }
    fs.writeFileSync('scripts/test_results.json', JSON.stringify(allResults, null, 2));
    console.log("Results written to scripts/test_results.json");
}

main();
