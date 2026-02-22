/**
 * Deep System Design Knowledge Base — ALL 30 Problems
 * AI Interviewer 2.0: Complete — all conflictBanks, tradeoffs, and scale numbers filled.
 *
 * WHAT CHANGED FROM v1:
 * - Added conflictBank to ALL 15 HLD problems that were missing one
 * - Added conflictBank to ALL 8 LLD problems that were missing one
 * - Added tradeoffs to ALL HLD problems that were missing it
 * - Standardized scale numbers to include QPS for math audit
 * - Deepened deepDive sections where they were thin
 */

// ═══════════════════════════════════════════════════════
//  HLD SOLUTIONS (20 problems)
// ═══════════════════════════════════════════════════════

export const HLD_SOLUTIONS = {

    // ─── 1. YOUTUBE ────────────────────────────────────────
    youtube: {
        title: 'Design YouTube',
        requirements: {
            functional: ['Upload videos', 'Stream/watch videos', 'Search', 'Like/comment/subscribe', 'Recommendations', 'Channels'],
            nonFunctional: ['99.99% availability', 'Video start <2s', 'Eventual consistency for social', 'Global CDN', '1080p/4K adaptive streaming'],
            scale: {
                dau: '2B',
                uploadsPerDay: '500K videos',
                watchHoursPerDay: '1B',
                storagePerYear: '500PB',
                qps: '~58K watch QPS (1B views/day ÷ 86,400s)',
                uploadQPS: '~6 uploads/sec (500K/day ÷ 86,400s)',
            },
        },
        architecture: {
            components: [
                'CDN (CloudFront/Akamai) — edge caching for video chunks',
                'Video Processing Pipeline — transcoding + thumbnails + adaptive bitrate (HLS/DASH)',
                'Object Storage (S3) — raw + processed videos',
                'Metadata Service — PostgreSQL for video/channel data',
                'Search — Elasticsearch for discovery',
                'Recommendation Engine — ML collaborative + content filtering',
                'User Service — profiles, subscriptions',
                'Analytics — view counts, watch time, engagement (Kafka → data warehouse)',
            ],
            dataFlow: 'Upload → API Gateway → Video Ingestion Queue → Transcoding Workers (FFmpeg, multiple resolutions) → S3 → CDN. Watch → CDN cache hit OR origin S3 → HLS manifest (.m3u8) → adaptive bitrate chunks.',
            databases: {
                videos: 'PostgreSQL (metadata) + Redis (popular cache) + S3 (files)',
                users: 'PostgreSQL with read replicas',
                comments: 'Cassandra (write-heavy, partition by video_id)',
                search: 'Elasticsearch (title, tags, captions)',
                recommendations: 'Feature store + Redis for real-time signals',
            },
        },
        deepDive: {
            videoProcessing: 'DAG-based pipeline: Upload → Kafka → parallel transcoding (360p/720p/1080p/4K) → adaptive bitrate packaging (HLS .m3u8 manifest) → S3 → CDN invalidation.',
            cdnStrategy: 'Multi-tier: Edge PoPs (90% cache hit) → Regional origins → Central S3. Consistent hashing for cache. Pre-populate popular. Byte-range requests for seeking.',
            recommendations: 'Two-stage: candidate generation (collaborative filtering + content-based) → ranking (deep learning model scoring engagement probability). User history + video features + session context.',
            adaptiveBitrate: 'Client requests .m3u8 manifest listing quality variants. Player monitors bandwidth every 2s → switches quality tier. Buffer 10s ahead. Start at lowest quality → upgrade.',
        },
        commonMistakes: [
            'Not considering transcoding pipeline',
            'Forgetting adaptive bitrate streaming (HLS/DASH)',
            'Underestimating storage scale',
            'Not separating upload vs stream paths',
            'Storing video files in database instead of object storage',
        ],
        tradeoffs: {
            'Consistency vs Availability': 'Eventual consistency for view counts/likes. Strong for payments/subscriptions. View counts can be off by ~1% — acceptable.',
            'Storage Cost vs Quality': 'Multiple resolutions = more storage but better UX. 4K = 4× storage of 1080p. Use intelligent tiering: archive low-view videos to cold storage.',
            'CDN Cost vs Latency': 'More edge locations = lower latency but higher cost. Pre-position top 10% of content at edge, long tail served from origin.',
            'Processing Speed vs Quality': 'Fast transcode (360p first) = video available sooner. Per-title encoding = better quality at same bitrate but slower.',
        },
        conflictBank: [
            { id: 'transcoding-latency', area: 'highLevelArchitecture', challenge: "Your transcoding pipeline is falling behind during a high-upload event. New videos are taking 2 hours to process. How do you prioritize the queue?" },
            { id: 'cdn-cost', area: 'cachingStrategy', challenge: "CDN costs just spiked 400% due to an unexpected viral video in a high-cost region. How do you mitigate this without breaking the user experience?" },
            { id: 'recommendation-bias', area: 'tradeoffs', challenge: "Your recommendation engine only shows popular videos, causing rich-get-richer bias. How do you inject exploration and diversity into the feed?" },
        ],
    },

    // ─── 2. TWITTER ────────────────────────────────────────
    twitter: {
        title: 'Design Twitter/X',
        requirements: {
            functional: ['Post tweets (280 chars + media)', 'Timeline (home feed)', 'Follow/unfollow', 'Like/retweet/reply', 'Search', 'Trending topics'],
            nonFunctional: ['Feed <500ms', 'High write throughput', 'Eventual consistency for feed', 'Real-time notifications'],
            scale: {
                dau: '400M',
                tweetsPerDay: '500M',
                readWriteRatio: '1000:1',
                avgFollowers: '200',
                celebrityFollowers: '50M+',
                qps: '~5,800 write QPS (500M/day ÷ 86,400s), ~5.8M read QPS',
            },
        },
        architecture: {
            components: [
                'Tweet Service — create/store tweets',
                'Fan-out Service — push to follower timelines',
                'Timeline Service — read pre-computed timeline from cache',
                'User Service — profiles, follow graph',
                'Search — Elasticsearch',
                'Media Service — S3 + CDN',
                'Trending — real-time computation via Kafka Streams',
            ],
            dataFlow: 'Post → Tweet Service → Kafka → Fan-out workers → write to follower timeline caches (Redis). Celebrity tweets: hybrid (pull on read). Read timeline → Redis → if miss, compute from follow graph + tweet store.',
            databases: {
                tweets: 'Sharded MySQL (Snowflake IDs)',
                timelines: 'Redis sorted sets (timestamp, per user)',
                followGraph: 'Graph DB or adjacency list in MySQL',
                search: 'Elasticsearch (real-time indexing via Kafka)',
            },
        },
        deepDive: {
            fanoutStrategy: 'HYBRID: Fan-out on write for normal users (<10K followers) — push tweet to each follower\'s Redis timeline. Fan-out on read for celebrities (>10K followers) — merge at read time. Avoids writing to millions of timelines for one tweet.',
            trendingAlgorithm: 'Sliding window (5 min) count of hashtag occurrences via stream processing. Normalize by historical baseline to detect spikes. Filter spam/bots.',
            idGeneration: 'Twitter Snowflake: 64-bit = timestamp(41) + datacenter(5) + machine(5) + sequence(12). ~4096 IDs/ms. Time-sortable.',
        },
        commonMistakes: [
            'Pure fan-out on write (fails for celebrities)',
            'Not handling hot partitions',
            'Ignoring read-heavy nature of timelines',
        ],
        tradeoffs: {
            'Fan-out Write vs Read': 'Write = low read latency, high write amplification. Read = less storage, higher read latency. Hybrid is optimal.',
            'Strong vs Eventual Consistency': 'Timeline is eventually consistent — 1-2s lag acceptable. Follower counts can be slightly off. Critical: your own tweets must appear immediately.',
            'Snowflake ID vs UUID': 'Snowflake = time-sortable, compact (64-bit), requires coordination. UUID = simple but not sortable, 128-bit.',
            'Search Indexing Speed vs Cost': 'Real-time indexing via Kafka = fresh results but expensive. Batch indexing = cheaper but stale. Twitter uses near-real-time (<30s lag).',
        },
        conflictBank: [
            { id: 'celebrity-fanout', area: 'highLevelArchitecture', challenge: "A user with 50M followers just tweeted. Your hybrid strategy is still causing a 5-second lag for some followers. What specifically would you optimize?" },
            { id: 'delete-consistency', area: 'apiDesign', challenge: "A user deletes a tweet, but it still appears in the search index and some follower timelines due to caching. How do you ensure a hard-delete experience?" },
            { id: 'trending-spam', area: 'tradeoffs', challenge: "Bots are gaming your trending algorithm with coordinated hashtag volume. How do you detect and filter these spikes in real-time without false positives?" },
        ],
    },

    // ─── 3. WHATSAPP ───────────────────────────────────────
    whatsapp: {
        title: 'Design WhatsApp',
        requirements: {
            functional: ['1-on-1 messaging', 'Group chat (256 members)', 'Media sharing', 'Read receipts', 'Online/offline presence', 'End-to-end encryption'],
            nonFunctional: ['Delivery <500ms', 'Strong ordering in conversation', 'At-least-once delivery', '99.99% availability'],
            scale: {
                dau: '2B',
                messagesPerDay: '100B',
                concurrentConnections: '500M',
                qps: '~1.16M message QPS (100B/day ÷ 86,400s)',
            },
        },
        architecture: {
            components: [
                'Chat Server (WebSocket gateway)',
                'Message Service — store + forward',
                'Presence Service — online/offline/last seen',
                'Group Service — metadata + membership',
                'Media Service — S3 encrypted upload/download',
                'Push Notification Service',
                'Encryption Service — Signal Protocol',
            ],
            dataFlow: 'Send → WebSocket → Chat Server → route to recipient\'s Chat Server (online: direct) OR → Message Queue → Store in DB → Push notification. Reconnect: pull undelivered messages.',
            databases: {
                messages: 'Cassandra (partition by chat_id, sorted by timestamp)',
                users: 'MySQL with replicas',
                presence: 'Redis (TTL-based)',
                groups: 'MySQL (metadata) + Cassandra (messages)',
            },
        },
        deepDive: {
            messageDelivery: '3 states: Sent (single check) → Delivered (double check, device confirms) → Read (blue checks, app confirms). Store delivery status per message per recipient.',
            encryption: 'Signal Protocol: X3DH key exchange + Double Ratchet (new key per message). Server never sees plaintext.',
            webSocketManagement: 'Connection manager maps userId → Chat Server. Consistent hashing for routing. Heartbeat every 30s. On disconnect, buffer in queue.',
        },
        commonMistakes: [
            'HTTP polling instead of WebSocket',
            'Not handling offline queuing',
            'Ignoring message ordering in groups',
            'Storing plaintext messages (E2E encryption required)',
        ],
        tradeoffs: {
            'WebSocket vs HTTP Long-Poll': 'WebSocket = lower latency, persistent connection, server push. Long-poll = simpler, works through restrictive proxies. WhatsApp uses WebSocket.',
            'At-least-once vs Exactly-once': 'Exactly-once = very expensive at 100B messages/day. At-least-once with client-side dedup (message ID) is the practical choice.',
            'Group Size Limit': '256 members is WhatsApp\'s limit. Larger = fan-out to 256 connections per message. Telegram allows 200K but uses different architecture.',
            'Presence Granularity': 'Real-time presence = battery drain + privacy concern. WhatsApp shows "last seen" as a compromise. Online status only when app is foregrounded.',
        },
        conflictBank: [
            { id: 'websocket-scaling', area: 'apiDesign', challenge: "You have 500M concurrent WebSocket connections. One chat server goes down and 1M clients try to reconnect at once. How do you handle this thundering herd?" },
            { id: 'e2e-search', area: 'technical-depth', challenge: "Since messages are end-to-end encrypted, your server can't index them. How do you implement fast message search for users without breaking E2E encryption?" },
            { id: 'group-ordering', area: 'highLevelArchitecture', challenge: "In a 256-person group, users are seeing messages in different orders due to network latency. How do you guarantee a consistent message order without a central sequencer bottleneck?" },
        ],
    },

    // ─── 4. UBER ───────────────────────────────────────────
    uber: {
        title: 'Design Uber',
        requirements: {
            functional: ['Request rides', 'Match rider to driver', 'Real-time tracking', 'ETA', 'Surge pricing', 'Payments', 'Ratings'],
            nonFunctional: ['Location updates every 3-5s', 'Match within 10s', 'Low latency location queries', '99.9% payment consistency'],
            scale: {
                dau: '100M riders + 5M drivers',
                tripsPerDay: '25M',
                locationUpdatesPerSecond: '1.5M',
                qps: '1.5M location write QPS, 250K match QPS',
            },
        },
        architecture: {
            components: [
                'Location Service — GeoHash index in Redis',
                'Matching Service — nearest available drivers',
                'Trip Service — lifecycle management',
                'Pricing Service — dynamic surge',
                'Payment Service — charge rider, pay driver',
                'ETA Service — route + traffic',
                'Map Service — routing, geocoding',
            ],
            dataFlow: 'Driver pings location every 4s → Location Service → GeoHash index (Redis). Rider requests → Matching: query nearby drivers via GeoHash → sort by ETA → send sequential requests → driver accepts → Trip created → real-time tracking.',
            databases: {
                locations: 'Redis with GeoHash (ephemeral)',
                trips: 'PostgreSQL (transactional)',
                payments: 'PostgreSQL + event sourcing',
                historicalLocations: 'Cassandra (time-series)',
            },
        },
        deepDive: {
            geoIndexing: 'GeoHash: encode (lat,lng) into prefix string. Nearby locations share prefix. Redis sorted sets. Query: GeoHash cell + 8 neighbors. Precision 6 chars = ~1.2km.',
            matchingAlgorithm: 'Expanding radius (1km→3km→5km). Filter: available, correct vehicle, moving toward rider. Rank by ETA. Sequential requests (not broadcast).',
            surgePricing: 'Supply/demand ratio per GeoHash cell. Multiplier = max(1.0, demand/supply × factor). Update every 2 min.',
        },
        commonMistakes: [
            'Not using spatial indexing (GeoHash or S2)',
            'Broadcasting match requests to all nearby drivers simultaneously',
            'Ignoring payment consistency requirements',
            'Single server for location updates (needs partitioning)',
        ],
        tradeoffs: {
            'GeoHash vs S2 Geometry': 'GeoHash = simple, string prefix search. S2 = more accurate at boundaries, used by Google. Uber uses H3 (hexagonal indexing) for even distribution.',
            'Sequential vs Parallel Driver Requests': 'Sequential = one driver at a time, fair but slower match. Parallel broadcast = faster match but drivers may all decline leading to wasted notifications.',
            'Surge Pricing Update Frequency': 'More frequent = more accurate demand signal but more computation. Every 2 min is Uber\'s balance. Real-time = too volatile, causes user distrust.',
            'Location Update Frequency': 'Every 4s = 1.5M QPS at scale. Every 1s = 6M QPS — too expensive. Every 10s = cheaper but ETA less accurate.',
        },
        conflictBank: [
            { id: 'geohash-precision', area: 'scaleEstimation', challenge: "A precision-6 GeoHash in Manhattan could return 5,000 drivers. How do you efficiently rank them by ETA without computing routes for all 5,000?" },
            { id: 'matching-race', area: 'highLevelArchitecture', challenge: "Two riders request the same driver at the exact same millisecond. How do you ensure exactly one rider is matched without a global distributed lock?" },
            { id: 'surge-latency', area: 'tradeoffs', challenge: "Your surge pricing updates every 2 minutes. During a sudden rainstorm, demand spikes in 10 seconds. How do you make pricing more reactive without causing price volatility?" },
        ],
    },

    // ─── 5. URL SHORTENER ──────────────────────────────────
    'url-shortener': {
        title: 'Design URL Shortener',
        requirements: {
            functional: ['Shorten long URL', 'Redirect short URL', 'Click analytics', 'Custom aliases', 'Expiration'],
            nonFunctional: ['Redirect <50ms', 'High availability', '100K reads/sec, 10K writes/sec'],
            scale: {
                urlsTotal: '100M',
                readsPerSec: '100K',
                writesPerSec: '10K',
                qps: '100K read QPS, 10K write QPS — 10:1 read/write ratio',
                storage: '100M URLs × 500 bytes avg = 50GB',
            },
        },
        architecture: {
            components: [
                'API Service — shorten + redirect',
                'ID Generator — Snowflake or auto-increment + Base62',
                'Cache (Redis) — hot URLs, 95% hit rate',
                'Database — URL mappings',
                'Analytics Pipeline — Kafka → Cassandra',
            ],
            dataFlow: 'Create: generate unique ID → Base62 encode → store mapping → return short URL. Redirect: check Redis → if miss, read DB → cache → 301 redirect. Analytics: async to Kafka → workers → Cassandra.',
            databases: {
                urls: 'PostgreSQL sharded by short_code',
                cache: 'Redis (20M hot URLs × 1KB = 20GB)',
                analytics: 'Cassandra (append-only clicks)',
            },
        },
        deepDive: {
            idGeneration: 'Option 1: Auto-increment DB counter + Base62 (simple but single point). Option 2: Snowflake distributed IDs. Option 3: Hash URL + take first 7 chars (collision handling needed). 7-char Base62 = 62^7 = 3.5 trillion possible URLs.',
            caching: '80/20 rule: 20% of URLs get 80% of traffic. Cache top 20M URLs in Redis. Cache hit = 1ms, DB fallback = 10ms. 301 vs 302: 301 = browser caches (less server load), 302 = always hits server (better analytics).',
        },
        commonMistakes: [
            'Not handling hash collisions',
            'Forgetting analytics async processing',
            'Not implementing redirect caching',
            'Using 301 when analytics matter (use 302)',
        ],
        tradeoffs: {
            '301 vs 302 Redirect': '301 = permanent, browser caches it, reduces load but analytics miss repeat visitors. 302 = temporary, always hits server, accurate click analytics.',
            'Hash vs Counter for ID': 'Hash = stateless, deterministic per URL, collision risk. Counter = guaranteed unique, sequential (predictable), requires coordination.',
            'Custom Alias Security': 'Allow custom aliases = better UX but phishing risk (paypal-login). Block reserved words + run URL safety checks (Google Safe Browsing API).',
            'Cache TTL': 'Long TTL = fewer DB hits but stale redirects if URL deleted. Short TTL = fresh but more DB reads. Use event-driven invalidation on deletion.',
        },
        conflictBank: [
            { id: 'hash-collision', area: 'technical-depth', challenge: "You're using 7-character Base62. What's your exact collision resolution strategy when two different long URLs generate the same short code?" },
            { id: 'alias-security', area: 'apiDesign', challenge: "A user creates a custom alias 'paypal-login' to phish users. How do you implement a scalable safety filter for custom aliases at 10K writes/sec?" },
            { id: 'redirect-ddos', area: 'cachingStrategy', challenge: "A viral short link is being hit 1M times per second — 10× your design capacity. Your Redis cache is hot-spotting on one key. How do you distribute the load?" },
        ],
    },

    // ─── 6. INSTAGRAM ──────────────────────────────────────
    instagram: {
        title: 'Design Instagram',
        requirements: {
            functional: ['Post photos/videos', 'Feed (home timeline)', 'Stories (24h ephemeral)', 'Follow/like/comment', 'Explore/discover', 'Direct messages'],
            nonFunctional: ['Feed load <500ms', 'Image upload <3s', 'Global availability', 'Eventual consistency for social'],
            scale: {
                dau: '500M',
                postsPerDay: '100M',
                storagePerDay: '50TB images',
                qps: '~1,160 write QPS (100M posts/day ÷ 86,400s), feed reads ~5M QPS',
            },
        },
        architecture: {
            components: [
                'Post Service — create/store posts',
                'Feed Service — fan-out timeline generation',
                'Media Service — S3 + CDN image/video pipeline',
                'User Service — profiles, follow graph',
                'Story Service — ephemeral storage with TTL',
                'Explore/Recommendation — ML-based content discovery',
                'Search — user/hashtag/location search',
            ],
            dataFlow: 'Upload: Client → S3 presigned URL (direct upload) → trigger Lambda → resize to 5 sizes → CDN. Feed: fan-out on write (normal users) / fan-out on read (celebrities). Hybrid same as Twitter.',
            databases: {
                posts: 'Cassandra (partition by user_id, sorted by timestamp)',
                users: 'PostgreSQL + Redis cache',
                feed: 'Redis sorted sets',
                media: 'S3 + CloudFront CDN',
                stories: 'Redis with 24h TTL + S3 archive',
            },
        },
        deepDive: {
            imageProcessing: 'Upload → S3 → Lambda → generate 5 sizes (thumbnail, small, medium, large, original) → store all in S3 → push to CDN. Use WebP for modern browsers (30% smaller). Progressive JPEG for perceived load speed.',
            feedRanking: 'Not chronological. ML model scores each post by: recency, relationship strength, engagement prediction, content type preference. Re-rank on each load.',
            storiesArchitecture: 'Redis sorted set per user: story IDs with expiry timestamp. On load: filter expired IDs. Background job deletes expired media from S3 daily. Stories never shown after 24h even if job delayed.',
        },
        commonMistakes: [
            'Not separating image upload from post creation (use presigned URLs)',
            'Forgetting stories are ephemeral (TTL required)',
            'Using chronological feed (Instagram uses ranked ML feed)',
            'Storing image files in DB instead of S3',
        ],
        tradeoffs: {
            'Fan-out Write vs Read': 'Write = fast reads, expensive for celebrities. Read = slow feed load. Hybrid: push to users with <10K followers, pull from celebrities at read time.',
            'Chronological vs Ranked Feed': 'Chronological = simple, transparent, users understand it. Ranked = higher engagement (+40% time on app) but opaque, user complaints about missing posts.',
            'Image Format': 'JPEG = universal support, good compression. WebP = 30% smaller, not supported by older Safari. AVIF = 50% smaller, limited support. Serve format based on Accept header.',
            'CDN Caching for User Content': 'Long CDN TTL = fast delivery but deleted photos still accessible at CDN edge. Must purge CDN on delete — expensive at scale.',
        },
        conflictBank: [
            { id: 'celebrity-story', area: 'highLevelArchitecture', challenge: "A celebrity with 100M followers posts a Story. Your fan-out service tries to notify all followers. At 100M notifications, how do you prevent this from overwhelming your system?" },
            { id: 'feed-cold-start', area: 'databaseDesign', challenge: "A new user follows 10 accounts. Their feed cache is empty. How do you generate their first feed quickly without running a full fan-out query?" },
            { id: 'image-delete-consistency', area: 'cachingStrategy', challenge: "A user deletes a photo, but it's cached at 200 CDN edge locations globally. Some users can still access the photo via direct CDN URL for hours. How do you handle this?" },
        ],
    },

    // ─── 7. NETFLIX ────────────────────────────────────────
    netflix: {
        title: 'Design Netflix',
        requirements: {
            functional: ['Browse catalog', 'Search', 'Stream adaptive bitrate', 'Personalized recommendations', 'Profiles', 'Watch history/resume', 'Offline download'],
            nonFunctional: ['Video start <3s', '99.99% availability', 'Global (190+ countries)', 'Smooth playback at varying bandwidth'],
            scale: {
                dau: '230M subscribers',
                concurrentStreams: '10M peak',
                catalogSize: '15K titles',
                bandwidth: '15% of global internet traffic',
                qps: '~115 stream starts/sec (10M concurrent / avg 87,000s session)',
            },
        },
        architecture: {
            components: [
                'Open Connect CDN — Netflix custom CDN embedded in ISPs',
                'Content Processing Pipeline — encode 700+ quality/codec combos per title',
                'API Gateway — routes to microservices',
                'Catalog Service — content metadata by region',
                'Recommendation Service — ML personalization',
                'Playback Service — manifest generation + DRM token',
                'User Service — profiles, preferences, watch history',
            ],
            dataFlow: 'Content onboarding: Raw video → encoding pipeline (700+ profiles) → deploy to Open Connect Appliances in ISPs. Playback: Client requests → Playback Service generates adaptive manifest (.mpd) → client fetches chunks from nearest OCA → adaptive bitrate switching based on bandwidth.',
            databases: {
                catalog: 'Cassandra (denormalized, partitioned by region)',
                userActivity: 'Cassandra (event log, partition by user_id)',
                recommendations: 'Spark offline → feature store + Redis (online serving)',
                billing: 'MySQL (transactional)',
            },
        },
        deepDive: {
            openConnect: 'Netflix embeds custom hardware (OCAs) in ISP data centers. Content pre-positioned off-peak using BGP. >95% of traffic served from within ISP network. Eliminates transit costs, reduces latency to <10ms within ISP.',
            encodingPipeline: 'Per-title optimization: analyze scene complexity → allocate bitrate accordingly. Shot-based encoding. Result: same perceptual quality at 50% lower bitrate vs fixed encoding. 700+ codec/resolution/bitrate combos per title.',
            recommendationSystem: 'Homepage = rows (galleries). Each row ranked by ML model A. Content within row ranked by model B. Signals: watch history, ratings, time of day, device type, trending in region.',
            chaosTesting: 'Chaos Monkey randomly kills production services. Chaos Kong kills entire AWS regions. Forces resilient design: every service must handle dependency failures gracefully.',
        },
        commonMistakes: [
            'Using a generic CDN — Netflix built their own (Open Connect)',
            'Not mentioning adaptive bitrate (HLS/DASH)',
            'Ignoring per-title encoding optimization',
            'Not considering regional content licensing restrictions',
        ],
        tradeoffs: {
            'Build vs Buy CDN': 'Generic CDN = faster setup, ongoing cost. Custom CDN (Open Connect) = huge upfront investment, but Netflix saves hundreds of millions annually and has full control.',
            'Encoding Quality vs Cost': 'More encoding profiles = better adaptive bitrate granularity but more CPU/storage. Netflix encodes 700+ profiles. Startup would encode 5-10.',
            'Recommendation Freshness vs Accuracy': 'Real-time recommendations = reacts to current session but expensive. Offline batch = cheaper but stale. Hybrid: offline models + real-time contextual signals.',
            'Download Quality vs Storage': 'Offline downloads use most storage on user device. Netflix limits download quality to 1080p and sets expiry (48h after first play). Balances UX vs piracy risk.',
        },
        conflictBank: [
            { id: 'oca-failure', area: 'failureHandling', challenge: "An ISP's Open Connect Appliance goes offline, cutting off 2M users in that region from their nearest content cache. How does your fallback chain work?" },
            { id: 'encoding-backlog', area: 'highLevelArchitecture', challenge: "A major studio just delivered 500 new titles for simultaneous global release in 48 hours. Your encoding pipeline normally takes 5 days per title. How do you handle this?" },
            { id: 'regional-licensing', area: 'apiDesign', challenge: "A user in Germany uses a VPN to appear to be in the US and accesses content not licensed in Germany. How do you detect and handle this without blocking legitimate VPN users?" },
        ],
    },

    // ─── 8. RATE LIMITER ───────────────────────────────────
    'rate-limiter': {
        title: 'Design Rate Limiter',
        requirements: {
            functional: ['Limit requests per user/IP/API key', 'Configurable limits per endpoint', 'Return 429 when exceeded', 'Headers showing remaining quota'],
            nonFunctional: ['<1ms overhead per request', 'Distributed across multiple servers', 'Accurate counting', 'Minimal false positives'],
            scale: {
                rps: '1M requests/sec',
                rules: '10K configurable rules',
                qps: '1M QPS across all endpoints',
                latencyBudget: '<1ms added latency per request',
            },
        },
        architecture: {
            components: [
                'Rate Limiter Middleware — intercepts before processing',
                'Rules Engine — configurable per endpoint/user tier',
                'Counter Store — Redis cluster with atomic operations',
                'Sync Service — coordinate counters across data centers',
            ],
            dataFlow: 'Request → Rate Limiter middleware → identify key (user_id or IP) → INCRBY + EXPIRE in Redis → if counter > limit: return 429 + Retry-After header → else: forward to service.',
            databases: {
                counters: 'Redis (in-memory, INCRBY atomic, <1ms)',
                rules: 'Configuration service or YAML, cached in memory',
            },
        },
        deepDive: {
            algorithms: 'Token Bucket: refill tokens at fixed rate, allows bursts. | Sliding Window Log: store timestamp of each request — accurate but memory-heavy (O(requests) per user). | Sliding Window Counter: current window count + weighted previous window count — best balance. | Fixed Window: simple but double-burst possible at boundary (100 at :59 + 100 at :01 = 200 in 2s).',
            distributedCounting: 'Single Redis cluster: simple, slight latency (~1ms). Local counters + periodic sync: fast but slightly inaccurate (allows ~5-10% over limit). Gossip protocol: eventually consistent, complex. Netflix uses local counters accepting slight inaccuracy.',
            redisLua: 'Use Lua script for atomic check-and-increment: prevents TOCTOU race condition. Single round-trip to Redis.',
        },
        commonMistakes: [
            'Using fixed window only (vulnerable to boundary burst attack)',
            'Not considering multi-datacenter consistency',
            'Forgetting Retry-After header in 429 response',
            'Rate limiting after business logic runs (must be first)',
        ],
        tradeoffs: {
            'Accuracy vs Performance': 'Sliding window log = perfect accuracy but O(N) memory per user. Sliding window counter = ~0.003% error but O(1) memory. For most use cases, approximation is fine.',
            'Centralized vs Distributed Counters': 'Centralized Redis = accurate but single point, adds RTT. Local counters = sub-millisecond but each server only knows its own count — allows burst across servers.',
            'Hard vs Soft Limits': 'Hard limit = exactly N requests, some legitimate traffic rejected at boundary. Soft limit = allow burst, charge for overage. APIs use hard limits, telco uses soft.',
            'Per-IP vs Per-User': 'Per-IP = protects against unauthenticated abuse but breaks for NAT (1000 users behind one IP). Per-user = more accurate but requires auth. Do both.',
        },
        conflictBank: [
            { id: 'distributed-burst', area: 'highLevelArchitecture', challenge: "You have 10 API servers each with local rate limit counters. A client sends exactly 10 requests per second — one to each server. Each server sees 1 request/sec and doesn't trigger the 5 req/sec limit. How do you fix this?" },
            { id: 'redis-failure', area: 'failureHandling', challenge: "Your Redis rate limiter cluster goes down. Do you fail open (allow all requests) or fail closed (block all requests)? Walk me through the business implications of each choice." },
            { id: 'limit-bypass', area: 'apiDesign', challenge: "A sophisticated client rotates through 1,000 IPs to bypass your per-IP rate limit. Your per-user limit doesn't help because they're unauthenticated. How do you handle this?" },
        ],
    },

    // ─── 9. NOTIFICATION SYSTEM ────────────────────────────
    notification: {
        title: 'Design Notification System',
        requirements: {
            functional: ['Push notifications (iOS/Android)', 'SMS', 'Email', 'In-app notifications', 'Notification preferences', 'Templates', 'Scheduling'],
            nonFunctional: ['Delivery within seconds for push', 'At-least-once delivery', 'Rate limiting (no spam)', 'Priority levels'],
            scale: {
                notificationsPerDay: '10B',
                users: '500M',
                qps: '~115K notification QPS (10B/day ÷ 86,400s)',
                peakQPS: '~1M QPS during major events (sports, breaking news)',
            },
        },
        architecture: {
            components: [
                'Notification Service — entry point, validates + routes',
                'Template Service — Handlebars/Mustache templates with i18n',
                'Priority Queue — Kafka topics by priority (critical/high/low)',
                'Channel Workers — separate services for push/SMS/email',
                'User Preferences Service — opt-in/out per channel per category',
                'Delivery Tracker — success/failure/retry state per notification',
                'Rate Limiter — per-user, per-channel limits',
            ],
            dataFlow: 'Trigger event → Notification Service → check user preferences → check rate limits → render template → enqueue by priority in Kafka → Channel Workers consume → call APNs/FCM/Twilio/SES → track delivery → retry failed on exponential backoff.',
            databases: {
                templates: 'PostgreSQL (versioned templates)',
                preferences: 'Redis (fast lookup, O(1) per user)',
                deliveryLog: 'Cassandra (append-only, partition by user_id)',
                pendingQueue: 'Kafka (partitioned by notification_type for ordering)',
            },
        },
        deepDive: {
            deduplication: 'Idempotency key per notification (hash of: user_id + template_id + trigger_event_id). Redis SET with 24h TTL. Before enqueue: check if key exists → skip if duplicate.',
            rateLimiting: 'Per-user limits: max 10 push/hour, 5 SMS/day, 20 email/day. Per-campaign limits: max 1M/hour to prevent blast mistakes. Token bucket in Redis.',
            apnsVsFcm: 'APNs (Apple): device token per app, certificates expire, silent notifications for background refresh. FCM (Google): Firebase project key, handles retry internally, topics for broadcast.',
            priorityQueues: 'Kafka topics: notifications.critical (OTP, security alerts), notifications.high (transactional), notifications.low (marketing). Critical = immediate processing, low = batch in off-peak hours.',
        },
        commonMistakes: [
            'Not implementing user preferences/opt-out (CAN-SPAM, GDPR)',
            'Forgetting per-user rate limiting',
            'Not handling APNs/FCM token expiry',
            'Single notification queue (need priority separation)',
        ],
        tradeoffs: {
            'At-least-once vs Exactly-once': 'Exactly-once for OTP/security alerts (duplicate = security issue). At-least-once for marketing (duplicate is annoying but acceptable). Use idempotency keys.',
            'Push vs SMS vs Email': 'Push = free, instant, requires app install. SMS = universal, expensive ($0.01-0.10/message), 98% open rate. Email = cheap, low open rate (~20%), rich content.',
            'Real-time vs Batched': 'Real-time = instant delivery but expensive at scale. Batched = efficient but delayed. Marketing = batch during off-peak. Security alerts = always real-time.',
            'Template Rendering Location': 'Render at enqueue = immutable notification (shows state at send time). Render at delivery = dynamic (shows current state). Use enqueue for legal/compliance.',
        },
        conflictBank: [
            { id: 'apns-token-expire', area: 'technical-depth', challenge: "APNs returns error code 410 (Unregistered) for 50M device tokens after your iOS app update. How do you efficiently clean stale tokens without affecting active users?" },
            { id: 'notification-storm', area: 'highLevelArchitecture', challenge: "A breaking news event triggers 500M notifications in 30 seconds — 5× your normal 24-hour volume. How does your system protect downstream APNs/FCM/SMS providers from being overwhelmed?" },
            { id: 'gdpr-delete', area: 'databaseDesign', challenge: "A user exercises their GDPR right to erasure. They want all notifications deleted within 30 days. Your delivery log in Cassandra is append-only. How do you handle this?" },
        ],
    },

    // ─── 10. WEB CRAWLER ───────────────────────────────────
    'web-crawler': {
        title: 'Design Web Crawler',
        requirements: {
            functional: ['Crawl web pages from seed URLs', 'Extract links and follow', 'Store page content', 'Respect robots.txt', 'Handle different content types'],
            nonFunctional: ['Politeness (don\'t overload servers)', 'Deduplication (don\'t crawl same page twice)', 'Scalable to billions of pages', 'Fresh content prioritized'],
            scale: {
                pagesToCrawl: '1B pages',
                pagesPerSecond: '10K pages/sec',
                storagePerPage: '~100KB avg = 100TB total',
                qps: '10K fetch QPS, distributed across millions of domains',
            },
        },
        architecture: {
            components: [
                'URL Frontier — priority queue of URLs to crawl',
                'Fetcher — HTTP worker pool (thousands of goroutines/threads)',
                'Parser — extract content + outbound links',
                'Content Store — S3 or HDFS',
                'URL Filter — dedup via Bloom filter + robots.txt check',
                'DNS Resolver — cached DNS lookups (avoid DNS bottleneck)',
                'Politeness Controller — per-domain rate limiting',
            ],
            dataFlow: 'Seed URLs → URL Frontier (priority queue) → Fetcher (respect politeness per domain) → Parser (extract links + content) → Content Store. New links → URL Filter (Bloom filter dedup + robots.txt) → back to Frontier if not seen.',
            databases: {
                urlFrontier: 'Redis sorted set (priority score = PageRank × freshness)',
                contentStore: 'S3 or HDFS (raw HTML)',
                visitedUrls: 'Bloom filter (10B URLs × 10 bits = 12.5GB)',
                metadata: 'PostgreSQL (crawl metadata, last-crawled timestamp)',
            },
        },
        deepDive: {
            politeness: 'Per-domain rate limiting: max 1 request/second per domain. Separate queue per domain. Parse robots.txt on first visit, cache for 24h. Honor Crawl-delay directive.',
            deduplication: 'URL dedup: Bloom filter (probabilistic, ~1% false positive = OK, we\'d rather miss 1% than re-crawl everything). Content dedup: SimHash fingerprinting to detect near-duplicate pages (different URLs, same content).',
            prioritization: 'Score = PageRank × (1/days_since_last_crawl) × content_change_frequency. High-traffic news sites crawled every hour. Static company pages crawled weekly.',
            dnsBottleneck: 'Naive DNS lookup blocks fetcher thread. Solution: DNS cache per crawler process (TTL 5 min), async DNS resolution, dedicated DNS resolver service. DNS is often the hidden bottleneck.',
        },
        commonMistakes: [
            'Not implementing politeness (gets IP banned)',
            'URL dedup with exact string matching (misses URL variants)',
            'Single-threaded fetcher (must be massively parallel)',
            'Ignoring DNS as a bottleneck',
        ],
        tradeoffs: {
            'Breadth-first vs Priority-based': 'BFS = simple, fair coverage. Priority-based = higher value pages crawled first but complex. Google uses priority-based heavily weighted by PageRank.',
            'Bloom Filter False Positives': '1% false positive = skip 10M legitimate pages per billion. Acceptable for crawling. Increase filter size to reduce false positives at cost of more memory.',
            'Crawl Frequency vs Server Load': 'More frequent = fresher index but more server load on target sites. Must balance user value (fresh results) vs being a good internet citizen.',
            'Centralized vs Distributed Frontier': 'Centralized frontier = easy dedup but bottleneck. Distributed by URL domain hash = scales but cross-shard dedup harder.',
        },
        conflictBank: [
            { id: 'spider-trap', area: 'highLevelArchitecture', challenge: "A website generates infinite unique URLs dynamically (e.g., /calendar?date=X&view=Y with infinite combinations). Your crawler gets stuck in a loop. How do you detect and escape spider traps?" },
            { id: 'robots-override', area: 'apiDesign', challenge: "A major news site's robots.txt blocks all crawlers, but it's the most important source for your search engine. How do you handle this tension between crawling value and robots.txt compliance?" },
            { id: 'freshness-vs-scale', area: 'tradeoffs', challenge: "You have capacity to crawl 10B pages/month. CNN publishes 500 new articles/day that need to be indexed within 1 hour. Static Wikipedia pages don't change for months. How do you allocate crawl budget?" },
        ],
    },

    // ─── 11. PAYMENT SYSTEM ────────────────────────────────
    payment: {
        title: 'Design Payment System',
        requirements: {
            functional: ['Process payments (card, bank)', 'Refunds', 'Transaction history', 'Multi-currency', 'Fraud detection', 'Merchant settlement'],
            nonFunctional: ['Strong consistency (no double-charge)', 'Idempotency', '99.999% availability', 'PCI DSS compliance', '<1s auth latency'],
            scale: {
                tps: '10K transactions/sec',
                dailyVolume: '$1B',
                merchants: '500K',
                qps: '10K TPS peak — 864M transactions/day',
            },
        },
        architecture: {
            components: [
                'Payment Gateway — validates, authenticates, routes',
                'Payment Processor — orchestrates the full payment flow',
                'Ledger Service — double-entry bookkeeping, immutable append-only',
                'Fraud Detection — ML real-time scoring (<100ms)',
                'Settlement Service — daily batch to merchant bank accounts',
                'Reconciliation Service — match internal ledger with bank statements',
            ],
            dataFlow: 'Charge request → idempotency key check → fraud scoring → Payment Processor → Ledger (DEBIT buyer, CREDIT merchant escrow) → call PSP/Bank API → receive callback → update ledger → notify. Settlement: nightly batch, move escrow → merchant bank.',
            databases: {
                ledger: 'PostgreSQL (ACID, double-entry, immutable rows)',
                transactions: 'PostgreSQL sharded by merchant_id',
                fraudSignals: 'Redis (real-time feature store) + data warehouse',
                idempotencyKeys: 'Redis with 24h TTL',
            },
        },
        deepDive: {
            idempotency: 'Every request includes client-generated idempotency_key. Before processing: check Redis → if found, return cached result (same response regardless of outcome). If not: process → store result → return. Prevents double-charge on network retries.',
            doubleEntry: 'Every transaction = DEBIT from one account + CREDIT to another. Total debits always = total credits. Self-auditing. Immutable rows — never UPDATE, only INSERT. Corrections via reversal entries.',
            fraudDetection: 'Real-time (<100ms): velocity checks (5 transactions in 1 min?), geo anomaly (NY now, London 1h ago?), amount anomaly (10× typical transaction?), device fingerprinting. ML gradient-boosted trees give score 0-100. Score >80 = decline, 60-80 = 3DS challenge.',
            pciCompliance: 'Never store raw card numbers — store tokenized version (Stripe token). Encrypt PAN at rest (AES-256). Network segmentation for cardholder data environment. Annual audit.',
        },
        commonMistakes: [
            'Not implementing idempotency (leads to double-charges)',
            'Using single-entry accounting instead of double-entry',
            'Storing raw card numbers (PCI DSS violation)',
            'Not handling partial failures between ledger and bank API',
        ],
        tradeoffs: {
            'Consistency vs Availability': 'Payments require strong consistency — no eventual consistency. CP over AP. A user must never be charged twice regardless of network partition.',
            'Synchronous vs Async Settlement': 'Sync = merchant gets money immediately but higher cost. Async batch (T+1) = cheaper, industry standard. Stripe and PayPal use T+2 settlement.',
            'In-house vs Third-party Processing': 'In-house = full control, lower per-transaction fee at scale. Third-party (Stripe/Adyen) = faster to market, PCI compliance handled, higher fee. Build in-house only if >$1B volume/year.',
            'Fraud Threshold': 'Low fraud threshold = fewer fraud losses but more false positives (legitimate transactions declined — terrible UX). High threshold = better UX but more fraud. Optimize for revenue, not fraud rate.',
        },
        conflictBank: [
            { id: 'partial-failure', area: 'failureHandling', challenge: "You've debited the buyer's account and sent a request to the bank API, but the bank's response times out. You don't know if the charge succeeded. What do you do?" },
            { id: 'refund-race', area: 'databaseDesign', challenge: "A customer clicks 'Refund' three times rapidly. All three requests hit your API simultaneously before the first completes. How do you ensure only one refund is processed?" },
            { id: 'settlement-discrepancy', area: 'tradeoffs', challenge: "During nightly reconciliation, you find your internal ledger shows $50K more in settlements than the bank statement. The discrepancy must be resolved before morning. What's your investigation and resolution process?" },
        ],
    },

    // ─── 12. DROPBOX ───────────────────────────────────────
    dropbox: {
        title: 'Design Dropbox / Google Drive',
        requirements: {
            functional: ['Upload/download files', 'Sync across devices', 'Share files/folders', 'Version history', 'Conflict resolution'],
            nonFunctional: ['Real-time sync (<5s)', 'Support large files (up to 50GB)', 'Bandwidth efficient (delta sync)', '99.9% durability'],
            scale: {
                users: '700M',
                filesStored: '500B files',
                uploadsPerDay: '1.2B files',
                qps: '~13,900 upload QPS (1.2B/day ÷ 86,400s)',
                storage: '500B files × avg 1MB = 500PB',
            },
        },
        architecture: {
            components: [
                'Sync Service — detects file changes + coordinates across devices',
                'Block Server — splits files into 4MB chunks',
                'Metadata Service — file/folder tree, versions, sharing permissions',
                'Block Storage — S3 with content-addressable deduplication',
                'Notification Service — WebSocket/long-poll for real-time sync',
            ],
            dataFlow: 'Upload: Client detects file change → split into 4MB blocks → hash each block (SHA-256) → upload only new/changed blocks → update metadata server. Sync: Notification Service alerts other devices → pull changed block hashes → download only new blocks.',
            databases: {
                metadata: 'PostgreSQL (file tree, versions, sharing permissions)',
                blocks: 'S3 (content-addressed by hash, deduplicated)',
                syncState: 'Redis (per-device sync cursor)',
                notifications: 'Redis pub/sub or long-poll server',
            },
        },
        deepDive: {
            chunkingAndDedup: 'Split files into 4MB blocks. SHA-256 hash each block. Store by hash (content-addressable). If same hash exists → skip upload. Saves 50%+ storage for office documents (many identical blocks). Cross-user dedup: if two users store same file, only one copy in S3.',
            conflictResolution: 'Last-writer-wins for simple cases. Simultaneous edits: create conflict copy (filename_conflict_john.ext). Let user resolve manually. Google Docs uses OT (Operational Transform) for real-time co-editing — much more complex.',
            deltaSyncProtocol: 'Client maintains rolling checksum of local file. On change: compute which 4MB blocks changed → upload only those blocks → update metadata. For a 1GB file with 1KB change: upload 4MB (one block), not 1GB.',
        },
        commonMistakes: [
            'Uploading entire files instead of block-level delta sync',
            'Ignoring conflict resolution for simultaneous edits',
            'Not implementing cross-user deduplication',
            'Polling for changes instead of push notifications',
        ],
        tradeoffs: {
            'Block Size': '4MB blocks = good balance. Smaller (1MB) = more blocks, better delta but more metadata overhead. Larger (10MB) = fewer metadata ops but worse delta sync for small changes.',
            'Version History Storage': 'Keep all versions = full recovery but expensive. Keep N versions or versions for 30 days. Dropbox: unlimited versions for paid plans, 30 days for free.',
            'Cross-user Dedup Privacy': 'Cross-user dedup saves 50% storage but is a privacy issue — Dropbox was criticised because they could detect if two users had the same file. Per-user dedup only avoids this.',
            'Sync Conflict Strategy': 'Auto-merge (OT/CRDT) = seamless but complex to implement correctly. Create conflict copy = simple, user must resolve manually. Dropbox uses conflict copies, Google Docs uses OT.',
        },
        conflictBank: [
            { id: 'large-file-resume', area: 'apiDesign', challenge: "A user uploads a 50GB video file. After 45GB, their connection drops. They reconnect and try again. How do you support resumable uploads without starting over?" },
            { id: 'sync-conflict-detection', area: 'highLevelArchitecture', challenge: "A user edits the same Word document on their laptop (offline) and phone simultaneously. Both go online at the same time and try to sync. How do you detect the conflict and what does the user experience look like?" },
            { id: 'storage-dedup-attack', area: 'technical-depth', challenge: "An attacker knows you use SHA-256 content hashing for dedup. They check if a specific file exists on your platform by uploading it and seeing if it uploads instantly (cache hit). How do you defend against this hash oracle attack?" },
        ],
    },

    // ─── 13. AUTOCOMPLETE ──────────────────────────────────
    autocomplete: {
        title: 'Design Search Autocomplete',
        requirements: {
            functional: ['Return top 10 suggestions as user types', 'Ranked by popularity', 'Handle typos/fuzzy matching', 'Personalized suggestions'],
            nonFunctional: ['Response <100ms', 'Update with new trending queries', 'Multi-language support'],
            scale: {
                queriesPerDay: '5B',
                uniqueQueries: '100M',
                qps: '~57,870 QPS (5B/day ÷ 86,400s)',
                trieSize: '~4GB for top 100M queries',
            },
        },
        architecture: {
            components: [
                'Trie Service — prefix-based lookup (in-memory, sharded)',
                'Ranking Service — score by frequency + recency + personalization',
                'Data Collection — log queries → Kafka → Spark aggregation → update trie',
                'Cache — Redis for hot prefixes (top 1K prefixes = 80% of traffic)',
            ],
            dataFlow: 'User types "des" → check Redis prefix cache → if miss: query Trie shard → return top 10 ranked → cache result. Background pipeline: Kafka → Spark (hourly aggregation) → rebuild trie shards with updated frequencies.',
            databases: {
                trie: 'In-memory distributed trie (sharded by prefix range a-f, g-l, m-r, s-z)',
                queryLogs: 'Kafka → Hadoop/Spark aggregation pipeline',
                cache: 'Redis (prefix → top 10 results, 15-min TTL)',
                personalization: 'User query history in Redis (last 100 queries)',
            },
        },
        deepDive: {
            trieOptimization: 'Compressed trie (merge single-child nodes = Patricia trie). Store top 10 results at each node (pre-computed, updated hourly). Total memory: 100M unique queries × avg 20 chars = 2B chars × 2 bytes = 4GB. Shard into 4 ranges.',
            ranking: 'Score = log(frequency) × recency_weight × personalization_boost. Recency: exponential decay (query 1h ago scores higher than query 1 year ago). Personalization: 2× boost for queries user searched before.',
            fuzzyMatching: 'Levenshtein distance for typo tolerance. Computationally expensive at scale. Approach: pre-compute phonetic keys (Soundex/Metaphone), build alternative trie for common misspellings.',
        },
        commonMistakes: [
            'Linear search instead of trie (O(N) vs O(prefix_length))',
            'Not pre-computing top results at each node (compute on query = too slow)',
            'Rebuilding trie on every query instead of background batch updates',
            'Not considering trie sharding for scale',
        ],
        tradeoffs: {
            'Trie vs Inverted Index': 'Trie = O(prefix_length) prefix lookup, naturally ordered. Inverted index = flexible query but prefix search requires special handling. Autocomplete = trie wins.',
            'Update Frequency': 'Real-time trie updates = trending queries captured immediately but high write overhead. Hourly batch = some lag on trends but 99% accuracy for top queries.',
            'Personalization vs Privacy': 'Personalized suggestions = higher relevance but requires storing user search history. GDPR implications. Google provides "Incognito mode" to opt out.',
            'Cache TTL': 'Short TTL = fresh results but cache misses for trending queries. Long TTL = fast but misses viral moments. Use event-driven invalidation for major trending topics.',
        },
        conflictBank: [
            { id: 'trie-update-lag', area: 'highLevelArchitecture', challenge: "A major news event starts trending and millions of users are searching a new term. Your trie updates hourly — for 59 minutes, users get no autocomplete for this term. How do you handle real-time trending queries?" },
            { id: 'trie-shard-hotspot', area: 'databaseDesign', challenge: "Your trie is sharded by first letter: A-F, G-L, M-R, S-Z. Your logs show the S-Z shard handles 40% of all traffic. How do you rebalance without downtime?" },
            { id: 'malicious-suggestions', area: 'apiDesign', challenge: "Users are deliberately searching offensive phrases to boost them into autocomplete suggestions. You see 'how to [offensive content]' appearing in top suggestions. How do you filter autocomplete results at scale?" },
        ],
    },

    // ─── 14. NEWS FEED ─────────────────────────────────────
    newsfeed: {
        title: 'Design News Feed',
        requirements: {
            functional: ['Aggregated feed from followed users/pages', 'Ranked (not chronological)', 'Support text, images, videos, links', 'Real-time updates'],
            nonFunctional: ['Feed load <500ms', 'Personalized per user', 'Handle millions of concurrent users'],
            scale: {
                dau: '500M',
                postsPerDay: '200M',
                feedReadsPerDay: '5B',
                qps: '~2,315 write QPS (200M/day ÷ 86,400s), ~57,870 read QPS',
            },
        },
        architecture: {
            components: [
                'Post Service — create/store posts',
                'Fan-out Service — distribute posts to follower feed caches',
                'Feed Cache (Redis) — pre-computed timeline per user',
                'Ranking Service — ML model scores posts by engagement probability',
                'Social Graph Service — follow relationships',
            ],
            dataFlow: 'Post created → Fan-out Service → write to each follower\'s Redis timeline (sorted set by rank score). Celebrity posts: skip fan-out, inject at read time. Feed read: Redis sorted set → take top 50 → apply real-time ranking → return.',
            databases: {
                feed: 'Redis sorted sets (post_id sorted by rank score, per user)',
                posts: 'Cassandra (partition by author_id)',
                socialGraph: 'PostgreSQL or graph database',
            },
        },
        deepDive: {
            rankingModel: 'Features: post recency (decay function), author-reader relationship strength (interaction frequency), content type preference (user watches more videos → boost videos), predicted engagement probability. Model: gradient-boosted trees. Re-rank on each feed request using real-time signals.',
            pushVsPull: 'Push (fan-out on write): pre-computed = fast reads (Redis lookup), expensive writes (fan-out to 1M followers). Pull (fan-out on read): cheap writes, slow reads (query all followed users). Hybrid: push for <10K followers, pull for celebrities.',
            feedDiversity: 'Avoid showing 10 posts from same author in a row. Limit: max 3 posts per author in top 20. Inject "exploration" posts from outside immediate network to expand discovery.',
        },
        commonMistakes: [
            'Pure chronological feed (no engagement ranking)',
            'Pure push model that breaks for celebrity accounts',
            'Not considering feed diversity (too many posts from one source)',
            'Fetching all followed users\' posts at read time (too slow)',
        ],
        tradeoffs: {
            'Fan-out Write vs Read': 'Same as Twitter/Instagram. Write = fast reads. Read = fresh but slow. Hybrid is correct at scale.',
            'Ranked vs Chronological': 'Ranked = higher engagement, more time-on-app but users feel they miss posts. Chronological = transparent, users prefer it but lower engagement. Meta uses ranked, Twitter has both.',
            'Feed Freshness': 'Pre-compute feed = stale (missing posts from last 5 min). Real-time = fresh but slow. Hybrid: pre-compute base feed + merge real-time posts from key accounts at read time.',
            'Feed Cache Size': 'Store last 1000 posts in Redis per user = 500M users × 1000 × 1KB = 500TB Redis. Too expensive. Solution: pre-compute only active users, evict inactive users\' caches.',
        },
        conflictBank: [
            { id: 'feed-cold-start', area: 'databaseDesign', challenge: "A new user signs up and follows 5 people, none of whom have posted recently. Their feed is empty. How do you generate a meaningful first feed experience?" },
            { id: 'viral-post-fanout', area: 'highLevelArchitecture', challenge: "A post goes viral and 10M people share it in 30 minutes. Your fan-out queue has 10M × avg 200 followers = 2B write operations pending. How do you prevent this from starving other users' feed updates?" },
            { id: 'ranking-gaming', area: 'tradeoffs', challenge: "You discover that posts asking 'Like if you agree!' get 10× more engagement and are being ranked first by your ML model, crowding out higher-quality content. How do you fix your ranking model?" },
        ],
    },

    // ─── 15. TICKET BOOKING ────────────────────────────────
    'ticket-booking': {
        title: 'Design Ticket Booking (Ticketmaster)',
        requirements: {
            functional: ['Browse events', 'Select seats', 'Hold seats temporarily', 'Process payment', 'Issue tickets', 'Handle cancellations'],
            nonFunctional: ['No double-booking (strong consistency)', 'Handle 10K concurrent bookings for popular events', 'Seat holds expire after 10 min', 'Fair queuing'],
            scale: {
                events: '100K active events',
                concurrentUsers: '10M during popular sale',
                ticketsPerDay: '5M',
                qps: '~58 normal QPS, up to 10K concurrent booking attempts per event sale',
            },
        },
        architecture: {
            components: [
                'Event Catalog Service — browse + search events',
                'Seat Inventory Service — manages seat availability with optimistic locking',
                'Booking Service — orchestrates hold → pay → confirm flow',
                'Payment Service — processes charge, handles failures',
                'Queue Service — virtual waiting room for high-demand events',
                'Notification Service — booking confirmation + reminders',
            ],
            dataFlow: 'User clicks seat → Seat Inventory: optimistic lock (version check) → hold seat for 10 min (Redis TTL) → user pays → Payment Service → Booking Service confirms → Seat Inventory marks SOLD. If payment fails or TTL expires: release seat automatically.',
            databases: {
                seats: 'PostgreSQL with optimistic locking (version column)',
                bookings: 'PostgreSQL (ACID for transactional integrity)',
                seatHolds: 'Redis with 10-min TTL (auto-expiry)',
                eventCatalog: 'Elasticsearch (search) + PostgreSQL (source of truth)',
            },
        },
        deepDive: {
            seatLocking: 'Optimistic locking: UPDATE seats SET status=\'HELD\', version=version+1, held_by=user_id, held_until=NOW()+10min WHERE seat_id=X AND version=current_version AND status=\'AVAILABLE\'. If 0 rows affected → conflict, seat taken. No SELECT FOR UPDATE needed.',
            virtualQueue: 'For popular events: assign queue position token on arrival. Process in FIFO batches (1000 users at a time). Show real-time position + estimated wait. Hold position for 5 min to complete purchase. Prevents thundering herd on seat inventory.',
            holdExpiry: 'Redis TTL handles hold expiry automatically. Seat status in PostgreSQL is reset by a background job that polls Redis and releases expired holds every 30 seconds. Prevents orphaned holds if background job misses a cycle.',
        },
        commonMistakes: [
            'Not implementing seat hold timeout (seats held forever)',
            'Using SELECT FOR UPDATE (causes lock contention at scale)',
            'No virtual queue for high-demand events (stampede problem)',
            'Not handling payment failure → seat release flow',
        ],
        tradeoffs: {
            'Optimistic vs Pessimistic Locking': 'Pessimistic (SELECT FOR UPDATE) = safe but blocks all readers. Optimistic (version column) = scales better, slight chance of retry on conflict. For ticket booking: optimistic is correct.',
            'Hold Duration': 'Short hold (5 min) = seats released faster if user abandons. Long hold (15 min) = better UX for slow payers but seats tied up longer. 10 min is industry standard.',
            'Queue vs First-Come-First-Served': 'Pure FCFS = fastest user/best connection wins (unfair). Virtual queue = fair distribution, better UX, but adds complexity. Ticketmaster uses virtual queue.',
            'Seat Map Real-time Update': 'Real-time seat map updates = great UX but 10K WebSocket connections per event sale. Polling every 5s = simpler, slightly stale. WebSocket only for VIP events.',
        },
        conflictBank: [
            { id: 'payment-timeout', area: 'failureHandling', challenge: "A user selects 4 seats, goes to checkout, and their payment processor times out at 9 minutes 50 seconds into the 10-minute hold. The hold expires. What does the user experience, and how do you minimize the chance of this happening?" },
            { id: 'queue-bypass', area: 'apiDesign', challenge: "Users are buying queue position tokens and reselling them to bots. Your virtual queue is being gamed. How do you detect and prevent bots from farming queue positions?" },
            { id: 'sold-out-spike', area: 'highLevelArchitecture', challenge: "Taylor Swift tickets go on sale. 2M users hit your queue simultaneously for 50,000 seats. Your queue service receives 2M connections in 10 seconds. What breaks first and how do you protect the seat inventory system?" },
        ],
    },

    // ─── 16. KV STORE ──────────────────────────────────────
    'kv-store': {
        title: 'Design Distributed Key-Value Store',
        requirements: {
            functional: ['get(key)', 'put(key, value)', 'delete(key)', 'Configurable consistency (strong/eventual)', 'Automatic replication'],
            nonFunctional: ['Highly available (AP or CP configurable)', 'Partition tolerant', 'Horizontal scaling', '<10ms p99 latency'],
            scale: {
                keys: '1 trillion keys',
                dataSize: '100TB total',
                rps: '1M requests/sec',
                qps: '1M QPS mixed read/write',
            },
        },
        architecture: {
            components: [
                'Coordinator — routes requests to correct partition via consistent hash ring',
                'Storage Nodes — actual data storage with LSM-tree engine',
                'Gossip Protocol — membership management + failure detection',
                'Consistent Hash Ring — partitions data across nodes with virtual nodes',
                'Replication Manager — maintains N replicas per key',
            ],
            dataFlow: 'put(key, val): hash key → find N nodes on ring → write to primary + N-1 replicas → return success when W writes confirm. get(key): hash → read from R replicas → return most recent (highest vector clock). Tunable: W+R>N = strong consistency.',
            databases: {
                storage: 'LSM-tree (MemTable → SSTable, write-optimized)',
                metadata: 'Gossip protocol for cluster membership state',
            },
        },
        deepDive: {
            consistentHashing: 'Ring with 100-200 virtual nodes per physical node. Even load distribution. When node added: only K/N keys migrate (K=total, N=nodes). When node removed: its keys distributed to next node on ring.',
            conflictResolution: 'Vector clocks detect concurrent writes. Last-writer-wins (NTP timestamp) for simple resolution (risk: clock skew). Application-level resolution for complex (shopping cart: merge items). Dynamo-style: return both versions, let application decide.',
            merkleTreeAntiEntropy: 'Each node builds Merkle tree of its data. Compare root hashes between replicas periodically. If different: traverse tree to find exact differing keys. Efficient repair without full data transfer.',
            lsmTree: 'Writes go to in-memory MemTable → WAL (durability) → periodically flushed to SSTable on disk. Reads check MemTable + Bloom filter + SSTables. Compaction merges SSTables. 10× faster writes than B-tree at cost of slower reads.',
        },
        commonMistakes: [
            'Not explaining consistent hashing (critical concept)',
            'Forgetting conflict resolution strategy',
            'Not discussing quorum (W+R>N for strong consistency)',
            'Ignoring the CAP theorem implications of design choices',
        ],
        tradeoffs: {
            'CP vs AP': 'W+R>N = strong consistency (CP) but lower availability. W+R<N = high availability (AP) but eventual consistency. Cassandra defaults AP. ZooKeeper is CP. Configurable like Dynamo.',
            'LSM-tree vs B-tree': 'LSM = write-optimized (10× faster writes), slower reads (multiple SSTables). B-tree = balanced read/write. For write-heavy KV store: LSM wins.',
            'Replication Factor N': 'N=3 is standard: tolerates 1 node failure with W=2, R=2. N=5: tolerates 2 failures but 2× write amplification.',
            'Gossip vs ZooKeeper for Membership': 'Gossip = decentralized, no SPOF, eventually consistent membership. ZooKeeper = strongly consistent, SPOF risk (mitigated by quorum). Cassandra uses Gossip, HBase uses ZooKeeper.',
        },
        conflictBank: [
            { id: 'clock-skew', area: 'technical-depth', challenge: "Two clients write to the same key at the same millisecond on different nodes. You use NTP timestamps for last-writer-wins. NTP clock skew between servers is up to 500ms. How do you handle this?" },
            { id: 'hot-key', area: 'databaseDesign', challenge: "A single key (e.g., a celebrity's profile) receives 500K reads/sec — 500× the average. All reads go to the same 3 replica nodes. How do you solve this hot key problem?" },
            { id: 'rebalance-during-failure', area: 'failureHandling', challenge: "During a node failure, your consistent hash ring starts moving keys to the next node. But that node is also overloaded and starts failing. How do you prevent a cascading ring failure?" },
        ],
    },

    // ─── 17. CHAT SYSTEM ───────────────────────────────────
    'chat-system': {
        title: 'Design Chat System',
        requirements: {
            functional: ['1-on-1 chat', 'Group chat', 'Online status', 'Message history', 'Read receipts', 'Typing indicators', 'File/media sharing'],
            nonFunctional: ['Real-time (<200ms)', 'Message ordering guaranteed per conversation', 'Offline message delivery', '99.9% availability'],
            scale: {
                dau: '50M',
                messagesPerDay: '5B',
                concurrentConnections: '10M',
                qps: '~57,870 message QPS (5B/day ÷ 86,400s)',
            },
        },
        architecture: {
            components: [
                'WebSocket Gateway — persistent connections, horizontal scaling',
                'Chat Service — message routing, storage, delivery confirmation',
                'Presence Service — online/offline/typing status via Redis TTL',
                'Group Service — group membership, fan-out to group members',
                'Media Service — S3 presigned URL upload/download',
                'Push Service — APNs/FCM for offline users',
            ],
            dataFlow: 'Send message → WebSocket → Chat Service → store in Cassandra → route to recipient\'s WebSocket server → deliver → ACK. Recipient offline: store in undelivered queue → send push notification → on reconnect: client pulls missed messages.',
            databases: {
                messages: 'Cassandra (partition by conversation_id, sorted by message_id)',
                users: 'PostgreSQL',
                presence: 'Redis with 30s TTL (heartbeat-based)',
                groups: 'PostgreSQL (metadata) + Redis (active member cache)',
            },
        },
        deepDive: {
            messageOrdering: 'Server assigns monotonically increasing sequence number per conversation. Client displays messages in sequence order. For distributed servers: use Snowflake IDs (time-sortable). Never rely on client timestamps.',
            offlineDelivery: 'Track last_delivered_message_id per user per conversation. On reconnect: client sends {conversation_id: last_id}. Server returns all messages with id > last_id. This handles both offline periods and network blips.',
            typingIndicators: 'WebSocket event: {type: "typing", user_id, conversation_id}. Do NOT persist to database. Route to conversation participants via WebSocket. Stop indicator after 3s of no typing event.',
        },
        commonMistakes: [
            'HTTP polling instead of WebSocket (1000ms+ latency)',
            'Not handling offline message delivery',
            'Persisting typing indicators to database',
            'Relying on client-side timestamps for ordering',
        ],
        tradeoffs: {
            'WebSocket vs SSE vs Long-poll': 'WebSocket = bidirectional, real-time, complex. SSE = server→client only, simpler. Long-poll = works everywhere, higher latency. Chat requires WebSocket.',
            'Message Storage Duration': 'Store all messages forever = expensive but complete history. Delete after N days = cheaper but users lose history. Offer tiered: free = 30 days, paid = unlimited.',
            'Group Size Limit': 'Small groups (<100): fan-out on write to all member connections. Large groups (100+): fan-out on read or pub/sub. No limit = Telegram allows 200K, architecturally complex.',
            'Read Receipt Granularity': 'Per-message read receipts = precise but high volume (N receipts per message per reader). Conversation-level receipts = cheaper but less precise. WhatsApp uses per-message, Slack uses emoji reactions.',
        },
        conflictBank: [
            { id: 'message-ordering-conflict', area: 'technical-depth', challenge: "Two users send messages at the same millisecond in a group chat, reaching different servers. How do you guarantee all members see the messages in the same order?" },
            { id: 'websocket-reconnect', area: 'failureHandling', challenge: "Your WebSocket gateway goes down. 500K connected users try to reconnect simultaneously. How do you prevent the reconnect storm from cascading to your Chat Service?" },
            { id: 'large-group-fanout', area: 'highLevelArchitecture', challenge: "A group with 10,000 members receives 100 messages per minute. Fan-out = 1M WebSocket writes per minute for this one group. How do you handle this efficiently?" },
        ],
    },

    // ─── 18. E-COMMERCE ────────────────────────────────────
    ecommerce: {
        title: 'Design E-Commerce Platform',
        requirements: {
            functional: ['Product catalog', 'Search + filters', 'Shopping cart', 'Checkout + payment', 'Order tracking', 'Reviews/ratings', 'Inventory management'],
            nonFunctional: ['No overselling (strong consistency for inventory)', 'Search <200ms', 'Cart persistence across sessions', 'Handle flash sales (100K concurrent)'],
            scale: {
                products: '100M SKUs',
                ordersPerDay: '10M',
                dau: '200M',
                qps: '~116 order QPS normally, up to 100K concurrent during flash sales',
            },
        },
        architecture: {
            components: [
                'Catalog Service — product metadata, pricing',
                'Search Service — Elasticsearch with filters + facets',
                'Cart Service — Redis (fast, session-based)',
                'Order Service — order lifecycle management',
                'Inventory Service — stock management with atomic operations',
                'Payment Service — Stripe/Adyen integration',
                'Recommendation Service — "Frequently bought together"',
            ],
            dataFlow: 'Browse → Elasticsearch search → Product detail → Add to cart (Redis HSET). Checkout → Inventory atomic decrement → Payment → Create order → Update inventory → Notify. Flash sale: pre-allocate stock to Redis counter → atomic DECR → if negative: sold out.',
            databases: {
                products: 'MongoDB (flexible schema per category) + Elasticsearch (search)',
                orders: 'PostgreSQL (ACID transactions)',
                inventory: 'Redis (atomic DECR for flash sales) + PostgreSQL (source of truth)',
                cart: 'Redis hash (cart:{user_id} → {sku: qty})',
                reviews: 'MongoDB (document per product)',
            },
        },
        deepDive: {
            inventoryManagement: 'Normal flow: SELECT FOR UPDATE on inventory row → decrement → commit. Flash sale: pre-load stock count into Redis → DECR is atomic → if result < 0: INCR back + return sold-out. Avoids DB bottleneck at 100K concurrent.',
            cartDesign: 'Redis hash per user: O(1) add/remove items. TTL 7 days for session persistence. On login: merge guest cart (cookie-based) with user cart. Abandoned cart emails: trigger on cart with items + 24h inactivity.',
            searchRanking: 'Elasticsearch score × business rules. Boost: high inventory, high rating, sponsored. Demote: out of stock, low rating, old listing. A/B test ranking changes for revenue impact.',
        },
        commonMistakes: [
            'Ignoring inventory race conditions (double-sell)',
            'Not handling flash sale thundering herd',
            'Tight coupling between cart, order, and payment services',
            'Not considering search relevance tuning',
        ],
        tradeoffs: {
            'SQL vs NoSQL for Products': 'PostgreSQL = ACID, great for orders/inventory. MongoDB = flexible schema for product catalog (shoes have different attributes than laptops). Amazon uses both.',
            'Cart in Redis vs DB': 'Redis = fast (O(1)), no persistence durability. DB = durable but slower. Redis is correct — carts are temporary, occasional loss acceptable.',
            'Immediate vs Eventual Inventory Update': 'Immediate = consistent stock count, blocks writes. Eventual = higher throughput but risk of oversell (use reservation model to mitigate).',
            'Centralized vs Distributed Search': 'Single Elasticsearch cluster = simpler but SPOF. Distributed with replica shards = resilient but complex. For 100M products: mandatory sharding.',
        },
        conflictBank: [
            { id: 'flash-sale-oversell', area: 'databaseDesign', challenge: "During a flash sale with 100K concurrent users competing for 1,000 items, your Redis DECR approach works fine — but your PostgreSQL source-of-truth inventory shows -50 items after the sale. What went wrong and how do you prevent this?" },
            { id: 'cart-abandonment', area: 'apiDesign', challenge: "40% of your carts are abandoned. You want to send re-engagement emails at the 1-hour and 24-hour marks. How do you implement this at 200M DAU scale without scanning all Redis carts continuously?" },
            { id: 'search-ranking-abuse', area: 'tradeoffs', challenge: "Sellers discover that using specific keywords increases their Elasticsearch ranking. Your product search results are being gamed with keyword stuffing. How do you make ranking more resilient to manipulation?" },
        ],
    },

    // ─── 19. MONITORING ────────────────────────────────────
    monitoring: {
        title: 'Design Metrics Monitoring System',
        requirements: {
            functional: ['Collect metrics from servers/services', 'Store time-series data', 'Dashboard visualization', 'Alerting (threshold + anomaly)', 'Query language for ad-hoc analysis'],
            nonFunctional: ['Handle 1M metrics/second ingestion', 'Query 1 year of data in <5s', 'Real-time alerting (<1 min delay)', '99.9% availability'],
            scale: {
                metricsPerSecond: '1M metrics/sec ingestion',
                retention: '1 year',
                uniqueMetrics: '10M unique metric series',
                qps: '1M ingest QPS, ~1K dashboard query QPS',
            },
        },
        architecture: {
            components: [
                'Collection Agent — lightweight daemon on each server (Prometheus exporter)',
                'Ingestion Service — receives + batches + validates metrics',
                'Time-Series DB — write-optimized with time-range query support',
                'Query Engine — PromQL-like language for aggregations',
                'Alert Engine — evaluates rules every 30s against TSDB',
                'Dashboard Service — Grafana-like UI with saved queries',
            ],
            dataFlow: 'Agent pulls/pushes metrics every 10s → Ingestion Service batches 1000 metrics → writes to TSDB. Alert Engine: query TSDB every 30s for alert rules → if threshold breached: send to Alert Manager → deduplicate → page on-call. Dashboard: ad-hoc queries to Query Engine → render.',
            databases: {
                metrics: 'InfluxDB or TimescaleDB (time-series optimized, columnar)',
                alertRules: 'PostgreSQL (versioned alert configurations)',
                dashboards: 'PostgreSQL (saved dashboard JSON)',
            },
        },
        deepDive: {
            timeSeriesCompression: 'Delta-of-delta encoding for timestamps (most intervals are identical = near-zero delta-of-delta = 1-2 bits). XOR compression for values (Gorilla algorithm: consecutive values share high bits). Overall: 12:1 compression vs raw float64.',
            downsampling: 'Raw data (10s intervals): keep 2 weeks. Auto-downsample to 1-min averages: keep 3 months. 1-hour averages: keep 1 year. Storage reduction: 6× (10s→1min) × 60× (1min→1hr) = 360× over 1 year.',
            cardinalityExplosion: 'Each unique label combination = new metric series. labels={service=A, host=server1, region=us-east-1} creates 1 series. 100 services × 1000 hosts × 10 regions = 1M series. High cardinality (e.g., user_id label) = billions of series — kills TSDB.',
        },
        commonMistakes: [
            'Not considering data retention/downsampling strategy',
            'Single TSDB instance (needs horizontal sharding)',
            'High cardinality labels (user_id, request_id) that explode series count',
            'Alert fatigue from too many noisy alerts without deduplication',
        ],
        tradeoffs: {
            'Push vs Pull Metrics Collection': 'Pull (Prometheus): scrape endpoint → knows immediately if service is down. Push (StatsD/InfluxDB): service pushes → more flexible but can\'t detect dead service. Prometheus pull is standard.',
            'TSDB vs General DB for Metrics': 'PostgreSQL with time index = works for small scale. Dedicated TSDB (InfluxDB, TimescaleDB) = columnar storage, 12:1 compression, time-range queries 100× faster.',
            'Alert Threshold vs Anomaly Detection': 'Static threshold = simple, predictable, alert when CPU>80%. Anomaly detection (ML) = catches unusual patterns but complex, false positives. Use thresholds first, add anomaly detection later.',
            'Retention vs Storage Cost': '1 year of raw 10s metrics for 1M series: 1M × 6 × 86,400 × 365 × 8 bytes = ~1.5PB. With downsampling + compression: ~4TB. Downsampling is mandatory at scale.',
        },
        conflictBank: [
            { id: 'cardinality-bomb', area: 'technical-depth', challenge: "A developer accidentally adds a user_id label to a high-traffic metric. Your system now has 100M unique series instead of 1000. InfluxDB runs out of memory within minutes. How do you detect and prevent cardinality explosions in production?" },
            { id: 'alert-storm', area: 'highLevelArchitecture', challenge: "Your database goes down and triggers 50,000 alerts simultaneously (one per dependent service, endpoint, and region). On-call gets 50K pages. How do you group and route alerts to prevent alert fatigue?" },
            { id: 'missing-metrics', area: 'failureHandling', challenge: "Your monitoring system itself goes down for 30 minutes during an incident. You have no visibility into what happened during that window. How do you design your monitoring system to survive its own failures and recover gracefully?" },
        ],
    },

    // ─── 20. CDN ───────────────────────────────────────────
    cdn: {
        title: 'Design CDN',
        requirements: {
            functional: ['Cache static content at edge', 'Route users to nearest PoP', 'Cache invalidation', 'Support streaming (HLS/DASH)', 'SSL termination'],
            nonFunctional: ['<50ms latency globally', '99.99% availability', '>95% cache hit rate', 'Support petabytes of content'],
            scale: {
                pops: '200+ PoPs worldwide',
                bandwidth: '100 Tbps aggregate',
                requestsPerSec: '10M requests/sec',
                qps: '10M QPS at edge',
            },
        },
        architecture: {
            components: [
                'GeoDNS — routes user to nearest PoP based on IP geolocation',
                'Edge Servers — L1 cache, SSL termination, serve cached content',
                'Origin Shield — L2 regional cache, reduces origin load',
                'Origin Server — source of truth for uncached content',
                'Purge Service — cache invalidation API (key-based or tag-based)',
                'Analytics — real-time hit/miss ratios, latency, bandwidth by PoP',
            ],
            dataFlow: 'User request → GeoDNS → nearest PoP edge server → cache HIT: serve immediately (<10ms). Cache MISS: edge → Origin Shield (regional L2 cache) → if miss: origin server → cache at edge + origin shield → serve. Pre-warm popular content off-peak (push model).',
            databases: {
                cache: 'In-memory (hot content) + SSD (warm content) at edge servers with LRU eviction',
                metadata: 'Distributed config store (ZooKeeper/Consul) for routing rules',
                analytics: 'Kafka → data warehouse (ClickHouse) for real-time reporting',
            },
        },
        deepDive: {
            cacheInvalidation: 'TTL-based (Cache-Control: max-age=86400). Purge API (instant, by URL or tag). Version-based URLs (style.v3.css + CDN-Surrogate-Key header for group invalidation). Trade-off: instant purge = consistency but purge API call overhead.',
            consistentHashingEdge: 'Distribute content across edge servers using consistent hash ring. Same URL always goes to same edge server = maximizes cache efficiency. Virtual nodes for even distribution.',
            originShield: 'Without shield: 200 PoPs × 1 miss each = 200 origin requests per cache miss. With origin shield: 200 PoPs → 10 regional shields → 1 origin request. 20× reduction in origin load for cold content.',
        },
        commonMistakes: [
            'Not mentioning GeoDNS for routing (anycast is alternative)',
            'Forgetting origin shield (mistakenly called "mid-tier cache")',
            'Using only TTL-based invalidation (can\'t handle urgent purges)',
            'Not discussing cache key design (query params, headers)',
        ],
        tradeoffs: {
            'TTL Length': 'Long TTL = high cache hit rate, fewer origin requests, but stale content. Short TTL = fresh content, more origin requests. Solution: long TTL + purge API for urgent updates.',
            'Push vs Pull Caching': 'Pull = lazy (cache on first miss), simple, cold start problem. Push = pre-warm edge caches for known popular content, avoids cold start but needs prediction.',
            'Anycast vs GeoDNS Routing': 'Anycast = routing at network level, automatic failover, used by Cloudflare. GeoDNS = DNS-based, requires DNS TTL to propagate failover. Anycast is faster failover.',
            'Cache Key Granularity': 'Cache by URL only = misses personalization. Cache by URL+Accept-Encoding = more cache keys, lower hit rate but correct. Vary header controls this.',
        },
        conflictBank: [
            { id: 'cache-poisoning', area: 'apiDesign', challenge: "An attacker sends a request with a malformed Host header that causes your CDN to cache a poisoned response under a legitimate URL. All subsequent users get the poisoned content. How do you prevent cache poisoning?" },
            { id: 'pop-failure', area: 'failureHandling', challenge: "Your PoP in Singapore goes completely offline. 50M users in Southeast Asia who were routing to it are now experiencing timeouts. GeoDNS takes 2 minutes to propagate new routing. How do you minimize user impact?" },
            { id: 'invalidation-at-scale', area: 'cachingStrategy', challenge: "You need to invalidate 500M cached URLs immediately after a security incident exposes sensitive data. Your purge API handles 10K purges/sec. At that rate, it takes 14 hours. How do you purge faster?" },
        ],
    },
}

