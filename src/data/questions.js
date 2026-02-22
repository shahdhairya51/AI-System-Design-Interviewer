export const HLD_QUESTIONS = [
    { id: 'youtube', title: 'Design YouTube', difficulty: 'Hard', category: 'Video Streaming', description: 'Design a video sharing platform like YouTube that supports uploading, processing, and streaming videos to millions of users. Scale: 100M DAU, 1B total videos, 100k QPS.', keyTopics: ['Video transcoding (MPEG-DASH, HLS)', 'CDN strategy (Edge vs Origin)', 'Recommendation engine (Collaborative filtering)', 'Search indexing', 'BLOB storage (S3) vs Metadata partitioning', 'Thundering herd handling'] },
    { id: 'twitter', title: 'Design Twitter/X', difficulty: 'Medium', category: 'Social Media', description: 'Design a microblogging platform supporting tweets, follows, timelines, and trending topics. Handle celebrities with 100M+ followers.', keyTopics: ['Fan-out (Push vs Pull)', 'Timeline generation (Pre-computation)', 'Distributed caching (Redis/Memcached)', 'Message queue (Kafka/RabbitMQ)', 'Social graph management', 'Hot-key problem'] },
    { id: 'whatsapp', title: 'Design WhatsApp', difficulty: 'Hard', category: 'Messaging', description: 'Design a real-time messaging application supporting 1-on-1 and group chats with read receipts and media sharing.', keyTopics: ['WebSocket/MQTT for persistent connections', 'Message ordering (Sequencers vs Vector Clocks)', 'End-to-end encryption (Signal Protocol)', 'Presence service', 'Media storage & optimization', 'Last seen status'] },
    { id: 'uber', title: 'Design Uber', difficulty: 'Hard', category: 'Location Services', description: 'Design a ride-sharing platform that matches riders with nearby drivers in real-time.', keyTopics: ['Geospatial indexing (S2 Cells, H3, Quadtrees)', 'Location tracking (Gossip vs Polling)', 'Matching algorithm (Hungarian algorithm)', 'Surge pricing (Demand/Supply analysis)', 'ETA calculation (A* search, Real-time traffic)'] },
    { id: 'url-shortener', title: 'Design URL Shortener', difficulty: 'Easy', category: 'Web Services', description: 'Design a service like bit.ly that shortens URLs, redirects users, and provides analytics.', keyTopics: ['Hashing (MD5/SHA256) vs Token generation (Base62)', 'Distributed ID generation (Snowflake)', 'Caching (LRU)', 'Redirection (301 vs 302)', 'Analytics (OLAP vs OLTP)'] },
    { id: 'instagram', title: 'Design Instagram', difficulty: 'Medium', category: 'Social Media', description: 'Design a photo and video sharing platform with feeds, stories, and explore functionality.', keyTopics: ['Image storage (S3/GCS)', 'CDN distribution', 'News feed ranking', 'Stories (In-memory vs Persistent)', 'Recommendation ML', 'Photo metadata & EXIF'] },
    { id: 'netflix', title: 'Design Netflix', difficulty: 'Hard', category: 'Streaming', description: 'Design a video streaming service that delivers content globally with personalized recommendations.', keyTopics: ['Adaptive bitrate streaming', 'CDN (Open Connect)', 'Recommendation ML (Netflix Prize)', 'Content licensing (DRM)', 'Microservices orchestration', 'Chaos Engineering'] },
    { id: 'rate-limiter', title: 'Design Rate Limiter', difficulty: 'Easy', category: 'Infrastructure', description: 'Design a rate limiting system that controls the rate of requests a client can send to an API.', keyTopics: ['Token bucket', 'Leaky bucket', 'Sliding window log', 'Sliding window counter', 'Distributed counting (Redis Lua)'] },
    { id: 'notification', title: 'Design Notification System', difficulty: 'Medium', category: 'Events', description: 'Design a scalable notification system supporting push, SMS, email, and in-app notifications.', keyTopics: ['Message queues (Decoupling)', 'Priority queues', 'Rate limiting per provider', 'Template engine', 'Delivery tracking & Retries'] },
    { id: 'web-crawler', title: 'Design Web Crawler', difficulty: 'Medium', category: 'Data Processing', description: 'Design a distributed web crawler that efficiently crawls billions of web pages.', keyTopics: ['BFS/DFS traversal', 'URL frontier', 'Politeness policies (Robots.txt)', 'Deduplication (Bloom filters)', 'Distributed lock management'] },
    { id: 'payment', title: 'Design Payment System', difficulty: 'Hard', category: 'FinTech', description: 'Design a payment processing system like Stripe supporting transactions, refunds, and reconciliation.', keyTopics: ['ACID compliance', 'Idempotency keys', 'Payment gateway integration', 'Double-entry bookkeeping (Ledger)', 'PCI-DSS security'] },
    { id: 'dropbox', title: 'Design Dropbox/Google Drive', difficulty: 'Hard', category: 'File Storage', description: 'Design a cloud file storage and sync service supporting file upload, download, and real-time sync.', keyTopics: ['Chunking (Block-level delta)', 'Deduplication (In-line vs Post-process)', 'Sync protocol (Delta sync)', 'Metadata DB (SQL vs NoSQL)', 'Notification service (HTTP long polling)'] },
    { id: 'autocomplete', title: 'Design Search Autocomplete', difficulty: 'Medium', category: 'Search', description: 'Design a typeahead suggestion system that provides real-time search suggestions.', keyTopics: ['Trie data structure', 'Prefix matching', 'Ranking (Popularity, Personalization)', 'Sampling & Pre-computation', 'Data collection & Aggregation'] },
    { id: 'newsfeed', title: 'Design News Feed', difficulty: 'Medium', category: 'Social Media', description: 'Design a personalized news feed system that aggregates and ranks content from followed sources.', keyTopics: ['Fan-out (Push vs Pull model)', 'Ranking algorithm (EdgeRank)', 'Caching (Hot feeds)', 'Consistency vs Availability', 'Feed generation pipeline'] },
    { id: 'ticket-booking', title: 'Design Ticket Booking', difficulty: 'Medium', category: 'E-Commerce', description: 'Design a ticket booking platform like BookMyShow supporting seat selection and concurrent bookings.', keyTopics: ['Distributed locking', 'Seat map management', 'Payment integration', 'Reservation timeouts', 'Optimistic vs Pessimistic locking'] },
    { id: 'kv-store', title: 'Design Key-Value Store', difficulty: 'Medium', category: 'Databases', description: 'Design a distributed key-value store like DynamoDB supporting high availability and partition tolerance.', keyTopics: ['Consistent hashing', 'Replication (Quorum writing)', 'Gossip protocol', 'Conflict resolution (Vector clocks, LWW)', 'Merkle trees for anti-entropy'] },
    { id: 'chat-system', title: 'Design Chat System', difficulty: 'Medium', category: 'Real-time', description: 'Design a real-time chat application supporting direct messages, group chats, and online status.', keyTopics: ['WebSockets', 'Message ordering', 'Presence service', 'Group management', 'Storage strategy (NoSQL vs SQL)'] },
    { id: 'ecommerce', title: 'Design E-Commerce Platform', difficulty: 'Hard', category: 'Full Stack', description: 'Design an e-commerce platform like Amazon supporting product catalog, cart, checkout, and order tracking.', keyTopics: ['Catalog (Elasticsearch)', 'Inventory management (Atomic updates)', 'Shopping cart (Redis)', 'Order processing', 'Search & Filtering'] },
    { id: 'monitoring', title: 'Design Metrics Monitoring', difficulty: 'Medium', category: 'Observability', description: 'Design a metrics collection and monitoring system like Datadog supporting alerting and dashboards.', keyTopics: ['Time-series DB (InfluxDB, Prometheus)', 'Data aggregation', 'Pull vs Push collection', 'Alerting rules', 'Data retention & Rollups'] },
    { id: 'cdn', title: 'Design CDN', difficulty: 'Hard', category: 'Infrastructure', description: 'Design a content delivery network that serves content from edge locations closest to users.', keyTopics: ['Edge caching (Varnish, Nginx)', 'Cache invalidation (Purge vs Expire)', 'GeoDNS routing', 'Origin shielding', 'Anycast vs Unicast'] },
]

