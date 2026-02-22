import { HLD_UNITS, HLD_CHAPTERS } from '../src/data/hldCurriculum.js'
import { LLD_UNITS, LLD_CHAPTERS } from '../src/data/lldCurriculum.js'

console.log('🔍 Verifying Curriculum Data...')

const VALID_SECTION_TYPES = [
    'text', 'code', 'diagram', 'tip', 'concept-card', 'comparison', 'example',
    'deep-dive', 'scenario', 'step-by-step', 'quiz', 'table'
]

function verifyCurriculum(units, chapters, name) {
    console.log(`\nChecking ${name}...`)
    let errors = 0

    // Check Units
    const unitIds = new Set(units.map(u => u.id))
    if (unitIds.size !== units.length) {
        console.error(`❌ Duplicate Unit IDs found in ${name}`)
        errors++
    }

    // Check Chapters
    const chapterIds = new Set()
    chapters.forEach((ch, idx) => {
        // 1. Duplicate IDs
        if (chapterIds.has(ch.id)) {
            console.error(`❌ Duplicate Chapter ID: ${ch.id}`)
            errors++
        }
        chapterIds.add(ch.id)

        // 2. Invalid Unit Reference
        if (!unitIds.has(ch.unit)) {
            console.error(`❌ Chapter ${ch.id} references non-existent unit ${ch.unit}`)
            errors++
        }

        // 3. Section Validation
        if (!ch.sections) {
            console.error(`❌ Chapter ${ch.id} missing sections array`)
            errors++
            return
        }

        ch.sections.forEach((sec, i) => {
            if (!VALID_SECTION_TYPES.includes(sec.type)) {
                console.error(`❌ Chapter ${ch.id} section ${i} has invalid type: ${sec.type}`)
                errors++
            }

            // Type-specific checks
            if (sec.type === 'quiz') {
                if (!sec.question || !sec.options || sec.correctIndex === undefined) {
                    console.error(`❌ Chapter ${ch.id} quiz section missing required fields`)
                    errors++
                }
            }
            if (sec.type === 'scenario') {
                if (!sec.title || !sec.problem || !sec.solution) {
                    console.error(`❌ Chapter ${ch.id} scenario section missing fields`)
                    errors++
                }
            }
        })
    })

    console.log(`${name}: ${errors} errors found.`)
    return errors
}

const hldErrors = verifyCurriculum(HLD_UNITS, HLD_CHAPTERS, 'HLD')
const lldErrors = verifyCurriculum(LLD_UNITS, LLD_CHAPTERS, 'LLD')

if (hldErrors + lldErrors === 0) {
    console.log('\n✨ All data is valid!')
    process.exit(0)
} else {
    console.error('\n💥 Data verification failed.')
    process.exit(1)
}