// ═══════════════════════════════════════════════════════
//  LLD SOLUTIONS (10 problems) — all conflictBanks added
// ═══════════════════════════════════════════════════════

export const LLD_SOLUTIONS = {

    // ─── 1. PARKING LOT ────────────────────────────────────
    'parking-lot': {
        title: 'Design Parking Lot',
        classes: {
            core: ['ParkingLot (Singleton)', 'ParkingFloor', 'ParkingSpot (abstract)', 'Vehicle (abstract)', 'ParkingTicket', 'Payment'],
            vehicles: ['Car', 'Truck', 'Motorcycle'],
            spots: ['CompactSpot', 'LargeSpot', 'MotorcycleSpot'],
            patterns: ['Strategy (pricing)', 'Singleton (ParkingLot)', 'Observer (spot availability display)', 'Factory (vehicle creation)'],
        },
        keyMethods: {
            'ParkingLot.park(vehicle)': 'Find available spot matching vehicle size → CAS (compare-and-swap) on spot status → generate ticket → return. If no spot: return FULL.',
            'ParkingLot.unpark(ticket)': 'Validate ticket → calculate fee (exit_time - entry_time) × rate → process payment → release spot → update availability counter.',
            'ParkingSpot.canFitVehicle(vehicle)': 'Motorcycle → any spot. Car → compact or large. Truck → large only. Check vehicle type enum against spot type.',
        },
        concurrency: 'CAS (Compare-And-Swap) on spot.status field. Use AtomicReference<SpotStatus> or database optimistic lock (version column). Never use synchronized(this) on entire lot — too coarse. Lock per spot.',
        solidAnalysis: 'SRP: ParkingLot finds spots, Payment handles fees, Ticket holds state. OCP: Add ElectricSpot by extending ParkingSpot, no modification to ParkingLot. LSP: CompactSpot/LargeSpot/MotorcycleSpot all substitutable for ParkingSpot. DIP: ParkingLot depends on ParkingSpot abstraction, not concrete types.',
        tradeoffs: {
            'Singleton vs Multiple Lots': 'Singleton assumes one lot. Multi-lot chain: use ParkingLotManager that holds collection of ParkingLot. Singleton is premature if requirement says "parking lot chain".',
            'Eager vs Lazy Spot Finding': 'Iterate all spots = simple but O(N). Maintain priority queue of available spots per type = O(log N) but complex. For <10K spots, linear search is fine.',
            'Synchronous vs Async Payment': 'Sync payment blocks exit lane. Async: issue exit ticket, charge later. Real parking garages use async with license plate camera.',
        },
        conflictBank: [
            { id: 'concurrent-park', area: 'technical-depth', challenge: "Two threads find the same empty compact spot simultaneously and both try to assign it. Show me the exact concurrency primitive you'd use to guarantee only one thread succeeds, and what the other thread does after failing." },
            { id: 'flexible-pricing', area: 'solution-design', challenge: "Management wants to add dynamic pricing: 2× rate during peak hours, 0.5× rate on weekends. How do you change the design to support this without modifying the ParkingLot or ParkingTicket classes?" },
            { id: 'multi-floor-optimization', area: 'technical-depth', challenge: "Your parking lot has 10 floors. A motorcycle arrives and there are spots on floor 1 and floor 9. Your current design assigns the first available spot. How would you change the design to prefer the nearest floor to the entrance?" },
        ],
        extensions: ['EV charging spots with charger allocation', 'VIP/reserved parking with pre-booking', 'License plate recognition for ticketless entry', 'Reservation system with time slots', 'Multi-level pricing tiers'],
    },

    // ─── 2. LRU CACHE ──────────────────────────────────────
    'lru-cache': {
        title: 'Design LRU Cache',
        classes: { core: ['LRUCache', 'DoublyLinkedNode'] },
        keyMethods: {
            'get(key)': 'HashMap lookup → if found: move node to head of DLL (most recent) → return value. If not found: return -1. O(1).',
            'put(key, value)': 'If key exists: update value + move to head. If new key: create node, add to head, add to HashMap. If over capacity: remove tail node + remove from HashMap. O(1).',
            'moveToHead(node)': 'Remove node from current position (update prev/next pointers) → insert after dummy head. O(1) because DLL with prev pointers.',
            'removeTail()': 'Get tail.prev (last real node) → remove it from DLL + return it for HashMap cleanup. O(1).',
        },
        dataStructures: 'HashMap<Key, Node> for O(1) lookup by key. Doubly Linked List for O(1) move-to-head and remove-tail. Head = most recently used, Tail = least recently used. Use dummy head + dummy tail to avoid null checks.',
        threadSafety: 'Option 1: synchronized(this) on get/put — correct but blocks all threads. Option 2: ReadWriteLock (concurrent reads, exclusive writes). Option 3: Shard into N LRUCache segments by key.hashCode() % N — best throughput.',
        tradeoffs: {
            'LRU vs LFU': 'LRU = evicts least recently used. Good for temporal locality. LFU = evicts least frequently used. Good for stable popular content. LRU has O(1) ops, LFU needs frequency heap = O(log N).',
            'Thread Safety Granularity': 'Global lock = correct, low concurrency. Segment-level lock (16 segments) = 16× concurrency. Lock-free CAS = highest concurrency but very complex to implement correctly.',
            'TTL Support': 'Adding TTL = each entry needs expiry timestamp. Background thread or lazy expiry on access. Adds complexity but necessary for distributed caches.',
        },
        conflictBank: [
            { id: 'thread-safe-lru', area: 'technical-depth', challenge: "Your LRU Cache is used by 100 concurrent threads. Using synchronized(this) on every get() means threads block each other even for reads. How do you redesign for higher concurrency without breaking correctness?" },
            { id: 'ttl-eviction', area: 'solution-design', challenge: "Requirements change: cached entries should expire after a configurable TTL regardless of access pattern. How do you add TTL support to your LRU implementation without changing the O(1) complexity of get() and put()?" },
            { id: 'serialize-lru', area: 'technical-depth', challenge: "You need to persist the LRU Cache to disk so it survives a process restart with the same ordering intact. How do you serialize and deserialize the cache state efficiently?" },
        ],
        extensions: ['TTL-based expiration per entry', 'LFU variant (count-based eviction)', 'Distributed cache with consistent hashing', 'Statistics tracking (hit rate, miss rate)'],
    },

    // ─── 3. ELEVATOR ───────────────────────────────────────
    elevator: {
        title: 'Design Elevator System',
        classes: {
            core: ['ElevatorSystem (controller)', 'Elevator', 'Request (floor + direction)', 'Direction enum (UP/DOWN/IDLE)', 'ElevatorState (IDLE/MOVING_UP/MOVING_DOWN/DOOR_OPEN/DOOR_CLOSED)'],
            patterns: ['Strategy (scheduling algorithm — swap SCAN for ShortestSeek)', 'Observer (floor display + door sensors)', 'State (elevator state machine)'],
        },
        schedulingAlgorithms: {
            SCAN: 'Move in one direction, serve all requests, then reverse. Fair, no starvation. Like disk arm (elevator algorithm). O(1) direction decisions.',
            LOOK: 'Like SCAN but reverse direction when no more requests in current direction (not at physical limit). More efficient than SCAN.',
            ShortestSeekFirst: 'Always go to nearest requested floor. Minimizes travel time. Can starve far-away floors. Not used in practice for fairness.',
            SSTF_with_Aging: 'ShortestSeek + increment priority of waiting requests over time. Prevents starvation while maintaining efficiency.',
        },
        keyMethods: {
            'ElevatorSystem.requestElevator(floor, direction)': 'Score each elevator: if moving toward request in same direction = best. Idle + close = second. Opposite direction = last. Assign lowest score.',
            'Elevator.addDestination(floor)': 'Add floor to destination set. Keep set sorted for efficient SCAN traversal. Thread-safe: ConcurrentSkipListSet.',
            'Elevator.step()': 'Called every tick. Check if current floor has pending request → open door → after close: continue direction → if no more requests in direction: reverse or idle.',
        },
        concurrency: 'Each Elevator runs on its own thread with event loop. Request queue: ConcurrentLinkedQueue. Destination set: ConcurrentSkipListSet. ElevatorSystem dispatcher: single thread to avoid race conditions in assignment.',
        tradeoffs: {
            'SCAN vs Shortest Seek': 'SCAN = fair (no starvation), slightly suboptimal average travel. SSF = optimal average but starves extreme floors. Real elevators use LOOK (variant of SCAN).',
            'Single vs Multi-threaded Elevators': 'Single thread simulating all elevators = simpler, no race conditions. Multi-thread (one per elevator) = realistic but requires thread-safe destination sets.',
            'Push vs Pull Request Model': 'Push: dispatcher assigns elevator immediately. Pull: elevators poll for nearest request. Push = more intelligent assignment. Pull = simpler implementation.',
        },
        conflictBank: [
            { id: 'elevator-starvation', area: 'solution-design', challenge: "A user on floor 1 requests the elevator going up. Elevators keep getting called to floors 2-15 and your SCAN algorithm keeps passing floor 1 without stopping. How do you modify your scheduling to prevent starvation?" },
            { id: 'concurrent-requests', area: 'technical-depth', challenge: "100 people press the elevator button on floor 10 simultaneously. Your dispatcher tries to assign all 100 requests to elevators. How do you batch these into a single elevator assignment rather than sending 3 elevators to the same floor?" },
            { id: 'door-sensor-failure', area: 'failureHandling', challenge: "Elevator 2's door sensor stops reporting. You don't know if the door is open or closed. How does your state machine handle a sensor failure to ensure the elevator doesn't move with doors open?" },
        ],
        extensions: ['VIP/express elevators (only stop at lobby + designated floors)', 'Weight capacity limits (refuse when overloaded)', 'Emergency mode (all elevators to ground floor)', 'Energy optimization (park idle elevators at most-used floors)'],
    },

    // ─── 4. CHESS ──────────────────────────────────────────
    chess: {
        title: 'Design Chess Game',
        classes: {
            core: ['Game', 'Board (8×8 grid)', 'Piece (abstract)', 'Square', 'Move (from, to, piece, captured, isSpecial)', 'Player', 'GameStatus enum (ACTIVE/CHECK/CHECKMATE/STALEMATE/DRAW)'],
            pieces: ['King', 'Queen', 'Rook', 'Bishop', 'Knight', 'Pawn — each overrides getValidMoves(Board board)'],
            patterns: ['Command (Move objects — enables undo/redo)', 'Strategy (AI difficulty level)', 'Observer (game state updates → UI)', 'Memento (save/load game state for analysis)'],
        },
        keyMethods: {
            'Piece.getValidMoves(board)': 'Returns List<Move>. Each piece implements movement rules. Filter: moves that leave own King in check are invalid. Pawn: different capture vs advance logic.',
            'Board.isInCheck(Color color)': 'Find King square → check if any opponent piece\'s valid moves include King\'s square. O(pieces × moves_per_piece).',
            'Board.isCheckmate(Color color)': 'isInCheck(color) AND getAllValidMoves(color).isEmpty(). If all moves lead to check: checkmate.',
            'Game.makeMove(Move move)': 'Validate move is in piece.getValidMoves() → execute move on board → push to moveHistory stack → check game status → switch turn → notify observers.',
            'Game.undoMove()': 'Pop from moveHistory stack → reverse move on board (restore captured piece, move piece back) → switch turn. Command pattern enables this.',
        },
        specialMoves: [
            'Castling: King + Rook swap if neither has moved, no pieces between, King not in check, King does not pass through check. Store hasMoved flag on King and Rooks.',
            'En passant: Pawn captures diagonally to square passed by opponent\'s double-step pawn. Only valid immediately after the double-step. Store lastMove on Game.',
            'Pawn promotion: Pawn reaches rank 8 → player chooses piece (usually Queen). Replace Pawn with chosen piece in board state.',
        ],
        concurrency: 'Turn-based: only one player acts at a time. For online multiplayer: Game.makeMove() must be synchronized per game session. Each game is independent — no shared state across games.',
        tradeoffs: {
            'Command vs Direct Mutation': 'Direct mutation = simple but no undo. Command pattern (Move objects with execute/undo) = undo/redo + move history for analysis + replay. Worth the complexity.',
            'Pre-compute vs Lazy Valid Moves': 'Pre-compute all valid moves after each turn = faster response on move selection but expensive after each move. Lazy (compute on selection) = cheaper but noticeable delay for complex positions.',
            'AI Depth': 'Minimax depth 4 = good enough to beat beginners, ~100ms. Depth 8 = strong club player strength, ~10s. Alpha-beta pruning reduces search space by ~√(branches). Add iterative deepening for time control.',
        },
        conflictBank: [
            { id: 'check-validation-perf', area: 'technical-depth', challenge: "After every move, you call isInCheck() which iterates all opponent pieces and their valid moves. For a complex position, this might evaluate 1000+ moves. In a fast online game with 1s move time, how do you optimize this?" },
            { id: 'undo-special-moves', area: 'solution-design', challenge: "A player castles (King + Rook both move). They then use undo. How does your Command pattern handle undoing a move that modifies two pieces simultaneously and resets their 'hasMoved' flags?" },
            { id: 'multiplayer-sync', area: 'highLevelArchitecture', challenge: "Two players are playing online. Player A makes a move, and due to network lag, Player B doesn't see it for 2 seconds but makes their own move in that window. How do you handle conflicting game states on your server?" },
        ],
        extensions: ['Timer/clock with time control (blitz, rapid, classical)', 'Move history export in PGN format', 'AI opponent (minimax + alpha-beta pruning)', 'Online multiplayer via WebSocket', 'Game analysis (show mistakes, suggest better moves)'],
    },

    // ─── 5. LIBRARY MANAGEMENT ─────────────────────────────
    library: {
        title: 'Design Library Management',
        classes: {
            core: ['Library', 'Book', 'BookItem (physical copy with barcode)', 'Member', 'Librarian extends Member', 'BookReservation', 'BookLoan', 'Fine'],
            patterns: ['Observer (notify member when reserved book becomes available)', 'Strategy (fine calculation — daily flat vs percentage)', 'Factory (create Member or Librarian based on role)'],
        },
        keyMethods: {
            'Library.searchBook(criteria)': 'Search by title/author/ISBN/category. HashMap index per field for O(1) ISBN lookup. Full-text search requires Trie or inverted index for title/author.',
            'Member.borrowBook(BookItem item)': 'Check member not blocked → check loan limit (max 5) → check item AVAILABLE → create BookLoan (borrow_date, due_date=now+14days) → update BookItem.status=BORROWED. All in transaction.',
            'Member.returnBook(BookItem item)': 'Find active loan → calculate overdue days → if overdue: create Fine → update BookItem.status=AVAILABLE → check reservation waitlist → notify first reservation holder.',
            'Library.reserveBook(Book book, Member member)': 'Check no available BookItem → create BookReservation → add to waitlist queue per Book.',
        },
        relationships: 'Book 1→M BookItem (one title, many physical copies). Member 1→M BookLoan (history). BookLoan M→1 BookItem. Book 1→M BookReservation. Member 1→M Fine.',
        tradeoffs: {
            'Librarian vs Member Role Inheritance': 'Librarian extends Member = shares borrow behavior + adds admin methods. Could use Composition + Role enum instead to avoid deep inheritance. Both valid — inheritance is simpler here.',
            'Fine Calculation Strategy': 'Flat daily rate (simple) vs percentage of book value (fair for expensive books). Strategy pattern lets you swap calculation without changing Member class.',
            'Reservation Queue Fairness': 'FIFO queue per Book = fair, simple. Priority queue (librarian members first) = unfair but possible requirement. Implement as Queue interface so implementation is swappable.',
        },
        conflictBank: [
            { id: 'concurrent-borrow', area: 'technical-depth', challenge: "The last available copy of a popular book has one reservation pending. Two members simultaneously try to borrow it directly. How do you ensure only one member gets the book and the other sees 'unavailable'?" },
            { id: 'bulk-return', area: 'solution-design', challenge: "A member returns 20 books at once. For 5 of them, other members are waiting in the reservation queue. How do you handle the cascade of notifications and loan creations efficiently without timing out?" },
            { id: 'fine-dispute', area: 'apiDesign', challenge: "A member disputes a fine, claiming they returned the book on time but the librarian marked it as returned 3 days late. How does your design support auditing the return event with a timestamp and librarian ID?" },
        ],
        extensions: ['E-book digital lending with DRM limits', 'Inter-library loan system', 'Overdue email/SMS notifications', 'Book recommendation based on borrow history', 'Reading room reservation'],
    },

    // ─── 6. SNAKE GAME ─────────────────────────────────────
    'snake-game': {
        title: 'Design Snake Game',
        classes: {
            core: ['Game (main loop, score)', 'Snake (Deque<Position>)', 'Board (grid)', 'Food (position)', 'Direction enum (UP/DOWN/LEFT/RIGHT)', 'GameState enum (PLAYING/PAUSED/GAME_OVER)'],
            patterns: ['State (PLAYING/PAUSED/GAME_OVER with transitions)', 'Observer (score updates → UI re-render)', 'Strategy (food placement algorithm — random vs predetermined)'],
        },
        keyMethods: {
            'Snake.move(Direction dir)': 'Compute new head position (current head + direction delta). Check wall collision → GAME_OVER. Check self collision (is new head in body set?) → GAME_OVER. Add new head to front of Deque. If head == food: eat (don\'t remove tail, score++, place new food). Else: remove tail from Deque.',
            'Board.generateFood()': 'Naive: random position until not in snake body. O(snake_length) per try. Better: maintain Set<Position> of empty cells → random selection from set → O(1).',
            'Game.tick()': 'Check gameState → move snake in currentDirection → check food → update score → notify observers → render.',
        },
        dataStructures: 'Snake body: ArrayDeque (O(1) addFirst + removeLast). Collision detection: HashSet<Position> of occupied cells (O(1) lookup). Board: 2D array for rendering only.',
        tradeoffs: {
            'Direction Change Validation': 'Must prevent 180° reversal (RIGHT → LEFT instantly = self collision). Buffer direction changes: accept input but only apply on next tick. Validate: new direction != opposite of current.',
            'Game Loop Timing': 'Thread.sleep(interval) = simple but drifts over time. ScheduledExecutorService = more accurate. For a game, drift over 1000 ticks matters for score fairness.',
            'Food Generation at Max Size': 'When snake fills entire board, O(N) random food generation spins forever. Empty cell set approach degrades gracefully: 0 empty cells → game won.',
        },
        conflictBank: [
            { id: 'direction-buffering', area: 'technical-depth', challenge: "A player quickly presses RIGHT then DOWN in the same game tick. Your current design only processes one direction per tick. The first input is ignored. How do you handle input buffering to respect both inputs without allowing illegal moves?" },
            { id: 'multiplayer-snake', area: 'solution-design', challenge: "Requirements expand: two snakes on the same board, controlled by different players. How do you extend your current design to support multiple snakes where head-to-head collision kills both, and head-to-body kills only the attacker?" },
            { id: 'save-restore', area: 'technical-depth', challenge: "Add a pause-and-save feature. The user closes the app and reopens it later, resuming from exact game state. What do you serialize and how do you restore the Deque-based snake state correctly?" },
        ],
        extensions: ['Obstacles/walls that appear over time', 'Multiple food types (speed boost, score multiplier, invincibility)', 'Increasing speed every N food items', 'High score persistence', 'Replay system'],
    },

    // ─── 7. HOTEL BOOKING ──────────────────────────────────
    'hotel-booking': {
        title: 'Design Hotel Booking',
        classes: {
            core: ['Hotel', 'Room', 'RoomType enum (SINGLE/DOUBLE/SUITE)', 'Reservation', 'Guest', 'Payment', 'HotelSearchService'],
            patterns: ['Observer (notify guest on cancellation → room available)', 'Strategy (pricing — seasonal, demand-based, loyalty discount)', 'State (PENDING → CONFIRMED → CHECKED_IN → CHECKED_OUT → CANCELLED)'],
        },
        keyMethods: {
            'HotelSearchService.searchRooms(checkIn, checkOut, type, guests)': 'Query rooms WHERE type=X AND room_id NOT IN (SELECT room_id FROM reservations WHERE dates overlap). Date overlap: checkIn < existing.checkOut AND checkOut > existing.checkIn.',
            'Hotel.bookRoom(room, guest, checkIn, checkOut)': 'Optimistic lock on room_availability → create Reservation (status=PENDING) → charge payment → update status=CONFIRMED. Rollback on payment failure.',
            'Reservation.cancel(reason)': 'Check cancellation policy → calculate refund → process refund → status=CANCELLED → release room → notify waitlist.',
        },
        concurrency: 'Two guests book same room for same dates simultaneously. Solutions: (1) DB UNIQUE constraint on (room_id, date) in room_availability table — DB rejects duplicate. (2) Optimistic locking: version column on Reservation — second commit fails. (3) SELECT FOR UPDATE: pessimistic, blocks concurrent reads.',
        tradeoffs: {
            'Room Availability Representation': 'Row per day per room (room_availability table) = easy date queries but many rows (1000 rooms × 365 days = 365K rows). Reservation ranges only = fewer rows but date overlap queries complex.',
            'Cancellation Policy': 'Hard-coded in Reservation class = simple but not configurable. Strategy pattern for CancellationPolicy = configurable per room type, season, advance notice. Worth it for real hotel system.',
            'Overbooking Strategy': 'Some hotels intentionally overbook (airlines do this). Accept more reservations than rooms → if all show up: upgrade or compensate. Complex to implement ethically.',
        },
        conflictBank: [
            { id: 'double-booking', area: 'technical-depth', challenge: "Your searchRooms shows Room 101 available. Guest A and Guest B both see it and click Book simultaneously. Both pass your availability check before either commits. How do you guarantee only one gets the room?" },
            { id: 'dynamic-pricing', area: 'solution-design', challenge: "Management wants rooms priced at 1.5× on weekends and 2× during local events (concert, holiday). How do you design a pricing system that supports these rules without hardcoding dates into the Room class?" },
            { id: 'partial-stay-change', area: 'apiDesign', challenge: "A guest with a 5-night reservation wants to check out 2 nights early. Your system must release the last 2 nights, recalculate the charge, and issue a partial refund. Walk me through exactly which objects and methods change." },
        ],
        extensions: ['Room upgrade suggestions on check-in (if better room available)', 'Loyalty points system', 'Group booking with multiple rooms', 'Corporate rate negotiation', 'Housekeeping schedule generation'],
    },

    // ─── 8. VENDING MACHINE ────────────────────────────────
    'vending-machine': {
        title: 'Design Vending Machine',
        classes: {
            core: ['VendingMachine', 'Product', 'Inventory (Map<Product, Integer>)', 'Coin (enum)', 'Transaction'],
            states: ['IdleState', 'HasMoneyState', 'DispensingState', 'OutOfStockState', 'MaintenanceState'],
            patterns: ['State (machine behavior changes per state — insertMoney, selectProduct, cancel each behave differently per state)', 'Singleton (one machine instance)', 'Strategy (different payment processors — coin, card, mobile)'],
        },
        keyMethods: {
            'VendingMachine.insertMoney(amount)': 'In IdleState: accept coins → accumulate balance → transition to HasMoneyState. In HasMoneyState: add to balance. In DispensingState: reject (return coins).',
            'VendingMachine.selectProduct(product)': 'In HasMoneyState: check inventory[product] > 0 → check balance >= price → transition to DispensingState. In IdleState: display "insert money first".',
            'VendingMachine.dispense()': 'In DispensingState: inventory[product]-- → dispense product → calculate change (balance - price) → return change coins → transition to Idle or OutOfStock.',
            'VendingMachine.cancel()': 'In HasMoneyState: return full balance → transition to IdleState. In DispensingState: cannot cancel (already dispensing).',
        },
        stateTransitions: 'Idle → (insertMoney) → HasMoney → (selectProduct, sufficient funds, in stock) → Dispensing → (dispense complete) → Idle. HasMoney → (cancel) → Idle. Any → (last item dispensed) → OutOfStock. Any → (admin login) → Maintenance.',
        tradeoffs: {
            'State Pattern vs if-else Chain': 'if-else = simpler for 2-3 states. State pattern = each state is a class, adding new state doesn\'t break existing states. For 5+ states with complex transitions: State pattern wins.',
            'Coin Handling Precision': 'Store balance as cents (integer) not dollars (float). Float arithmetic: $0.10 + $0.20 = $0.30000000000000004. Integer cents: 10 + 20 = 30 exactly.',
            'Change Calculation': 'Greedy algorithm (largest coins first) works for standard coin denominations. For arbitrary denominations, use dynamic programming. For vending machine: greedy is sufficient.',
        },
        conflictBank: [
            { id: 'exact-change', area: 'solution-design', challenge: "A user inserts $2 for a $1.75 item. You need to return $0.25 change but the machine only has dimes and nickels. How does your design determine the minimum number of coins to return, and what happens if exact change is impossible?" },
            { id: 'concurrent-purchase', area: 'technical-depth', challenge: "Two users simultaneously press the button for the last item in stock. Both machines in a networked chain think 1 item is available. How do you prevent both from dispensing the last item?" },
            { id: 'new-payment-method', area: 'solution-design', challenge: "Management wants to add contactless card payment. Your current design is built around physical coins. How do you extend the design to support card payment without modifying the existing state classes or VendingMachine class?" },
        ],
        extensions: ['Admin interface for restocking + price changes', 'Temperature control (hot/cold sections)', 'Remote monitoring + low-stock alerts', 'Loyalty card integration', 'Receipt printing'],
    },

    // ─── 9. FILE SYSTEM ────────────────────────────────────
    'file-system': {
        title: 'Design In-Memory File System',
        classes: {
            core: ['FileSystemNode (abstract — name, parent, createdAt, permissions)', 'File extends FileSystemNode (content: byte[])', 'Directory extends FileSystemNode (children: Map<String, FileSystemNode>)'],
            patterns: ['Composite (Directory contains Files and Directories uniformly)', 'Iterator (depth-first or breadth-first tree traversal)', 'Visitor (calculate total size, search by predicate, permissions check without modifying node classes)'],
        },
        keyMethods: {
            'Directory.addChild(node)': 'Check name uniqueness in children map → children.put(name, node) → set node.parent = this. Throw NameCollisionException if duplicate.',
            'FileSystem.resolvePath(path)': 'Split path by "/" → start from root or current directory → for each token: navigate to child → handle ".." (node.parent) and "." (current node) → return final node.',
            'Directory.getSize()': 'Recursive: sum of children.stream().mapToLong(child → child.getSize()).sum(). File.getSize() returns content.length. Classic Composite pattern.',
            'FileSystem.find(startDir, pattern)': 'BFS from startDir → for each node: if name matches glob pattern → add to results. Return List<FileSystemNode>.',
            'File.write(content)': 'Set content = content.getBytes(). Update modifiedAt timestamp. If permissions check needed: verify calling user has WRITE permission.',
        },
        dataStructures: 'Directory children: LinkedHashMap<String, FileSystemNode> (preserves insertion order for ls command). Path resolution: Stack<FileSystemNode> for ".." navigation.',
        tradeoffs: {
            'Composite vs Separate File/Directory APIs': 'Composite pattern (same interface for File and Directory) = uniform treatment, simpler client code. Downside: Directory.getContent() and File.getChildren() don\'t make sense for opposite types. Must handle gracefully.',
            'In-memory vs Persistent': 'In-memory = fast, no I/O, lost on process crash. Persistent = serialize tree to disk on every write (expensive) or periodic snapshot. Real file systems use journaling for crash recovery.',
            'Permissions Model': 'Simple boolean (readable, writable, executable) = easy. Unix-style (owner/group/other × rwx) = realistic but complex. Interview scope: simple boolean is fine unless asked.',
        },
        conflictBank: [
            { id: 'symlink', area: 'solution-design', challenge: "Add support for symbolic links — a FileSystemNode that points to another path. How does your Composite design handle a symlink without causing infinite loops when a symlink points to a parent directory?" },
            { id: 'concurrent-write', area: 'technical-depth', challenge: "Two threads simultaneously write to the same File. Thread A writes 'Hello', Thread B writes 'World'. The final content could be 'HWeorllldo' (interleaved bytes). How do you prevent this?" },
            { id: 'large-directory', area: 'technical-depth', challenge: "A directory has 10 million files. Your current getSize() does a full recursive traversal every time it's called. A UI widget calls getSize() every second for display. How do you optimize this?" },
        ],
        extensions: ['Permissions (read/write/execute per user/group)', 'Symbolic links with cycle detection', 'Watch/notify on directory changes (Observer)', 'Undo delete with soft delete + timestamp', 'File compression'],
    },

    // ─── 10. LOGGER ────────────────────────────────────────
    logger: {
        title: 'Design Logger Framework',
        classes: {
            core: ['Logger (Singleton)', 'LogLevel enum (DEBUG/INFO/WARN/ERROR/FATAL)', 'LogMessage (level, message, timestamp, thread, class)', 'LogHandler (abstract — abstract handle(LogMessage))', 'LogFormatter (abstract — abstract format(LogMessage): String)'],
            handlers: ['ConsoleHandler', 'FileHandler (with rotation)', 'DatabaseHandler', 'RemoteHandler (HTTP POST to log aggregator)'],
            formatters: ['SimpleFormatter ("2024-01-15 INFO UserService: User logged in")', 'JSONFormatter (structured, machine-readable)', 'PatternFormatter (configurable pattern like Log4j)'],
            patterns: ['Singleton (Logger instance — thread-safe)', 'Strategy (formatters — swap JSON for Simple)', 'Chain of Responsibility (log level filtering per handler)', 'Builder (LoggerConfig builder)', 'Observer (handlers notified of new log messages)'],
        },
        keyMethods: {
            'Logger.log(level, message, throwable)': 'Check level >= minimumLevel threshold → create LogMessage → submit to async queue → return immediately. Queue consumer thread writes to all handlers.',
            'Logger.getInstance()': 'Thread-safe Singleton. Use enum (most elegant), static holder idiom, or double-checked locking with volatile keyword.',
            'FileHandler.handle(LogMessage)': 'Format message → append to current log file. Check size/time threshold → if exceeded: close current file → rename with timestamp → open new file.',
            'Logger.addHandler(handler)': 'Register handler for future messages. CopyOnWriteArrayList for thread-safe iteration (reads >>> writes for handlers list).',
        },
        concurrency: 'Logger.log() must be non-blocking. Use BlockingQueue<LogMessage> between logger and handlers. Background thread consumes from queue → writes to handlers. Application thread never blocks waiting for I/O. Queue bounded (10K messages) — if full: drop DEBUG/INFO, never drop ERROR/FATAL.',
        tradeoffs: {
            'Sync vs Async Logging': 'Sync = message guaranteed written before continuing. Simple but blocks app on slow I/O. Async = non-blocking, risk of losing last messages on crash. Log4j2 async is 12× faster. Use async with bounded queue.',
            'Structured vs Unstructured Logs': 'Unstructured ("User 123 logged in") = human-readable. Structured (JSON with fields) = machine-parseable, Splunk/ELK searchable. Always use structured logging for production systems.',
            'Log Level Granularity': 'DEBUG = verbose, dev only. INFO = operational events. WARN = unexpected but handled. ERROR = unexpected failure, needs attention. FATAL = system must shutdown. Don\'t overuse ERROR — alert fatigue.',
        },
        conflictBank: [
            { id: 'lost-logs-on-crash', area: 'technical-depth', challenge: "Your async logger uses a BlockingQueue. The process crashes unexpectedly while the queue has 5,000 unwritten ERROR messages. These critical logs are lost. How do you design the logger to prevent losing important logs on crash while keeping async non-blocking behavior?" },
            { id: 'log-sampling', area: 'solution-design', challenge: "Your high-traffic service logs 10M DEBUG messages per minute, filling disk in hours. You can't disable DEBUG globally because you need it for 1% of requests. How do you implement request-level sampling (log DEBUG for 1 in 100 requests) without changing every log call site?" },
            { id: 'circular-dependency', area: 'technical-depth', challenge: "Your DatabaseHandler logs to a database. The database client itself uses your Logger to log connection errors. When the database goes down, the Logger tries to log to the DatabaseHandler, which tries to connect to the database, which tries to log... How do you break this circular dependency?" },
        ],
        extensions: ['Log rotation (size-based: max 10MB, time-based: daily)', 'Structured logging with MDC (Mapped Diagnostic Context) for request tracing', 'Log sampling for high-volume DEBUG', 'Remote log shipping to ELK/Splunk', 'Contextual logging (request_id, user_id via ThreadLocal)'],
    },
}

