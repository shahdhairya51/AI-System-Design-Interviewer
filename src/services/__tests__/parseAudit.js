const fs = require('fs');
const content = fs.readFileSync('full_session_v8.2_audit.log', 'utf16le');

console.log('--- REFINEMENT VERIFICATION: TURN 10 CHECK ---');

const turns = content.match(/\[Turn \d+\] AI: ".*?"/g);
if (turns) {
    console.log('Captured ' + turns.length + ' AI turns.\n');
    turns.forEach((t, i) => {
        if (i >= 2 && i <= 5) { // Turns 3, 4, 5, 6
            console.log(t + '\n');
        }
    });
}

console.log('--- EXTRACTION VERIFICATION (Turn 3 Focus) ---');
const extractionMatches = content.split('Extraction result:');
if (extractionMatches.length > 3) {
    // Turn 3 extraction is roughly index 3
    console.log('Turn 3 Extraction State:');
    console.log(extractionMatches[3].split('\n').slice(0, 10).join('\n'));
}

const specializedTrigger = content.includes('[DETECTION] Specialized Challenge (YouTube) triggered!');
console.log('\nSpecialized Challenge Triggered:', specializedTrigger);

const grading = content.includes('overallVerdict');
console.log('Grading Success:', grading);
