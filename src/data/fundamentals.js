/**
 * System Design Fundamentals Reference
 * Extracted from interview guides — the AI uses these to evaluate candidates
 * and ask context-aware follow-up questions about core concepts.
 */

export const DATABASE_DECISION_TREE = {
    sql: {
        when: 'Transactions, complex queries, referential integrity, ACID compliance',
        examples: 'PostgreSQL, MySQL',
        bestFor: ['Financial systems (payments, banking)', 'E-commerce (inventory, orders)', 'User accounts + auth', 'Booking systems (prevent double-booking)', 'Any data requiring JOINs and constraints'],
        interviewProbe: 'Why did you choose SQL here? What isolation level would you use for this operation?',
        scaleStrategy: 'Read replicas for read-heavy, sharding by user_id/region for write-heavy, connection pooling (PgBouncer)',
    },
    documentDB: {
        when: 'Flexible schema, nested data, read-heavy with denormalization',
        examples: 'MongoDB, CouchDB, DynamoDB',
        bestFor: ['Content management (blog posts, articles)', 'Product catalogs (different attributes per type)', 'User profiles (varying fields)', 'Real-time analytics events', 'Configuration storage'],
        interviewProbe: 'How will you handle data that needs to be queried across documents? What about write amplification from denormalization?',
    },
    keyValue: {
        when: 'Simple lookups, caching, session storage, real-time counters',
        examples: 'Redis, Memcached, DynamoDB',
        bestFor: ['Session management (TTL-based)', 'Rate limiting (sliding window counters)', 'Leaderboards (sorted sets)', 'Caching layer (user profiles, hot data)', 'Pub/sub messaging', 'Feature flags'],
        interviewProbe: 'What eviction policy would you use? How do you handle cache invalidation?',
    },
    wideColumn: {
        when: 'Write-heavy, time-series, append-only, massive scale',
        examples: 'Cassandra, HBase, ScyllaDB',
        bestFor: ['Messages (partition by chat_id, sort by timestamp)', 'IoT sensor data', 'Activity feeds and timelines', 'Analytics event logging', 'Any table with billions of rows'],
        interviewProbe: 'How would you choose the partition key? What happens with hot partitions?',
    },
    search: {
        when: 'Full-text search, fuzzy matching, faceted queries',
        examples: 'Elasticsearch, Solr, Meilisearch',
        bestFor: ['Product search', 'Log aggregation and analysis', 'Autocomplete / typeahead', 'Geospatial queries'],
        interviewProbe: 'How would you keep the search index in sync with the primary database?',
    },
    graph: {
        when: 'Highly connected data, relationship traversal',
        examples: 'Neo4j, Amazon Neptune',
        bestFor: ['Social networks (friend-of-friend)', 'Recommendation engines', 'Fraud detection (transaction graphs)', 'Knowledge graphs'],
        interviewProbe: 'Could you achieve this with a relational DB using recursive CTEs? What are the trade-offs?',
    },
}

export const CACHING_STRATEGIES = {
    cacheAside: {
        name: 'Cache-Aside (Lazy Loading)',
        flow: 'Read: Check cache → if miss, read DB → write to cache. Write: Write to DB → invalidate cache.',
        pros: 'Only caches what is requested, simple, resilient to cache failures',
        cons: 'Cache miss = 3 round trips, risk of stale data until TTL expires',
        bestFor: 'Read-heavy workloads (user profiles, product pages)',
        interviewProbe: 'What TTL would you set? How do you handle thundering herd on cache miss?',
    },
    writeThrough: {
        name: 'Write-Through',
        flow: 'Write goes to cache AND database synchronously. Reads always hit cache.',
        pros: 'Cache always consistent with DB, simple reads',
        cons: 'Write latency (2 writes), may cache data that is never read',
        bestFor: 'When read-after-write consistency is critical',
    },
    writeBack: {
        name: 'Write-Back (Write-Behind)',
        flow: 'Write goes to cache only. Cache asynchronously writes to DB in batches.',
        pros: 'Lowest write latency, batch DB writes',
        cons: 'Risk of data loss if cache fails before flush, complexity',
        bestFor: 'Write-heavy workloads where slight data loss is acceptable (analytics, metrics)',
    },
    cacheInvalidation: {
        patterns: [
            'TTL-based: Set expiration time. Simple but may serve stale data.',
            'Event-based: Publish invalidation event on write. More complex but consistent.',
            'Version-based: Attach version number. Read checks version. Used by CDNs.',
        ],
        interviewProbe: 'How would you handle cache invalidation for this feature? What about the thundering herd problem?',
    },
}

