import {
    initializeInterview,
    sendMessageToAI,
} from '../aiEngine.js';

async function runSpecializedAudit() {
    console.log('🚀 Starting Specialized Content Audit...');

    try {
        // Test Case 1: Twitter Celebrity Fan-out
        console.log('\n--- Test Case 1: Twitter (HLD) ---');
        const twitterConfig = {
            question: { id: 'twitter', title: 'Twitter' },
            companyStyle: 'google',
            difficulty: 'senior',
            type: 'hld',
            timeLimit: 45
        };

        console.log('Initializing Twitter interview...');
        await initializeInterview(twitterConfig);

        const twitterTurns = [
            "I'll start with the requirements. 400M DAU, 500M tweets per day.",
            "For the database, I'll use MySQL sharded by user_id for tweets.",
            "I'll use a hybrid fan-out approach: push for followers, pull for celebrities.",
            "I'll also implement a Redis cache for the home timeline."
        ];

        for (const turn of twitterTurns) {
            console.log(`\nCandidate: "${turn}"`);
            const response = await sendMessageToAI(turn, { phaseId: 'architecture', messageCount: 1 });
            console.log(`AI: "${response.slice(0, 100)}..."`);

            console.log('Waiting for extraction pass...');
            await new Promise(resolve => setTimeout(resolve, 3000));

            const lowerRes = response.toLowerCase();
            if (lowerRes.includes('celebrity') || lowerRes.includes('fanout') || lowerRes.includes('hashtag') || lowerRes.includes('delete')) {
                console.log('✅ Specialized Challenge Detected in AI response!');
            }
        }

        // Test Case 2: Parking Lot (LLD)
        console.log('\n--- Test Case 2: Parking Lot (LLD) ---');
        const parkingConfig = {
            question: { id: 'parking-lot', title: 'Parking Lot' },
            companyStyle: 'meta',
            difficulty: 'mid',
            type: 'lld',
            timeLimit: 45
        };

        console.log('Initializing Parking Lot interview...');
        await initializeInterview(parkingConfig);

        const parkingTurns = [
            "I'll have classes for ParkingLot, Floor, and Spot.",
            "I'll use a Singleton for the ParkingLot class.",
            "I'll have a method calculateFee in the PaymentStrategy.",
            "I'll implement the parkVehicle method to find a spot with a mutex."
        ];

        for (const turn of parkingTurns) {
            console.log(`\nCandidate: "${turn}"`);
            const response = await sendMessageToAI(turn, { phaseId: 'design', messageCount: 1 });
            console.log(`AI: "${response.slice(0, 100)}..."`);

            console.log('Waiting for extraction pass...');
            await new Promise(resolve => setTimeout(resolve, 3000));

            const lowerRes = response.toLowerCase();
            if (lowerRes.includes('thread') || lowerRes.includes('concurrency') || lowerRes.includes('race') || lowerRes.includes('mutex') || lowerRes.includes('pricing')) {
                console.log('✅ Specialized LLD Challenge Detected!');
            }
        }

        console.log('\n✅ Specialized Audit Complete.');
    } catch (error) {
        console.error('\n❌ Audit Failed:');
        console.error(error);
        process.exit(1);
    }
}

runSpecializedAudit();