export const LLD_QUESTIONS = [
    { id: 'parking-lot', title: 'Design Parking Lot', difficulty: 'Easy', category: 'OOP Basics', description: 'Design a parking lot system with multiple floors, different vehicle types, and ticketing.', keyTopics: ['Inheritance (Vehicle hierarchy)', 'Encapsulation', 'Strategy pattern (Pricing model)', 'State management (Spot occupancy)'] },
    { id: 'lru-cache', title: 'Design LRU Cache', difficulty: 'Easy', category: 'Data Structures', description: 'Design a Least Recently Used cache with O(1) get and put operations.', keyTopics: ['HashMap + Doubly Linked List', 'Eviction policy', 'Thread safety (Read-Write locks)', 'Generics'] },
    { id: 'elevator', title: 'Design Elevator System', difficulty: 'Medium', category: 'State Machine', description: 'Design an elevator control system for a multi-floor building with multiple elevators.', keyTopics: ['State pattern (Elevator state)', 'Scheduling (SCAN algorithm)', 'Observer pattern (Floor requests)', 'Priority queue'] },
    { id: 'chess', title: 'Design Chess Game', difficulty: 'Hard', category: 'Game Logic', description: 'Design a chess game with all piece movements, check/checkmate detection, and game state management.', keyTopics: ['Polymorphism', 'Command pattern (Move history)', 'Board representation (Bitboards)', 'Move validation'] },
    { id: 'library', title: 'Design Library Management', difficulty: 'Easy', category: 'CRUD + Relations', description: 'Design a library management system supporting book catalog, members, and borrowing.', keyTopics: ['Entity relationships', 'Normalization', 'Transaction isolation', 'Search indexing'] },
    { id: 'snake-game', title: 'Design Snake Game', difficulty: 'Medium', category: 'Game Loop', description: 'Design the classic Snake game with grid, food generation, and collision detection.', keyTopics: ['Game loop management', 'Queue-based body tracking', 'Direction change handling', 'Boundary detection'] },
    { id: 'hotel-booking', title: 'Design Hotel Booking', difficulty: 'Medium', category: 'Concurrency', description: 'Design a hotel room booking system with availability check, reservation, and cancellation.', keyTopics: ['Distributed locks', 'Optimistic concurrency', 'Availability indexing', 'Observer pattern (Notifications)'] },
    { id: 'vending-machine', title: 'Design Vending Machine', difficulty: 'Easy', category: 'State Pattern', description: 'Design a vending machine with product selection, payment, and dispensing.', keyTopics: ['State pattern', 'Inventory control', 'Payment validation', 'Change calculation'] },
    { id: 'file-system', title: 'Design File System', difficulty: 'Medium', category: 'Tree Structure', description: 'Design an in-memory file system supporting directories, files, and path operations.', keyTopics: ['Composite pattern', 'Visitor pattern (File search)', 'In-memory tree structure', 'Relative vs Absolute paths'] },
    { id: 'logger', title: 'Design Logger Framework', difficulty: 'Easy', category: 'Design Patterns', description: 'Design a logging framework with multiple log levels, outputs, and formatters.', keyTopics: ['Singleton pattern', 'Strategy pattern', 'Chain of Responsibility (Log levels)', 'Builder pattern (Log message)'] },
]

