import React, { useState } from 'react'

const GLOSSARY = {
    // Distributed Systems
    'CAP Theorem': 'In a distributed system, you can only have 2 of 3: Consistency, Availability, Partition Tolerance.',
    'Sharding': 'Splitting a large database into smaller, faster, more easily managed parts called data shards.',
    'Load Balancer': 'A device that acts as a reverse proxy and distributes network or application traffic across a number of servers.',
    'Consistent Hashing': 'A hashing strategy that minimizes reorganization when nodes are added or removed.',
    'Throughput': 'Number of actions executed or results produced per unit of time.',
    'Latency': 'Time it takes for a data packet to travel from one designated point to another.',
    'Availability': 'The percentage of time a system remains operational and accessible.',

    // Low-Level Design
    'SOLID': 'Acronym for 5 design principles: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion.',
    'Singleton': 'A creational pattern that ensures a class has only one instance and provides a global point of access to it.',
    'Factory Pattern': 'A creational pattern that provides an interface for creating objects in a superclass, but allows subclasses to alter the type of objects that will be created.',
    'Observer Pattern': 'A behavioral pattern where an object maintains a list of dependents and notifies them of state changes.',

    // Database
    'ACID': 'Atomicity, Consistency, Isolation, Durability — properties ensuring reliable database transactions.',
    'Index': 'A data structure that improves the speed of data retrieval operations on a database table.',
    'Normalization': 'Organizing data in a database to reduce redundancy and improve data integrity.',
}

export default function GlossaryTooltip({ term, children }) {
    const [isVisible, setIsVisible] = useState(false)
    const definition = GLOSSARY[term] || 'Definition not found.'

    return (
        <span
            className="glossary-term"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
            onClick={() => setIsVisible(!isVisible)} // Mobile tap
        >
            {children || term}
            {isVisible && (
                <span className="glossary-tooltip">
                    <strong>{term}</strong>
                    <p>{definition}</p>
                </span>
            )}
        </span>
    )
}
