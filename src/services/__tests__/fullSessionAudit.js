import {
    initializeInterview,
    sendMessageToAI,
    generateAIScoring,
    getMessageCount
} from '../aiEngine.js';

async function runFullSessionAudit() {
    console.log('🚀 Starting 30-Minute Full Session Audit (YouTube HLD)...');

    const config = {
        question: {
            id: 'youtube',
            title: 'YouTube',
            description: 'Design a video sharing platform like YouTube where users can upload and view videos.',
            keyTopics: ['scalability', 'video-transcoding', 'cdn', 'caching']
        },
        companyStyle: 'google',
        difficulty: 'senior',
        type: 'hld',
        timeLimit: 45
    };

    try {
        console.log('\n--- PHASE 1: Initialization ---');
        const opening = await initializeInterview(config);
        console.log(`AI Opening: "${opening.slice(0, 150)}..."`);

        const turns = [
            // Turn 1: Requirements
            "Hi, I'm ready to start. For requirements, I'm thinking 1 Billion Daily Active Users, globally distributed. Functional: Upload videos, search, and view. Is that correct?",

            // Turn 2: Non-functional
            "For non-functional, we need high availability for viewing, and low latency global streaming. Eventual consistency for metadata is fine, but upload confirmation should be reliable.",

            // Turn 3: Scale Estimation (Intentional 10x Math Error as reported by user)
            "Let's look at the scale. 5 billion views per day works out to about 500,000 QPS. Does that seem right?",

            // Turn 4: Hint Request (Testing Fix 3: Hint Handling)
            "I'm not sure how to shard the database for this scale, can you give me a hint?",

            // Turn 5: The Pivot / Contradiction (Testing Turn 5 of user's script)
            "I'll start with PostgreSQL for metadata. Actually, on second thought, PostgreSQL might not handle the write volume. I'll switch to Cassandra sharded by video_id.",

            // Turn 6: Deep Dive - View Path
            "For viewing, the client hits an API Gateway, gets the video metadata from Cassandra, then fetches the manifest from a CDN edge node.",

            // Turn 7: Probing the specialized knowledge
            "I'll have a workers fleet for transcoding. It will generate multiple resolutions: 360p, 720p, 1080p.",

            // Turn 8: Responding to a potential challenge (Triggering turnsSinceLastChallenge)
            "I'll use a message queue like Kafka to decouple the upload from the transcoding process so we can scale workers independently.",

            // Turn 9: More details on Caching
            "I'll also have a Redis layer to cache the metadata of trending videos to reduce the hit on Cassandra.",

            // Turn 10: Finalizing
            "That's my core design. We have a distributed transcoding pipeline, NoSQL metadata storage, and a robust CDN strategy."
        ];

        let lastResponse = "";
        for (let i = 0; i < turns.length; i++) {
            const turn = turns[i];
            console.log(`\n[Turn ${i + 1}] Candidate: "${turn}"`);

            lastResponse = await sendMessageToAI(turn, {
                phaseId: i < 3 ? 'requirements' : (i < 6 ? 'high-level' : 'deep-dive'),
                messageCount: i + 1
            });

            console.log(`[Turn ${i + 1}] AI: "${lastResponse.slice(0, 200)}..."`);

            // Wait for extraction to sync
            await new Promise(resolve => setTimeout(resolve, 3000));

            // Log for detection
            const lowerRes = lastResponse.toLowerCase();
            if (lowerRes.includes('math') || lowerRes.includes('calculation') || lowerRes.includes('720')) {
                console.log('👀 [DETECTION] Math Audit triggered!');
            }
            if (lowerRes.includes('mysql') || lowerRes.includes('cassandra') || lowerRes.includes('contradict') || lowerRes.includes('earlier')) {
                console.log('👀 [DETECTION] Contradiction triggered!');
            }
            if (lowerRes.includes('latency') || lowerRes.includes('processing') || lowerRes.includes('transcoding') || lowerRes.includes('hours to process')) {
                console.log('👀 [DETECTION] Specialized Challenge (YouTube) triggered!');
            }
        }

        console.log('\n--- PHASE 2: Final Scoring ---');
        const finalMessages = [
            { role: 'user', content: 'Design YouTube' },
            { role: 'ai', content: 'Starting...' },
            ...turns.map((t, idx) => ({ role: idx % 2 === 0 ? 'user' : 'ai', content: t }))
        ];

        const scoring = await generateAIScoring(finalMessages, config);
        console.log('\n🏆 FINAL SCORE CARD:');
        console.log(JSON.stringify(scoring, null, 2));

        console.log('\n✅ Full Session Audit Complete.');
    } catch (error) {
        console.error('\n❌ Audit Crash:');
        console.error(error);
        process.exit(1);
    }
}

runFullSessionAudit();