export const LOAD_BALANCING = {
    algorithms: {
        roundRobin: 'Distribute sequentially. Simple but ignores server load and request difficulty.',
        weightedRoundRobin: 'Distribute proportionally by server capacity. Good for mixed hardware.',
        leastConnections: 'Route to server with fewest active connections. Best for WebSocket/long-polling.',
        leastResponseTime: 'Route to fastest-responding server. Best for heterogeneous workloads.',
        ipHash: 'Hash client IP to assign server. Provides sticky sessions but uneven with NAT.',
        consistentHashing: 'Distribute across hash ring with virtual nodes. Minimal disruption on scale up/down. Used by CDNs and distributed caches.',
    },
    layers: {
        l4: 'Network/Transport layer. Routes by IP:Port. Very fast (1M+ RPS), protocol-agnostic. Use for: database load balancing, non-HTTP traffic.',
        l7: 'Application layer. Routes by URL path, headers, cookies. Used for: microservices routing, SSL termination, A/B testing, path-based routing.',
    },
    interviewProbe: 'Which load balancing algorithm would you use and why? L4 or L7? How would you handle health checks?',
}

export const CONSISTENCY_MODELS = {
    capTheorem: {
        summary: 'In a distributed system during a network partition, choose either Consistency or Availability (Partition Tolerance is required).',
        cp: { when: 'Money, inventory, bookings — double-spending/overselling is unacceptable', examples: 'Banking, ticket sales, seat reservations' },
        ap: { when: 'Social features, content, analytics — temporary inconsistency acceptable', examples: 'Like counts, follower counts, view counts, shopping carts' },
        interviewProbe: 'Where on the CAP spectrum does this system fall? Can you use different consistency models for different parts?',
    },
    consistencyLevels: {
        strong: 'All reads see latest write. Use for: payments, inventory. Cost: higher latency.',
        eventual: 'Reads may see stale data briefly. Use for: social feeds, counters. Benefit: higher availability.',
        causal: 'Respects causality (if A caused B, reader sees A before B). Use for: messaging, comments.',
        readYourWrites: 'User always sees their own writes immediately. Use for: profile updates, posts.',
    },
}

export const SCALE_ESTIMATION = {
    formulas: {
        rps: 'DAU × actions_per_user / 86400',
        peakRps: 'average_RPS × 3',
        storage: 'daily_objects × avg_size × 365 × replication_factor',
        bandwidth: 'RPS × avg_response_size',
        servers: 'peak_RPS / 1000 / 0.5 (50% headroom)',
    },
    referenceNumbers: {
        latency: { l1Cache: '0.5ns', ram: '100ns', ssd: '150μs', hdd: '10ms', sameDatacenter: '0.5ms', crossCountry: '50ms', intercontinental: '150ms' },
        throughput: { singleServer: '~1K RPS (API)', cacheServer: '~10K RPS', staticContent: '~100K RPS' },
        availability: { threeNines: '8.76 hours/year downtime', fourNines: '52 min/year', fiveNines: '5.26 min/year' },
        storage: { tweet: '500 bytes', image: '200KB', video: '2MB', userProfile: '10KB' },
    },
    interviewProbe: 'Can you estimate the QPS for this system? How much storage would we need per year? How many servers?',
}

export const MESSAGE_QUEUE_PATTERNS = {
    when: 'Decouple producers from consumers, buffer traffic spikes, enable async processing, ensure at-least-once delivery',
    technologies: 'Kafka (high throughput, event streaming), RabbitMQ (flexible routing), SQS (managed, simple)',
    patterns: {
        pointToPoint: 'One producer → one consumer. Use for: task queues, order processing.',
        pubSub: 'One producer → many consumers. Use for: notifications, event broadcasting, fan-out.',
        eventSourcing: 'Store all events as immutable log. Rebuild state by replaying. Use for: audit trails, financial ledgers.',
    },
    interviewProbe: 'Why did you introduce a message queue here? What happens if the consumer crashes? How do you handle duplicate messages (idempotency)?',
}

export const NETWORKING_PATTERNS = {
    http: 'Request-response. Stateless. Best for: REST APIs, CRUD operations. Simple but not real-time.',
    websocket: 'Persistent bidirectional connection. Best for: chat, live updates, collaborative editing. Stateful.',
    grpc: 'Binary protocol over HTTP/2. Best for: microservice-to-microservice communication. Fast, strongly typed (protobuf).',
    sse: 'Server-Sent Events. Server pushes to client. Best for: live feeds, stock tickers, notifications. Simpler than WebSocket for server-push only.',
    webrtc: 'Peer-to-peer real-time. Best for: video calls, screen sharing. Lowest latency but complex NAT traversal.',
    interviewProbe: 'Would you use REST or WebSocket for this feature? Why? How would microservices communicate — HTTP or gRPC?',
}

