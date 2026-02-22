/**
 * HLD Curriculum Data
 * Total Units: 6
 * Total Chapters: 28
 * Content extracted from Complete System Design Interview Guides
 */

export const HLD_UNITS = [
    { id: 1, name: 'Foundations', icon: 'foundations', difficulty: 'Beginner' },
    { id: 2, name: 'Core Building Blocks', icon: 'architecture', difficulty: 'Intermediate' },
    { id: 3, name: 'Distributed Systems', icon: 'network', difficulty: 'Intermediate' },
    { id: 4, name: 'Production Concerns', icon: 'scale', difficulty: 'Advanced' },
    { id: 5, name: 'Complete Walkthroughs', icon: 'architecture', difficulty: 'Advanced' },
    { id: 6, name: 'Interview Mastery', icon: 'mastery', difficulty: 'Expert' },
]

export const HLD_CHAPTERS = [
    // ═══════════════════════════════════════════════════════
    //  UNIT 1: FOUNDATIONS
    // ═══════════════════════════════════════════════════════
    // ═══════════════════════════════════════════════════════
    //  UNIT 1: FOUNDATIONS
    // ═══════════════════════════════════════════════════════
    {
        id: 'what-is-system-design',
        title: 'Introduction to Architecture',
        unit: 1,
        duration: '12 min',
        icon: 'foundations',
        content: [
            {
                type: 'markdown',
                content: `### Why System Design Matters
System design interviews assess your ability to build software systems that work at scale. Unlike coding interviews that test algorithms, system design tests your ability to **think architecturally** — making decisions about databases, caching, networking, and trade-offs that affect millions of users.

At {{FAANG}} companies, system design is often the deciding factor for senior-level (L5+) offers. It separates engineers who can code features from engineers who can **design entire platforms**.`
            },
            {
                type: 'faang-insight',
                company: 'Google',
                content: 'At Google, the focus is heavily on **scalability** and **reliability**. You are expected to proactively identify bottlenecks before the interviewer points them out.'
            },
            {
                type: 'markdown',
                content: `### The Interview Framework

A typical system design interview lasts 45-60 minutes. Use this framework to stay structured:

1. **CLARIFY REQUIREMENTS** (5-7 min)
   - Function: What does it do?
   - Scale: How many users? ({{DAU}}, {{MAU}})
   - Constraints: Latency vs Consistency?

2. **HIGH-LEVEL DESIGN** (10-15 min)
   - Draw core components (LB, Web Server, DB)
   - Show data flow
   - Explain choices (SQL vs NoSQL)

3. **DEEP DIVE** (20-25 min)
   - Partitioning strategies ({{Sharding}})
   - Failure handling
   - Bottlenecks

4. **WRAP-UP** (5 min)
   - Summarize trade-offs
   - Suggest future improvements`
            },
            {
                type: 'code-tutorial',
                title: 'Scenario: Scaling a Photosharing App',
                language: 'System Architecture',
                code: `1. Client -> Web Server -> SQL DB
   (Works for 100 users)

2. Client -> Load Balancer -> [Web Server 1, Web Server 2] -> SQL DB
   (Works for 10k users, adds redundancy)

3. Client -> Load Balancer -> Web Cluster -> Reader/Writer DB Splitting
   (Works for 100k users. Writes go to Master, Reads to Slaves)

4. Client -> LB -> Web Cluster -> Sharded DB + Redis Cache + CDN
   (Works for 10M+ users. Content is cached near users.)`,
                steps: [
                    { title: 'Step 1: The Monolith', desc: 'At first, a single server handles everything. This is simple but has a Single Point of Failure (SPOF). If the server crashes, the app dies.', lines: [1, 2] },
                    { title: 'Step 2: Horizontal Scaling', desc: 'We add a Load Balancer (LB) to distribute traffic. Now we can add more web servers to handle more users. If one dies, the LB routes traffic to the others.', lines: [4, 5] },
                    { title: 'Step 3: Database Bottleneck', desc: 'Web servers scale easily, but the database is now the bottleneck. We split it into a Master (Write) and Slaves (Read). Since most apps are read-heavy, this significantly improves performance.', lines: [7, 8] },
                    { title: 'Step 4: Hyper-Scale', desc: 'To handle millions, we add Caching (Redis) to stop hitting the DB for common queries, and a CDN to serve images/css from a server close to the user physically.', lines: [10, 11] }
                ]
            }
        ]
    },
    {
        id: 'requirements-gathering',
        title: 'Professional Requirements Gathering',
        unit: 1,
        duration: '15 min',
        icon: 'check',
        sections: [
            { type: 'text', title: 'The Foundation of Great Design', content: 'The #1 reason candidates fail system design interviews is **jumping to solutions before understanding the problem**. Requirements gathering is not a formality — it\'s where you demonstrate engineering maturity.\n\nThere are two types of requirements:\n- **Functional Requirements**: What the system must DO (features, user actions)\n- **Non-Functional Requirements**: How the system must PERFORM (speed, reliability, scale)' },
            { type: 'example', title: 'The Right Way to Start', bad: '"Okay, so we\'ll have a database for users, posts, and comments. We\'ll use AWS..."\n❌ Jumped to solution without understanding requirements', good: '"Great! Before I start, let me clarify:\n1. Should we focus on core features (posting, following, feed) or the full feature set?\n2. Should the feed be chronological or algorithmic?\n3. Do we need stories (temporary posts)?\n4. Video or just images?\n5. Direct messaging?\n6. Mobile only or web too?"\n✅ Shows thoughtful requirement gathering' },
            {
                type: 'concept-card', title: 'Questions to Always Ask', items: [
                    { term: 'Users', definition: 'How many total users? Daily active? Concurrent?' },
                    { term: 'Features', definition: 'What are the core features for MVP? What can wait?' },
                    { term: 'Scale', definition: 'What\'s the read-to-write ratio? How much data per user?' },
                    { term: 'Latency', definition: 'What response time is acceptable? Real-time needed?' },
                    { term: 'Availability', definition: 'How much downtime is tolerable? 99.9%? 99.99%?' },
                    { term: 'Consistency', definition: 'Must all users see the same data instantly? Or is eventual consistency OK?' },
                ]
            },
            { type: 'text', title: 'Prioritizing Features (MVP)', content: '**Core Features (Must Have):**\n- Instagram: Post photos, follow users, view feed, like/comment\n- Uber: Request ride, driver acceptance, GPS tracking, payment\n- Netflix: Browse content, play videos, pause/resume\n\n**Secondary Features (Add Later):**\n- Instagram: Stories, reels, shopping\n- Uber: Ride scheduling, ride sharing, driver ratings\n- Netflix: Download offline, multiple profiles, autoplay' },
            { type: 'tip', variant: 'pro-tip', content: '"For our MVP, I\'ll focus on [core features]. We can add [secondary features] in future iterations once the core is stable and we understand user behavior better." — This is a gold statement in any interview.' },
            {
                type: 'scenario',
                title: 'Interview Scenario: Design Instagram',
                problem: 'Interviewer says: "Design Instagram." You have 45 minutes. What do you do first?',
                solution: '"Before jumping into the design, let me clarify the scope.\n\n**Functional Requirements — I\'ll prioritize:**\n- Post photos with captions — the core feature\n- Follow users and see their posts in a feed\n- Like and comment on posts\n- Search for users\n\n**Out of scope for MVP:** Stories, Reels, DMs, Shopping, Explore page.\n\n**Non-Functional Requirements:**\n- Scale: ~500M MAU, ~100M DAU (I\'ll design for this)\n- Availability over consistency: It\'s OK if a like count shows 999 instead of 1000\n- Feed latency: Feed should load under 200ms\n- Upload reliability: Photos should never be lost (11 nines durability)\n\nDoes this scope look right, or would you like me to include any other features?"'
            },
            {
                type: 'quiz',
                question: 'When designing a ride-sharing app like Uber, which is a non-functional requirement?',
                options: ['Users can request a ride', 'Drivers can accept ride requests', 'GPS location updates must be within 3 seconds', 'Users can rate their driver'],
                correctIndex: 2,
                explanation: 'GPS latency (within 3 seconds) is a non-functional requirement — it describes HOW the system performs, not WHAT it does. The other three are functional requirements (features the system provides).'
            },
        ],
    },
    {
        id: 'scale-estimation',
        title: 'Back-of-the-Envelope Estimation',
        unit: 1,
        duration: '12 min',
        icon: 'scale',
        sections: [
            {
                type: 'text',
                content: 'To design scalable systems (like Twitter or Instagram), you need to verify your design with back-of-the-envelope calculations. This helps you decide if you need one server or a thousand.'
            },
            {
                type: 'deep-dive',
                title: 'Case Study: The Math Behind Twitter (X) Scale',
                content: `Let's break down the math for a system like Twitter with **200M DAU**:

**1. Traffic Estimates:**
*   Users: 200M Daily Active Users (DAU)
*   Writes: Each user posts 2 tweets/day = 400M tweets/day
*   Reads: Each user views 100 tweets/day = 20B views/day
*   **Write QPS:** 400M / 86400 ≈ **4,600 QPS**
*   **Read QPS:** 20B / 86400 ≈ **230,000 QPS**

**2. Storage Estimates (Per Day):**
*   Tweet ID (8 bytes) + Text (140 bytes) + Metadata (50 bytes) ≈ 200 bytes
*   Media: 20% tweets have images (200KB avg)
*   Text Storage: 400M * 200 bytes = **80 GB/day**
*   Media Storage: 400M * 20% * 200KB = **16 TB/day**

**3. Bandwidth Estimates:**
*   Ingress (Upload): 16 TB / 86400 ≈ **185 MB/s**
*   Egress (Read): Assuming fanout, ~30 GB/s (very high!)

**Takeaway:** This system is **read-heavy**. You need heavy caching and a fanout-on-write architecture.`
            },
            {
                type: 'quiz',
                question: 'If a system has 10M DAU and each makes 10 requests/day, what is the approximate QPS?',
                options: ['~115 QPS', '~1,150 QPS', '~11,500 QPS', '~115,000 QPS'],
                correctIndex: 1,
                explanation: '10M * 10 = 100M requests/day. 100,000,000 / 86,400 seconds ≈ 1,157 QPS.'
            },
            {
                type: 'concept-card', title: 'Numbers Every Engineer Should Know', items: [
                    { term: 'L1 Cache', definition: '~1 ns' },
                    { term: 'L2 Cache', definition: '~4 ns' },
                    { term: 'RAM Access', definition: '~100 ns' },
                    { term: 'SSD Read', definition: '~100 μs' },
                    { term: 'HDD Seek', definition: '~10 ms' },
                    { term: 'Same datacenter roundtrip', definition: '~500 μs' },
                    { term: 'Cross-continent roundtrip', definition: '~150 ms' },
                ]
            },
            { type: 'tip', variant: 'interview', content: '"Based on 10M users with 1M daily active, I estimate ~230 RPS average, ~700 RPS peak. This means we need horizontal scaling with 10-15 app servers and database read replicas." — This kind of concrete math impresses interviewers.' },
        ],
    },
    {
        id: 'interview-framework',
        title: 'The System Design Framework',
        unit: 1,
        duration: '10 min',
        icon: 'architecture',
        sections: [
            { type: 'text', title: 'A Proven Step-by-Step Approach', content: 'Every successful system design interview follows the same high-level structure. Having a framework means you never freeze up — you always know what to do next.\n\nThe key is to be **structured but flexible**. Don\'t robotically follow steps — adapt based on what the interviewer cares about.' },
            { type: 'diagram', title: 'Time Allocation', content: '```\n┌──────────────────────────────────────────────────┐\n│  45-Minute Interview Breakdown                    │\n├───────────────┬──────┬────────────────────────────┤\n│ Requirements  │ 5-7m │ ████░░░░░░░░░░░░░░ (15%)   │\n│ High-Level    │10-15m│ ████████░░░░░░░░░░ (30%)   │\n│ Deep Dive     │20-25m│ █████████████░░░░░ (50%)   │\n│ Wrap-up       │ 3-5m │ ██░░░░░░░░░░░░░░░░  (5%)   │\n└───────────────┴──────┴────────────────────────────┘\n```' },
            { type: 'text', title: 'Phase 1: Requirements (5-7 min)', content: '1. **Ask clarifying questions** — functional AND non-functional\n2. **Estimate scale** — DAU, RPS, storage\n3. **Define scope** — what\'s in MVP, what\'s out\n4. **State assumptions** — "I\'ll assume 10M DAU unless you say otherwise"' },
            { type: 'text', title: 'Phase 2: High-Level Design (10-15 min)', content: '1. **Draw the big picture** — clients, load balancers, services, databases\n2. **Show data flow** — how a request travels through the system\n3. **Identify key services** — name them, explain their responsibility\n4. **Choose technologies** — and briefly justify each choice' },
            { type: 'text', title: 'Phase 3: Deep Dive (20-25 min)', content: 'This is where interviews are won or lost. The interviewer will pick 1-2 areas:\n1. **Database schema** — tables, indexes, queries\n2. **API design** — endpoints, payloads, auth\n3. **Scaling strategy** — sharding, caching, CDN\n4. **Failure handling** — what happens when X goes down?\n5. **Specific algorithm** — news feed ranking, matching, search' },
            { type: 'text', title: 'Phase 4: Wrap-up (3-5 min)', content: '1. **Identify bottlenecks** — "The database is our biggest risk at 100K RPS"\n2. **Propose improvements** — "I\'d add a cache layer and read replicas"\n3. **Summarize trade-offs** — "We chose AP over CP because..."' },
            { type: 'tip', variant: 'warning', content: 'Never spend more than 7 minutes on requirements. If you\'re still asking questions at minute 10, the interviewer will think you\'re stalling. Get the key info and move to design.' },
            {
                type: 'scenario',
                title: 'Good vs Bad: Opening Your Interview',
                problem: 'The interviewer says: "Design a URL shortener like bit.ly." Compare two candidate responses:',
                solution: '**Weak candidate:** "OK, so we need a web server, a database to store URLs, maybe Redis for caching... and we\'ll use AWS." ← Jumped straight to solution without understanding scope.\n\n**Strong candidate:** "Before I start, let me understand the requirements:\n- How many URLs shortened per day? I\'ll assume 100M writes/day.\n- Do shortened URLs ever expire? I\'ll assume 5-year default TTL.\n- Custom aliases? I\'ll include this as nice-to-have.\n- Analytics (click tracking)? I\'ll defer this to v2.\n- That gives us ~1,150 write QPS and ~11,500 read QPS (10:1 read ratio)\n- 5 years of data = ~180B URLs → we need a horizontally scaleable data store.\n\nLet me draw the high-level architecture..." ← Shows structured thinking, estimates, and prioritization.'
            },
            {
                type: 'quiz',
                question: 'In a 45-minute system design interview, how long should you spend on deep diving into specific components?',
                options: ['5-7 minutes', '10-15 minutes', '20-25 minutes', '30+ minutes'],
                correctIndex: 2,
                explanation: 'The deep dive phase (20-25 minutes) is where interviews are won or lost. This is where you show real engineering depth — discussing database schemas, failure modes, scaling strategies, and trade-offs. Spend 5-7 min on requirements, 10-15 min on high-level design, 20-25 min on deep dive, and 3-5 min wrapping up.'
            },
        ],
    },

    // ═══════════════════════════════════════════════════════
    //  UNIT 2: CORE BUILDING BLOCKS
    // ═══════════════════════════════════════════════════════
    {
        id: 'databases-storage',
        title: 'Databases & Storage Architecture',
        unit: 2,
        duration: '20 min',
        icon: 'database',
        practiceLink: 'url-shortener',
        sections: [
            { type: 'text', title: 'The Most Important Decision', content: 'Database selection is often the single most impactful architectural decision. It affects performance, scalability, consistency, and cost. Interviewers will **always** ask "Why did you choose that database?"\n\nThe answer is never "because it\'s popular." It must be driven by your data\'s characteristics.' },
            {
                type: 'deep-dive',
                title: 'ACID Transactions in Distributed Environments',
                content: `SQL databases guarantee **ACID** properties, which is critical for financial transactions. Let's see why:

**Scenario:** Alice sends $100 to Bob.

**A - Atomicity (All or Nothing):**
If the system crashes after deducting from Alice but *before* adding to Bob, Atomicity rolls back the deduction. Money is never lost.

**C - Consistency:**
The database ensures rules are met (e.g., "Balance cannot be negative"). If Alice has $50, the transaction fails.

**I - Isolation:**
If Alice sends money to Bob *and* Charlie at the exact same millisecond, Isolation ensures the transactions run sequentially (or lock correctly) so she doesn't double-spend.

**D - Durability:**
Once the system says "Success", the data is on the disk. Even if the power plug is pulled 1ms later, the record survives.`
            },
            {
                type: 'comparison', title: 'SQL vs NoSQL Decision', headers: ['Factor', 'SQL (PostgreSQL, MySQL)', 'NoSQL (MongoDB, DynamoDB, Cassandra)'],
                rows: [
                    ['Data Model', 'Structured, relational, normalized', 'Flexible: document, key-value, wide-column, graph'],
                    ['Schema', 'Fixed schema, migrations needed', 'Schema-less or flexible schema'],
                    ['Scaling', 'Vertical first, horizontal harder', 'Horizontal by design'],
                    ['Consistency', 'Strong ACID transactions', 'Eventual consistency (tunable)'],
                    ['Joins', 'Excellent, native support', 'Poor or none — denormalize instead'],
                    ['Best For', 'Banking, e-commerce, relational data', 'Social feeds, IoT, real-time analytics, catalogs'],
                ]
            },
            { type: 'diagram', title: 'Database Decision Tree', content: '```\nDo you need ACID transactions?\n├── YES → Do you need complex joins?\n│   ├── YES → PostgreSQL / MySQL\n│   └── NO → PostgreSQL (still best default)\n└── NO → What\'s your access pattern?\n    ├── Key-value lookups → Redis / DynamoDB\n    ├── Document storage → MongoDB\n    ├── Time-series data → InfluxDB / TimescaleDB\n    ├── Wide-column (massive write throughput) → Cassandra\n    ├── Graph relationships → Neo4j\n    └── Full-text search → Elasticsearch\n```' },
            { type: 'text', title: 'Indexing — The 500× Speed Boost', content: '**Without index:** Full table scan → 5000ms\n**With B-tree index:** Direct lookup → 10ms\n\n**When to add indexes:**\n- Columns in WHERE clauses\n- Columns in JOIN conditions\n- Columns used for ORDER BY\n\n**When NOT to index:**\n- Columns with low cardinality (boolean, status)\n- Tables with heavy writes (indexes slow down inserts)\n- Small tables (< 1000 rows)' },
            { type: 'text', title: 'Sharding — Horizontal Scaling', content: '**When single DB can\'t handle the load, split data across multiple servers.**\n\n**Sharding Strategies:**\n- **Hash-based:** `shard = hash(user_id) % num_shards` — even distribution\n- **Range-based:** Users A-M on shard 1, N-Z on shard 2 — can be uneven\n- **Geographic:** US data on US shard, EU on EU shard — low latency\n\n**Challenges:**\n- Cross-shard queries are expensive\n- Rebalancing when adding shards\n- Maintaining referential integrity' },
            { type: 'tip', variant: 'interview', content: '"I\'d start with PostgreSQL because we need ACID for payments. For the feed/timeline data, I\'d use Redis for the hot path and Cassandra for the cold storage — it handles our write-heavy pattern at scale." — This shows nuanced thinking.' },
            { type: 'code', language: 'sql', title: 'Database Schema Design — E-Commerce Example', content: '-- A well-designed schema for an e-commerce platform\n-- Notice: normalized for writes, denormalized for reads\n\n-- Core Users Table\nCREATE TABLE users (\n    id          BIGSERIAL PRIMARY KEY,  -- Auto-incrementing ID\n    email       VARCHAR(255) UNIQUE NOT NULL,\n    username    VARCHAR(50) UNIQUE NOT NULL,\n    password_hash VARCHAR(255) NOT NULL, -- Never store plain passwords!\n    created_at  TIMESTAMP DEFAULT NOW(),\n    INDEX idx_email (email)  -- Index for login lookups\n);\n\n-- Products with proper indexing\nCREATE TABLE products (\n    id          BIGSERIAL PRIMARY KEY,\n    name        VARCHAR(255) NOT NULL,\n    price       DECIMAL(10,2) NOT NULL,  -- DECIMAL for money, never FLOAT!\n    category_id INT REFERENCES categories(id),\n    stock       INT DEFAULT 0,\n    created_at  TIMESTAMP DEFAULT NOW(),\n    INDEX idx_category (category_id),   -- Filter by category\n    INDEX idx_price (price)              -- Sort by price\n);\n\n-- Orders with ACID guarantees\nCREATE TABLE orders (\n    id          BIGSERIAL PRIMARY KEY,\n    user_id     BIGINT REFERENCES users(id),\n    total       DECIMAL(10,2) NOT NULL,\n    status      VARCHAR(20) DEFAULT \'pending\',  -- pending/paid/shipped/delivered\n    created_at  TIMESTAMP DEFAULT NOW(),\n    INDEX idx_user_orders (user_id, created_at DESC)  -- "My Orders" page\n);\n\n-- Why DECIMAL for money?\n-- FLOAT: 0.1 + 0.2 = 0.30000000000000004 (WRONG!)\n-- DECIMAL: 0.1 + 0.2 = 0.3 (CORRECT!)\n-- Real banks have lost millions due to floating point errors.' },
            {
                type: 'deep-dive',
                title: 'Real Example: How Discord Stores Trillions of Messages',
                content: `Discord stores **trillions of messages** and needs to serve them fast. Here's their actual architecture evolution:

**Phase 1 (2015): MongoDB**
- Single MongoDB instance
- Worked fine for <10M users
- Began crashing as message volume grew

**Phase 2 (2017): Cassandra**
- Moved to Cassandra for horizontal scaling
- Partitioned by channel_id + time bucket
- Could handle massive writes (100K+ messages/sec)
- Problem: Cassandra's storage engine caused GC pauses at scale

**Phase 3 (2023): ScyllaDB**
- Rewrote from Cassandra to ScyllaDB (Cassandra-compatible, C++ based)
- Same data model, but 10× lower latency
- P99 latency went from 40-125ms → 5-15ms
- Cut their server count by 3×

**Key design decisions:**
- Messages partitioned by (channel_id, bucket) — bucket = 10-day window
- Each bucket is a single Cassandra partition → fast sequential reads
- "Jump to" feature uses binary search within a partition
- Read-heavy workload → heavy caching with Redis`
            },
            {
                type: 'quiz',
                question: 'You\'re designing a social media platform. User profiles are read 100× more than they\'re updated. Which database pattern is most appropriate?',
                options: ['Write-optimized NoSQL (Cassandra)', 'PostgreSQL with read replicas', 'MongoDB with single node', 'Redis only'],
                correctIndex: 1,
                explanation: 'For a 100:1 read-to-write ratio with structured user data, PostgreSQL with read replicas is ideal. The primary handles writes while multiple replicas serve reads. Cassandra is write-optimized. MongoDB single node doesn\'t scale reads. Redis is for caching, not primary storage.'
            },
        ],
    },
    {
        id: 'caching-strategies',
        title: 'High-Performance Caching',
        unit: 2,
        duration: '15 min',
        icon: 'scale',
        sections: [
            { type: 'text', title: 'Speed Up Everything by 50×', content: 'Caching stores frequently accessed data in fast memory (RAM) instead of hitting the database every time.\n\n**The impact:**\n- Database query: ~50ms\n- Redis cache hit: ~1ms\n- That\'s a **50× improvement**\n\nEvery system design should include at least one caching layer.' },
            {
                type: 'concept-card', title: 'Caching Strategies', items: [
                    { term: 'Cache-Aside (Lazy Loading)', definition: 'App checks cache first → miss → read DB → write to cache. Most common. Good for read-heavy workloads.' },
                    { term: 'Write-Through', definition: 'Every write goes to cache AND DB simultaneously. Data always fresh. Higher write latency.' },
                    { term: 'Write-Behind (Write-Back)', definition: 'Write to cache → async write to DB later. Fastest writes. Risk of data loss if cache crashes.' },
                    { term: 'Read-Through', definition: 'Cache itself fetches from DB on miss. Simplifies app code. Cache acts as proxy.' },
                ]
            },
            { type: 'code', language: 'python', title: 'Cache-Aside Pattern', content: 'def get_user(user_id):\n    # 1. Check cache first\n    cached = redis.get(f"user:{user_id}")\n    if cached:\n        return json.loads(cached)  # Cache HIT — 1ms\n    \n    # 2. Cache miss — query database\n    user = db.query("SELECT * FROM users WHERE id = ?", user_id)  # 50ms\n    \n    # 3. Store in cache for next time (TTL: 5 minutes)\n    redis.setex(f"user:{user_id}", 300, json.dumps(user))\n    \n    return user' },
            { type: 'text', title: 'Cache Invalidation — The Hard Problem', content: '"There are only two hard things in Computer Science: cache invalidation and naming things." — Phil Karlton\n\n**Strategies:**\n- **TTL (Time-To-Live):** Cache expires after N seconds. Simple but stale data possible.\n- **Event-driven:** When data changes, invalidate cache immediately. Consistent but complex.\n- **Version-based:** Cache key includes version number. Increment to invalidate.\n\n**Common pitfalls:**\n- Cache stampede: 1000 requests hit DB when cache expires simultaneously\n- Solution: Lock + stale-while-revalidate OR jittered TTLs' },
            { type: 'text', title: 'Multi-Layer Caching', content: '```\nLayer 1: Browser cache (static assets, images)\nLayer 2: CDN cache (geographically distributed)\nLayer 3: API gateway cache (rate limiting, auth)\nLayer 4: Application cache (Redis/Memcached)\nLayer 5: Database query cache (built-in)\n```\n\nEach layer reduces load on the layers below it.' },
            { type: 'tip', variant: 'interview', content: 'When asked about caching, always address: (1) What to cache, (2) When to invalidate, (3) What happens on cache miss, (4) How to handle cache stampede. This shows depth.' },
            {
                type: 'deep-dive',
                title: 'Real Example: How Netflix Caches Content for 200M Users',
                content: `Netflix serves 200M+ subscribers streaming simultaneously. Their caching strategy is multi-layered and fascinating:

**Layer 1: Open Connect (CDN)**
- Netflix builds its own CDN boxes and places them **inside ISPs worldwide**
- Your local Comcast data center has a Netflix server with thousands of movies pre-cached
- 95% of video traffic is served from these edge boxes, never touching Netflix's origin servers

**Layer 2: EVCache (Distributed Cache)**
- Netflix's custom caching layer built on Memcached
- Stores: user profiles, viewing history, recommendations, session data
- Runs across multiple AWS availability zones for fault tolerance
- If one AZ fails, the other continues serving (with fallback to DB)

**Layer 3: Data Pipeline Caching**
- Pre-computed recommendations are cached hourly
- "Because you watched X" rows are pre-built and stored in EVCache
- Not computed on-the-fly — that would be too slow

**Their golden rule: Every request should be served from cache.** Database calls are the exception, not the norm. If a DB call is required, it's considered a performance bug.`
            },
            { type: 'code', language: 'python', title: 'Cache Stampede Protection — Locking Pattern', content: '# Cache Stampede: 1000 requests arrive for the same expired key\n# ALL hit the database simultaneously → DB overloaded\n# Solution: Only ONE request rebuilds the cache, others wait\n\nimport redis\nimport json\nimport time\n\ndef get_with_lock(key: str, db_fetch_fn, ttl=300):\n    """\n    Cache-Aside with stampede protection using Redis locks.\n    \n    Problem: Key expires → 1000 requests → 1000 DB queries\n    Solution: First request acquires lock, rebuilds cache.\n             Other 999 wait for the cache to be repopulated.\n    """\n    r = redis.Redis()\n    \n    # 1. Try cache first\n    cached = r.get(key)\n    if cached:\n        return json.loads(cached)  # Cache HIT\n    \n    # 2. Cache miss — try to acquire lock\n    lock_key = f"lock:{key}"\n    acquired = r.set(lock_key, "1", nx=True, ex=10)  # Lock for 10 sec max\n    \n    if acquired:\n        # 3a. I got the lock — I\'ll rebuild the cache\n        try:\n            data = db_fetch_fn()  # Single DB call\n            r.setex(key, ttl, json.dumps(data))\n            return data\n        finally:\n            r.delete(lock_key)  # Release lock\n    else:\n        # 3b. Someone else is rebuilding — wait and retry\n        for _ in range(50):  # Wait up to 5 seconds\n            time.sleep(0.1)\n            cached = r.get(key)\n            if cached:\n                return json.loads(cached)\n        \n        # 3c. Gave up waiting — fetch from DB as fallback\n        return db_fetch_fn()' },
            {
                type: 'quiz',
                question: 'A Token Bucket has capacity=10 and refill_rate=2 tokens/sec. After 3 seconds of inactivity, a burst of 15 requests arrives. How many succeed?',
                options: ['6 requests', '10 requests', '15 requests', '2 requests'],
                correctIndex: 1,
                explanation: 'After 3 seconds, 6 new tokens are added (3 × 2 = 6). But the bucket was already full at 10 tokens, and it can\'t exceed capacity. So the bucket still has 10 tokens. The first 10 requests succeed, the remaining 5 are rate-limited.'
            },
        ],
    },
    {
        id: 'load-balancing',
        title: 'Advanced Load Balancing',
        unit: 2,
        duration: '12 min',
        icon: 'architecture',
        sections: [
            { type: 'text', title: 'Distributing Traffic Across Servers', content: 'A load balancer sits between clients and servers, distributing incoming requests so no single server is overwhelmed.\n\n**Why it matters:**\n- **Scalability:** Add more servers to handle more traffic\n- **Reliability:** If one server dies, others continue serving\n- **Performance:** Route to the least busy server' },
            {
                type: 'comparison', title: 'L4 vs L7 Load Balancing', headers: ['Aspect', 'Layer 4 (Transport)', 'Layer 7 (Application)'],
                rows: [
                    ['Operates on', 'TCP/UDP packets', 'HTTP requests'],
                    ['Sees', 'IP addresses, ports', 'URLs, headers, cookies, body'],
                    ['Speed', 'Very fast (no inspection)', 'Slower (must parse HTTP)'],
                    ['Routing', 'Basic: round-robin, least connections', 'Smart: URL path, headers, content type'],
                    ['Use Case', 'Generic TCP services, databases', 'Web apps, API routing, A/B testing'],
                    ['Examples', 'AWS NLB, HAProxy (TCP mode)', 'AWS ALB, Nginx, HAProxy (HTTP mode)'],
                ]
            },
            {
                type: 'concept-card', title: 'Load Balancing Algorithms', items: [
                    { term: 'Round Robin', definition: 'Requests go to servers in order: 1, 2, 3, 1, 2, 3... Simple but ignores server load.' },
                    { term: 'Weighted Round Robin', definition: 'Powerful servers get more requests. Server A (weight 3) gets 3× more than Server B (weight 1).' },
                    { term: 'Least Connections', definition: 'Route to the server with fewest active connections. Best for long-lived requests.' },
                    { term: 'IP Hash', definition: 'Hash client IP to determine server. Ensures same client always hits same server (session affinity).' },
                    { term: 'Random', definition: 'Randomly pick a server. Surprisingly effective at scale with many servers.' },
                ]
            },
            { type: 'text', title: 'Health Checks', content: 'Load balancers continuously check server health:\n\n```\nEvery 10 seconds:\n  GET /health → 200 OK → Server healthy ✓\n  GET /health → timeout → Mark unhealthy ✗\n  After 3 consecutive fails → Remove from pool\n  After 3 consecutive passes → Add back to pool\n```\n\nThis enables **zero-downtime deployments** — take servers out, update, add back.' },
            { type: 'tip', variant: 'interview', content: '"I\'d use an L7 ALB for our API layer — it can route /api/users to the user service and /api/orders to the order service. For the database layer, an L4 NLB since we just need TCP distribution."' },
            { type: 'code', language: 'nginx', title: 'Nginx Load Balancer — Real Configuration', content: '# Real Nginx load balancer config for a microservices architecture\n# This is similar to what companies like Airbnb and Dropbox use\n\n# Define backend server pools (upstream)\nupstream api_servers {\n    # Least connections algorithm — route to least busy server\n    least_conn;\n    \n    server 10.0.1.1:8080 weight=3;  # Powerful server, gets 3× traffic\n    server 10.0.1.2:8080 weight=2;  # Medium server\n    server 10.0.1.3:8080 weight=1;  # Smaller server\n    \n    # Health checks: mark unhealthy after 3 failures\n    server 10.0.1.4:8080 backup;    # Only used if others are down\n}\n\nupstream websocket_servers {\n    # IP hash for WebSocket — same client always hits same server\n    # Critical for maintaining persistent WebSocket connections\n    ip_hash;\n    \n    server 10.0.2.1:8080;\n    server 10.0.2.2:8080;\n}\n\nserver {\n    listen 443 ssl;\n    server_name api.example.com;\n    \n    # Route API requests to API servers\n    location /api/ {\n        proxy_pass http://api_servers;\n        proxy_set_header X-Real-IP $remote_addr;\n    }\n    \n    # Route WebSocket to dedicated servers\n    location /ws/ {\n        proxy_pass http://websocket_servers;\n        proxy_http_version 1.1;\n        proxy_set_header Upgrade $http_upgrade;  # Required for WebSocket\n        proxy_set_header Connection "upgrade";\n    }\n}' },
            {
                type: 'quiz',
                question: 'Your chat application uses WebSocket connections. Which load balancing algorithm should you use to ensure persistent connections aren\'t broken?',
                options: ['Round Robin', 'Least Connections', 'IP Hash (Session Affinity)', 'Random'],
                correctIndex: 2,
                explanation: 'WebSocket connections are persistent — they maintain a long-lived connection between client and server. IP Hash ensures the same client always routes to the same server, preserving the WebSocket connection. Round Robin or Random would route subsequent packets to different servers, breaking the connection.'
            },
            {
                type: 'quiz',
                question: 'Which Load Balancing algorithm is best for a system where some requests take much longer than others?',
                options: [
                    'Round Robin',
                    'Weighted Round Robin',
                    'Least Connections',
                    'IP Hash'
                ],
                correctIndex: 2,
                explanation: 'Least Connections routes traffic to the server currently handling the fewest requests. This prevents "clogging" a server that happened to get several heavy, long-running requests in a row.'
            }
        ],
    },
    {
        id: 'networking-fundamentals',
        title: 'Networking & Protocols',
        unit: 2,
        duration: '15 min',
        icon: 'network',
        sections: [
            { type: 'text', title: 'How the Internet Works', content: 'Every system design sits on top of networking. Understanding DNS, HTTP, TCP, and CDNs helps you make better architectural choices.' },
            {
                type: 'step-by-step',
                title: 'The Journey of a URL',
                steps: [
                    { title: 'DNS Resolution', desc: 'Browser asks DNS Resolver: "Where is google.com?" Resolver replies with IP: 142.250.190.46.' },
                    { title: 'TCP Handshake (SYN, SYN-ACK, ACK)', desc: 'Browser and Server establish a reliable connection. "Can you hear me?" "Yes, can you hear me?" "Yes."' },
                    { title: 'TLS Handshake', desc: 'They negotiate encryption keys so no one can spy on the data. The lock icon appears.' },
                    { title: 'HTTP Request', desc: 'Browser sends: GET /search?q=cats' },
                    { title: 'Server Processing', desc: 'Load Balancer forwards to Web Server → DB Query → HTML generated.' },
                    { title: 'HTTP Response', desc: 'Server sends back HTML code (200 OK).' }
                ]
            },
            {
                type: 'deep-dive',
                title: '🌍 GeoDNS & Anycast: Global Speed',
                content: `How does Google serve billions of users fast?

**GeoDNS:**
The DNS server checks your IP.
*   If you are in **London**, it returns the IP of the **UK Data Center**.
*   If you are in **Tokyo**, it returns the IP of the **Japan Data Center**.

**Anycast:**
Multiple servers share the **same IP address**. The internet routers automatically send your request to the *nearest* physical server. This is how CDNs works.`
            },
            {
                type: 'concept-card', title: 'Key Protocols', items: [
                    { term: 'DNS', definition: 'Translates domain names to IP addresses. First step in every request. Can be used for geographic load balancing.' },
                    { term: 'TCP', definition: 'Reliable, ordered delivery. Used by HTTP, databases. Has overhead from 3-way handshake and acknowledgments.' },
                    { term: 'UDP', definition: 'Fast, unreliable, no ordering. Used for video streaming, gaming, DNS queries. Lower latency than TCP.' },
                    { term: 'HTTP/HTTPS', definition: 'Request-response protocol. REST APIs, web pages. HTTP/2 adds multiplexing. HTTP/3 uses QUIC (UDP-based).' },
                    { term: 'WebSocket', definition: 'Full-duplex persistent connection. Used for real-time: chat, live updates, collaborative editing.' },
                    { term: 'gRPC', definition: 'Binary protocol over HTTP/2. Faster than REST. Used for internal microservice communication.' },
                ]
            },
            { type: 'text', title: 'CDN — Content Delivery Network', content: 'CDNs cache content at edge servers close to users worldwide.\n\n```\nWithout CDN:\n  User in Tokyo → Server in US → 150ms latency\n\nWith CDN:\n  User in Tokyo → CDN edge in Tokyo → 10ms latency\n```\n\n**What to put on CDN:**\n- Static files: images, CSS, JS, videos\n- API responses that don\'t change often\n- HTML pages (for static sites)\n\n**CDN providers:** CloudFront, Cloudflare, Akamai, Fastly' },
            {
                type: 'comparison', title: 'REST vs WebSocket vs gRPC', headers: ['Protocol', 'Pattern', 'Best For'],
                rows: [
                    ['REST', 'Request → Response', 'CRUD APIs, public APIs, simple interactions'],
                    ['WebSocket', 'Bidirectional streaming', 'Chat, live dashboards, collaborative editing, gaming'],
                    ['gRPC', 'RPC with protobuf', 'Internal microservice calls, high-performance, streaming'],
                    ['SSE', 'Server → Client push', 'Notifications, live feeds, stock prices'],
                ]
            },
            {
                type: 'deep-dive',
                title: 'Why WhatsApp Chose Erlang Over HTTP',
                content: `WhatsApp achieved **2 billion messages per day** with a team of just 50 engineers. Their secret weapon? Erlang and raw TCP sockets.

**Why NOT HTTP/REST for messaging?**
- HTTP adds overhead: headers, cookies, connection setup (~200 bytes per request)
- Messages are tiny (avg 50 bytes) — HTTP overhead is 4× bigger than the payload!
- HTTP is request-response — but chat needs push (server → client)

**Their solution:**
- Custom binary protocol on top of raw TCP sockets
- Erlang VM handles millions of concurrent connections on a single server
- Each connection uses only 2KB of memory (vs 2MB for a Java thread)
- One server could handle 2 million simultaneous connections

**The lesson:** Sometimes REST isn't the answer. For real-time systems with millions of tiny messages, raw TCP/WebSocket with a custom protocol can be 100× more efficient.`
            },
            {
                type: 'quiz',
                question: 'A user in Tokyo accesses your application hosted in US-East. The page loads slowly. What\'s the MOST impactful improvement?',
                options: ['Upgrade to a faster database', 'Add a CDN with edge servers in Asia', 'Switch from HTTP/1.1 to HTTP/2', 'Add more application servers in US-East'],
                correctIndex: 1,
                explanation: 'The main bottleneck is network latency — a round trip from Tokyo to US-East is ~150ms. A CDN with edge servers in Asia caches static content close to the user, reducing latency to ~10ms. HTTP/2 helps with multiplexing but doesn\'t fix the fundamental distance problem. More US servers don\'t help with geographic latency.'
            },
            { type: 'tip', variant: 'interview', content: 'When asked about latency, mention **CDNs**. "By moving our static assets (images, JS) to a CDN edge like Cloudflare or AWS CloudFront, we reduce the physical distance to the user, significantly lowering the Time to First Byte (TTFB)." This shows you think about global users.' },
            {
                type: 'quiz',
                question: 'What is the primary difference between TCP and UDP?',
                options: [
                    'TCP is faster, UDP is more reliable',
                    'TCP guarantees delivery and order, UDP is "fire and forget"',
                    'UDP is only used for websites, TCP is for video',
                    'There is no functional difference'
                ],
                correctIndex: 1,
                explanation: 'TCP uses a "Three-way Handshake" to ensure a reliable connection. UDP just sends packets without checking if they arrived, making it much faster but less reliable — perfect for video streaming and gaming.'
            }
        ],
    },
    {
        id: 'rate-limiting',
        title: 'Defensive Design: Rate Limiting',
        unit: 2,
        duration: '18 min',
        icon: 'security',
        sections: [
            { type: 'text', title: 'Why Every System Needs a Bouncer', content: 'Imagine a nightclub with no bouncer — anyone can walk in. On a busy Saturday, the club gets dangerously overcrowded, the bartenders can\'t serve anyone, and the whole experience degrades.\n\n**Rate limiting is that bouncer for your API.** It controls how many requests a user (or IP, or service) can make in a given time window. Without it, a single misbehaving client can bring down your entire system.\n\n**Real-world consequences of no rate limiting:**\n- **Twitter (2023):** Elon Musk had to emergency-add rate limits when scrapers were consuming extreme amounts of server resources\n- **GitHub API:** Without their rate limit of 5,000 requests/hour, CI/CD pipelines would overwhelm their servers\n- **Stripe:** Payment APIs use strict rate limits to prevent accidental double-charges from retry storms' },
            {
                type: 'concept-card', title: 'Why Rate Limit?', items: [
                    { term: 'Prevent Abuse', definition: 'Stop bad actors from DDoS attacks, brute-force login attempts, or scraping your data. A single attacker could send millions of requests per second.' },
                    { term: 'Protect Resources', definition: 'Your database has a connection limit (-100-500). If 10,000 requests hit it simultaneously, the DB crashes. Rate limiting keeps traffic within safe bounds.' },
                    { term: 'Ensure Fairness', definition: 'Without limits, one heavy user could consume 90% of your API capacity, leaving nothing for others. Think of it as a "fair use" policy.' },
                    { term: 'Control Costs', definition: 'Cloud services charge per request. An accidental infinite loop in a client could rack up thousands of dollars in API calls.' },
                    { term: 'Manage SLAs', definition: 'If you promise 99.9% uptime, you need to prevent traffic spikes from causing outages. Rate limiting is your safety net.' },
                ]
            },
            { type: 'text', title: 'The Token Bucket Algorithm — How It Works', content: 'The **Token Bucket** is the most widely used rate limiting algorithm. Think of it like an arcade token machine:\n\n**The Analogy:**\n- You have a bucket that holds a maximum number of **tokens** (say, 10)\n- Every second, a new token is added to the bucket (the **refill rate**)\n- When you want to make an API call, you need to spend 1 token\n- If the bucket is empty, your request is **rejected** (HTTP 429 Too Many Requests)\n- If the bucket is full and a new token arrives, it overflows — tokens don\'t accumulate beyond the max\n\n**Why it\'s brilliant:**\n- Allows **bursts** — if you haven\'t used the API in a while, your bucket is full and you can make 10 rapid requests\n- But sustained abuse is blocked — you can\'t exceed the refill rate long-term\n- Simple to implement, predictable behavior' },
            { type: 'code', language: 'python', title: 'Token Bucket — Step-by-Step Implementation', content: '# Token Bucket Rate Limiter — The most popular algorithm\n# Used by: AWS API Gateway, Stripe, Shopify\n\nimport time\nimport threading\n\nclass TokenBucket:\n    """\n    How it works:\n    - The bucket starts full (max_tokens)\n    - Each request consumes 1 token\n    - Tokens refill at a constant rate (refill_rate per second)\n    - If bucket is empty → request denied (429)\n    """\n    def __init__(self, max_tokens: int, refill_rate: float):\n        self.max_tokens = max_tokens      # Bucket capacity (burst size)\n        self.refill_rate = refill_rate    # Tokens added per second\n        self.tokens = max_tokens          # Start with full bucket\n        self.last_refill = time.time()    # Track when we last added tokens\n        self.lock = threading.Lock()       # Thread-safe for concurrent requests\n    \n    def _refill(self):\n        """Add tokens based on elapsed time since last refill."""\n        now = time.time()\n        elapsed = now - self.last_refill\n        # Calculate how many tokens to add\n        # Example: 0.5 seconds elapsed × 10 tokens/sec = 5 new tokens\n        new_tokens = elapsed * self.refill_rate\n        self.tokens = min(self.max_tokens, self.tokens + new_tokens)\n        self.last_refill = now\n    \n    def allow_request(self) -> bool:\n        """Check if request is allowed. Returns True/False."""\n        with self.lock:  # Critical: multiple threads may call this\n            self._refill()\n            if self.tokens >= 1:\n                self.tokens -= 1  # Consume one token\n                return True       # ✅ Request allowed\n            return False          # ❌ Rate limited (429)\n\n# === Real-world usage ===\n# Create a limiter: 100 requests max, refilling at 10/second\nlimiter = TokenBucket(max_tokens=100, refill_rate=10)\n\n# Simulate API requests\nfor i in range(120):\n    if limiter.allow_request():\n        print(f"Request {i}: ✅ Allowed")\n    else:\n        print(f"Request {i}: ❌ Rate limited (429)")\n    # First 100 pass, then requests are denied until tokens refill' },
            {
                type: 'deep-dive',
                title: 'Real Example: How GitHub Rate Limits Their API',
                content: `When you call GitHub's API, you'll notice these headers in every response:

**Response Headers:**
\`X-RateLimit-Limit: 5000\`  ← Your bucket capacity
\`X-RateLimit-Remaining: 4985\`  ← Tokens left
\`X-RateLimit-Reset: 1609459200\`  ← When bucket refills (Unix timestamp)

**What happens when you're rate limited:**
1. You get HTTP \`429 Too Many Requests\`
2. The \`Retry-After\` header tells you when to try again
3. Your client should implement **exponential backoff** — wait 1s, then 2s, then 4s

**Why GitHub chose Token Bucket:**
- Developers need **burst capacity** — a CI/CD pipeline might make 50 API calls in rapid succession during a deploy
- But sustained scraping at 5000 req/min should be blocked
- Token Bucket perfectly handles both: allows bursts up to the bucket size, while enforcing a long-term average rate

**At scale, GitHub runs distributed rate limiting:** Each API server checks Redis for the user's token count, using Lua scripts to ensure atomicity.`
            },
            {
                type: 'comparison', title: 'Rate Limiting Algorithms Compared', headers: ['Algorithm', 'How It Works', 'Pros', 'Cons', 'Used By'],
                rows: [
                    ['Token Bucket', 'Tokens fill at constant rate, each request consumes one', 'Allows bursts, simple, memory efficient', 'Requires tuning bucket size vs refill rate', 'AWS, Stripe, GitHub'],
                    ['Leaky Bucket', 'Requests enter a queue, processed at fixed rate', 'Smooths out traffic perfectly, no bursts', 'May add latency, queued requests wait', 'Nginx, telecom systems'],
                    ['Fixed Window', 'Count requests in fixed time windows (e.g., per minute)', 'Very simple to implement', 'Boundary problem: 100 req at 0:59 + 100 at 1:01 = 200 in 2 sec', 'Simple APIs, internal tools'],
                    ['Sliding Window Log', 'Track timestamp of every request, count in sliding window', 'Most accurate, no boundary issues', 'High memory: stores every timestamp', 'Financial APIs, critical systems'],
                    ['Sliding Window Counter', 'Weighted average of current + previous window counts', 'Good accuracy, low memory', 'Slightly less precise than log approach', 'Cloudflare, most production systems'],
                ]
            },
            { type: 'code', language: 'python', title: 'Sliding Window Counter — Production-Grade', content: '# Sliding Window Counter — Best balance of accuracy and memory\n# Used by: Cloudflare, Kong API Gateway\n\nimport time\nimport threading\nfrom collections import defaultdict\n\nclass SlidingWindowCounter:\n    """\n    Instead of tracking every request timestamp (expensive),\n    we keep counters for the current and previous windows,\n    then calculate a weighted average.\n    \n    Example: window_size=60s, limit=100 requests\n    Current window: 30s elapsed, 40 requests\n    Previous window: 80 requests\n    \n    Weighted count = 80 × (1 - 30/60) + 40 = 80 × 0.5 + 40 = 80\n    Since 80 < 100 → Request ALLOWED\n    """\n    def __init__(self, limit: int, window_seconds: int):\n        self.limit = limit\n        self.window = window_seconds\n        self.counters = {}  # user_id → {window_start: count}\n        self.lock = threading.Lock()\n    \n    def allow_request(self, user_id: str) -> bool:\n        with self.lock:\n            now = time.time()\n            current_window = int(now // self.window) * self.window\n            previous_window = current_window - self.window\n            \n            # Get counts for current and previous windows\n            user_data = self.counters.setdefault(user_id, {})\n            current_count = user_data.get(current_window, 0)\n            previous_count = user_data.get(previous_window, 0)\n            \n            # Calculate position within current window (0.0 to 1.0)\n            elapsed_ratio = (now - current_window) / self.window\n            \n            # Weighted count: previous × remaining + current\n            weighted_count = previous_count * (1 - elapsed_ratio) + current_count\n            \n            if weighted_count >= self.limit:\n                return False  # ❌ Rate limited\n            \n            # Allow and increment current window\n            user_data[current_window] = current_count + 1\n            return True  # ✅ Allowed\n\n# Usage: 100 requests per 60-second window per user\nlimiter = SlidingWindowCounter(limit=100, window_seconds=60)' },
            {
                type: 'scenario',
                title: 'Interview Scenario: Design a Rate Limiter',
                problem: 'An interviewer asks: "Our API is getting hammered by scrapers. Some users make 10,000 requests per minute. Design a rate limiting solution."',
                solution: '**Great answer framework:**\n\n1. **Clarify:** "Should we rate limit per user, per IP, or both? What\'s our target limit — say 100 requests per minute?"\n\n2. **Choose algorithm:** "I\'d use a **Sliding Window Counter** for accuracy without high memory cost. Token Bucket is simpler if we want to allow bursts."\n\n3. **Architecture:** "Place the rate limiter as **middleware** before the API layer. Use **Redis** to store counters — it\'s in-memory (fast) and supports atomic operations."\n\n4. **Distributed:** "Since we have multiple API servers, we need a **centralized counter** in Redis. Use a Lua script for atomic check-and-increment to avoid race conditions."\n\n5. **Response:** "Return HTTP 429 with **Retry-After** header. Include rate limit headers (X-RateLimit-Remaining) so clients can self-throttle."\n\n6. **Edge cases:** "What about distributed systems? If Redis goes down, **fail open** (allow requests) rather than blocking all users. We can use a local in-memory fallback."'
            },
            {
                type: 'quiz',
                question: 'A Token Bucket has capacity=10 and refill_rate=2 tokens/sec. After 3 seconds of inactivity, a burst of 15 requests arrives. How many succeed?',
                options: ['6 requests', '10 requests', '15 requests', '2 requests'],
                correctIndex: 1,
                explanation: 'After 3 seconds, 6 new tokens are added (3 × 2 = 6). But the bucket was already full at 10 tokens, and it can\'t exceed capacity. So the bucket still has 10 tokens. The first 10 requests succeed, the remaining 5 are rate-limited.'
            },
            { type: 'tip', variant: 'interview', content: '"I\'d implement rate limiting at multiple levels: (1) Per-user limits to prevent abuse — 100 req/min, (2) Per-IP limits to stop DDoS — 1000 req/min, (3) Global limits to protect the system — 50,000 req/min total. Each layer uses Token Bucket stored in Redis with atomic Lua scripts." — This layered approach impresses interviewers because it shows depth.' },
        ],
    },
    {
        id: 'api-design-protocols',
        title: 'Professional API Design',
        unit: 2,
        duration: '20 min',
        icon: 'code',
        sections: [
            { type: 'text', title: 'The Contract Between Services', content: 'An API (Application Programming Interface) is a **contract** between two pieces of software. When you order food at a restaurant, the menu is the API — it tells you what you can order, what information you need to provide, and what you\'ll get back.\n\nIn system design interviews, API design reveals whether you can think about:\n- **Clarity** — Can another engineer understand your API without asking questions?\n- **Consistency** — Do similar endpoints behave similarly?\n- **Scalability** — Will this API work at 10× the current load?\n- **Backward compatibility** — Can you add features without breaking existing clients?' },
            {
                type: 'step-by-step',
                title: 'Designing a REST API — Twitter Example',
                steps: [
                    { title: 'Identify Resources (Nouns)', desc: 'Think about what "things" exist in your system. For Twitter: Users, Tweets, Followers, Likes, Timelines. Each resource gets its own URL path: /users, /tweets, /timelines.' },
                    { title: 'Define Operations (HTTP Verbs)', desc: 'Map CRUD operations to HTTP methods: POST /tweets (create), GET /tweets/:id (read), PUT /tweets/:id (update), DELETE /tweets/:id (delete). Never use verbs in URLs like /getTweet — the HTTP method IS the verb.' },
                    { title: 'Design Request/Response Payloads', desc: 'What data does the client send? What does the server return? Always include: the resource data, metadata (timestamps, IDs), and pagination info for list endpoints.' },
                    { title: 'Handle Errors Consistently', desc: 'Use standard HTTP status codes: 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 404 (Not Found), 429 (Rate Limited), 500 (Server Error). Always return a JSON error body with a message.' },
                    { title: 'Add Pagination & Filtering', desc: 'List endpoints MUST be paginated. Use cursor-based pagination for feeds (more efficient than offset): GET /tweets?cursor=abc123&limit=20. Support filtering: GET /tweets?user_id=42&since=2024-01-01.' },
                    { title: 'Version Your API', desc: 'Always version: /api/v1/tweets. This lets you make breaking changes in v2 while v1 clients still work. Stripe keeps old API versions running for years.' },
                ]
            },
            { type: 'code', language: 'javascript', title: 'REST API Design — Complete Example', content: '// ============================================\n// Twitter-like API — Full REST Design\n// ============================================\n\n// === 1. CREATE A TWEET ===\n// POST /api/v1/tweets\n// Headers: Authorization: Bearer <jwt_token>\n// Request Body:\n{\n  "text": "Hello world! My first tweet",\n  "media_ids": ["img_abc123"],     // Optional: attached images\n  "reply_to": null                  // Optional: thread reply\n}\n// Response: 201 Created\n{\n  "data": {\n    "id": "tweet_789",\n    "text": "Hello world! My first tweet",\n    "author": {\n      "id": "user_42",\n      "username": "johndoe",\n      "avatar_url": "https://cdn.example.com/avatars/42.jpg"\n    },\n    "created_at": "2024-12-15T10:30:00Z",\n    "likes_count": 0,\n    "retweets_count": 0\n  }\n}\n\n// === 2. GET USER\'S TIMELINE (Cursor Pagination) ===\n// GET /api/v1/timeline?cursor=eyJpZCI6MTIzfQ&limit=20\n// Response: 200 OK\n{\n  "data": [\n    { "id": "tweet_789", "text": "...", "author": {...} },\n    { "id": "tweet_788", "text": "...", "author": {...} }\n  ],\n  "pagination": {\n    "next_cursor": "eyJpZCI6Nzg4fQ",  // Base64 encoded\n    "has_more": true\n  }\n}\n// Client calls: GET /timeline?cursor=eyJpZCI6Nzg4fQ for next page\n\n// === 3. ERROR RESPONSE FORMAT ===\n// 400 Bad Request\n{\n  "error": {\n    "code": "TWEET_TOO_LONG",\n    "message": "Tweet exceeds 280 character limit",\n    "details": { "max_length": 280, "actual_length": 312 }\n  }\n}' },
            {
                type: 'deep-dive',
                title: 'Why Cursor Pagination Beats Offset Pagination',
                content: `Most beginners use \`?page=2&limit=20\` (offset pagination). Here's why it breaks at scale:

**Offset Pagination — The Problem:**
\`SELECT * FROM tweets ORDER BY created_at DESC LIMIT 20 OFFSET 10000\`
- The database must scan and discard 10,000 rows to get to your page
- Page 500 takes 25× longer than page 1
- If new tweets are inserted while paginating, you'll see **duplicates or miss items**

**Cursor Pagination — The Solution:**
\`SELECT * FROM tweets WHERE id < 'tweet_788' ORDER BY id DESC LIMIT 20\`
- Uses an indexed column (id or timestamp) as a "bookmark"
- Always O(1) performance regardless of which "page" you're on
- No duplicates or missing items, even with real-time inserts

**How cursors work in practice:**
1. Client requests: \`GET /tweets?limit=20\`
2. Server returns 20 tweets + \`next_cursor: "eyJpZCI6Nzg4fQ"\`
3. Cursor is a Base64-encoded pointer: \`{"id": 788}\`
4. Client requests: \`GET /tweets?cursor=eyJpZCI6Nzg4fQ&limit=20\`
5. Server decodes cursor → \`WHERE id < 788 LIMIT 20\`

**Used by:** Twitter, Facebook, Slack, Stripe — virtually every feed-based API at scale.`
            },
            {
                type: 'comparison', title: 'REST vs GraphQL vs gRPC — When to Use Each', headers: ['Aspect', 'REST', 'GraphQL', 'gRPC'],
                rows: [
                    ['Data Format', 'JSON', 'JSON', 'Protocol Buffers (binary)'],
                    ['Protocol', 'HTTP/1.1 or HTTP/2', 'HTTP', 'HTTP/2 (required)'],
                    ['Over/Under-fetching', 'Common problem — fixed payloads', 'Client specifies exact fields needed', 'Fixed contract via .proto files'],
                    ['Real-world speed', '~50-200ms typical', '~50-200ms typical', '~5-20ms (10× faster than REST)'],
                    ['Best For', 'Public APIs, simple CRUD, web apps', 'Mobile apps, complex nested data, multiple resources in one call', 'Internal microservice calls, real-time streaming, high-performance'],
                    ['Learning Curve', 'Low — everyone knows REST', 'Medium — new query language', 'High — protobuf, code generation'],
                    ['Famous Users', 'Stripe, GitHub, Twitter', 'Facebook, GitHub (v4), Shopify', 'Google, Netflix, Spotify internal'],
                ]
            },
            {
                type: 'code', language: 'graphql', title: 'GraphQL — Solving the Over-Fetching Problem', content: '# REST Problem: To show a user profile page, you need 3 API calls:\n# GET /users/42           → user name, bio\n# GET /users/42/tweets    → their tweets  \n# GET /users/42/followers → follower count\n# That\'s 3 round trips! On mobile with high latency, this is painful.\n\n# GraphQL Solution: ONE request, get exactly what you need:\nquery UserProfile {\n  user(id: "42") {\n    name\n    bio\n    avatar_url\n    tweets(limit: 10) {      # Nested! No separate call needed\n      id\n      text\n      likes_count\n      created_at\n    }\n    followers_count           # Just the count, not all followers\n  }\n}\n\n# Response: Only the fields you asked for — nothing more, nothing less\n{\n  "data": {\n    "user": {\n      "name": "John Doe",\n      "bio": "Software Engineer",\n      "avatar_url": "https://...",\n      "tweets": [\n        { "id": "789", "text": "Hello!", "likes_count": 42, "created_at": "..." }\n      ],\n      "followers_count": 1234\n    }\n  }\n}'
            },
            { type: 'text', title: 'Idempotency — The Silent Hero of API Design', content: 'An operation is **idempotent** if doing it once has the same effect as doing it N times.\n\n**Why this matters:** Networks are unreliable. If a client sends a payment request and the connection drops, did the payment go through? The client doesn\'t know, so it retries. Without idempotency, the user gets charged twice.\n\n**HTTP Method Idempotency:**\n- **GET** — Always idempotent (reading data doesn\'t change it)\n- **PUT** — Idempotent (setting X = 5 twice is same as once)\n- **DELETE** — Idempotent (deleting something twice = it\'s deleted)\n- **POST** — NOT idempotent (creating a resource twice = two resources)\n\n**Making POST idempotent with Idempotency Keys:**\n```\nPOST /api/v1/payments\nIdempotency-Key: "abc-123-unique-key"\nBody: { "amount": 100, "currency": "USD" }\n```\nThe server stores the key. If the same key is sent again, it returns the original result instead of processing a new payment. **Stripe uses this exact pattern.**' },
            {
                type: 'quiz',
                question: 'Your user profile page needs to show: user name, their 5 latest tweets, and follower count. Which API style minimizes network round trips?',
                options: ['REST — 3 separate GET requests', 'GraphQL — 1 query with nested fields', 'gRPC — 1 unary call', 'All perform the same'],
                correctIndex: 1,
                explanation: 'GraphQL lets you request the user, their tweets, and follower count in a single query with nested fields. REST would typically require 3 separate requests (/users/42, /users/42/tweets, /users/42/followers). gRPC could also do this in one call, but it\'s less common for client-facing APIs.'
            },
            { type: 'tip', variant: 'interview', content: '"For our public-facing API, I\'d use REST with JSON — it\'s the industry standard, easy to debug, and well-documented. For internal microservice communication, I\'d switch to gRPC with Protocol Buffers — it\'s 10× faster due to binary serialization and HTTP/2 multiplexing. For our mobile app, we could add a GraphQL gateway that translates to REST/gRPC internally, giving mobile clients the flexibility to fetch exactly what they need." — This answer shows you understand the trade-offs and can mix protocols appropriately.' },
        ],
    },
    {
        id: 'blob-storage',
        title: 'Object Storage & Blobs',
        unit: 2,
        duration: '14 min',
        icon: 'database',
        sections: [
            { type: 'text', title: 'Where Do Files Live at Scale?', content: 'When you upload a profile photo to Instagram, a resume to LinkedIn, or a video to YouTube — where does that file actually go? Not a regular database. Files are stored in **Blob Storage** (Binary Large Object) — specialized object storage systems designed for massive unstructured data.\n\n**Why not just use a database?**\n- A 5MB photo stored in PostgreSQL bloats the database and slows queries\n- Databases are optimized for structured data (rows, columns), not binary blobs\n- You can\'t serve a file from a database directly to a CDN\n- At Instagram\'s scale (100M+ photos/day), the database would collapse\n\n**The answer:** Object Storage like **Amazon S3**, **Google Cloud Storage**, or **Azure Blob Storage**. These are purpose-built for storing and serving billions of files.' },
            {
                type: 'concept-card', title: 'Key Concepts', items: [
                    { term: 'Object', definition: 'A file + its metadata (content type, size, permissions). Unlike file systems, there are no folders — just a flat namespace with key-value lookup.' },
                    { term: 'Bucket', definition: 'A container for objects, like a top-level folder. Example: "profile-photos-bucket", "video-uploads-bucket". Each has its own access policy.' },
                    { term: 'Key', definition: 'The unique identifier for an object within a bucket. Example: "users/42/avatar.jpg". The "/" is just part of the name — there are no real directories.' },
                    { term: 'Presigned URL', definition: 'A temporary, signed URL that grants time-limited access to a private object. Used for secure uploads/downloads without exposing your credentials.' },
                    { term: 'Storage Class', definition: 'Trade-off between cost and access speed. S3 Standard ($0.023/GB) for frequent access, Glacier ($0.004/GB) for archives you rarely touch.' },
                ]
            },
            { type: 'text', title: 'The Upload Flow — How Instagram Stores Your Photo', content: 'Let\'s trace exactly what happens when you post a photo on Instagram:\n\n**Step 1: Client → API Server**\nYour phone sends the image to the API server. But wait — we don\'t want the API server to handle the actual file upload. That would bottleneck our servers with large file transfers.\n\n**Step 2: API Server → Generate Presigned URL**\nInstead, the API server asks S3: "Generate a temporary upload URL for this user." S3 returns a presigned URL that\'s valid for 15 minutes.\n\n**Step 3: Client → Direct Upload to S3**\nThe client uploads the photo **directly to S3** using the presigned URL, bypassing the API server entirely. This is crucial for scalability.\n\n**Step 4: S3 → Processing Pipeline**\nOnce uploaded, S3 triggers an event → a Lambda function → image processing:\n- Resize to multiple sizes (thumbnail, medium, full)\n- Strip EXIF data (privacy — removes GPS location)\n- Run content moderation (detect inappropriate content)\n- Generate a CDN URL\n\n**Step 5: CDN → Users**\nThe processed images are pushed to a CDN. When your followers view the photo, they fetch it from the nearest CDN edge server — not from S3 directly.' },
            { type: 'code', language: 'python', title: 'Presigned Upload URL — Real Implementation', content: '# This is how services like Instagram, Dropbox, and Slack\n# handle file uploads without bottlenecking their API servers\n\nimport boto3\nfrom datetime import datetime\nimport uuid\n\ndef generate_upload_url(user_id: str, file_type: str) -> dict:\n    """\n    Generate a presigned URL for direct client → S3 upload.\n    \n    Why presigned URLs?\n    - API server never touches the file (no bandwidth bottleneck)\n    - Client uploads directly to S3 (faster, cheaper)\n    - URL expires after 15 minutes (secure)\n    - S3 handles all the heavy lifting (durability, replication)\n    """\n    s3 = boto3.client(\'s3\')\n    \n    # Generate unique key: users/42/photos/uuid.jpg\n    file_key = f"users/{user_id}/photos/{uuid.uuid4()}.{file_type}"\n    \n    # Create presigned URL — valid for 15 minutes\n    presigned_url = s3.generate_presigned_url(\n        \'put_object\',\n        Params={\n            \'Bucket\': \'instagram-photos-prod\',\n            \'Key\': file_key,\n            \'ContentType\': f\'image/{file_type}\',\n            \'ACL\': \'private\',            # Private — only accessible via CDN\n        },\n        ExpiresIn=900,  # 15 minutes in seconds\n    )\n    \n    return {\n        \'upload_url\': presigned_url,   # Client uploads to this URL\n        \'file_key\': file_key,          # Server stores this reference in DB\n        \'expires_in\': 900\n    }\n\n# API endpoint: POST /api/v1/photos/upload-url\n# Response: { upload_url: "https://s3.amazonaws.com/...", file_key: "..." }\n# Client then: PUT <upload_url> with file body → 200 OK' },
            {
                type: 'comparison', title: 'Storage Options Decision Matrix', headers: ['Storage Type', 'Best For', 'Latency', 'Cost', 'Example'],
                rows: [
                    ['Object Storage (S3)', 'Images, videos, backups, logs', '50-200ms', '$0.023/GB/month', 'User uploads, static assets'],
                    ['Block Storage (EBS)', 'Database files, OS disks', '1-5ms', '$0.10/GB/month', 'PostgreSQL data files'],
                    ['File Storage (EFS)', 'Shared files across servers', '5-20ms', '$0.30/GB/month', 'CMS content, shared configs'],
                    ['Database (BLOB column)', 'Tiny files < 256KB', '5-50ms', 'Varies', 'User avatars, thumbnails'],
                    ['CDN Edge Cache', 'Frequently accessed static files', '1-10ms', '$0.085/GB transferred', 'Popular images, CSS/JS'],
                ]
            },
            { type: 'tip', variant: 'interview', content: '"For file uploads, I\'d never store files directly in the database or route them through our API servers. Instead, the API server generates a presigned S3 URL, the client uploads directly to S3, and S3 triggers a processing pipeline. This keeps our API servers lightweight and lets S3 handle the heavy lifting — it\'s designed for 11 nines of durability (99.999999999%)." — This answer shows you understand production-grade file handling patterns.' },
            {
                type: 'quiz',
                question: 'Why do we use "Presigned URLs" for file uploads in a system like Instagram?',
                options: ['To encrypt the file before it leaves the phone', 'To allow the client to upload directly to S3 without passing through our API server', 'To bypass the CDN and upload to the edge', 'To ensure the file is under 10MB'],
                correctIndex: 1,
                explanation: 'Presigned URLs allow the client to upload directly to object storage (like S3). This saves our API servers from the bandwidth bottleneck of handling large binary files, making the system much more scalable.'
            },
        ],
    },
    {
        id: 'search-indexing',
        title: 'Full-Text Search & Indexing',
        unit: 2,
        duration: '16 min',
        icon: 'network',
        sections: [
            { type: 'text', title: 'How Does Google Find Your Answer in 0.3 Seconds?', content: 'When you search "best pizza near me" on Google, it searches through **hundreds of billions** of web pages and returns results in under 0.3 seconds. How?\n\nThe naive approach — scanning every page for the word "pizza" — would take hours. Instead, search engines use an **Inverted Index** — a data structure that pre-computes which documents contain which words.\n\n**Think of it like a textbook index:**\n- Instead of reading every page to find "photosynthesis," you flip to the back index: "Photosynthesis → pages 42, 87, 156"\n- An inverted index does the same thing for every word across billions of documents\n\nThis is the foundation of every search system: Google, Amazon product search, Elasticsearch, and even the search bar in your email client.' },
            {
                type: 'concept-card', title: 'Search Engine Components', items: [
                    { term: 'Inverted Index', definition: 'A mapping from words to the documents that contain them. Instead of "doc → words," it stores "word → docs." This makes lookups O(1) instead of O(n).' },
                    { term: 'Tokenization', definition: 'Breaking text into searchable units. "Running shoes" → ["running", "shoe"]. Includes lowercasing, stemming (running → run), and removing stop words (the, is, a).' },
                    { term: 'TF-IDF Scoring', definition: 'Term Frequency × Inverse Document Frequency. Words that appear often in THIS document but rarely across ALL documents are more relevant. "quantum" in a physics paper = high relevance.' },
                    { term: 'Sharding', definition: 'Splitting the index across multiple machines. Google uses thousands of shards so each server only searches a fraction of the web.' },
                    { term: 'Elasticsearch', definition: 'The most popular distributed search engine. Built on Apache Lucene. Used by Netflix, Wikipedia, GitHub, and Uber for full-text search.' },
                ]
            },
            { type: 'code', language: 'python', title: 'Building an Inverted Index — From Scratch', content: '# This is the CORE data structure behind Google, Elasticsearch,\n# and every search engine ever built.\n\nfrom collections import defaultdict\nimport re\n\nclass InvertedIndex:\n    """\n    How search engines store data for instant lookups.\n    \n    Traditional DB: doc_id → content (slow to search)\n    Inverted Index:  word → [doc_ids] (instant lookup)\n    \n    Example:\n    Doc 1: "Redis is a fast cache"\n    Doc 2: "Cache speeds up databases"\n    Doc 3: "Redis uses memory for speed"\n    \n    Index:\n    "redis"    → [1, 3]\n    "cache"    → [1, 2]\n    "fast"     → [1]\n    "speed"    → [2, 3]\n    "database" → [2]\n    "memory"   → [3]\n    \n    Search "redis cache" → intersection of [1,3] and [1,2] = [1] ← Doc 1!\n    """\n    def __init__(self):\n        # word → set of document IDs\n        self.index = defaultdict(set)\n        # doc_id → original content (for displaying results)\n        self.documents = {}\n    \n    def _tokenize(self, text: str) -> list:\n        """\n        Break text into search tokens.\n        "Running quickly!" → ["running", "quickly"]\n        \n        Real engines also do:\n        - Stemming: "running" → "run"\n        - Synonyms: "fast" → "quick"\n        - N-grams: "new york" → single token\n        """\n        # Lowercase + split on non-alpha characters\n        words = re.findall(r\'[a-z0-9]+\', text.lower())\n        # Remove stop words (words too common to be useful)\n        stop_words = {\'the\', \'is\', \'a\', \'an\', \'and\', \'or\', \'in\', \'to\', \'for\'}\n        return [w for w in words if w not in stop_words]\n    \n    def add_document(self, doc_id: str, content: str):\n        """Index a document — add all its words to the inverted index."""\n        self.documents[doc_id] = content\n        for word in self._tokenize(content):\n            self.index[word].add(doc_id)\n    \n    def search(self, query: str) -> list:\n        """\n        Search for documents matching ALL query words.\n        Returns doc_ids sorted by relevance (number of matching terms).\n        """\n        tokens = self._tokenize(query)\n        if not tokens:\n            return []\n        \n        # Find docs containing ALL query words (intersection)\n        result_sets = [self.index.get(token, set()) for token in tokens]\n        matching_docs = set.intersection(*result_sets) if result_sets else set()\n        \n        return list(matching_docs)\n\n# === Usage ===\nidx = InvertedIndex()\nidx.add_document("doc1", "Redis is a blazing fast in-memory cache")\nidx.add_document("doc2", "PostgreSQL is a relational database")\nidx.add_document("doc3", "Redis can be used as a database and cache")\n\nprint(idx.search("redis cache"))    # → ["doc1", "doc3"]\nprint(idx.search("database"))        # → ["doc2", "doc3"]\nprint(idx.search("fast redis"))      # → ["doc1"]' },
            {
                type: 'deep-dive',
                title: 'Real Example: How Amazon Product Search Works',
                content: `When you search "wireless headphones under $50" on Amazon, here's what happens behind the scenes:

**Step 1: Query Understanding**
- Tokenize: ["wireless", "headphones"]
- Detect intent: product search + price filter ($50)
- Expand: "headphones" → also search "earbuds", "earphones" (synonyms)

**Step 2: Retrieval (Inverted Index)**
- Look up "wireless" → 50,000 matching product IDs
- Look up "headphones" OR "earbuds" → 30,000 matching IDs
- Intersection → 12,000 products match both terms
- Apply price filter (< $50) → 4,000 candidates

**Step 3: Ranking (The Secret Sauce)**
- **Relevance score** — How well does the title/description match?
- **Sales velocity** — Products selling more = ranked higher
- **Review score** — 4.5 stars with 10,000 reviews beats 5.0 with 2 reviews
- **Conversion rate** — Products people actually buy after clicking
- **Sponsored** — Paid placements are mixed in (labeled "Sponsored")

**Step 4: Response**
- Return top 48 results (first page)
- Include facets for filtering (brand, rating, Prime, etc.)
- Total time: ~50ms for 300 million products

**The infrastructure:** Amazon uses a custom search engine (A9) with thousands of shards, each responsible for a subset of products. Each query fans out to all shards in parallel.`
            },
            {
                type: 'comparison', title: 'Search Solutions — When to Use What', headers: ['Solution', 'Best For', 'Scale', 'Complexity'],
                rows: [
                    ['SQL LIKE / ILIKE', 'Simple substring search', '< 100K records', 'Low — just SQL'],
                    ['PostgreSQL Full-Text', 'Moderate search with ranking', '< 10M records', 'Medium — tsvector/tsquery'],
                    ['Elasticsearch', 'Complex search, facets, analytics', 'Billions of documents', 'High — separate cluster'],
                    ['Algolia (SaaS)', 'Instant search-as-you-type', 'Millions of records', 'Low — hosted API'],
                    ['Apache Solr', 'Enterprise search, legacy systems', 'Billions of documents', 'High — similar to Elasticsearch'],
                ]
            },
            {
                type: 'quiz',
                question: 'You have 500 million products in your e-commerce database. Users want to search by product name, description, and category with real-time results. Which approach is best?',
                options: ['SQL LIKE queries with indexes', 'PostgreSQL full-text search', 'Elasticsearch with an inverted index', 'Load all data into Redis'],
                correctIndex: 2,
                explanation: 'At 500 million products, you need a dedicated search engine like Elasticsearch. SQL LIKE doesn\'t use indexes effectively for text search. PostgreSQL full-text search works but struggles at this scale. Redis is for caching, not full-text search. Elasticsearch is purpose-built for this exact use case — it shards the inverted index across a cluster for parallel search.'
            },
            { type: 'tip', variant: 'interview', content: '"For the search feature, I wouldn\'t build it from scratch. I\'d use Elasticsearch — it handles tokenization, stemming, relevance scoring, and scales horizontally out of the box. Our write path pushes product updates to a Kafka topic, which a consumer uses to update the Elasticsearch index. This keeps the search index eventually consistent with the database without coupling them." — This shows you understand the full architecture, not just the search algorithm.' },
        ],
    },

    // ═══════════════════════════════════════════════════════
    //  UNIT 3: DISTRIBUTED SYSTEMS
    // ═══════════════════════════════════════════════════════
    {
        id: 'cap-theorem',
        title: 'CAP Theorem & Distributed Trade-offs',
        unit: 3,
        duration: '15 min',
        icon: 'network',
        sections: [
            { type: 'text', title: 'The Fundamental Trade-off', content: 'The CAP theorem states that in a distributed system during a network partition, you can only guarantee TWO of three properties:\n\n- **C**onsistency: All nodes see the same data at the same time\n- **A**vailability: Every request gets a response (even if it might be stale)\n- **P**artition Tolerance: System works despite network failures between nodes\n\nSince network partitions are **inevitable** in real systems, P is always required. So the real choice is: **CP or AP?**' },
            {
                type: 'comparison', title: 'CP vs AP Systems', headers: ['Aspect', 'CP (Consistency)', 'AP (Availability)'],
                rows: [
                    ['During partition', 'Blocks or rejects requests', 'Serves potentially stale data'],
                    ['Use when', 'Money, inventory, bookings', 'Social media, analytics, caches'],
                    ['Example', 'Bank transfer: block until consistent', 'Facebook like: show 999 instead of 1000, fix later'],
                    ['Databases', 'PostgreSQL, MySQL, HBase, MongoDB (default)', 'Cassandra, DynamoDB, CouchDB'],
                    ['Trade-off', 'Users may see errors/timeouts', 'Users may see slightly outdated data'],
                ]
            },
            { type: 'text', title: 'Consistency Models', content: '**Strong Consistency:** After a write, all subsequent reads return that value. Simplest to reason about, hardest to scale.\n\n**Eventual Consistency:** After a write, reads * eventually* return that value. Fast and scalable, but temporarily inconsistent.\n\n**Causal Consistency:** If event A caused event B, everyone sees A before B. Good middle ground.\n\n**Read-Your-Writes:** You always see your own writes immediately. Others may see them later. Great for user experience.' },
            { type: 'tip', variant: 'interview', content: '"For the flight booking system, I\'d use CP for seat reservations — double-booking is unacceptable. But for the \'users viewing this flight\' counter, AP is fine since approximate numbers are acceptable and we want the feature available even during network issues." — This nuanced answer shows real understanding.' },
            {
                type: 'quiz',
                question: 'Which system is an example of an AP (Available, Partition Tolerant) system?',
                options: ['Bank ATM network', 'Stock exchange trading engine', 'DNS (Domain Name System)', 'Relational Database with ACID'],
                correctIndex: 2,
                explanation: 'DNS is the classic example of AP. It guarantees that you always get an IP address (Availability) even if some servers are down, but that IP might be slightly outdated (Eventual Consistency). Bank ATMs and Stock Exchanges must be CP (Consistent) to avoid double-spending. RDBMS are typically CA (Consistent + Available) but become CP during a partition.'
            },
        ],
    },
    {
        id: 'message-queues',
        title: 'Event-Driven Architectures',
        unit: 3,
        duration: '15 min',
        icon: 'network',
        practiceLink: 'notification-system',
        sections: [
            { type: 'text', title: 'Decoupling Services', content: 'Message queues let services communicate **asynchronously** — the sender doesn\'t wait for the receiver to process the message.\n\n**Why this matters:**\n```\nSynchronous (without queue):\nUser uploads photo → Resize → Thumbnail → Face detect → Notify → Return\nTotal: 8 seconds. User waits.\n\nAsynchronous (with queue):\nUser uploads photo → Queue "process photo" → Return immediately\nBackground: Resize + Thumbnail + Face detect + Notify\nUser wait time: 200ms\n```' },
            {
                type: 'concept-card', title: 'Queue Technologies', items: [
                    { term: 'Apache Kafka', definition: 'Distributed event streaming. Massive throughput (millions/sec). Persistent log. Best for event sourcing, analytics, data pipelines.' },
                    { term: 'RabbitMQ', definition: 'Traditional message broker. Flexible routing. Best for task queues, RPC patterns, complex routing.' },
                    { term: 'Amazon SQS', definition: 'Fully managed, serverless. Simple FIFO or standard queues. Best for AWS-native architectures.' },
                    { term: 'Redis Pub/Sub', definition: 'Lightweight, in-memory. Fire-and-forget. Best for real-time notifications, cache invalidation.' },
                ]
            },
            { type: 'text', title: 'Key Patterns', content: '**Point-to-Point:** One producer → one consumer. Task queues, job processing.\n\n**Publish-Subscribe:** One producer → many consumers. Notifications, event broadcasting.\n\n**Event Sourcing:** Store all state changes as events. Rebuild state by replaying. Used by banking, audit systems.\n\n**Dead Letter Queue (DLQ):** Messages that fail processing N times go to a DLQ for investigation. Critical for reliability.' },
            { type: 'text', title: 'Delivery Guarantees', content: '- **At-most-once:** Fire and forget. Message may be lost. Fastest.\n- **At-least-once:** Retry until acknowledged. Message may be duplicated. Most common.\n- **Exactly-once:** Process exactly once. Hardest to achieve. Kafka supports this with transactions.\n\n**Interview tip:** Always mention which guarantee you need and why. "For payment processing, we need at-least-once with idempotency keys to prevent double charges."' },
            { type: 'code', language: 'python', title: 'Producer-Consumer Pattern (Python Queue)', content: '# Basic Async processing example\n# In production, replace Queue() with RabbitMQ or Kafka\n\nimport queue\nimport threading\nimport time\n\n# The buffer (Queue)\ntask_queue = queue.Queue()\n\ndef producer():\n    """Simulates a web server receiving user uploads"""\n    for i in range(5):\n        print(f"Server: Received photo upload {i}")\n        task_queue.put(f"photo_{i}.jpg")\n        time.sleep(1)  # Requests come in unevenly\n\ndef consumer():\n    """Simulates a background worker processing uploads"""\n    while True:\n        task = task_queue.get() # Blocks until task available\n        if task is None: break\n        \n        print(f"Worker: Resizing {task}...")\n        time.sleep(2)  # Processing takes longer than upload!\n        print(f"Worker: Done with {task}")\n        task_queue.task_done()\n\n# Start background worker thread\nworker = threading.Thread(target=consumer)\nworker.daemon = True\nworker.start()\n\n# Start producing tasks\nproducer()\n\n# Wait for all tasks to be processed\ntask_queue.join()\nprint("All uploads processed!")' },
            {
                type: 'deep-dive',
                title: 'Dead Letter Queues (DLQ) — Saving Failed Messages',
                content: `What happens when a worker *fails* to process a message? Maybe the database is down, or the message is malformed.
                
**Without DLQ:** The worker crashes or discards the message. The user's order is lost forever. 😱
                
**With DLQ:**
1. Worker tries to process message. Fails.
2. Retry 3 times with exponential backoff. Fails.
3. Move message to a special queue: **The Dead Letter Queue**.
4. Engineers get alerted.
5. They fix the bug and **replay** the messages from the DLQ.

**Interview Gold:** "I'll include a DLQ for the payment processing pipeline so we never lose a transaction, even if the banking API is down for hours."`
            },
            {
                type: 'quiz',
                question: 'What is the primary purpose of a Dead Letter Queue (DLQ)?',
                options: ['To speed up message processing', 'To store messages that failed to process after several retries for manual investigation', 'To handle messages for users who have deleted their accounts', 'To store encrypted messages'],
                correctIndex: 1,
                explanation: 'A DLQ is a safety net. When a message fails to process (e.g., due to a bug or database downtime), it is moved to the DLQ so it isn\'t lost and can be replayed later once the issue is resolved.'
            },
        ],
    },
    {
        id: 'consistent-hashing',
        title: 'Consistent Hashing at FAANG Scale',
        unit: 3,
        duration: '16 min',
        icon: 'scale',
        sections: [
            { type: 'text', title: 'The Problem — Why Regular Hashing Breaks at Scale', content: 'Imagine you have 4 cache servers (Redis nodes) and you distribute data using:\n```\nserver = hash(key) % 4\n```\n\nThis works great — until **you add a 5th server**. Now it\'s `hash(key) % 5`, and suddenly **80% of your keys map to different servers.** Your entire cache is effectively wiped, causing a "thundering herd" of requests to your database.\n\n**The real-world disaster:**\n- You\'re running 10 Memcached servers\n- One crashes at 2 AM during peak Black Friday traffic\n- With `hash % 9`, roughly **90% of cached data is now on the wrong server**\n- All those cache misses hit your database simultaneously\n- Database collapses → entire site goes down\n\nConsistent hashing solves this by ensuring that when servers are added or removed, **only ~1/N of the keys** need to be remapped (where N = number of servers).' },
            { type: 'diagram', title: 'The Hash Ring — Visual Concept', content: '```\n          The Consistent Hash Ring\n          \n              0° (top)\n              │\n       ╭──────┼──────╮\n      ╱       │       ╲\n   Server A   │      Server B\n   (45°)      │      (135°)\n     ╲        │       ╱\n      ──── ───┼───────\n     ╱        │       ╲\n   Server D   │      Server C\n   (270°)     │      (225°)\n      ╲       │       ╱\n       ╰──────┼──────╯\n              │\n            180°\n\n  Key "user:42" hashes to 90° → goes to Server B (next clockwise)\n  Key "order:789" hashes to 200° → goes to Server C (next clockwise)\n  Key "session:abc" hashes to 300° → goes to Server A (next clockwise, wraps around)\n\n  If Server B dies:\n  - Only keys between Server A (45°) and Server B (135°) are affected\n  - They now go to Server C instead\n  - Servers A, D keep ALL their existing data ✅\n  - Only ~25% of keys remapped (instead of ~90% with mod hashing)\n```' },
            { type: 'text', title: 'Virtual Nodes — Solving the Imbalance Problem', content: 'With only 4 servers on the ring, data distribution can be uneven — one server might own 40% of the ring while another owns 10%.\n\n**The solution: Virtual Nodes (vnodes)**\n\nInstead of placing each server once on the ring, we place it **multiple times** (150-200 virtual nodes per server). Each virtual node is just the server name with a suffix: "ServerA-1", "ServerA-2", "ServerA-47", etc.\n\n**Why this works:**\n- 4 servers × 150 vnodes = 600 points on the ring\n- Data distribution becomes nearly uniform (statistically)\n- When a server is removed, its load is spread evenly across ALL remaining servers (not just one neighbor)\n\n**Real-world usage:**\n- **Cassandra** uses 256 vnodes per node by default\n- **DynamoDB** uses consistent hashing for partition assignment\n- **Akamai CDN** invented consistent hashing in 1997 for this exact use case' },
            { type: 'code', language: 'python', title: 'Consistent Hashing — Complete Implementation', content: '# Consistent Hashing — Used by Cassandra, DynamoDB, Memcached, CDNs\n# This is production-quality logic (simplified for learning)\n\nimport hashlib\nimport bisect\n\nclass ConsistentHashRing:\n    """\n    How it works:\n    1. Create a \"ring\" of hash values (0 to 2^32)\n    2. Each server is placed at multiple points on the ring (virtual nodes)\n    3. To find which server owns a key:\n       - Hash the key to get a position on the ring\n       - Walk clockwise to the first server position\n       - That server owns this key\n    \n    When a server is added/removed, only its \"arc\" of keys is affected.\n    """\n    def __init__(self, nodes=None, replicas=150):\n        self.replicas = replicas  # Virtual nodes per real server\n        self.ring = {}            # hash_value → server_name\n        self.sorted_keys = []     # Sorted list of all hash positions\n        \n        # Add initial servers to the ring\n        if nodes:\n            for node in nodes:\n                self.add_node(node)\n    \n    def _hash(self, key: str) -> int:\n        """\n        Hash a string to a position on the ring (0 to 2^32).\n        Using MD5 for uniform distribution. In production,\n        you might use MurmurHash3 or xxHash for speed.\n        """\n        digest = hashlib.md5(key.encode()).hexdigest()\n        return int(digest, 16) % (2 ** 32)\n    \n    def add_node(self, node: str):\n        """\n        Add a server to the ring with `replicas` virtual nodes.\n        Example: add_node("Server-A") creates:\n          "Server-A:0", "Server-A:1", ..., "Server-A:149"\n        Each is hashed to a position on the ring.\n        """\n        for i in range(self.replicas):\n            virtual_key = f"{node}:{i}"\n            hash_val = self._hash(virtual_key)\n            self.ring[hash_val] = node\n            bisect.insort(self.sorted_keys, hash_val)\n    \n    def remove_node(self, node: str):\n        """\n        Remove a server and all its virtual nodes.\n        Only keys that were assigned to this server are affected.\n        They automatically fall through to the next server on the ring.\n        """\n        for i in range(self.replicas):\n            virtual_key = f"{node}:{i}"\n            hash_val = self._hash(virtual_key)\n            if hash_val in self.ring:\n                del self.ring[hash_val]\n                self.sorted_keys.remove(hash_val)\n    \n    def get_node(self, key: str) -> str:\n        """\n        Find which server should store this key.\n        Hash the key → find next clockwise server on the ring.\n        """\n        if not self.ring:\n            return None\n        \n        hash_val = self._hash(key)\n        \n        # Binary search for the first server position >= hash_val\n        idx = bisect.bisect_right(self.sorted_keys, hash_val)\n        \n        # Wrap around to the beginning if we\'re past the last position\n        if idx >= len(self.sorted_keys):\n            idx = 0\n        \n        return self.ring[self.sorted_keys[idx]]\n\n# === Demo: See how few keys move when a server is added ===\nring = ConsistentHashRing(["Redis-1", "Redis-2", "Redis-3"])\n\n# Check where 1000 keys land\noriginal = {f"user:{i}": ring.get_node(f"user:{i}") for i in range(1000)}\n\n# Add a 4th server\nring.add_node("Redis-4")\n\n# Check how many keys moved\nmoved = sum(1 for k in original if ring.get_node(k) != original[k])\nprint(f"Keys moved: {moved}/1000 ({moved/10}%)")  # ~250 keys (25%)\n# With regular mod hashing, ~750 keys (75%) would have moved!' },
            {
                type: 'scenario',
                title: 'Interview Scenario: Server Failure with Consistent Hashing',
                problem: 'Interviewer: "You have 5 cache servers using consistent hashing. Server 3 crashes during peak traffic. What happens to the data? How do you prevent cache stampedes?"',
                solution: '**Strong answer:**\n\n"When Server 3 crashes, only the keys that were assigned to Server 3 are affected — roughly 20% of total keys. These keys now map to the next server clockwise on the ring (say, Server 4).\n\nThe first requests for those keys will be cache misses. To prevent a stampede:\n\n1. **Request coalescing** — If 100 requests come in for the same key simultaneously, only make ONE database call and share the result with all waiters.\n\n2. **Probabilistic early expiration** — Before a key expires, randomly refresh it early. This staggers cache rebuilds.\n\n3. **Replication** — Each key is stored on N consecutive servers on the ring (e.g., N=3). If Server 3 dies, the key is still in Server 4 and Server 5. Zero cache misses.\n\n4. **Graceful removal** — During planned maintenance, gradually drain Server 3\'s keys to its neighbors before shutting down."'
            },
            {
                type: 'quiz',
                question: 'You have 5 cache servers using hash(key) % 5. If you add a 6th server (hash(key) % 6), approximately what percentage of keys will be remapped to a different server?',
                options: ['About 17% (1/6)', 'About 50%', 'About 83%', 'About 100%'],
                correctIndex: 2,
                explanation: 'With modular hashing, changing from % 5 to % 6 remaps approximately (N-1)/N = 5/6 ≈ 83% of keys. Only keys where hash(key) % 5 == hash(key) % 6 stay on the same server. This is why consistent hashing is essential — it would only remap ~17% (1/N) of keys when adding a server.'
            },
            { type: 'tip', variant: 'interview', content: '"For our distributed cache, I\'d use consistent hashing with virtual nodes — around 150 per server — to ensure uniform data distribution. When we add or remove servers, only about 1/N of the keys need to be remapped instead of almost all of them. I\'d also replicate each key to the next 2 servers on the ring for fault tolerance." — Mentioning virtual nodes and replication shows deep understanding that impresses senior interviewers.' },
        ],
    },
    {
        id: 'microservices-vs-monoliths',
        title: 'Microservices vs Monoliths',
        unit: 3,
        duration: '12 min',
        icon: 'architecture',
        sections: [
            { type: 'text', title: 'Architecture Patterns', content: 'This is one of the most debated topics in software engineering. The answer is almost always: **"It depends."**' },
            {
                type: 'comparison', title: 'Monolith vs Microservices', headers: ['Factor', 'Monolith', 'Microservices'],
                rows: [
                    ['Deployment', 'Deploy everything together', 'Deploy services independently'],
                    ['Scaling', 'Scale the entire app', 'Scale individual services'],
                    ['Development', 'Simpler codebase, faster initially', 'Complex infrastructure, faster long-term'],
                    ['Team Size', 'Good for < 10 engineers', 'Good for 50+ engineers'],
                    ['Data', 'Shared database', 'Each service owns its data'],
                    ['Testing', 'Easy end-to-end testing', 'Complex integration testing'],
                    ['Failure', 'One bug can crash everything', 'Failures are isolated'],
                    ['Latency', 'Function calls (nanoseconds)', 'Network calls (milliseconds)'],
                ]
            },
            { type: 'text', title: 'The Right Answer in Interviews', content: '**For a startup/new system:** "I\'d start with a **modular monolith** — a monolith with clear module boundaries. This lets us move fast initially while keeping the door open for microservices later."\n\n**For a mature system at scale:** "Given the team size and scale, microservices make sense. The user service, payment service, and notification service have very different scaling needs and deployment cadences."\n\n**Never say:** "Microservices are always better." That\'s a red flag.' },
            { type: 'tip', variant: 'pro-tip', content: 'The best interview answer acknowledges trade-offs: "Microservices add operational complexity — service discovery, distributed tracing, network latency. But for our scale of 50M users with 200 engineers, the benefits of independent deployment and scaling outweigh the costs."' },
            {
                type: 'deep-dive',
                title: 'Case Study: Why Amazon Prime Video Returned to Monolith',
                content: `In 2023, Amazon Prime Video published a viral article: "Scaling up the Prime Video audio/video monitoring service and reducing costs by 90%."
                
**The Story:**
- They built a distributed microservices architecture using AWS Step Functions and Lambda.
- Problem: **Costs were too high** and they hit scaling limits.
- Logic: Passing data between microservices (serialization + network) was expensive.
- Solution: They refactored into a **monolith** (single process) running on EC2/ECS.
- Result: **90% cost reduction!**
                
**The Lesson:** Microservices aren't always better. If your components are "chatty" (send lots of data back and forth) and tight-coupled, a monolith might be faster and cheaper. Don't be afraid to suggest a monolith.`
            },
            {
                type: 'quiz',
                question: 'Which is a major HIDDEN cost of microservices?',
                options: ['Code duplication', 'Network latency and serialization overhead', 'Larger team size', 'Slower database queries'],
                correctIndex: 1,
                explanation: 'While code duplication and team size are visible factors, the network latency and serialization overhead (marshalling data to JSON, sending over wire, unmarshalling) is often underestimated. In some systems, services spend 30-50% of CPU just parsing JSON!'
            },
        ],
    },
    {
        id: 'replication-partitioning',
        title: 'Data Replication & Partitioning',
        unit: 3,
        duration: '15 min',
        icon: 'database',
        sections: [
            { type: 'text', title: 'Scaling Your Data Layer', content: 'When a single database server can\'t handle the load, you have two options:\n- **Replication:** Copy data to multiple servers (read scaling)\n- **Partitioning (Sharding):** Split data across servers (write + storage scaling)' },
            {
                type: 'concept-card', title: 'Replication Strategies', items: [
                    { term: 'Master-Slave', definition: 'One master handles writes, slaves handle reads. Simple. If master dies, promote a slave. Read-heavy workloads.' },
                    { term: 'Multi-Master', definition: 'Multiple masters accept writes. More complex (conflict resolution). Better write availability.' },
                    { term: 'Leaderless', definition: 'Any node accepts reads/writes. Quorum-based (W + R > N). Used by Cassandra, DynamoDB.' },
                ]
            },
            { type: 'text', title: 'Sharding Strategies', content: '**Hash Sharding:** `shard = hash(key) % N` — Even distribution, but adding/removing shards is painful.\n\n**Range Sharding:** Key ranges assigned to shards (A-M → Shard 1). Easy range queries, risk of hot spots.\n\n**Consistent Hashing:** Virtual ring with virtual nodes. Adding/removing servers only affects neighboring nodes. Used by Cassandra, DynamoDB.\n\n**Directory-Based:** A lookup table maps keys to shards. Flexible but the directory is a single point of failure.' },
            { type: 'tip', variant: 'interview', content: '"I\'d use consistent hashing for our user data sharding — it minimizes data movement when we add or remove servers. For the posts table, hash on user_id so all of a user\'s posts are on the same shard, enabling efficient timeline queries."' },
            {
                type: 'deep-dive',
                title: 'Quorums: The Math of Reliability (W + R > N)',
                content: `In leaderless replication (like Cassandra/DynamoDB), how do we ensure we read the latest data if some nodes are down?
                
**We use a Quorum.**
- **N** = Number of replicas (e.g., 3)
- **W** = Write Quorum (nodes that must confirm write)
- **R** = Read Quorum (nodes that must respond to read)
                
**The Golden Rule:** If **W + R > N**, you are guaranteed to read the latest data (Strong Consistency).
                
**Example (N=3):**
- **Strong Consistency:** W=2, R=2. (2+2 > 3). Balanced.
- **Fast Writes:** W=1, R=3. Risky writes, slow reads.
- **Fast Reads:** W=3, R=1. Slow writes, fast reads.
                
"I'll choose W=2 and R=2 (Quorum) for our chat messages to ensure consistency without sacrificing too much availability."`
            },
            {
                type: 'quiz',
                question: 'In a leaderless system with 3 replicas (N=3), which configuration guarantees Strong Consistency?',
                options: ['W=1, R=1', 'W=1, R=2', 'W=2, R=2', 'W=3, R=0'],
                correctIndex: 2,
                explanation: 'Strong Consistency is guaranteed when W + R > N. With N=3, W=2 and R=2 gives 2+2=4, which is greater than 3. This ensures that the write and read sets always overlap, so you always read the latest write.'
            },
        ],
    },

    // ═══════════════════════════════════════════════════════
    //  UNIT 4: PRODUCTION CONCERNS
    // ═══════════════════════════════════════════════════════
    {
        id: 'monitoring-observability',
        title: 'Monitoring & Observability Stack',
        unit: 4,
        duration: '10 min',
        icon: 'scale',
        sections: [
            { type: 'text', title: 'You Can\'t Fix What You Can\'t See', content: 'Production systems need three pillars of observability:\n1. **Metrics** — Numerical measurements over time (CPU, RPS, latency)\n2. **Logs** — Detailed event records for debugging\n3. **Traces** — Request journey across services (distributed tracing)' },
            {
                type: 'concept-card', title: 'Key Metrics to Monitor', items: [
                    { term: 'Latency (p50, p95, p99)', definition: 'p50 = median, p99 = worst 1%. If p99 > 2s, 1% of users have a bad experience.' },
                    { term: 'Error Rate', definition: 'Percentage of requests returning 5xx errors. Alert if > 0.1%.' },
                    { term: 'Throughput (RPS)', definition: 'Requests per second. Sudden drops may indicate failures.' },
                    { term: 'Saturation', definition: 'How full your resources are: CPU, memory, disk, connections.' },
                ]
            },
            { type: 'text', title: 'The Four Golden Signals (Google SRE)', content: '1. **Latency** — How long requests take\n2. **Traffic** — How many requests you\'re serving\n3. **Errors** — How many requests fail\n4. **Saturation** — How overloaded the system is\n\nIf you monitor these four things well, you catch most problems before users notice.' },
            { type: 'code', language: 'yaml', title: 'Prometheus Alert Rule — High Latency', content: '# Alert if 99th percentile latency > 500ms for 5 minutes\n\ngroups:\n- name: API_Alerts\n  rules:\n  - alert: HighLatency\n    expr: histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m])) > 0.5\n    for: 5m\n    labels:\n      severity: page\n    annotations:\n      summary: "API is too slow!"\n      description: "99% of requests are taking over 500ms."' },
            {
                type: 'quiz',
                question: 'Why do we monitor P99 (99th percentile) latency instead of Average latency?',
                options: ['P99 is easier to calculate', 'Average hides outliers', 'Average is not supported by Prometheus', 'P99 is the industry standard'],
                correctIndex: 1,
                explanation: 'Averages lie. If 99 users get 100ms response and 1 user gets 100s response, the average is 1.1s (looks okay), but P99 is 100s (terrible). P99 shows what your worst-case users are experiencing, which is crucial for SLA guarantees.'
            },
        ],
    },
    {
        id: 'security-fundamentals',
        title: 'Cloud Security Fundamentals',
        unit: 4,
        duration: '10 min',
        icon: 'security',
        sections: [
            { type: 'text', title: 'Defense in Depth', content: 'Security isn\'t a feature — it\'s a property of the entire system. In interviews, mentioning security considerations at the right moments shows senior-level thinking.' },
            {
                type: 'concept-card', title: 'Security Layers', items: [
                    { term: 'Authentication (AuthN)', definition: 'WHO is making the request? JWT tokens, OAuth 2.0, Multi-Factor Auth.' },
                    { term: 'Authorization (AuthZ)', definition: 'WHAT can they do? RBAC (role-based), ABAC (attribute-based), ACLs.' },
                    { term: 'Encryption at Rest', definition: 'Database files and backups encrypted with AES-256.' },
                    { term: 'Encryption in Transit', definition: 'All network traffic over TLS 1.3. No plain HTTP.' },
                    { term: 'Rate Limiting', definition: 'Prevent abuse: 100 requests/min per user. Token bucket or sliding window.' },
                    { term: 'Input Validation', definition: 'Sanitize all inputs to prevent SQL injection, XSS, command injection.' },
                ]
            },
            { type: 'tip', variant: 'interview', content: 'You don\'t need a detailed security section in every design, but drop security mentions naturally: "All inter-service communication would be over mTLS" or "We\'d rate-limit the API at 100 req/min per user." This shows awareness.' },
            { type: 'code', language: 'json', title: 'JWT Structure (JSON Web Token)', content: '// Header\n{\n  "alg": "HS256",\n  "typ": "JWT"\n}\n\n// Payload (Data)\n{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "admin": true,\n  "iat": 1516239022,\n  "exp": 1516242622  // Expiration is critical!\n}\n\n// Signature\nHMACSHA256(\n  base64UrlEncode(header) + "." +\n  base64UrlEncode(payload),\n  your-256-bit-secret\n)' },
            {
                type: 'deep-dive',
                title: 'How HTTPS Works (Simplified)',
                content: `
1. **Client Hello:** Browser sends supported encryption versions.
2. **Server Hello:** Server sends its SSL Certificate (contains Public Key).
3. **Verification:** Browser checks if Certificate is valid (signed by a trusted CA).
4. **Key Exchange:** Browser uses Server's Public Key to encrypt a session secret.
5. **Secure Connection:** Both sides now use the session secret for symmetric encryption (AES).`
            },
            {
                type: 'quiz',
                question: 'What is the main difference between Authentication and Authorization?',
                options: ['Authentication is about permissions, Authorization is about identity', 'Authentication is WHO you are, Authorization is WHAT you can do', 'Authentication is for databases, Authorization is for APIs', 'They are the same thing'],
                correctIndex: 1,
                explanation: 'AuthN (Who are you?) verifies your identity (e.g., login). AuthZ (What can you do?) verifies your permissions (e.g., can you delete this post?). Senior engineers must keep these distinct.'
            },
        ],
    },
    {
        id: 'tradeoffs-decision-making',
        title: 'Engineering Trade-offs',
        unit: 4,
        duration: '10 min',
        icon: 'architecture',
        sections: [
            { type: 'text', title: 'Every Decision Has a Cost', content: 'System design is fundamentally about trade-offs. There is no perfect architecture — every choice comes with consequences. The best engineers articulate these trade-offs clearly.' },
            {
                type: 'comparison', title: 'Common Trade-offs', headers: ['Choice A', 'Choice B', 'When to Pick A', 'When to Pick B'],
                rows: [
                    ['Consistency', 'Availability', 'Money, inventory, booking', 'Social features, analytics'],
                    ['Latency', 'Throughput', 'Real-time (chat, gaming)', 'Batch processing, analytics'],
                    ['SQL', 'NoSQL', 'Complex relationships, ACID', 'Flexible schema, horizontal scale'],
                    ['Monolith', 'Microservices', 'Small team, early stage', 'Large team, independent scaling'],
                    ['Push', 'Pull', 'Real-time needed, few subscribers', 'Many subscribers, batch acceptable'],
                    ['Cache', 'No Cache', 'Read-heavy, tolerates stale data', 'Always-fresh data, write-heavy'],
                ]
            },
            { type: 'tip', variant: 'pro-tip', content: 'In interviews, frame decisions with: "I chose X over Y because [specific reason]. The trade-off is [what we lose], which is acceptable because [why it\'s OK for this system]." This template works every time.' },
            {
                type: 'quiz',
                question: 'You are designing a high-frequency trading system where every microsecond counts. Which trade-off is MOST likely for this system?',
                options: ['Consistency over Availability', 'Latency over Throughput', 'Availability over Consistency', 'Throughput over Latency'],
                correctIndex: 1,
                explanation: 'In high-frequency trading, Lateny (speed of a single transaction) is everything. Throughput (total volume) matters too, but if your trade takes 100ms instead of 1ms, the price has already changed. You often sacrifice everything for low latency.'
            },
        ],
    },

    // ═══════════════════════════════════════════════════════
    //  UNIT 5: COMPLETE WALKTHROUGHS
    // ═══════════════════════════════════════════════════════
    {
        id: 'design-url-shortener',
        title: 'System Design: URL Shortener',
        unit: 5,
        duration: '20 min',
        icon: 'architecture',
        practiceLink: 'url-shortener',
        sections: [
            { type: 'text', title: 'Full Worked Example', content: 'This is the "Hello World" of system design interviews. Let\'s walk through it end-to-end using our framework.' },
            { type: 'text', title: 'Step 1: Requirements', content: '**Functional:**\n- Create short URL from long URL\n- Redirect short URL to original\n- Optional: custom aliases, expiration, analytics\n\n**Non-functional:**\n- Very low latency for redirects (< 50ms)\n- High availability (99.99%)\n- Short URLs should be as short as possible\n\n**Scale:**\n- 100M URLs created per month\n- 10:1 read-to-write ratio → 1B redirects/month\n- ~400 writes/sec, ~4000 reads/sec' },
            { type: 'diagram', title: 'Step 2: High-Level Architecture', content: '```\n┌────────┐     ┌──────────┐     ┌──────────────┐\n│ Client │────▶│   Load   │────▶│ URL Service  │\n└────────┘     │ Balancer │     │ (Stateless)  │\n               └──────────┘     └──────┬───────┘\n                                       │\n                                ┌──────┴───────┐\n                                │              │\n                           ┌────┴───┐    ┌─────┴────┐\n                           │ Redis  │    │  NoSQL   │\n                           │ Cache  │    │ (Writes) │\n                           └────────┘    └──────────┘\n```' },
            { type: 'text', title: 'Step 3: Key Design Decisions', content: '**URL generation:** Base62 encoding (a-z, A-Z, 0-9) of auto-incrementing ID or random hash.\n- 7 characters = 62^7 = 3.5 trillion possible URLs\n- Hash collision? Check DB and retry\n\n**Database:** NoSQL (DynamoDB/Cassandra)\n- Simple key-value: shortURL → longURL\n- No relationships needed\n- Horizontal scaling required\n\n**Caching:** Redis for hot URLs\n- 80/20 rule: 20% of URLs get 80% of traffic\n- Cache the popular ones → 80% cache hit rate\n- TTL: 24 hours (or until URL expires)' },
            { type: 'text', title: 'Step 4: Deep Dive — Redirect Flow', content: '```\n1. Client: GET /abc123\n2. Load Balancer → URL Service\n3. Check Redis cache for "abc123"\n4. CACHE HIT → 302 Redirect to long URL (1ms)\n5. CACHE MISS → Query DynamoDB → Store in Redis → 302 Redirect (10ms)\n6. Async: Log analytics event to Kafka\n```\n\n**301 vs 302?**\n- 301 (Permanent): Browser caches, doesn\'t hit our server again. Less analytics data.\n- 302 (Temporary): Browser always hits our server. Better for analytics.' },
            {
                type: 'code', language: 'python', title: 'Base62 Encoding Implementation', content: '# Why Base62? A-Z, a-z, 0-9 = 62 characters\n# 6 chars = 56 billion combinations\n# 7 chars = 3.5 trillion combinations (Enough for 100 years)\n\nBASE62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"\n\ndef encode(num):\n    if num == 0: return "0"\n    s = ""\n    while num > 0:\n        s = BASE62[num % 62] + s\n        num //= 62\n    return s\n\ndef decode(s):\n    num = 0\n    for char in s:\n        num = num * 62 + BASE62.index(char)\n    return num'
            },
            {
                type: 'comparison', title: 'Database Schema: SQL vs NoSQL', headers: ['Field', 'SQL (PostgreSQL)', 'NoSQL (DynamoDB)'],
                rows: [
                    ['Primary Key', 'id (Auto Increment Integer)', 'short_url (Partition Key)'],
                    ['Long URL', 'long_url (VARCHAR)', 'long_url (String)'],
                    ['Created At', 'created_at (TIMESTAMP)', 'created_at (Number/ISO)'],
                    ['User ID', 'user_id (Foreign Key)', 'user_id (GSI for lookup)'],
                ]
            },
            {
                type: 'quiz',
                question: 'Why is it better to use a dedicated ID generator (like Snowflake) instead of Database Auto-Increment for the URL Shortener?',
                options: ['Auto-increment is too slow', 'Auto-increment reveals business metrics', 'Distributed databases (sharding) make auto-increment hard to synchronize', 'Snowflake IDs are shorter'],
                correctIndex: 2,
                explanation: 'In a distributed system with multiple database shards, keeping a central auto-increment counter is a bottleneck and single point of failure. Twitter Snowflake generates unique IDs locally on each server using timestamps + machine IDs, allowing infinite horizontal scaling.'
            },
        ],
    },
    {
        id: 'design-twitter',
        title: 'System Design: Real-time Feed (Twitter)',
        unit: 5,
        duration: '25 min',
        icon: 'architecture',
        practiceLink: 'twitter',
        sections: [
            { type: 'text', title: 'The Classic Feed Problem', content: 'This problem tests your understanding of fan-out, caching, and real-time systems.' },
            { type: 'text', title: 'Requirements', content: '**Functional:** Post tweets, follow users, home timeline, search, likes, retweets\n**Non-functional:** 200M DAU, ~300K tweets/sec reads, ~5K tweets/sec writes, < 200ms feed latency\n**Core challenge:** How to show each user a personalized feed of tweets from people they follow?' },
            { type: 'text', title: 'The Fan-Out Problem', content: '**Fan-out on write (Push model):**\nWhen a user tweets, push it to all followers\' timelines.\n- Celebrity with 50M followers → 50M writes per tweet 😰\n- Pro: Fast read (timeline is pre-built)\n- Con: Slow write for popular users\n\n**Fan-out on read (Pull model):**\nWhen a user opens their feed, query all followed users\' tweets.\n- User follows 500 people → 500 queries per feed load 😰\n- Pro: Fast write (just store the tweet)\n- Con: Slow read\n\n**Hybrid (Twitter\'s actual approach):**\n- Regular users (< 10K followers): Fan-out on write\n- Celebrities (> 10K followers): Fan-out on read\n- Merge at read time: Pre-built timeline + live celebrity tweets' },
            { type: 'tip', variant: 'interview', content: 'The hybrid approach is the gold standard answer. It shows you understand that one-size-fits-all doesn\'t work at scale. Always mention the celebrity problem.' },
            {
                type: 'deep-dive',
                title: 'Data Model: The Relational Backbone',
                content: 'Even though tweets are NoSQL-friendly, the relationships are often best conceptualized in SQL first.\n\n**Users Table:**\n`id (PK), username, email, password_hash, created_at`\n\n**Tweets Table:**\n`id (PK), user_id (FK), content, created_at`\n\n**Follows Table:**\n`follower_id (FK), followee_id (FK), created_at`\n*(Composite PK on follower_id + followee_id)*\n\n**The Scaling Challenge:**\n`SELECT * FROM tweets WHERE user_id IN (SELECT followee_id FROM follows WHERE follower_id = :me)`\nThis query (Fan-out on Read) is **too slow** when you follow 500 people. That\'s why we pre-compute timelines in Redis lists!'
            },
            { type: 'code', language: 'javascript', title: 'Redis Timeline Structure', content: '// Redis Data Structure for Timelines\n// Key: "timeline:user_id"\n// Value: List of Tweet IDs\n\n// 1. User A tweets (ID: 101)\nterms = ["timeline:456", "timeline:789"] // IDs of followers\nredis.rpush(terms, 101)\n\n// 2. User B opens app\nids = redis.lrange("timeline:456", 0, 20)\n// Returns: [101, 99, 95, ...]\n\n// 3. Hydrate tweets from Main DB/Cache\ntweets = db.getTweets(ids)' },
            {
                type: 'quiz',
                question: 'Why does Twitter use a Hybrid (Push + Pull) model for the timeline?',
                options: ['To save storage space', 'Because users with millions of followers (Celebrities) would cause a write-bottleneck in a pure Push model', 'To prevent users from seeing old tweets', 'To support multiple languages'],
                correctIndex: 1,
                explanation: 'If a celebrity with 50M followers tweets, a pure "Push" model would require 50M database writes in a few seconds. This is unscalable. Instead, we "Pull" celebrity tweets only when their followers open their feed.'
            },
        ],
    },
    {
        id: 'design-whatsapp',
        title: 'System Design: Messenger App (WhatsApp)',
        unit: 5,
        duration: '20 min',
        icon: 'network',
        practiceLink: 'chat-messenger',
        sections: [

            { type: 'text', title: 'Real-Time Messaging at Scale', content: 'WhatsApp handles 100B+ messages per day. This problem tests WebSocket management, message delivery guarantees, and end-to-end encryption.' },
            { type: 'text', title: 'Key Architecture Decisions', content: '**Connection Management:**\n- Each device maintains a persistent WebSocket connection\n- Connection servers maintain millions of concurrent connections\n- If recipient is online → deliver immediately via WebSocket\n- If offline → store in message queue, deliver on reconnect\n\n**Message Flow:**\n```\n1. Sender → WebSocket → Connection Server\n2. Connection Server → Message Service → Store in DB\n3. Message Service → Check if recipient online\n4.   Online → Route to recipient\'s Connection Server → WebSocket → Delivered\n5.   Offline → Store in offline queue → Deliver when they reconnect\n```\n\n**Delivery Status:** Sent (✓) → Delivered (✓✓) → Read (✓✓ blue)' },
            { type: 'text', title: 'Group Messaging', content: 'For a group of N members, when someone sends a message:\n- **Small groups (< 256):** Fan out to all members. Each gets their own copy.\n- **Large groups/channels:** Store once, query on read. Like the Twitter celebrity approach.\n\n**End-to-End Encryption:**\n- Signal Protocol: Each chat has unique encryption keys\n- Server never sees plaintext — only encrypted blobs\n- Key exchange via Diffie-Hellman when users first connect' },
            {
                type: 'deep-dive',
                title: 'The Signal Protocol (Double Ratchet)',
                content: 'WhatsApp uses the **Signal Protocol** for E2E encryption. The core concept is the **Double Ratchet**:\n\n1. **Root Ratchet:** Derives new chain keys for every message "turn" (Diffie-Hellman).\n2. **Chain Ratchet:** Derives unique message keys for every single message.\n\n**Why is this cool?**\n- **Forward Secrecy:** If a hacker steals your key today, they can\'t decrypt *past* messages.\n- **Self-Healing:** If a hacker steals a key, the protocol "heals" itself after a few round-trips, locking the hacker out again.\n\n**Server\'s Role:** The server is just a "blind" postman. It carries the encrypted payloads but cannot read them. It only knows metadata (who sent to whom, and when).'
            },
            {
                type: 'quiz',
                question: 'In End-to-End Encryption (E2EE), where are the private keys stored?',
                options: ['On the server database', 'On the user\'s device only', 'In a separate Key Management Service (KMS)', 'Split between server and client'],
                correctIndex: 1,
                explanation: 'In true E2EE, private keys never leave the user\'s device. If the server had the private keys, it would be able to decrypt messages, which defeats the purpose. This makes device loss a challenge (need backups), but ensures privacy.'
            },
        ],
    },
    {
        id: 'design-youtube',
        title: 'System Design: Video Platform (YouTube)',
        unit: 5,
        duration: '20 min',
        icon: 'scale',
        practiceLink: 'video-streaming',
        sections: [
            { type: 'text', title: 'Video at Global Scale', content: 'YouTube serves 1B+ hours of video daily. This problem tests CDN, transcoding, storage, and recommendation systems.' },
            { type: 'text', title: 'Upload Pipeline', content: '```\n1. Client uploads raw video to Upload Service\n2. Upload Service stores original in Object Storage (S3)\n3. Transcoding Service (async via queue):\n   - Convert to multiple formats: 360p, 720p, 1080p, 4K\n   - Generate thumbnails at key frames\n   - Extract audio track\n   - Create HLS/DASH segments for adaptive streaming\n4. Push transcoded files to CDN\n5. Update Video DB with metadata and CDN URLs\n6. Notify user: "Video is ready"\n```\n\n**Key insight:** Transcoding is CPU-intensive. A 10-min 4K video takes ~30 min to process. This MUST be async.' },
            { type: 'text', title: 'Streaming Architecture', content: '**Adaptive Bitrate Streaming (ABR):**\n- Video split into 2-10 second segments\n- Each segment encoded at multiple qualities\n- Client monitors bandwidth and switches quality dynamically\n- Protocols: HLS (Apple) or DASH (open standard)\n\n**CDN Strategy:**\n- Popular videos (top 20%) cached at edge CDNs globally\n- Less popular videos served from regional data centers\n- Rarely watched videos served from origin (cold storage)\n\n**Storage estimation:**\n- 500 hours uploaded per minute\n- Average 10 min × 5 quality levels × 500MB average = 2.5GB per video\n- Daily: 500 × 60 × 24 × 2.5GB ≈ 1.8 PB/day 😱' },
            {
                type: 'comparison', title: 'CDN Pushing vs Pulling', headers: ['Strategy', 'How it works', 'Best For'],
                rows: [
                    ['Push CDN', 'We proactively upload content to CDN servers.', 'Netflix (moves movies to ISPs during off-peak hours)'],
                    ['Pull CDN', 'CDN fetches from origin ONCE when first user requests it.', 'YouTube, Social Media (content is too vast to push everywhere)'],
                ]
            },
            {
                type: 'quiz',
                question: 'What is the main purpose of splitting video into small 10-second segments (HLS/DASH)?',
                options: ['To save storage space on the server', 'To allow the client to switch quality levels mid-stream based on bandwidth', 'To make encryption easier', 'To prevent copyright infringement'],
                correctIndex: 1,
                explanation: 'Adaptive Bitrate Streaming (ABR) works by having short segments available in multiple qualities (360p, 720p, 1080p). If a user\'s internet slows down, the player requests the *next* 10-second segment in a lower quality, preventing buffering.'
            },
        ],
    },
    {
        id: 'design-notification-system',
        title: 'System Design: Notification Engine',
        unit: 5,
        duration: '18 min',
        icon: 'network',
        practiceLink: 'notification-system',
        sections: [
            { type: 'text', title: 'Sending Millions of Alerts', content: 'Notifications seem simple until you realized you need to send 10M "Breaking News" alerts in 60 seconds without crashing the system.' },
            { type: 'text', title: 'Architecture Overview', content: '**Components:**\n1. **Notification Service:** Receives requests from internal services (Order Service, Friend Service).\n2. **Message Queue:** Buffers requests (Kafka/RabbitMQ).\n3. **Workers:** Pull from queue and call 3rd party APIs.\n4. **3rd Party Gateways:**\n   - Apple APNS / Google FCM (Mobile Push)\n   - Twilio / SMS providers (SMS)\n   - SendGrid / SES (Email)\n\n**Why Queues?**\nThird-party APIs are slow and can rate-limit you. The queue allows you to throttle your own workers to match their limits (e.g., 1000 emails/sec).' },
            { type: 'code', language: 'python', title: 'Worker Logic with Retry', content: '# Worker handling email notifications\n# Uses exponential backoff for retries\n\nimport time\nimport random\n\ndef process_notification(notification):\n    retries = 3\n    for attempt in range(retries):\n        try:\n            # Call SendGrid/SES API\n            response = email_provider.send(notification)\n            if response.status == 200:\n                return True\n            elif response.status == 429:\n                # Rate limited! Wait longer.\n                time.sleep(2 ** attempt) \n            else:\n                # 5xx error, retry\n                time.sleep(1)\n        except NetworkError:\n            time.sleep(1)\n            \n    # Failed after 3 attempts\n    send_to_dead_letter_queue(notification)\n    return False' },
            {
                type: 'deep-dive',
                title: 'Data Model & Deduplication',
                content: 'Do not spam users! If a user gets 10 likes in 1 minute, send ONE "10 people liked your post" notification, not 10 separate ones.\n\n**Deduplication Logic:**\n- Use Redis to store recent notifications.\n- Key: `notify:user_123:liked_post_456`\n- TTL: 60 seconds.\n- If key exists → Increment counter.\n- If key missing → Create key, schedule delayed job.\n- Job runs after 60s → Sends "X people liked your post".'
            },
        ],
    },
    {
        id: 'design-rate-limiter',
        title: 'System Design: Distributed Rate Limiter',
        unit: 5,
        duration: '15 min',
        icon: 'security',
        sections: [
            { type: 'text', title: 'Protecting Your Services', content: 'A rate limiter prevents abuse (DDoS), cost overruns (paid APIs), and cascading failures.' },
            { type: 'text', title: 'Requirements', content: '- **Functional:** limiting requests (e.g., 10 requests/sec per user).\n- **High Availability:** The limiter itself shouldn\'t become a point of failure.\n- **Low Latency:** < 20ms overhead added to requests.\n- **Distributed:** Must work across multiple servers (shared state).' },
            { type: 'diagram', title: 'Architecture', content: '```\n[Client] → [Load Balancer] → [API Gateway (Rate Limiter)] → [Service]\n                                     │\n                                     ▼\n                                  [Redis]\n                               (Stored Counters)\n```\n**Why Redis?** It\'s fast (in-memory) and supports atomic increment operations.' },
            { type: 'code', language: 'lua', title: 'Redis Lua Script (Atomic)', content: '-- Why Lua? It runs ATOMICALLY inside Redis.\n-- No race conditions between checking logic and incrementing.\n\nlocal key = KEYS[1]\nlocal limit = tonumber(ARGV[1])\nlocal window = tonumber(ARGV[2]) -- e.g., 60 seconds\n\nlocal current = redis.call("GET", key)\n\nif current and tonumber(current) >= limit then\n    return 0 -- Rejected\nelse\n    -- Increment and set expiry if new\n    current = redis.call("INCR", key)\n    if tonumber(current) == 1 then\n        redis.call("EXPIRE", key, window)\n    end\n    return 1 -- Allowed\nend' },
            { type: 'text', title: 'Distributed Challenges', content: '**Race Conditions:**\nWithout Lua/Locks, two servers read "count=9" at the same time, both increment to 10, and both allow the request. Real count is 11. ❌\n\n**Synchronization:**\nIf you use local memory (HashMap) on each server, a user can hit Server A (0 requests) then Server B (0 requests) and bypass the limit. You NEED a centralized store like Redis.' },
            {
                type: 'quiz',
                question: 'Why we use Lua scripts for Redis-based rate limiting?',
                options: ['Lua is faster than Python', 'To ensure atomicity — the "Check-then-Increment" happens as a single, uninterruptible operation', 'Because Redis only supports Lua', 'To bypass the load balancer'],
                correctIndex: 1,
                explanation: 'Lua scripts run atomically in Redis. This prevents race conditions where two threads read the same counter value, both increment it, and both allow a request that should have been blocked.'
            },
        ],
    },

    // ═══════════════════════════════════════════════════════
    //  UNIT 6: INTERVIEW MASTERY
    // ═══════════════════════════════════════════════════════
    {
        id: 'communication-structure',
        title: 'Senior Communication Patterns',
        unit: 6,
        duration: '10 min',
        icon: 'mastery',
        sections: [
            { type: 'text', title: 'How You Say It Matters', content: 'You can design a perfect system and still fail the interview if you communicate poorly. Here\'s how to communicate like a staff engineer.' },
            {
                type: 'concept-card', title: 'Communication Principles', items: [
                    { term: 'Think Aloud', definition: 'Narrate your thought process: "I\'m weighing SQL vs NoSQL here. Let me think about our access patterns..."' },
                    { term: 'Top-Down', definition: 'Start with the big picture, then zoom in. Never start with database schema details.' },
                    { term: 'Check In', definition: 'After each section, ask: "Does this direction make sense? Anything you\'d like me to dive deeper on?"' },
                    { term: 'Acknowledge Trade-offs', definition: 'Never present a decision without its downsides: "The trade-off here is..."' },
                    { term: 'Use Numbers', definition: 'Quantify everything: "That\'s ~50K RPS, so we need about 10 servers at 5K each."' },
                ]
            },
            { type: 'text', title: 'What NOT to Do', content: '❌ **Silence** — Think aloud, even if you\'re unsure\n❌ **Jumping to implementation** — Start with requirements first\n❌ **Ignoring interviewer hints** — They\'re guiding you toward interesting areas\n❌ **Being defensive** — "Good point, I hadn\'t considered that. Let me revise..." is perfect\n❌ **Over-engineering** — Start simple, add complexity only when justified\n❌ **Using buzzwords** — "We\'ll use Kubernetes and Kafka" — Why? What problem does it solve?' },
            {
                type: 'quiz',
                question: 'If you are unsure about a design decision during an interview, what is the best approach?',
                options: ['Stay silent until you are sure', 'Pick one and defend it aggressively', 'Narrate your thought process and trade-offs aloud', 'Ask the interviewer to give you the answer'],
                correctIndex: 2,
                explanation: 'System design is open-ended. The interviewer wants to hear how you think. Thinking aloud allows them to see your logic, guide you if you\'re stuck, and understand how you weigh trade-offs.'
            },
        ],
    },
    {
        id: 'common-mistakes',
        title: 'High-Level Design Anti-Patterns',
        unit: 6,
        duration: '8 min',
        icon: 'alert',
        sections: [
            { type: 'text', title: 'The Top 10 Interview Killers', content: '1. **Skipping requirements** — Jumping to solution in the first minute\n2. **No scale estimation** — Designing without knowing the numbers\n3. **Single point of failure** — No redundancy anywhere\n4. **Ignoring data consistency** — Not thinking about CAP\n5. **No caching** — Hitting the database for everything\n6. **Overcomplicating** — Microservices for a 100-user system\n7. **No failure handling** — "What if the database goes down?" "Uhh..."\n8. **Not using the whiteboard** — Talking without drawing loses the interviewer\n9. **Monologuing** — Talking for 15 minutes without checking in\n10. **Being vague** — "We\'d use some kind of cache" vs "Redis with cache-aside, 5-min TTL"' },
            { type: 'tip', variant: 'pro-tip', content: 'After the interview, the interviewer writes feedback. The best feedback reads: "Candidate showed strong architectural instincts, considered scale and failure modes, made justified trade-offs, and communicated clearly throughout." Make every decision justify itself.' },
            {
                type: 'quiz',
                question: 'Which of these is a major "red flag" for a Senior System Design interview candidate?',
                options: ['Not knowing the exact syntax of a Redis command', 'Designing a complex microservice architecture for a system with only 10 users', 'Preferring SQL over NoSQL', 'Asking for clarification on requirements'],
                correctIndex: 1,
                explanation: 'Over-engineering is a major senior-level red flag. Senior engineers choose the simplest tool that solves the problem. Building microservices for a tiny system shows a lack of pragmatic judgment.'
            },
        ],
    },
]