export const COMPANY_STYLES = [
    {
        id: 'google',
        name: 'Google',
        emoji: '🔍',
        focus: 'Scale to billions, fault tolerance, adaptability to changing constraints',
        color: '#4285f4',
        logoUrl: 'https://logo.clearbit.com/google.com',
        signatureProbes: [
            "How does this handle a 50% node failure in one datacenter?",
            "What if we need to support search with <100ms P99 latency globally?",
            "Can we replace this centralized component with a peer-to-peer gossip protocol?"
        ]
    },
    {
        id: 'amazon',
        name: 'Amazon',
        emoji: '📦',
        focus: 'Cost-effectiveness, Leadership Principles, practical scalability',
        color: '#ff9900',
        logoUrl: 'https://logo.clearbit.com/amazon.com',
        signatureProbes: [
            "How would this design change if we had to cut the infrastructure cost by 40%?",
            "Customer Obsession: How does a slow database write impact the checkout UX?",
            "Ownership: If this service fails at 3 AM, what's the blast radius and who is alerted?"
        ]
    },
    {
        id: 'meta',
        name: 'Meta',
        emoji: '👥',
        focus: 'Data-intensive systems, real-world FB/IG scale, efficiency',
        color: '#0668E1',
        logoUrl: 'https://logo.clearbit.com/facebook.com',
        signatureProbes: [
            "We have 2 billion active users. How do we prevent a hot-key issue for a celebrity post?",
            "Move Fast: Can we use eventual consistency here to improve write throughput?",
            "What happens if our social graph cache is invalidated across all clusters?"
        ]
    },
    {
        id: 'netflix',
        name: 'Netflix',
        emoji: '🎬',
        focus: 'High availability, global CDN, streaming at massive scale',
        color: '#e50914',
        logoUrl: 'https://logo.clearbit.com/netflix.com',
        signatureProbes: [
            "Chaos Engineering: If we kill this microservice randomly, does the app still function?",
            "How do we handle the thundering herd if 10M people try to watch a new release at 8 PM?",
            "Multi-region: If US-EAST-1 is down, how do we redirect traffic with zero downtime?"
        ]
    },
    {
        id: 'apple',
        name: 'Apple',
        emoji: '🍎',
        focus: 'User-centric design, privacy/security, ecosystem integration',
        color: '#a2aaad',
        logoUrl: 'https://logo.clearbit.com/apple.com',
        signatureProbes: [
            "E2E Encryption: How do we sync this data across devices without the server seeing it?",
            "Privacy by Design: What is the minimum data we need to store for this feature to work?",
            "How does this service integrate with the existing device-side Keychain?"
        ]
    },
    {
        id: 'generic',
        name: 'General',
        emoji: '🏢',
        focus: 'Balanced evaluation across all system dimension',
        color: '#6c5ce7',
        logoUrl: null,
        signatureProbes: [
            "What are the major trade-offs in this architecture?",
            "How do you handle data consistency across these services?",
            "If you had another 6 months, what would you rethink from scratch?"
        ]
    },
]