export const SECURITY_CHECKLIST = {
    authentication: ['JWT tokens (stateless, good for microservices)', 'Session-based (stateful, easy to revoke)', 'OAuth 2.0 (third-party login)', 'MFA for sensitive operations'],
    authorization: ['RBAC (Role-Based Access Control) — roles define permissions', 'ABAC (Attribute-Based) — policies based on user/resource attributes'],
    encryption: ['TLS 1.3 for all traffic in transit', 'AES-256 for data at rest', 'Bcrypt/Argon2 for password hashing (never plaintext)', 'End-to-end encryption for messaging (Signal Protocol)'],
    interviewProbe: 'How would you handle authentication across microservices? Where would you terminate TLS?',
}

export const LLD_FUNDAMENTALS = {
    solidPrinciples: {
        S: { name: 'Single Responsibility', rule: 'A class should have only one reason to change.', violation: 'UserService that handles auth, profile, notifications, and payments', fix: 'Split into AuthService, ProfileService, NotificationService, PaymentService' },
        O: { name: 'Open/Closed', rule: 'Open for extension, closed for modification.', violation: 'Adding new payment type requires modifying PaymentProcessor class', fix: 'Use Strategy pattern — new payment types implement PaymentStrategy interface' },
        L: { name: 'Liskov Substitution', rule: 'Subtypes must be substitutable for their base types.', violation: 'Square extends Rectangle but breaks setWidth/setHeight contract', fix: 'Use separate Shape interface with area() method' },
        I: { name: 'Interface Segregation', rule: 'Clients should not depend on interfaces they do not use.', violation: 'Worker interface with work() and eat() — robots don\'t eat', fix: 'Split into Workable and Feedable interfaces' },
        D: { name: 'Dependency Inversion', rule: 'Depend on abstractions, not concretions.', violation: 'OrderService directly creates MySQLDatabase object', fix: 'OrderService depends on Database interface, injected via constructor' },
    },
    designPatternSelector: {
        'Need single instance': 'Singleton',
        'Create objects without specifying class': 'Factory',
        'Complex object with many params': 'Builder',
        'Add behavior dynamically': 'Decorator',
        'Simplify complex subsystem': 'Facade',
        'Change algorithm at runtime': 'Strategy',
        'Notify multiple objects of changes': 'Observer',
        'Encapsulate operations / undo-redo': 'Command',
        'Object behavior changes with state': 'State',
        'Tree structures / part-whole': 'Composite',
    },
    concurrencyPatterns: {
        mutex: 'Mutual exclusion lock. One thread at a time. Use for: shared counter, bank balance.',
        readWriteLock: 'Multiple readers OR single writer. Use for: cache reads with occasional updates.',
        semaphore: 'Limit concurrent access to N threads. Use for: connection pool, rate limiting.',
        producerConsumer: 'Producers add to queue, consumers process. Use for: task distribution.',
        threadPool: 'Fixed number of worker threads. Use for: web server request handling.',
    },
    interviewProbe: 'Which SOLID principle does this violate? What design pattern would you apply? Is this class thread-safe?',
}

/**
 * Get relevant fundamentals context based on conversation topic
 */
export function getRelevantFundamentals(topics) {
    let ctx = ''
    if (!topics || topics.length === 0) return ctx

    const topicStr = topics.join(' ').toLowerCase()

    if (topicStr.includes('database') || topicStr.includes('sql') || topicStr.includes('storage') || topicStr.includes('data model')) {
        ctx += '\nDATABASE DECISION GUIDE: '
        Object.entries(DATABASE_DECISION_TREE).forEach(([k, v]) => {
            ctx += `${k}: ${v.when} (${v.examples}). `
        })
    }

    if (topicStr.includes('cache') || topicStr.includes('redis') || topicStr.includes('latency')) {
        ctx += '\nCACHING: Cache-aside (lazy load on miss), write-through (sync both), write-back (async to DB). '
        ctx += `Invalidation: ${CACHING_STRATEGIES.cacheInvalidation.patterns.join(' | ')} `
    }

    if (topicStr.includes('scale') || topicStr.includes('capacity') || topicStr.includes('estimation')) {
        ctx += `\nSCALE FORMULAS: RPS = DAU × actions / 86400. Peak = 3× avg. Storage = daily × size × 365 × replication. Servers = peak_RPS / 1000 / 0.5. `
    }

    if (topicStr.includes('consistency') || topicStr.includes('cap') || topicStr.includes('availability')) {
        ctx += '\nCAP: CP for money/inventory (strong consistency), AP for social features/counters (eventual consistency). Can mix per feature. '
    }

    if (topicStr.includes('queue') || topicStr.includes('async') || topicStr.includes('kafka') || topicStr.includes('event')) {
        ctx += '\nMESSAGE QUEUES: Kafka (high throughput streaming), RabbitMQ (routing), SQS (simple managed). Patterns: point-to-point, pub/sub, event sourcing. '
    }

    return ctx
}