// ═══════════════════════════════════════════════════════
//  UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════

/**
 * Get the deep solution knowledge for a specific problem
 */
export function getProblemKnowledge(questionId) {
    return HLD_SOLUTIONS[questionId] || LLD_SOLUTIONS[questionId] || null
}

/**
 * Format problem knowledge into context string for AI system prompt injection
 */
export function formatProblemContext(questionId) {
    const knowledge = getProblemKnowledge(questionId)
    if (!knowledge) return ''

    const isHLD = !!HLD_SOLUTIONS[questionId]
    let ctx = `\n\n=== EXPERT SOLUTION REFERENCE (hidden from candidate) ===\nProblem: ${knowledge.title}\nType: ${isHLD ? 'High-Level Design' : 'Low-Level Design'}\n\n`

    // HLD-specific fields
    if (knowledge.requirements) {
        const req = knowledge.requirements
        ctx += `REQUIREMENTS THE CANDIDATE SHOULD IDENTIFY:\n`
        ctx += `Functional: ${req.functional.join(', ')}\n`
        ctx += `Non-functional: ${req.nonFunctional.join(', ')}\n`
        if (req.scale) {
            ctx += `Scale numbers: ${Object.entries(req.scale).map(([k, v]) => `${k}: ${v}`).join(', ')}\n\n`
        }
    }

    if (knowledge.architecture) {
        const arch = knowledge.architecture
        ctx += `EXPECTED ARCHITECTURE:\n`
        ctx += `Key components: ${arch.components.join('; ')}\n`
        ctx += `Data flow: ${arch.dataFlow}\n`
        if (arch.databases) {
            ctx += `Database choices: ${Object.entries(arch.databases).map(([k, v]) => `${k}: ${v}`).join('; ')}\n`
        }
        ctx += '\n'
    }

    if (knowledge.deepDive) {
        ctx += `DEEP DIVE AREAS (probe these):\n`
        Object.entries(knowledge.deepDive).forEach(([k, v]) => { ctx += `- ${k}: ${v}\n` })
        ctx += '\n'
    }

    if (knowledge.commonMistakes) {
        ctx += `COMMON MISTAKES TO WATCH FOR:\n`
        knowledge.commonMistakes.forEach(m => { ctx += `- ${m}\n` })
        ctx += '\n'
    }

    if (knowledge.tradeoffs) {
        ctx += `KEY TRADE-OFFS TO DISCUSS:\n`
        Object.entries(knowledge.tradeoffs).forEach(([k, v]) => { ctx += `- ${k}: ${v}\n` })
        ctx += '\n'
    }

    // LLD-specific fields
    if (knowledge.classes) {
        ctx += `EXPECTED CLASS DESIGN:\n`
        Object.entries(knowledge.classes).forEach(([k, v]) => {
            ctx += `- ${k}: ${Array.isArray(v) ? v.join(', ') : v}\n`
        })
        ctx += '\n'
    }

    if (knowledge.keyMethods) {
        ctx += `KEY METHODS:\n`
        Object.entries(knowledge.keyMethods).forEach(([k, v]) => { ctx += `- ${k}: ${v}\n` })
        ctx += '\n'
    }

    if (knowledge.schedulingAlgorithms) {
        ctx += `ALGORITHMS:\n`
        Object.entries(knowledge.schedulingAlgorithms).forEach(([k, v]) => { ctx += `- ${k}: ${v}\n` })
        ctx += '\n'
    }

    if (knowledge.specialMoves) {
        ctx += `SPECIAL CASES:\n`
        knowledge.specialMoves.forEach(m => { ctx += `- ${m}\n` })
        ctx += '\n'
    }

    if (knowledge.stateTransitions) ctx += `STATE TRANSITIONS: ${knowledge.stateTransitions}\n\n`
    if (knowledge.solidAnalysis) ctx += `SOLID ANALYSIS: ${knowledge.solidAnalysis}\n\n`
    if (knowledge.concurrency) ctx += `CONCURRENCY: ${knowledge.concurrency}\n\n`
    if (knowledge.dataStructures) ctx += `DATA STRUCTURES: ${knowledge.dataStructures}\n\n`
    if (knowledge.extensions) ctx += `POSSIBLE EXTENSIONS TO DISCUSS: ${knowledge.extensions.join(', ')}\n\n`

    ctx += `=== END REFERENCE ===\n\n`
    ctx += `USE THIS TO:\n`
    ctx += `1. Evaluate if candidate covers key areas (requirements, architecture, deep dive)\n`
    ctx += `2. Ask probing questions about areas they skip or mention superficially\n`
    ctx += `3. Validate their design choices against the reference — push back on mistakes\n`
    ctx += `4. Issue challenges from the conflictBank when candidate reaches depth >= 2 in an area\n`
    ctx += `5. Guide toward better solutions without giving answers directly\n`
    ctx += `6. Reference specific trade-offs when candidate makes a decision\n`

    return ctx
}