export const DIFFICULTY_LEVELS = [
    { id: 'junior', label: 'Junior (L3/SDE1)', description: 'Focus on fundamentals, guided approach' },
    { id: 'mid', label: 'Mid-Level (L4/SDE2)', description: 'Independent design, moderate depth' },
    { id: 'senior', label: 'Senior (L5/SDE3)', description: 'Deep dives, scaling challenges, leadership' },
    { id: 'staff', label: 'Staff+ (L6+)', description: 'System-wide thinking, cross-team impact, ambiguity' },
]

export const TIME_OPTIONS = [
    { value: 30, label: '30 min', description: 'Quick practice' },
    { value: 45, label: '45 min', description: 'Standard interview' },
    { value: 60, label: '60 min', description: 'Full deep-dive' },
]

export const INTERVIEW_PHASES = [
    { id: 'requirements', name: 'Requirements', icon: '1', defaultMinutes: 8, description: 'Clarify functional & non-functional requirements, estimate scale', guideline: 'Let the candidate drive — they should ask questions about features, scale, latency, consistency' },
    { id: 'high-level', name: 'High-Level Design', icon: '2', defaultMinutes: 15, description: 'Walk through architecture, components, and data flow', guideline: 'Candidate draws/describes components — probe each decision: "Why this over alternatives?"' },
    { id: 'deep-dive', name: 'Deep Dive', icon: '3', defaultMinutes: 15, description: 'Zoom into the most critical or interesting component', guideline: 'Pick ONE area and go deep — database schema, caching, algorithms, API design, or class implementation' },
    { id: 'tradeoffs', name: 'Trade-offs & Scaling', icon: '4', defaultMinutes: 8, description: 'Introduce constraints, discuss scaling, failure handling', guideline: '"What if traffic 10x?", "What if a data center fails?", "How would you cut costs 40%?"' },
    { id: 'wrapup', name: 'Wrap-up', icon: '5', defaultMinutes: 4, description: 'Synthesize, reflect, final questions', guideline: '"What would you change?", "What\'s the biggest risk?", "What would you build first?"' },
]
