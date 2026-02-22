import React from 'react'
import GlossaryTooltip from './GlossaryTooltip'
import CodeTutorial from './CodeTutorial'
import './RichContent.css'

// Simple markdown parser for bold, code, and list
const parseMarkdown = (text) => {
    if (!text) return null

    // Split by double newline for paragraphs
    const parts = text.split('\n\n')

    return parts.map((part, index) => {
        // Headers
        if (part.startsWith('### ')) return <h3 key={index}>{parseInline(part.replace('### ', ''))}</h3>
        if (part.startsWith('## ')) return <h2 key={index}>{parseInline(part.replace('## ', ''))}</h2>
        if (part.startsWith('# ')) return <h1 key={index}>{parseInline(part.replace('# ', ''))}</h1>

        // Blockquotes
        if (part.startsWith('> ')) return <blockquote key={index}>{parseInline(part.replace(/> /g, ''))}</blockquote>

        // Code Blocks
        if (part.startsWith('```')) {
            const lines = part.split('\n')
            const content = lines.slice(1, -1).join('\n')
            return (
                <pre key={index}>
                    <code>{content}</code>
                </pre>
            )
        }

        // Lists
        if (part.startsWith('- ') || part.startsWith('* ')) {
            const items = part.split('\n').map(line => line.replace(/^[-*] /, ''))
            return (
                <ul key={index}>
                    {items.map((item, i) => <li key={i}>{parseInline(item)}</li>)}
                </ul>
            )
        }

        // Paragraph
        return <p key={index}>{parseInline(part)}</p>
    })
}

// Helper to parse inline styles: **bold**, `code`, {{Glossary}}
const parseInline = (text) => {
    if (!text) return null

    // Split by regex for tokens
    // Matches: **bold**, `code`, {{Tooltip}}
    const regex = /(\*\*.*?\*\*|`.*?`|\{\{.*?\}\})/g
    const parts = text.split(regex)

    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i}>{part.slice(2, -2)}</strong>
        }
        if (part.startsWith('`') && part.endsWith('`')) {
            return <code key={i}>{part.slice(1, -1)}</code>
        }
        if (part.startsWith('{{') && part.endsWith('}}')) {
            const term = part.slice(2, -2)
            return <GlossaryTooltip key={i} term={term} />
        }
        return part
    })
}

export default function RichTextRenderer({ content }) {
    if (!content) return null

    // If it's a simple string, treat as markdown
    if (typeof content === 'string') {
        return <div className="rich-text">{parseMarkdown(content)}</div>
    }

    // If it's an array of blocks (New Curriculum Structure)
    if (Array.isArray(content)) {
        return (
            <div className="rich-text">
                {content.map((block, i) => {
                    switch (block.type) {
                        case 'markdown':
                        case 'text':
                            return <div key={i}>{parseMarkdown(block.content)}</div>

                        case 'code-tutorial':
                            return <CodeTutorial key={i} {...block} />

                        case 'faang-insight':
                            return (
                                <div key={i} className="faang-insight">
                                    <h4>{block.company || 'FAANG'} Insight</h4>
                                    <p>{parseInline(block.content)}</p>
                                </div>
                            )

                        case 'image':
                            return (
                                <div key={i} className="figure">
                                    <img src={block.src} alt={block.caption} className="content-img" />
                                    {block.caption && <span className="caption">{block.caption}</span>}
                                </div>
                            )

                        default:
                            return null
                    }
                })}
            </div>
        )
    }

    return null
}
