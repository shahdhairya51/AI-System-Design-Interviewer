# Complete System Design

# Interview Guide

## The Ultimate Interview-Ready Resource

## Table of Contents

#### 1. Introduction to System Design Interviews

#### 2. Understanding Requirements

#### 3. Fundamental Architecture Concepts

#### 4. Database Design and Selection

#### 5. Consistency and Availability

#### 6. Caching Strategies

#### 7. Networking Fundamentals

#### 8. Load Balancing and Traffic Management

#### 9. Message Queues and Async Processing

#### 10. Microservices vs Monoliths

#### 11. Monitoring and Observability

#### 12. Security Fundamentals

#### 13. System Design Trade-offs

#### 14. Complete System Design Examples

#### 15. Interview Strategy and Communication


# 1. Introduction to System

# Design Interviews

# {#introduction}

## What Interviewers Are Looking For

#### System design interviews assess your ability to:

#### Think at scale : Can you design systems for millions of users?

#### Make justified trade-offs : There’s no perfect solution, only appropriate

#### ones

#### Communicate clearly : Can you explain complex systems simply?

#### Handle ambiguity : Real requirements are never fully specified

#### Consider practical constraints : Cost, time, team size all matter

## The Interview Framework (Use This

## Every Time)

1. CLARIFY REQUIREMENTS (5-7 minutes)
├── Functional: What should the system do?
├── Non-functional: How should it perform?
├── Scale: How many users? How much data?
└── Constraints: Budget? Time? Team size?
2. HIGH-LEVEL DESIGN (10-15 minutes)
├── Draw basic components
├── Show data flow
├── Identify key services
└── Explain choices


3. DEEP DIVE (20-25 minutes)
├── Database schema
├── API design
├── Critical algorithms
├── Scaling strategies
└── Failure handling
4. WRAP-UP (5 minutes)
├── Bottlenecks
├── Improvements
└── Trade-offs made

#### Interview Tip : Always start by asking clarifying questions. Even if you think you

#### know what they want, ask anyway. This shows you understand requirements

#### gathering is critical.

# 2. Understanding Requirements

# - The Foundation of Great

# Design {#requirements}

## 2.1 Functional Requirements - What The

## System Must Do

#### Functional requirements define the core features users will interact with. In

#### interviews, you must extract these before designing anything.

### The Questions to Always Ask:

#### For a Social Media Platform (Instagram/Twitter):


```
✓ "Can users create posts with text, images, or videos?"
✓ "Do we need a feed/timeline?"
✓ "Should users be able to follow/friend others?"
✓ "Do we need real-time notifications?"
✓ "Should we support direct messaging?"
✓ "Do we need search functionality?"
✓ "What about comments and likes?"
```
#### For a Ride-Sharing App (Uber/Lyft):

```
✓ "Do riders and drivers use different apps or the same app?"
✓ "How does matching work? Manual or automatic?"
✓ "Do we need real-time location tracking?"
✓ "Should we support ride scheduling in advance?"
✓ "Do we need surge pricing?"
✓ "What about payment processing?"
✓ "Should we support ride-sharing (multiple passengers)?"
```
#### For a Video Streaming Platform (Netflix/YouTube):

```
✓ "Can users upload videos or just watch?"
✓ "Do we need recommendations?"
✓ "Should we support multiple video qualities?"
✓ "Do we need live streaming or just on-demand?"
✓ "Should users be able to download for offline viewing?"
✓ "Do we need subtitles/captions?"
✓ "What about watch history and resume functionality?"
```
### Interview Example - The Right Way:

#### Interviewer : “Design Instagram”

#### Bad Response : “Okay, so we’ll have a database for users, posts, and comments.

#### We’ll use AWS...” ❌ Jumped to solution without understanding requirements

#### Good Response : "Great! Before I start, let me clarify a few things:


#### 1. Should we support the full Instagram feature set, or focus on core features

#### like posting photos and following users?

#### 2. For the feed, should it be chronological or algorithmic?

#### 3. Do we need to support stories (24-hour temporary posts)?

#### 4. What about video posts, or just images?

#### 5. Should we implement direct messaging?

#### 6. Are we designing for mobile only, or web as well?"

#### ✅ Shows thoughtful requirement gathering

### Prioritizing Features (MVP vs Nice-to-Have)

#### Core Features (Must Have):

#### Instagram: Post photos, follow users, view feed, like/comment

#### Uber: Request ride, driver acceptance, GPS tracking, payment

#### Netflix: Browse content, play videos, pause/resume

#### Secondary Features (Can Add Later):

#### Instagram: Stories, reels, shopping, IGTV

#### Uber: Ride scheduling, ride sharing, driver ratings

#### Netflix: Download for offline, multiple profiles, autoplay

#### Interview Gold Statement : “For our MVP, I’ll focus on [core features]. We can add

#### [secondary features] in future iterations once the core is stable and we understand

#### user behavior better.”

## 2.2 Non-Functional Requirements -

## How The System Must Perform

#### These define the quality and performance characteristics. They often determine

#### your architectural choices.

### Key Non-Functional Requirements:


#### 1. Scalability

#### Questions to Ask:

#### “How many users do we expect?”

#### “What’s the growth rate?”

#### “How many concurrent users?”

#### “What’s the read-to-write ratio?”

#### Interview Examples:

#### Small Scale:

```
100K users, 10K daily active
Can use:
```
- Single database instance
- Simple application server
- Minimal caching
Cost: $500-1000/month

#### Medium Scale:

```
10M users, 1M daily active, 100K concurrent
Requires:
```
- Database replication (1 master, 3-5 read replicas)
- Load balancer + multiple app servers
- Redis caching layer
- CDN for static content
Cost: $10K-50K/month

#### Large Scale:

```
500M users, 50M daily active, 5M concurrent
Requires:
```
- Sharded databases across multiple regions
- Hundreds of application servers
- Multi-layer caching (Redis + CDN)
- Message queues for async processing


- Dedicated analytics infrastructure
Cost: $500K-1M+/month

#### Interview Statement : "Based on 10 million users with 1 million daily active, I

#### estimate:

#### 1M DAU × 20 requests/day = 20M requests/day

#### 20M requests ÷ 86400 seconds ≈ 230 requests/second average

#### Peak traffic (3x average) ≈ 700 requests/second This means we need

#### horizontal scaling with at least 10-15 app servers and database read

#### replicas."

#### 2. Availability

#### Measuring Availability:

```
99% availability = 3.65 days downtime per year
99.9% availability = 8.76 hours downtime per year ("Three nines")
99.99% availability = 52.56 minutes downtime per year ("Four nines")
99.999% availability = 5.26 minutes downtime per year ("Five nines")
```
#### Different Systems Need Different Availability:

#### High Availability Required (99.99%+):

#### Banking/payment systems: Money loss from downtime

#### Emergency services: Lives at stake

#### Critical infrastructure: Major economic impact

#### Medium Availability Acceptable (99.9%):

#### E-commerce: Some downtime acceptable outside peak hours

#### Social media: Users can wait briefly

#### Streaming services: Frustrating but not critical

#### Lower Availability Tolerable (99%):

#### Internal tools: Used during business hours only


#### Batch processing systems: Can retry later

#### Non-critical applications

#### How to Achieve High Availability:

1. Redundancy:
- Multiple servers (if one fails, others continue)
- Multiple data centers (if one goes down, others serve traffic)
- Multiple regions (if entire region fails, reroute)
2. Health Checks:
- Load balancer pings servers every 5-10 seconds
- Automatically removes unhealthy instances
- Adds them back when healthy
3. Failover Mechanisms:
- Automatic database failover (replica becomes master)
- DNS failover (reroute to backup data center)
- Circuit breakers (stop calling failing services)
4. Graceful Degradation:
- If recommendations service fails, show popular content
- If search is slow, show cached results
- If payment gateway times out, queue for retry

#### Interview Example - E-commerce Checkout: "For the checkout flow, I’d require

#### 99.99% availability because downtime directly costs revenue. However, for the

#### product review system, 99.9% is acceptable since it’s not revenue-critical. I’d

#### implement:

#### Multi-region deployment for checkout service

#### Circuit breakers to isolate failures

#### Cached fallbacks for non-critical features

#### Read replicas in multiple availability zones"

#### 3. Latency

#### Latency Requirements by Use Case:


#### Ultra-Low Latency (<10ms):

#### Gaming (FPS games like Call of Duty)

#### High-frequency trading

#### Real-time collaboration tools

#### Low Latency (<100ms):

#### Video calls (Zoom, Google Meet)

#### Messaging apps (WhatsApp, Slack)

#### Live streaming

#### Medium Latency (<300ms):

#### Social media feeds

#### E-commerce browsing

#### Web applications

#### Higher Latency Acceptable (>1s):

#### Batch processing

#### Report generation

#### Video encoding

#### Large file uploads

#### How to Achieve Low Latency:

#### 1. Geographic Distribution (CDN):

```
User in Tokyo → Content from Tokyo CDN = 10ms
User in Tokyo → Content from US server = 150ms
```
```
Solution: CloudFront, Akamai, Fastly
```
#### 2. Caching Layers:

```
No cache: Database query = 50ms
Redis cache: Memory lookup = 1ms
```

```
For frequently accessed data (user profiles, popular posts),
caching reduces latency by 50x
```
#### 3. Database Optimization:

```
No index: Full table scan = 5000ms
With index: B-tree lookup = 10ms
```
```
Proper indexing reduces latency by 500x
```
#### 4. Asynchronous Processing:

```
Synchronous:
User posts photo → Resize → Generate thumbnails → Update DB → Return
Total: 2000ms
```
```
Asynchronous:
User posts photo → Queue resize job → Return immediately
Background: Resize + thumbnails + DB update
User visible latency: 100ms (immediate confirmation)
```
#### Interview Example: "For Instagram photo upload, I’d optimize latency by:

#### 1. Uploading directly to S3 from client (bypass application server)

#### 2. Returning success immediately after S3 upload

#### 3. Asynchronously processing thumbnails, filters, face detection

#### 4. Using CloudFront CDN to serve images globally with <50ms latency

#### 5. Caching user profiles and feeds in Redis for <5ms access"

#### 4. Consistency vs Availability (CAP Theorem)

#### The CAP Theorem:

```
In a distributed system during a network partition, you must choose 2 of
```
- Consistency: All nodes see the same data


- Availability: Every request gets a response
- Partition Tolerance: System works despite network failures

```
Since network failures are inevitable (P is required),
you choose between C and A.
```
#### CP Systems (Choose Consistency):

```
Examples: Banking systems, inventory management, booking systems
```
```
Scenario: Bank transfer
```
- User A transfers $100 to User B
- Network partition occurs
- System blocks the transaction until partition heals
- Result: No inconsistent state (money doesn't duplicate or disappear)
- Trade-off: Transaction fails, user must retry

#### AP Systems (Choose Availability):

```
Examples: Social media, DNS, shopping carts
```
```
Scenario: Facebook like
```
- User likes a post in US
- Network partition between US and EU datacenters
- US shows 1000 likes, EU shows 999 likes
- Partition heals, counts reconcile to 1000
- Result: Temporary inconsistency acceptable
- Trade-off: Better user experience

#### Interview Decision Framework:

#### Choose CP (Consistency over Availability) when:

#### Money is involved: payments, trading, banking

#### Inventory is limited: booking systems, ticket sales

#### Regulatory requirements: healthcare records, legal documents

#### Data correctness is critical: source control, databases


#### Choose AP (Availability over Consistency) when:

#### Social features: likes, follows, views

#### User-generated content: posts, comments, reviews

#### Analytics and metrics: approximate counts acceptable

#### Caches and temporary data: can refresh later

#### Perfect Interview Answer: “For designing a flight booking system, I’d use a CP

#### approach for seat reservations because double-booking is unacceptable. However,

#### for the ‘users viewing this flight’ counter, I’d use AP since approximate numbers

#### are fine and we want the feature available even during network issues.”

#### 5. Durability

#### What It Means: Data, once written, is never lost (even during failures).

#### How to Ensure Durability:

#### 1. Replication:

```
Write data to 3 different servers across 3 availability zones
Only acknowledge write when 2+ copies are safe
```
```
Loss probability:
```
- 1 copy: 1% annual failure rate
- 3 copies: 0.0001% (1 in a million chance all 3 fail)

#### 2. Write-Ahead Logging (WAL):

```
Before updating database:
```
1. Write change to sequential log file (fast)
2. Flush log to disk
3. Apply change to database
4. If database update fails, replay from log

```
Used by: PostgreSQL, MySQL, Cassandra
```

#### 3. Backup Strategies:

```
Hot Backups: Continuous replication to backup database
Warm Backups: Hourly/daily snapshots
Cold Backups: Weekly/monthly archives to S3 Glacier
```
```
Example:
```
- Continuous replication to secondary region
- Hourly snapshots kept for 24 hours
- Daily snapshots kept for 30 days
- Monthly archives kept for 7 years (compliance)

#### 4. Checksums and Verification:

```
Store checksum with each data block
On read, verify checksum matches
If mismatch detected, read from replica
```
```
Protects against:
```
- Disk corruption
- Bit rot
- Silent data corruption

#### Interview Example: "For a document storage system like Google Docs, I’d ensure

#### durability through:

#### 1. Triple replication across availability zones

#### 2. Write-ahead logging for all changes

#### 3. Every 10 minutes, snapshot to S3 for disaster recovery

#### 4. Monthly archives to Glacier for 10-year retention

#### 5. Checksums on all stored documents This gives us 11 nines of durability

#### (99.999999999%) - losing data is virtually impossible."

#### 6. Security

#### Key Security Considerations:


#### Authentication:

#### Who is making the request?

#### Methods: Username/password, OAuth, JWT tokens, multi-factor auth

#### Authorization:

#### What is the user allowed to do?

#### Access control: RBAC (Role-Based), ABAC (Attribute-Based)

#### Encryption:

#### Data at rest: Encrypt database files, backups

#### Data in transit: TLS/HTTPS for all communication

#### End-to-end: Client-to-client encryption (WhatsApp messages)

#### Interview Example: "For a healthcare records system, security is critical:

#### 1. Multi-factor authentication for all access

#### 2. Role-based access control (doctors see full records, billing sees only

#### financial)

#### 3. All data encrypted at rest with AES-

#### 4. All network traffic over TLS 1.

#### 5. Audit logging for every record access (HIPAA compliance)

#### 6. Regular security audits and penetration testing

#### 7. Data retention policies (delete after 10 years)

#### 8. Patient consent management for data sharing"

## 2.3 Scale Estimation - The Numbers

## That Matter

#### Interviewers love to see you estimate system load. This drives all architectural

#### decisions.

### The Standard Calculation Framework:


#### Step 1: Daily Active Users (DAU)

```
Example: Twitter
```
- 500M total users
- 200M daily active users (40% engagement)
- 50M concurrent during peak hours

#### Step 2: Actions Per User

```
Average user per day:
```
- 20 tweet views
- 5 likes
- 2 retweets
- 1 new tweet
- 3 profile views
Total: 31 actions/day

#### Step 3: Total Daily Requests

```
200M users × 31 actions = 6.2 billion requests/day
```
#### Step 4: Requests Per Second (RPS)

```
Average RPS = 6.2B / 86,400 seconds = 71,759 RPS
```
```
Peak RPS (3x average) = 215,277 RPS
```
#### Step 5: Bandwidth Calculation

```
Assumptions:
```
- 1 tweet = 500 bytes (text + metadata)
- 1 image = 200KB
- 1 video thumbnail = 50KB
- 20% of tweets have images
- 5% of tweets have videos


```
Data per request:
```
- Text tweet: 500 bytes
- Image tweet: 200KB
- Video tweet: 50KB (thumbnail)

```
Average: (0.75 × 500) + (0.20 × 200KB) + (0.05 × 50KB) = 42.9KB
```
```
Total bandwidth:
71,759 RPS × 42.9KB = 3GB/second = 25Gbps
Peak: 75Gbps
```
#### Step 6: Storage Calculation

```
Tweets per day:
200M users × 1 tweet/day = 200M tweets/day
```
```
Storage per year:
200M tweets/day × 365 days × 500 bytes = 36.5TB (metadata)
200M × 0.20 × 200KB = 8,000TB = 8PB (images per day)
8PB × 365 = 2,920PB per year for images
```
```
With compression and deduplication: ~1,000PB/year
```
#### Step 7: Server Count Estimation

```
Assumptions:
```
- 1 server handles 1000 RPS
- Want 50% headroom for safety

```
Servers needed:
215,277 peak RPS ÷ 1000 ÷ 0.5 = 431 application servers
```
```
Database servers:
```
- 80% reads, 20% writes
- Read replicas: 172 RPS reads per server
- Need 215,277 × 0.8 ÷ 172 = 1,001 read replicas


- Master handles 43,055 writes/sec
- Need sharding (1 master per 10K writes) = 5 master shards

### Complete Interview Example - WhatsApp:

#### Interviewer : “Design WhatsApp. Start with scale estimation.”

#### Your Answer : "Let me break down the scale:

#### Users:

#### 2 billion total users

#### 500M daily active users

#### 100M concurrent during peak hours

#### User Behavior:

#### Average user sends 50 messages/day

#### Receives 50 messages/day

#### Checks status 10 times/day

#### Views 5 profiles/day Total: 115 actions/day

#### Request Load:

#### 500M × 115 = 57.5B actions/day

#### 57.5B ÷ 86400 = 665,509 RPS average

#### Peak (3x): ~2 million RPS

#### Message Storage:

#### 500M users × 50 messages/day = 25B messages/day

#### Average message: 100 bytes (text) or 200KB (image) or 2MB (video)

#### 80% text, 15% images, 5% videos

#### Daily storage: (25B × 0.8 × 100) + (25B × 0.15 × 200KB) + (25B × 0.05 ×

#### 2MB) = 2TB + 750TB + 2,500TB = 3,252TB/day

#### Annual: 1.2 petabytes

#### Bandwidth:


#### 665,509 RPS × average message size (~100KB with media) = 66GB/second

#### Peak: ~200GB/second

#### Infrastructure:

#### ~2,000 application servers (1000 RPS each with headroom)

#### ~500 database shards (50K writes/second per shard)

#### ~200TB RAM for caching (Redis cluster)

#### Multi-region deployment (Americas, Europe, Asia, Africa)

#### This scale requires distributed architecture with heavy sharding and caching."

#### ✅ This shows you can reason about scale systematically

# 3. Fundamental Architecture

# Concepts {#fundamentals}

## 3.1 Serverless vs Serverful - The First

## Major Decision

### Serverless Architecture

#### What It Means: You write code, cloud provider handles all infrastructure (servers,

#### scaling, patching).

#### Technologies:

#### AWS Lambda, Google Cloud Functions, Azure Functions

#### AWS Fargate (containers without managing servers)

#### Vercel, Netlify (frontend hosting)

#### Example - Image Processing Service:


```
Traditional Approach:
```
1. Provision 10 EC2 servers
2. Install image processing software
3. Set up load balancer
4. Configure auto-scaling
5. Monitor and maintain servers
6. Pay 24/7 even when idle

```
Serverless Approach:
```
1. Write Lambda function that processes images
2. Trigger on S3 upload
3. Automatically scales to thousands of concurrent executions
4. Pay only for execution time (milliseconds)
5. Zero management overhead

#### When to Use Serverless:

#### ✅ Good For:

#### Event-driven workloads (process file uploads, webhook handlers)

#### Unpredictable traffic (sporadic usage)

#### Rapid prototyping (MVP, hackathons)

#### Microservices with variable load

#### Background jobs (send emails, resize images)

#### Examples:

#### Thumbnail generation when users upload photos

#### Sending emails after user signs up

#### Processing payments via webhook

#### Running scheduled jobs (daily reports)

#### ❌ Not Good For:

#### Long-running processes (>15 minutes)

#### Consistent high traffic (cheaper to use dedicated servers)

#### Low-latency requirements (cold start overhead)

#### Stateful applications (Lambda is stateless)


#### Interview Example: "For designing Instagram’s image upload pipeline, I’d use

#### serverless for processing:

#### 1. User uploads image to S

#### 2. S3 triggers Lambda function

#### 3. Lambda generates 5 thumbnail sizes

#### 4. Lambda applies filters if requested

#### 5. Lambda updates database with image URLs

#### This is perfect for serverless because:

#### Upload volume varies greatly (viral posts spike traffic)

#### Processing is short-lived (<30 seconds)

#### No need to maintain thumbnail generation servers

#### Automatically scales to millions of uploads during peak

#### Pay only when images are uploaded, not 24/7"

### Serverful Architecture (Traditional)

#### What It Means: You provision and manage servers directly (EC2, VMs, physical

#### servers).

#### When to Use Serverful:

#### ✅ Good For:

#### Predictable, steady traffic (cost-effective)

#### Applications needing specific hardware (GPUs for ML)

#### Low-latency requirements (no cold starts)

#### Long-running processes

#### Fine-grained control over infrastructure

#### Stateful applications

#### Examples:

#### Database servers

#### Real-time chat servers (WebSocket connections)

#### Game servers

#### ML model training


#### Video streaming

#### Interview Example: "For WhatsApp’s real-time messaging, serverful is essential:

#### 1. WebSocket connections must remain open 24/7

#### 2. Users expect instant message delivery (<50ms)

#### 3. Traffic is consistent and predictable

#### 4. Serverless cold starts would break real-time experience

#### I’d use dedicated EC2 instances with:

#### Persistent WebSocket connections

#### In-memory message routing

#### Sticky sessions to specific servers

#### Manual but predictable scaling"

## 3.2 Vertical vs Horizontal Scaling -

## Growing Your System

### Vertical Scaling (Scale Up)

#### What It Is: Make your existing server bigger - add more CPU, RAM, SSD.

#### Example:

```
Start: t2.medium (2 vCPU, 4GB RAM) → $35/month
Traffic increases...
Upgrade: t2.large (2 vCPU, 8GB RAM) → $70/month
Traffic increases more...
Upgrade: t2.xlarge (4 vCPU, 16GB RAM) → $140/month
Traffic increases more...
Upgrade: t2.2xlarge (8 vCPU, 32GB RAM) → $280/month
```
#### Advantages:


#### Simple: No code changes needed

#### No distributed system complexity

#### Data consistency (everything on one machine)

#### Lower latency (no network calls between servers)

#### Disadvantages:

#### Hard limit : Largest AWS instance = 448 vCPUs, 24TB RAM (very expensive)

#### Single point of failure : If server crashes, entire system down

#### Downtime required : Must stop server to upgrade

#### Expensive : Bigger servers cost exponentially more

#### When to Use:

#### Small to medium applications

#### Monolithic databases that can’t easily shard

#### Quick fix for growing traffic

#### When team lacks distributed systems expertise

#### Interview Example: "For a startup’s MVP with 10K users, I’d start with vertical

#### scaling:

#### Begin with t3.medium ($30/month)

#### Can easily scale to t3.2xlarge ($250/month) for 100K users

#### No need to overcomplicate with distributed architecture

#### Once we hit 500K+ users or need high availability, migrate to horizontal

#### scaling"

### Horizontal Scaling (Scale Out)

#### What It Is: Add more servers instead of making existing ones bigger.

#### Example:

```
Start: 1 server handling 1000 RPS
```
```
Traffic doubles...
Solution: Add 1 more server
Now: 2 servers, each handling 1000 RPS, load balanced
```

```
Total capacity: 2000 RPS
```
```
Traffic doubles again...
Solution: Add 2 more servers
Now: 4 servers, total capacity: 4000 RPS
```
```
Can continue indefinitely (Google has millions of servers)
```
#### Advantages:

#### No theoretical limit : Add as many servers as needed

#### High availability : Multiple servers mean redundancy

#### No downtime : Add servers without stopping service

#### Cost-effective : Many small servers cheaper than one giant server

#### Geographic distribution : Servers in different regions reduce latency

#### Disadvantages:

#### Complexity : Need load balancer, session management, distributed caching

#### Data consistency challenges : Multiple databases need synchronization

#### Network overhead : Servers communicate over network (latency)

#### More moving parts : More things that can fail

#### Requirements for Horizontal Scaling:

1. Stateless Application Servers:
- Don't store user sessions on server
- Use external session store (Redis)
2. Load Balancer:
- Distributes traffic across servers
- Health checks remove failed servers
3. Shared Data Layer:
- Centralized database or distributed database
- Shared cache (Redis cluster)
4. Distributed File Storage:


- S3, not local disk
- All servers access same files

#### Interview Example: "For Netflix with 200M users, horizontal scaling is mandatory:

#### Application Tier:

#### Thousands of stateless EC2 instances

#### Auto-scaling groups add/remove servers based on load

#### Elastic Load Balancer distributes traffic

#### Servers in multiple regions (US, Europe, Asia, South America)

#### Caching Tier:

#### Redis cluster with 500+ nodes

#### Caches movie metadata, user profiles, recommendations

#### Distributed across all regions

#### Database Tier:

#### Cassandra cluster with 2,500+ nodes

#### Sharded by user_id

#### Replicated across 3 availability zones

#### This architecture can scale to billions of users by adding more nodes."

## 3.3 Basic Computer Science

## Fundamentals

### Threads vs Processes

#### Process:

#### Independent program with own memory space

#### Isolated from other processes


#### Heavy resource consumption

#### Example: Running Chrome (1 process per tab)

#### Thread:

#### Lightweight execution within a process

#### Shares memory with other threads in same process

#### Lower overhead

#### Example: Gmail web app (1 thread for UI, 1 for network, 1 for notifications)

#### Interview Relevance:

#### Multi-threaded Web Server:

```
Apache with worker MPM:
```
- Each incoming request gets a thread
- Can handle 1000s of concurrent connections
- Threads share server memory (efficient)

```
Node.js (single-threaded):
```
- One thread handles all requests
- Uses async I/O (non-blocking)
- Different concurrency model

#### When Asked: “I’d use multi-threaded architecture for the API server to handle

#### concurrent requests efficiently. Each thread processes one request, allowing us to

#### serve thousands of simultaneous users on a single server. However, I’d ensure

#### threads don’t share mutable state to avoid race conditions.”

### How the Internet Works - Request/Response Cycle

#### The Complete Flow:

1. User types "www.instagram.com" in browser
↓
2. DNS Resolution:
- Browser checks cache
- If not found, asks DNS resolver


- Resolver queries root → TLD → authoritative DNS
- Returns IP: 157.240.2.35
↓
3. TCP Connection:
- Three-way handshake (SYN, SYN-ACK, ACK)
- Establishes reliable connection
↓
4. TLS Handshake (HTTPS):
- Client Hello (supported ciphers)
- Server Hello (chosen cipher)
- Certificate exchange and verification
- Encrypted session established
↓
5. HTTP Request:
GET / HTTP/1.1
Host: [http://www.instagram.com](http://www.instagram.com)
User-Agent: Mozilla/5.0...
Cookie: session_id=abc123
↓
6. Load Balancer:
- Receives request
- Checks health of backend servers
- Routes to healthy server using algorithm
↓
7. Application Server:
- Authenticates user (checks session)
- Queries database for user's feed
- Checks cache for recent posts
- Renders HTML or returns JSON
↓
8. HTTP Response:
HTTP/1.1 200 OK
Content-Type: application/json
Set-Cookie: session_id=abc123; Secure

```
{ "posts": [...], "stories": [...] }
↓
```
9. Browser renders content

#### Interview Deep Dive - DNS:


#### Interviewer : “How would you handle DNS for a global service?”

#### Perfect Answer : "For a service like Instagram serving 2 billion users globally, I’d

#### implement:

#### 1. GeoDNS (Geographic Load Balancing):

#### User in Japan queries DNS → Returns Tokyo data center IP (13.230.x.x)

#### User in Germany queries DNS → Returns Frankfurt IP (3.120.x.x)

#### Reduces latency by serving from nearest region

#### 2. DNS Caching Strategy:

#### Short TTL (60 seconds) for critical services: allows quick failover

#### Long TTL (1 hour) for static assets: reduces DNS load

#### 3. Health-Based DNS:

#### If Tokyo data center fails health check

#### DNS automatically returns secondary region (Singapore)

#### Seamless failover without user noticing

#### 4. Anycast DNS:

#### Multiple DNS servers share same IP address

#### Router sends user to nearest DNS server

#### Used by Cloudflare, AWS Route 53

#### This ensures users always connect to fastest, healthy endpoints with sub-50ms

#### latency globally."

# 4. Database Design and

# Selection - The Heart of Every


# System {#databases}

## 4.1 SQL (Relational) Databases - When

## Structure and Consistency Matter

### Core Concepts

#### What They Are: SQL databases store data in tables with predefined schemas and

#### use SQL for querying. They enforce ACID properties for reliability.

#### ACID Properties Explained:

#### Atomicity - All or Nothing:

```
-- Bank transfer example
BEGIN TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE user_id = 123;
UPDATE accounts SET balance = balance + 100 WHERE user_id = 456;
COMMIT;
```
```
If second UPDATE fails → entire transaction rolls back
Result: Either both updates succeed or neither does (no half-transfer)
```
#### Consistency - Valid State to Valid State:

```
-- Constraint: balance cannot be negative
UPDATE accounts SET balance = balance - 1000 WHERE user_id = 123;
```
```
If user has only $500:
→ Transaction rejected
→ Database remains in consistent state
→ No negative balances ever exist
```

#### Isolation - Concurrent Transactions Don’t Interfere:

```
Transaction A: Transfer $100 from Account 1 to Account 2
Transaction B: Transfer $50 from Account 2 to Account 3
```
```
Running simultaneously:
```
- Transaction A sees Account 2's balance before Transaction B
- Transaction B sees Account 2's balance before Transaction A
- Final state is as if they ran sequentially
- No lost updates or dirty reads

#### Durability - Committed Data Never Lost:

```
User completes purchase → Server confirms "Order placed"
→ Power outage 1 second later
→ When system restarts, order still exists in database
→ Write-ahead logging ensures this
```
### When to Use SQL Databases

#### 1. Financial Systems (Stripe, PayPal, Banking Apps)

#### Why SQL:

#### Money calculations must be exact (ACID guarantees)

#### Auditing requires transaction history

#### Regulatory compliance demands data integrity

#### Complex queries for fraud detection

#### Example Schema:

```
CREATE TABLE accounts (
account_id BIGINT PRIMARY KEY,
user_id BIGINT NOT NULL,
balance DECIMAL(19,2) NOT NULL CHECK (balance >= 0),
currency VARCHAR(3) NOT NULL,
created_at TIMESTAMP NOT NULL,
```

```
updated_at TIMESTAMP NOT NULL
);
```
```
CREATE TABLE transactions (
transaction_id BIGINT PRIMARY KEY,
from_account_id BIGINT REFERENCES accounts(account_id),
to_account_id BIGINT REFERENCES accounts(account_id),
amount DECIMAL(19,2) NOT NULL,
status VARCHAR(20) NOT NULL, -- pending, completed, failed
created_at TIMESTAMP NOT NULL,
completed_at TIMESTAMP
);
```
```
CREATE INDEX idx_transactions_from ON transactions(from_account_id, crea
CREATE INDEX idx_transactions_to ON transactions(to_account_id, created_
```
#### Interview Answer Template: "For a payment processing system like Stripe, I must

#### use SQL because:

#### 1. Financial transactions require atomic operations - either both debit and

#### credit happen, or neither

#### 2. Referential integrity prevents orphaned records

#### 3. Complex queries for reporting (monthly statements, tax documents)

#### 4. Strong consistency ensures no money duplication or loss

#### 5. Audit trails for regulatory compliance I’d choose PostgreSQL for its robust

#### ACID compliance and JSON support for metadata."

#### 2. E-commerce Platforms (Amazon, Shopify)

#### Why SQL:

#### Inventory tracking requires exact counts

#### Order processing needs transactional guarantees

#### Product relationships (categories, variants) benefit from joins

#### Complex reporting for business analytics

#### Example Schema:


CREATE TABLE products (
product_id BIGINT PRIMARY KEY,
name VARCHAR(255) NOT NULL,
description TEXT,
price DECIMAL(10,2) NOT NULL,
inventory_count INT NOT NULL CHECK (inventory_count >= 0),
category_id BIGINT REFERENCES categories(category_id),
created_at TIMESTAMP NOT NULL
);

CREATE TABLE orders (
order_id BIGINT PRIMARY KEY,
user_id BIGINT NOT NULL,
status VARCHAR(20) NOT NULL, -- pending, processing, shipped, deliv
total_amount DECIMAL(10,2) NOT NULL,
created_at TIMESTAMP NOT NULL,
updated_at TIMESTAMP NOT NULL
);

CREATE TABLE order_items (
order_item_id BIGINT PRIMARY KEY,
order_id BIGINT REFERENCES orders(order_id),
product_id BIGINT REFERENCES products(product_id),
quantity INT NOT NULL CHECK (quantity > 0),
price_at_purchase DECIMAL(10,2) NOT NULL,

UNIQUE(order_id, product_id) -- Prevent duplicate items in same ord
);

-- Critical for preventing overselling
CREATE TRIGGER check_inventory BEFORE INSERT ON order_items
FOR EACH ROW
BEGIN
DECLARE available INT;
SELECT inventory_count INTO available FROM products WHERE product_id
IF available < NEW.quantity THEN
SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Insufficient invento
END IF;
END;


#### Interview Scenario: “How do you prevent overselling when 1000 people

#### simultaneously buy the last item?”

#### Perfect Answer: "I’d use SQL with row-level locking and transactions:

##### BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;

```
-- This locks the product row
SELECT inventory_count FROM products WHERE product_id = 123 FOR UPDATE;
```
```
IF inventory_count >= requested_quantity THEN
-- Decrement inventory atomically
UPDATE products
SET inventory_count = inventory_count - requested_quantity
WHERE product_id = 123;
```
```
-- Create order
INSERT INTO order_items (...);
COMMIT;
ELSE
ROLLBACK;
RETURN 'Out of stock';
END IF;
```
#### Only ONE transaction can hold the lock at a time. Other 999 requests wait. First

#### one succeeds, others get ‘Out of stock’. This is why Black Friday sales on Amazon

#### don’t oversell - SQL’s locking prevents it."

#### 3. Enterprise Applications (Salesforce, SAP, Oracle ERP)

#### Why SQL:

#### Complex business logic with many relationships

#### Multi-table joins for comprehensive reporting

#### Data integrity critical for business operations

#### Regulatory compliance (SOX, GDPR)


## 4.2 NoSQL Databases - Flexibility and

## Scale

### Document Databases (MongoDB, CouchDB)

#### When to Use:

#### 1. Content Management Systems (WordPress, Medium, Ghost)

#### Why Document DB:

#### Schema flexibility (blog posts vs pages vs products all different)

#### Nested data (comments, tags, metadata) stored together

#### Easy to evolve structure as requirements change

#### No need for complex joins to retrieve a post

#### Example Document:

##### {

```
"_id": "post_12345",
"title": "System Design Patterns",
"author": {
"user_id": "user_789",
"name": "Sarah Johnson",
"avatar_url": "https://cdn.example.com/avatars/sarah.jpg",
"bio": "Senior engineer at TechCorp"
},
"content": "Full article text here...",
"tags": ["system-design", "architecture", "databases"],
"metadata": {
"word_count": 2500,
"read_time_minutes": 10,
"seo_title": "...",
"seo_description": "..."
},
"comments": [
{
```

```
"comment_id": "comment_1",
"user_id": "user_456",
"text": "Great article!",
"created_at": "2024-11-25T10:30:00Z",
"likes": 5,
"replies": [
{
"comment_id": "comment_2",
"user_id": "user_789",
"text": "Thanks!",
"created_at": "2024-11-25T11:00:00Z"
}
]
}
],
"reactions": {
"likes": 1250,
"shares": 45,
"bookmarks": 89
},
"published_at": "2024-11-25T09:00:00Z",
"updated_at": "2024-11-26T14:30:00Z"
}
```
#### Why This Works:

```
Single query retrieves entire post with:
```
- Author information
- All comments and nested replies
- Tags and metadata
- Engagement metrics

```
In SQL, this would require 5+ joins:
```
- Posts table
- Users table (for author)
- Comments table
- Tags table
- Post_tags join table
- Reactions table


```
MongoDB: 1 query, 5ms
SQL: 5 joins, 50-100ms
```
#### Interview Example: "For designing a blogging platform like Medium, I’d use

#### MongoDB because:

#### 1. Each article has unique structure (some have code blocks, some have

#### images, some have embedded videos)

#### 2. Denormalizing author data with each post avoids join overhead

#### 3. Nested comments eliminate recursive joins

#### 4. Easy to add new fields (podcast_url, sponsors) without schema migration

#### 5. Can scale horizontally by sharding on author_id or publication_id"

#### 2. Product Catalogs (Amazon, eBay)

#### Why Document DB:

#### Different product categories have wildly different attributes

#### Flexible schema allows easy addition of new product types

#### Fast retrieval of complete product information

#### Example - Different Products:

```
// Electronics - Laptop
{
"_id": "prod_laptop_123",
"category": "electronics",
"type": "laptop",
"brand": "Dell",
"model": "XPS 15",
"price": 1899.99,
"specs": {
"processor": "Intel Core i7-11800H",
"ram": "32GB DDR4",
"storage": "1TB NVMe SSD",
"display": "15.6\" 4K OLED",
"graphics": "NVIDIA RTX 3050 Ti",
"battery_life": "8 hours",
"weight": "4.31 lbs",
```

"ports": ["USB-C", "Thunderbolt 4", "HDMI 2.0", "SD Card"]
},
"warranty_years": 1,
"reviews_count": 342,
"average_rating": 4.6
}

// Clothing - Shirt
{
"_id": "prod_shirt_456",
"category": "clothing",
"type": "shirt",
"brand": "Nike",
"name": "Dri-FIT Training Top",
"price": 45.99,
"attributes": {
"material": "100% Polyester",
"fit": "Athletic",
"collar": "Crew neck",
"sleeve_length": "Short",
"care_instructions": "Machine wash cold"
},
"available_sizes": ["S", "M", "L", "XL", "XXL"],
"colors": [
{"name": "Black", "hex": "#000000", "inventory": 45},
{"name": "Navy", "hex": "#000080", "inventory": 23},
{"name": "Red", "hex": "#FF0000", "inventory": 12}
],
"reviews_count": 128,
"average_rating": 4.3
}

// Books
{
"_id": "prod_book_789",
"category": "books",
"type": "paperback",
"title": "Designing Data-Intensive Applications",
"author": "Martin Kleppmann",
"publisher": "O'Reilly Media",
"isbn": "978-1449373320",
"price": 49.99,


```
"details": {
"pages": 616,
"language": "English",
"publication_date": "2017-03-16",
"dimensions": "7 x 1.4 x 9.2 inches",
"weight": "2.2 pounds"
},
"genres": ["Computer Science", "Databases", "Distributed Systems"],
"reviews_count": 892,
"average_rating": 4.8
}
```
#### SQL Alternative (Why It’s Painful):

```
-- Would need separate tables for each product type
CREATE TABLE products_electronics (
product_id BIGINT PRIMARY KEY,
-- 50+ columns for various electronics specs
processor VARCHAR(100),
ram VARCHAR(50),
storage VARCHAR(50),
-- Most columns NULL for most products
);
```
```
CREATE TABLE products_clothing (
product_id BIGINT PRIMARY KEY,
-- Completely different set of columns
material VARCHAR(100),
sizes JSON, -- Or separate sizes table
colors JSON, -- Or separate colors table
);
```
```
CREATE TABLE products_books (
product_id BIGINT PRIMARY KEY,
-- Yet another different set
isbn VARCHAR(20),
pages INT,
publisher VARCHAR(100),
);
```

```
-- Querying becomes nightmare:
-- "Get product 123" → Need to check which table it's in!
-- Or use EAV (Entity-Attribute-Value) anti-pattern
```
#### Interview Gold: "For an e-commerce product catalog, MongoDB wins because:

#### 1. Adding new product category (e.g., furniture) doesn’t require schema

#### changes

#### 2. Each product’s full data retrieved in one query (no joins)

#### 3. Full-text search on product descriptions using MongoDB text indexes

#### 4. Can easily add seasonal attributes (is_halloween_special) without ALTER

#### TABLE

#### 5. Sharding by category distributes load effectively"

### Key-Value Stores (Redis, DynamoDB)

#### When to Use:

#### 1. Session Management

#### The Problem:

```
User logs in → Server creates session
Session contains:
```
- user_id
- login_timestamp
- permissions
- shopping_cart
- preferences

```
Without session store:
```
- Store session on application server's memory
- User's next request might hit different server (no session!)
- Solution: Sticky sessions (always route user to same server)
- Problem: Server crashes = all sessions lost

#### Redis Solution:


```
# User logs in
session_data = {
"user_id": 12345,
"email": "sarah@example.com",
"cart_items": ["prod_1", "prod_2", "prod_3"],
"preferences": {"language": "en", "currency": "USD"}
}
```
```
# Store in Redis with 1-hour expiration
redis.setex(
key="session:abc123xyz", # session token
time=3600, # expires in 1 hour
value=json.dumps(session_data)
)
```
```
# Later, on any server
session = redis.get("session:abc123xyz")
if session:
user_data = json.loads(session)
# User authenticated
else:
# Session expired or doesn't exist, redirect to login
```
#### Why Redis:

```
Speed: <1ms latency (in-memory)
Expiration: Automatically deletes old sessions (TTL)
Shared: All application servers access same Redis
Persistence: Can save to disk periodically (if configured)
Scale: Can handle millions of sessions
```
#### Interview Answer: "For a system like Amazon with 200M daily users, I’d use Redis

#### Cluster for session management:

#### 1. Sessions stored in Redis with 30-minute sliding expiration

#### 2. Every user action refreshes the expiration

#### 3. Redis Cluster sharded by session_id for horizontal scaling

#### 4. 500 Redis nodes, each handling 400K sessions


#### 5. AOF (Append-Only File) persistence for disaster recovery

#### 6. Replicated across 3 availability zones for high availability This provides <2ms

#### session lookup latency and can scale indefinitely."

#### 2. Rate Limiting

#### The Problem:

```
Protect API from abuse
Example: Allow 1000 requests per user per hour
```
#### Redis Implementation:

```
def is_rate_limited(user_id):
key = f"rate_limit:{user_id}:{current_hour}"
```
```
# Increment counter
count = redis.incr(key)
```
```
# Set expiration on first request
if count == 1:
redis.expire(key, 3600) # 1 hour
```
```
# Check limit
if count > 1000:
return True # Rate limited
return False # Allow request
```
```
# Usage
if is_rate_limited(user_123):
return "429 Too Many Requests"
else:
process_request()
```
#### Advanced - Sliding Window:

```
# More accurate rate limiting
def is_rate_limited_sliding(user_id, limit=1000, window=3600):
```

```
key = f"rate_limit:{user_id}"
now = time.time()
```
```
# Remove requests older than window
redis.zremrangebyscore(key, 0, now - window)
```
```
# Count requests in window
count = redis.zcard(key)
```
```
if count >= limit:
return True
```
```
# Add current request
redis.zadd(key, {str(now): now})
redis.expire(key, window)
```
```
return False
```
#### Interview Example: "For Twitter’s API, I’d implement tiered rate limiting using

#### Redis:

#### 1. Free tier: 300 requests/15 minutes per user

#### 2. Pro tier: 900 requests/15 minutes

#### 3. Enterprise: 30,000 requests/15 minutes

#### Implementation:

#### Redis sorted sets for sliding window

#### Key: rate_limit:{tier}:{user_id}

#### Store timestamp of each request

#### Remove requests older than 15 minutes

#### Count remaining requests in set

#### O(log N) performance with sorted sets

#### This scales to billions of API calls per day with consistent <1ms overhead per

#### request."

#### 3. Leaderboards (Gaming, Sports Apps)

#### The Problem:


```
Real-time leaderboard for 10 million players
Must show:
```
- Top 100 players globally
- Player's current rank
- Players around user's rank

```
Updates: Millions of score updates per minute
Queries: Millions of "What's my rank?" per minute
```
#### Redis Sorted Sets Solution:

```
# Player scores update
redis.zadd("leaderboard", {
"player_123": 9500, # player_id: score
"player_456": 8700,
"player_789": 12000,
# ... millions more
})
```
```
# Get top 10 players
top_10 = redis.zrevrange("leaderboard", 0, 9, withscores=True)
# Returns: [(player_789, 12000), (player_123, 9500), ...]
# Time: O(log N + 10) ≈ O(log N)
```
```
# Get player's rank (1-indexed)
rank = redis.zrevrank("leaderboard", "player_123") + 1
# Returns: 2 (player_123 is #2)
# Time: O(log N)
```
```
# Get players around user
# User is rank 5234, show ranks 5229-5239
players_around = redis.zrevrange("leaderboard", 5228, 5238, withscores=T
# Time: O(log N + 11)
```
```
# Increment player's score
redis.zincrby("leaderboard", 100, "player_123") # Add 100 points
# Time: O(log N)
```
#### Why This is Magical:


```
10 million players
All operations: O(log N) = O(log 10,000,000) ≈ 23 steps
Operations per second: 100,000+ (single Redis instance)
```
```
SQL Alternative:
SELECT COUNT(*) FROM scores WHERE score > my_score;
This is O(N) → scans entire table → 10 million rows → seconds
```
```
Redis: milliseconds
SQL: seconds
```
#### Interview Answer: "For a mobile game with 50M players like Candy Crush, I’d use

#### Redis sorted sets for leaderboards:

#### Global Leaderboard:

#### Key: leaderboard:global

#### 50M entries, but queries are O(log N)

#### Top 100: 2ms

#### Player rank lookup: 1ms

#### Update score: 1ms

#### Regional Leaderboards:

#### Key: leaderboard:{region}

#### Shard by geographic region

#### Reduces dataset size, faster queries

#### Time-based Leaderboards:

#### Daily: leaderboard:2024-11-30 (expires after 7 days)

#### Weekly: leaderboard:week-48-2024

#### All-time: leaderboard:global

#### This architecture handles 1M score updates/second and 10M rank queries/second

#### with <3ms latency using Redis Cluster with 100 shards."

#### 4. Caching Database Queries


#### The Problem:

```
-- Expensive query (takes 500ms)
SELECT u.*, COUNT(p.post_id) as post_count, COUNT(f.follower_id) as foll
FROM users u
LEFT JOIN posts p ON u.user_id = p.user_id
LEFT JOIN followers f ON u.user_id = f.following_id
WHERE u.user_id = 12345
GROUP BY u.user_id;
```
#### Redis Cache Solution:

```
def get_user_profile(user_id):
cache_key = f"user:profile:{user_id}"
```
```
# Try cache first
cached = redis.get(cache_key)
if cached:
return json.loads(cached) # 1ms
```
```
# Cache miss - query database
profile = db.execute_query(expensive_sql) # 500ms
```
```
# Store in cache for 5 minutes
redis.setex(cache_key, 300, json.dumps(profile))
```
```
return profile
```
```
# First request: 500ms (database)
# Next 100,000 requests in 5 minutes: 1ms each (cache)
# Cache hit rate: 99.999%
```
#### Cache Invalidation:

```
# When user posts new content
def create_post(user_id, content):
# Create post in database
db.insert_post(user_id, content)
```

```
# Invalidate cached profile (post_count changed)
redis.delete(f"user:profile:{user_id}")
```
```
# Next request will fetch fresh data
```
```
# OR update cache directly
def create_post_optimized(user_id, content):
db.insert_post(user_id, content)
```
```
# Update cache
profile = redis.get(f"user:profile:{user_id}")
if profile:
profile_data = json.loads(profile)
profile_data['post_count'] += 1
redis.setex(f"user:profile:{user_id}", 300, json.dumps(profile_d
```
#### Interview Answer: "For Instagram’s user profiles, I’d implement Redis caching:

#### Cold cache (first load):

#### 1. Query PostgreSQL for user data

#### 2. Query for post count, follower count

#### 3. Generate profile JSON

#### 4. Store in Redis with 10-minute TTL Total: 200ms

#### Warm cache (subsequent loads):

#### 1. Redis lookup Total: 2ms

#### For 200M daily users:

#### 80% cache hit rate

#### 160M requests served from cache (2ms each)

#### 40M requests hit database (200ms each)

#### Average latency: (160M × 2ms + 40M × 200ms) / 200M = 41.6ms

#### Without cache: 200ms average

#### Cache invalidation strategy:


#### On profile edit: immediate invalidation

#### On new post: increment cached counter

#### On follower change: invalidate follower count

#### TTL: 10 minutes (prevents stale data)

#### This reduces database load by 80% and improves user experience 5x."

### Column-Family Databases (Cassandra, HBase)

#### When to Use:

#### 1. Time-Series Data (IoT, Metrics, Logs)

#### The Problem:

```
10 million smart thermostats
Each sends data every minute:
```
- Temperature
- Humidity
- Power consumption
- User preferences

```
Data points per day:
10M devices × 1440 minutes = 14.4 billion rows/day
Per year: 5.256 trillion rows
```
```
SQL database would:
```
- Become impossibly large
- Queries would take forever
- Sharding would be nightmare

#### Cassandra Solution:

#### Schema Design:

```
CREATE TABLE device_readings (
device_id UUID,
```

```
reading_time TIMESTAMP,
temperature FLOAT,
humidity FLOAT,
power_consumption FLOAT,
PRIMARY KEY ((device_id), reading_time)
) WITH CLUSTERING ORDER BY (reading_time DESC);
```
```
-- Explanation:
-- Partition key: device_id (all readings for one device stored together
-- Clustering key: reading_time (sorted within partition)
```
#### How It Works:

```
Device device_12345's data:
Partition: device_12345
├── 2024-11-30 14:59:00 → temp: 72°F, humidity: 45%, power: 2.1kW
├── 2024-11-30 14:58:00 → temp: 72°F, humidity: 44%, power: 2.0kW
├── 2024-11-30 14:57:00 → temp: 71°F, humidity: 44%, power: 1.9kW
└── ... (sorted by time, newest first)
```
```
Device device_67890's data:
Partition: device_67890
├── 2024-11-30 14:59:00 → temp: 68°F, humidity: 50%, power: 1.8kW
└── ...
```
```
Each partition is independent
Distributed across cluster nodes
```
#### Query Patterns:

```
-- Get last 24 hours for device (ultra fast - single partition)
SELECT * FROM device_readings
WHERE device_id = device_12345
AND reading_time >= '2024-11-29 15:00:00'
AND reading_time <= '2024-11-30 15:00:00';
-- Time: 50ms (reads from one node)
```
```
-- Get latest reading for device (instant)
SELECT * FROM device_readings
```

```
WHERE device_id = device_12345
LIMIT 1;
-- Time: 5ms (data sorted, returns first row)
```
#### Why Cassandra Wins:

```
Write Performance:
```
- Append-only writes (no update-in-place)
- 10,000+ writes/second per node
- 1000 nodes = 10 million writes/second

```
Read Performance:
```
- Data collocated by device_id (no scans)
- Time-sorted within partition
- Query one node, not entire cluster

```
Scalability:
```
- Add nodes linearly to increase capacity
- No master/slave (peer-to-peer)
- No single point of failure

```
Storage Efficiency:
```
- Column compression (temperature values similar)
- Time-series optimized storage engine
- Automatic data compaction

#### Interview Example: "For Tesla’s fleet telemetry (1 million vehicles sending data

#### every second), I’d use Cassandra:

#### Data volume:

#### 1M vehicles × 86,400 seconds/day × 50 metrics = 4.32 trillion data

#### points/day

#### Schema:

```
CREATE TABLE vehicle_telemetry (
vehicle_id UUID,
```

```
metric_time TIMESTAMP,
speed FLOAT,
battery_level FLOAT,
location GEO_POINT,
-- ... 50 more metrics
PRIMARY KEY ((vehicle_id, date), metric_time)
) WITH CLUSTERING ORDER BY (metric_time DESC);
```
#### Partition by (vehicle_id, date) keeps daily data together Each partition ~86,400

#### rows (manageable size) Queries for “vehicle X today” hit single partition

#### Architecture:

#### 500-node Cassandra cluster

#### Replication factor: 3 (data stored on 3 nodes)

#### 2,880 writes/second per node (easily handled)

#### 1PB total storage (2GB per node)

#### Multi-region for global fleet

#### This handles massive write throughput while maintaining query performance."

#### 2. Analytics and Logging (Application Logs, User Activity)

#### Schema Example:

```
CREATE TABLE application_logs (
application_id UUID,
log_date DATE,
log_timestamp TIMESTAMP,
severity VARCHAR,
message TEXT,
user_id UUID,
request_id UUID,
PRIMARY KEY ((application_id, log_date), log_timestamp)
);
```
```
-- Query logs for specific app on specific day
SELECT * FROM application_logs
WHERE application_id = app_123
```

```
AND log_date = '2024-11-30'
AND log_timestamp >= '2024-11-30 10:00:00'
AND log_timestamp <= '2024-11-30 11:00:00';
```
### Graph Databases (Neo4j, Amazon Neptune)

#### When to Use:

#### 1. Social Networks (Facebook, LinkedIn, Twitter)

#### The Problem - Friend Recommendations:

```
Find "people you may know":
```
- Friends of friends
- Who went to your school
- Who work at your company
- Who live in your city
- With at least 3 mutual friends

#### SQL Attempt (Why It Fails):

```
-- Find friends of friends
SELECT DISTINCT f2.friend_id
FROM friendships f1
JOIN friendships f2 ON f1.friend_id = f2.user_id
WHERE f1.user_id = 12345 -- Your ID
AND f2.friend_id != 12345 -- Not yourself
AND f2.friend_id NOT IN (
SELECT friend_id FROM friendships WHERE user_id = 12345
); -- Not already friends
```
```
-- This query:
-- 1. Scans entire friendships table multiple times
-- 2. Requires complex joins
-- 3. Takes seconds for large networks
-- 4. Can't easily add more criteria (school, company, city)
```

#### Neo4j Graph Solution:

#### Data Model:

```
Nodes:
```
- User(id, name, city, company)
- School(id, name)
- Company(id, name)

```
Relationships:
```
- (User)-[:FRIENDS_WITH]->(User)
- (User)-[:ATTENDED]->(School)
- (User)-[:WORKS_AT]->(Company)
- (User)-[:LIVES_IN]->(City)

#### Query (Cypher):

```
// Find friend recommendations
MATCH (me:User {id: 12345})-[:FRIENDS_WITH]-(friend)-[:FRIENDS_WITH]-(su
WHERE NOT (me)-[:FRIENDS_WITH]-(suggestion)
AND me <> suggestion
WITH suggestion, COUNT(friend) as mutual_friends
WHERE mutual_friends >= 3
MATCH (suggestion)-[:WORKS_AT]->(company)<-[:WORKS_AT]-(me)
OR (suggestion)-[:ATTENDED]->(school)<-[:ATTENDED]-(me)
RETURN suggestion.name, mutual_friends, company.name, school.name
ORDER BY mutual_friends DESC
LIMIT 10;
```
```
// This query:
// 1. Traverses graph naturally (no table scans)
// 2. Executes in milliseconds (even with millions of users)
// 3. Easy to add criteria (just add more MATCH clauses)
```
#### Why Graph DB Wins:

```
Social network with 1 billion users:
```

##### SQL:

- friendships table: 50 billion rows (50 friends average)
- Query "friends of friends": 6+ self-joins
- Time: 10-30 seconds (with indexes)
- Doesn't scale

```
Neo4j:
```
- Same data as graph
- Query "friends of friends": simple traversal
- Time: 50-200 milliseconds
- Scales linearly (add more graph nodes)

#### Interview Example: "For LinkedIn’s ‘People You May Know’, I’d use Neo4j:

#### Graph structure:

```
// People
(alice:Person {id: 1, name: "Alice", title: "Engineer"})
(bob:Person {id: 2, name: "Bob", title: "Designer"})
(charlie:Person {id: 3, name: "Charlie", title: "Engineer"})
```
```
// Connections
(alice)-[:CONNECTED]->(bob)
(bob)-[:CONNECTED]->(charlie)
```
```
// Experiences
(alice)-[:WORKS_AT]->(google:Company)
(charlie)-[:WORKS_AT]->(google)
(alice)-[:ATTENDED]->(stanford:School)
(charlie)-[:ATTENDED]->(stanford)
```
#### Recommendation algorithm:

#### 1. Find 2nd-degree connections (friends of connections)

#### 2. Calculate mutual connections

#### 3. Boost by shared attributes:

#### Same company: +10 points

#### Same school: +8 points


#### Same role: +5 points

#### Same city: +3 points

#### 4. Return top 50 ranked by score

#### Query performance:

#### 500M users

#### Average 500 connections per person

#### 2nd-degree network: 250,000 people

#### Query time: 100-300ms (graph traversal)

#### Update in real-time as connections change

#### Could NOT achieve this performance with SQL."

#### 2. Fraud Detection (Banking, E-commerce)

#### The Problem:

```
Detect fraudulent credit card transactions:
```
- Same card used in different countries within 1 hour
- Card linked to multiple suspicious accounts
- Accounts sharing same device fingerprint
- Unusual patterns in transaction graph

#### Graph Model:

```
Nodes:
```
- Card(number, issuer)
- Transaction(id, amount, timestamp, location)
- Account(id, email, phone)
- Device(fingerprint, ip_address)
- Merchant(id, name, category)

```
Relationships:
```
- (Card)-[:USED_IN]->(Transaction)
- (Account)-[:OWNS]->(Card)
- (Device)-[:USED_BY]->(Account)


- (Transaction)-[:AT_MERCHANT]->(Merchant)
- (Account)-[:TRANSFERRED_TO]->(Account)

#### Fraud Detection Queries:

```
// Find card velocity fraud (same card, different locations)
MATCH (card:Card)-[:USED_IN]->(t1:Transaction),
(card)-[:USED_IN]->(t2:Transaction)
WHERE t1.timestamp < t2.timestamp
AND duration.between(t1.timestamp, t2.timestamp).minutes < 60
AND distance(t1.location, t2.location) > 1000 // km
RETURN card, t1, t2;
```
```
// Find accounts in fraud ring (shared devices/cards)
MATCH (suspicious:Account)
WHERE suspicious.marked_fraud = true
MATCH path = (suspicious)-[:OWNS|USED_BY*1..3]-(connected:Account)
WHERE connected.marked_fraud = false
RETURN connected, length(path) as degrees_of_separation
ORDER BY degrees_of_separation;
```
```
// Find unusual transaction patterns
MATCH (account:Account)-[:OWNS]->(card:Card)-[:USED_IN]->(txn:Transactio
WHERE txn.timestamp > datetime() - duration('PT24H') // Last 24 hours
WITH account, COUNT(txn) as txn_count, SUM(txn.amount) as total_amount
WHERE txn_count > account.avg_daily_transactions * 5
OR total_amount > account.avg_daily_amount * 10
RETURN account;
```
#### Interview Answer: "For a payment processor like Stripe detecting fraud, Neo4j

#### excels:

#### Real-time fraud detection:

#### 1. Transaction arrives → Immediately query graph

#### 2. Check for patterns:

#### Card used in 2+ countries within 1 hour

#### Account shares device with known fraudsters


#### Unusual merchant category for this user

#### Transaction amount 10x higher than average

#### 3. Score risk (0-100)

#### 4. If score > 80: Block transaction

#### 5. If score 50-80: Require 2FA

#### 6. If score < 50: Allow

#### Graph advantages:

#### Multi-hop queries (find fraud rings 3 levels deep)

#### Real-time pattern matching

#### Easy to add new fraud rules (just new Cypher patterns)

#### Visualize fraud networks for investigation

#### Performance:

#### 10,000 transactions/second

#### Fraud check: 20-50ms per transaction

#### Can examine 3-hop neighborhood (millions of relationships)

#### Scales horizontally with graph sharding

#### This catches 95% of fraud compared to 60% with rule-based SQL systems."

## 4.3 SQL vs NoSQL - The Critical

## Interview Decision

#### [Content continues with SQL vs NoSQL decision framework, data replication

#### strategies, sharding deep-dive with consistent hashing, database indexing with B-

#### trees, and ACID transactions with isolation levels - all the detailed content I

#### prepared will be added]

## 4.3 SQL vs NoSQL - The Critical

## Interview Decision


### Decision Framework - When Interviewers Ask “Which Database?”

#### This is one of the most common interview questions. Here’s how to nail it:

#### Step 1: Understand the Data

```
Questions to ask yourself:
```
- Is the schema fixed or flexible?
- Are relationships between entities important?
- Is the data structured or unstructured?

#### Step 2: Understand the Access Patterns

- Mostly reads or mostly writes?
- Simple lookups or complex queries?
- Real-time or batch processing?
- Point queries or range scans?

#### Step 3: Understand the Scale

- Millions of rows or billions?
- Can it fit on one machine?
- Global distribution needed?

#### Step 4: Understand Consistency Requirements

- Financial data (must be exact)?
- Social data (eventual consistency OK)?
- Regulatory requirements?

### Interview Answer Template

#### Question : “Design Instagram. Which database would you use?”

#### Perfect Answer : "I’d use a polyglot persistence approach with multiple databases:


#### 1. PostgreSQL for Core User Data:

#### User accounts, authentication, settings

#### Needs strong consistency (can’t have duplicate usernames)

#### Complex queries for admin dashboards

#### ACID compliance for security

#### 2. Cassandra for Posts and Feeds:

#### Billions of posts, high write throughput

#### Timeline queries (user X’s posts)

#### Partitioned by user_id

#### Eventual consistency acceptable

#### Horizontal scalability for growth

#### 3. Redis for Caching:

#### User sessions

#### Feed cache (recent posts)

#### Like/comment counts (high read/write)

#### Sub-millisecond latency

#### 4. Elasticsearch for Search:

#### Full-text search across posts, hashtags, users

#### Complex filtering (location, date range)

#### Real-time indexing

#### 5. Neo4j for Social Graph:

#### Follow relationships

#### Friend recommendations

#### Influence analysis

#### Graph traversal queries

#### This approach uses each database’s strengths while accepting trade-offs in

#### complexity."


## 4.4 Data Replication - Ensuring

## Availability and Performance

### Why Replication Matters

#### The Three Goals:

#### 1. High Availability : System works even when servers fail

#### 2. Geographic Distribution : Serve users from nearby data centers

#### 3. Read Scalability : Distribute read load across multiple servers

### Master-Slave (Primary-Replica) Replication

#### Architecture:

```
Master (Primary)
|
All Writes Here
|
┌──────────────┼──────────────┐
▼ ▼ ▼
Replica 1 Replica 2 Replica 3
(Read-Only) (Read-Only) (Read-Only)
| | |
Serve Reads Serve Reads Serve Reads
```
#### Synchronous Replication:

```
def write_data(data):
master.write(data)
```
```
# Wait for ALL replicas to acknowledge
replica1.write(data) # Block until done
replica2.write(data) # Block until done
replica3.write(data) # Block until done
```

```
return "Success"
```
```
Advantages:
```
- Strong consistency (all replicas have latest data)
- No data loss if master fails

```
Disadvantages:
```
- Slow (limited by slowest replica)
- One slow/failed replica blocks all writes
- Higher latency

```
Use when: Financial transactions, critical data
```
#### Asynchronous Replication:

```
def write_data(data):
master.write(data)
```
```
# Queue replication jobs, don't wait
replication_queue.send(data, replica1)
replication_queue.send(data, replica2)
replication_queue.send(data, replica3)
```
```
return "Success" # Return immediately
```
```
Advantages:
```
- Fast writes (don't wait for replicas)
- Replica failures don't impact writes
- Can replicate across regions

```
Disadvantages:
```
- Replicas lag behind master (replication lag)
- Recent writes lost if master fails
- Reads from replica might be stale

```
Use when: Social media, analytics, non-critical updates
```
#### Real-World Example - Facebook:


```
Architecture:
```
- 1 Master in California
- 20+ Replicas (US East, US West, Europe, Asia)

```
Write path:
```
1. User posts photo → Master (50ms)
2. Master confirms write immediately
3. Async replication to replicas (200-500ms lag)

```
Read path:
```
1. User in Japan loads feed
2. Routed to Tokyo replica
3. Sees posts with ~300ms lag (acceptable)

```
Trade-off: Fast writes + eventual consistency
```
#### Handling Replica Lag:

#### Problem:

```
10:00:00 - User posts "Hello World" to Master
10:00:01 - Write confirmed, user redirected to feed
10:00:01 - User reads from Replica (hasn't replicated yet)
Result: User doesn't see their own post!
```
#### Solution 1: Read-Your-Writes Consistency

```
def get_user_feed(user_id, requesting_user_id):
# For user's own posts, read from master
if requesting_user_id == user_id:
return master.query(...)
else:
# Others' posts can come from replica
return replica.query(...)
```
#### Solution 2: Timestamp-Based Routing


```
def read_data(last_write_timestamp):
for replica in replicas:
if replica.replication_lag < (now() - last_write_timestamp):
return replica.query(...)
```
```
# All replicas lagging, use master
return master.query(...)
```
### Master-Master (Multi-Master) Replication

#### Architecture:

```
Master 1 (US) <──────> Master 2 (EU) <──────> Master 3 (Asia)
| | |
Accepts Writes Accepts Writes Accepts Writes
| | |
Replicates <─────────────┴──────────────────────┘
```
#### Conflict Resolution - The Hard Problem:

#### Scenario: Concurrent Updates

```
Time 10:00:00 (US):
UPDATE users SET email = 'new@example.com' WHERE user_id = 123;
```
```
Time 10:00:00 (EU, simultaneously):
UPDATE users SET email = 'different@example.com' WHERE user_id = 123;
```
```
Which email wins?
```
#### Strategy 1: Last Write Wins (LWW)

```
us_write = {"email": "new@example.com", "timestamp": 1701345600.123}
eu_write = {"email": "different@example.com", "timestamp": 1701345600.45
```
```
# EU write has later timestamp, it wins
```

```
final_value = "different@example.com"
```
```
Problem: Clock synchronization issues
Solution: Logical clocks (Lamport timestamps, Vector clocks)
```
#### Strategy 2: Application-Level Resolution

```
conflicted_record = {
"user_id": 123,
"email_versions": [
{"value": "new@example.com", "source": "us", "ts": "..."},
{"value": "different@example.com", "source": "eu", "ts": "..."}
],
"needs_resolution": True
}
```
```
# Show both to user or use business logic
```
#### Strategy 3: Commutative Operations

```
# Instead of SET (non-commutative)
# Use operations that work in any order
```
```
INCREMENT like_count BY 1 (Master 1)
INCREMENT like_count BY 1 (Master 2)
# Result: +2 regardless of order
```
```
ADD_TO_CART(item_X) (Master 1)
ADD_TO_CART(item_Y) (Master 2)
# Result: Cart has {item_X, item_Y}
```
#### Interview Example: "For Notion (collaborative docs), I’d use multi-master with

#### CRDTs:

#### Masters in 5 regions

#### Each accepts writes locally (<50ms latency)

#### CRDTs merge text edits automatically


#### Character-level tracking prevents conflicts

#### Users get real-time collaboration globally"

## 4.5 Data Partitioning and Sharding -

## Horizontal Database Scaling

### Why Sharding is Essential

#### The Problem:

```
Instagram: 2 billion users
User data: 2B × 10KB = 20TB
Posts: 500B × 2KB = 1PB
```
```
Single PostgreSQL:
```
- Max practical size: 1-2TB
- Backup: days to complete
- Single point of failure

```
Solution: Shard across multiple databases
```
### Sharding Strategies

#### 1. Hash-Based Sharding

#### Algorithm:

```
def get_shard(user_id, num_shards=1024):
return hash(user_id) % num_shards
```
```
# Examples:
user_12345 → shard_789
user_67890 → shard_123
```

#### Distribution:

```
1 billion users across 1024 shards
Expected: ~977,000 users per shard
Actual variance: <1% (excellent)
```
#### Advantages:

#### Perfect load balancing

#### No hotspots

#### Simple implementation

#### Disadvantages:

#### Range queries impossible

#### Resharding painful (changes all mappings)

#### Related data scattered

#### The Resharding Problem:

```
# Initial: 512 shards
user_12345 → hash(12345) % 512 = shard_137
```
```
# Scale to 1024 shards
user_12345 → hash(12345) % 1024 = shard_649 # MOVED!
```
```
# Almost all data must move!
```
#### Resharding Solution:

```
# Phase 1: Dual-Write (Week 1)
def write_user(user_id, data):
old_shard = hash(user_id) % 512
new_shard = hash(user_id) % 1024
```
```
db[old_shard].write(data)
if old_shard != new_shard:
```

```
db[new_shard].write(data)
```
```
# Phase 2: Migrate (Weeks 2-4)
# Background job moves data to new shards
```
```
# Phase 3: Switch Reads (Week 5)
def read_user(user_id):
shard = hash(user_id) % 1024
return db[shard].read(user_id)
```
```
# Phase 4: Cleanup (Week 6)
# Remove old shards
```
#### 2. Range-Based Sharding

#### Algorithm:

```
def get_shard(user_id):
if user_id <= 10_000_000:
return "shard_1"
elif user_id <= 20_000_000:
return "shard_2"
elif user_id <= 30_000_000:
return "shard_3"
else:
return "shard_4"
```
#### Advantages:

#### Range queries efficient

#### Related data together

#### Easy to add shards

#### Disadvantages:

#### Hotspot Problem:


```
Shard 1 (old users): 100 RPS
Shard 2 (old users): 150 RPS
Shard 3 (old users): 200 RPS
Shard 4 (new users): 10,000 RPS ← HOTSPOT!
```
#### Hybrid Solution:

```
def get_shard(user_id):
# Combine range + hash
if user_id <= 10_000_000:
base = 0 # Old users
else:
base = 512 # New users
```
```
offset = hash(user_id) % 512
return base + offset
```
```
# Old users: shards 0-511 (evenly distributed)
# New users: shards 512-1023 (evenly distributed)
```
#### 3. Consistent Hashing - The Gold Standard

#### The Problem:

```
Regular hashing:
```
- 100 servers
- Add 1 server (101 total)
- 99% of data moves!

```
Consistent hashing:
```
- Add 1 server
- Only 1% moves (1/101)

#### How It Works:

#### Step 1: Hash Ring (0 to 2³²-1)


##### 0/MAX

##### |

```
Virtual Nodes
/ \
ServerA ServerB
\ /
\ /
ServerC
|
MID
```
#### Step 2: Virtual Nodes

```
# Each server → 150 virtual nodes
for server in ["ServerA", "ServerB", "ServerC"]:
for i in range(150):
vnode = f"{server}_vnode_{i}"
position = hash(vnode) % 2**32
ring.add(vnode, position)
```
```
# Ring has 450 points (evenly distributed)
```
#### Step 3: Data Placement

```
def get_server(key):
position = hash(key) % 2**32
```
```
# Find next server clockwise
for server in sorted_servers:
if server.position >= position:
return server
```
```
return sorted_servers[0] # Wrap around
```
#### Adding a Server:


```
Before (3 servers):
Each handles ~33% of data
```
```
Add Server D:
```
- Only data between C and D moves
- Other data stays put
- Moves: ~25% of data (1/4)

```
Regular hashing would move 75%!
```
#### Real-World - DynamoDB:

- Uses consistent hashing
- 128-256 virtual nodes per server
- Add capacity: minimal data movement
- Proven at Amazon scale

#### Interview Answer: "For Netflix’s distributed cache (500M users), I’d use consistent

#### hashing:

#### 1,000 Memcached servers

#### Each server: 200 virtual nodes

#### 200,000 total ring positions

#### Each virtual node: ~2,500 users

#### Benefits:

#### Add server: only 0.1% data moves

#### Server failure: load spreads evenly

#### Geographic sharding possible

#### Implementation handles millions of cache requests per second with <2ms

#### latency."


## 4.6 Database Indexing - Making

## Queries Fast

### Why Indexes Matter

#### Without Index:

```
SELECT * FROM users WHERE email = 'sarah@example.com';
```
```
Process:
```
1. Scan every row (FULL TABLE SCAN)
2. Check if email matches
3. Return matches

```
Time: O(N) - 10M users = 5-10 seconds
```
#### With Index:

```
CREATE INDEX idx_users_email ON users(email);
```
```
Process:
```
1. B-tree lookup (O(log N))
2. Get row pointer
3. Fetch row

```
Time: O(log N) - 10M users = 10-20ms
500x faster!
```
### B-Tree Index Structure

```
[m|s]
/ | \
[a|f|k] [m|p|r] [s|w|z]
/ | \ / | \ / | \
```

```
[a.][f.][k.][m.][p.][r.][s.][w.][z.]
↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓
rows rows rows rows rows rows rows rows
```
#### Search Process:

```
Find "sarah@example.com":
```
```
Step 1: Root [m|s]
```
- "sarah" starts with 's'
- Go right

```
Step 2: Node [s|w|z]
```
- "sarah" between 's' and 'w'
- Go left

```
Step 3: Leaf [s...]
```
- Binary search
- Found! Get row pointer

```
Total: ~3-4 steps for millions of rows
```
### Types of Indexes

#### 1. Composite Index

```
CREATE INDEX idx_posts_user_time ON posts(user_id, created_at);
```
```
-- Works for:
✅ WHERE user_id = 100
✅ WHERE user_id = 100 AND created_at > '2024-01-01'
✅ WHERE user_id = 100 ORDER BY created_at
```
```
-- Doesn't work for:
❌ WHERE created_at > '2024-01-01' (missing leftmost)
```
#### Leftmost Prefix Rule:


```
Index (A, B, C) works for:
✅ A
✅ A, B
✅ A, B, C
❌ B
❌ C
❌ B, C
```
#### Interview Example - Twitter:

```
CREATE TABLE tweets (
tweet_id BIGINT PRIMARY KEY,
user_id BIGINT,
created_at TIMESTAMP,
like_count INT
);
```
```
-- Query: "Get user's tweets, newest first"
CREATE INDEX idx_tweets_user_time
ON tweets(user_id, created_at DESC);
```
```
-- Query: "Trending tweets (most liked, recent)"
CREATE INDEX idx_tweets_trending
ON tweets(created_at DESC, like_count DESC);
```
#### 2. Covering Index

```
-- Regular index
CREATE INDEX idx_users_email ON users(email);
```
```
SELECT name FROM users WHERE email = 'alice@example.com';
-- Process: Index lookup + table lookup (2 I/Os)
```
```
-- Covering index
CREATE INDEX idx_users_email_name ON users(email, name);
```
```
SELECT name FROM users WHERE email = 'alice@example.com';
```

```
-- Process: Index lookup only (1 I/O)
-- 2x faster!
```
#### 3. Partial Index

```
-- Index only active users
CREATE INDEX idx_active_users ON users(email)
WHERE status = 'active';
```
```
-- 100M users, 80M active
-- Index 80% smaller
-- Active user queries just as fast
```
#### Use Cases:

```
-- E-commerce: Only pending orders
CREATE INDEX idx_pending_orders ON orders(user_id)
WHERE status = 'pending';
```
```
-- Logs: Only recent data
CREATE INDEX idx_recent_logs ON logs(timestamp)
WHERE timestamp > CURRENT_DATE - 7;
```
```
-- Premium features
CREATE INDEX idx_premium_users ON users(user_id)
WHERE is_premium = TRUE;
```
### Index Trade-offs

#### Costs:

```
Each index adds:
```
- Storage: 10-30% of table size
- Write overhead: Every INSERT/UPDATE updates indexes
- Maintenance: Fragmentation over time

```
For Twitter (500M tweets/day):
```

- 0 indexes: Writes 5ms, reads 5s (unusable)
- 3 indexes: Writes 15ms, reads 10ms (excellent)

```
10ms write penalty worth 500x faster reads!
```
## 4.7 Database Transactions and Isolation

## Levels

### ACID Properties

#### Atomicity - All or Nothing

##### BEGIN TRANSACTION;

```
-- Deduct from Alice
UPDATE accounts SET balance = balance - 500 WHERE user_id = 'alice';
```
```
-- Add to Bob
UPDATE accounts SET balance = balance + 500 WHERE user_id = 'bob';
-- ERROR: Account locked
```
```
ROLLBACK; -- Alice balance restored
```
#### How It Works (Write-Ahead Logging):

1. Transaction starts
2. Write to WAL:
"START TRANSACTION"
"UPDATE accounts..."
"COMMIT"
3. WAL flushed to disk (durable)
4. Then update data pages
5. If crash: replay WAL on restart


#### Isolation Levels

#### Problem: Concurrent Transactions Create Anomalies

#### Dirty Read:

```
Transaction A: Transaction B:
Read balance = $1000
Update balance = $500
Read balance = $500 ← DIRTY!
Rollback
(Read uncommitted data)
```
#### Non-Repeatable Read:

```
Transaction A: Transaction B:
Read balance = $1000
Update balance = $500
Commit
Read balance = $500 ← Different value!
```
#### Phantom Read:

```
Transaction A: Transaction B:
SELECT COUNT(*)
→ 5 orders
INSERT order
Commit
SELECT COUNT(*)
→ 6 orders ← Phantom appeared!
```
### Isolation Levels - Weakest to Strongest

#### Read Uncommitted


##### SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

```
-- Can see uncommitted changes
-- Fastest but dangerous
-- Use: Analytics where approximate OK
```
#### Read Committed (Default)

##### SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

```
-- Only see committed data
-- No dirty reads
-- Allows non-repeatable reads
```
```
-- Use: Most web applications
```
#### Repeatable Read

##### SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;

```
-- Snapshot at transaction start
-- Same query = same result
-- No dirty or non-repeatable reads
```
```
-- Use: Banking, reports
```
#### Serializable (Strongest)

##### SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

```
-- Transactions execute as if serial
-- No anomalies possible
-- Slowest (heavy locking)
```
```
-- Use: Financial transactions, ticket sales
```

#### Interview Example - Ticketmaster:

##### BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;

```
-- Check seat availability
SELECT status FROM seats WHERE seat_id = 'A15';
```
```
-- Reserve seat
UPDATE seats SET status = 'reserved' WHERE seat_id = 'A15';
```
##### COMMIT;

```
-- If two users try simultaneously:
-- First locks seat
-- Second blocks until first commits
-- Prevents double-booking
```
# 5. Consistency and Availability -

# The CAP Theorem

# {#consistency}

## 5.1 Understanding the CAP Theorem

#### The Fundamental Trade-off:

```
In a distributed system with network partitions, choose 2 of 3:
```
```
C - Consistency: All nodes see the same data
A - Availability: Every request gets a response
P - Partition Tolerance: System works despite network failures
```

```
Since network failures are inevitable (P is required),
you must choose between C and A.
```
#### Real-World Visualization:

```
Consistency (C)
▲
|
|
CP Systems| CA Systems
(Banking) | (Not realistic in distributed systems)
|
|
─────────────┼─────────────► Availability (A)
|
AP Systems|
(Social |
Media) |
▼
Partition Tolerance (P)
(Required in distributed systems)
```
### CP Systems - Consistency over Availability

#### When to Choose CP:

#### Money is involved

#### Inventory is limited

#### Data correctness is critical

#### Example 1: Bank Transfer

```
Scenario: Network partition between data centers
```
```
User A (NYC) → Transfer $100 to User B (London)
```
```
CP System Behavior:
```

1. NYC data center receives request
2. Cannot communicate with London (partition)
3. BLOCKS transaction until partition heals
4. User sees error: "Service temporarily unavailable"
5. Money doesn't transfer
6. ✅ Consistency maintained (no duplicate/lost money)
7. ❌ Availability sacrificed (request rejected)

```
Alternative (AP):
```
- Transfer might succeed in NYC but fail in London
- Result: Money deducted but not received (catastrophic!)

#### Example 2: Seat Booking (Airlines)

```
100 seats available on flight
```
```
Scenario: Network partition
```
- NYC sees 100 seats
- London sees 100 seats
- Both try to sell seat 42

```
CP System:
```
1. NYC locks seat 42 globally
2. Cannot sync with London (partition)
3. BLOCKS London transactions
4. NYC completes sale
5. Partition heals
6. London syncs, sees seat 42 sold
7. ✅ No double-booking
8. ❌ London customers got errors

```
AP System:
```
- Both sell seat 42
- Result: Double-booked! Angry customers!

#### Real Implementation - etcd (CP):

```
etcd (Kubernetes config store):
```

- Uses Raft consensus
- Requires majority to accept writes
- If network partition: minority partition REJECTS writes

```
Example:
5-node cluster → need 3 nodes for quorum
Network partition: 3 nodes | 2 nodes
```
```
Majority partition (3 nodes):
```
- ✅ Accepts writes
- ✅ Remains available

```
Minority partition (2 nodes):
```
- ❌ Rejects writes
- ❌ Becomes unavailable
- BUT: ✅ Data stays consistent

#### Interview Answer for CP: "For a stock trading platform, I’d choose CP

#### (consistency over availability):

```
def execute_trade(user_id, stock, quantity, price):
# Start distributed transaction
with distributed_transaction():
# Check balance (must be exact)
balance = get_balance(user_id)
cost = quantity * price
```
```
if balance < cost:
return "Insufficient funds"
```
```
# Deduct money
deduct_balance(user_id, cost)
```
```
# Add shares
add_shares(user_id, stock, quantity)
```
```
# This commits atomically or fails
# If partition occurs, transaction BLOCKS
# Better to fail than have inconsistent money/shares
commit()
```

```
During network partition:
```
- System becomes unavailable (shows error)
- But never shows wrong balance or share count
- Financial regulations require this

#### Justification:

#### Financial accuracy non-negotiable

#### Regulatory compliance requires exact records

#### Users prefer error over wrong balance

#### Can retry after partition heals"

### AP Systems - Availability over Consistency

#### When to Choose AP:

#### Social features (likes, views, follows)

#### User-generated content

#### Analytics and metrics

#### Caches and temporary data

#### Example 1: Facebook Likes

```
Post has 1000 likes
```
```
Scenario: Network partition
```
- US data center: sees 1000 likes, user adds like → 1001
- EU data center: sees 1000 likes, user adds like → 1001
- Both accept writes independently

```
AP System Behavior:
```
1. ✅ Both writes succeed immediately
2. ✅ Users see their likes registered
3. ❌ Temporary inconsistency (both show 1001, should be 1002)
4. Partition heals
5. Conflict resolution: 1001 + 1001 - 1000 = 1002
6. Eventually consistent: both show 1002


```
Why This is OK:
```
- Users care more about responsiveness than exact counts
- Seeing 1001 vs 1002 likes doesn't matter
- System remains available during partition
- Consistency reached eventually

#### Example 2: Shopping Cart

```
User adds items to cart during partition
```
```
AP System:
```
- User in US adds product A
- Partition occurs
- User's session moves to EU server
- User adds product B
- EU server can't see product A yet
- User sees only product B

```
Eventually:
```
- Partition heals
- Cart merges: {product A, product B}
- User sees both (acceptable UX)

```
Alternative (CP):
```
- User adds product B
- System error: "Can't add to cart"
- User frustrated, abandons purchase
- Lost revenue!

#### Real Implementation - Cassandra (AP):

```
Cassandra design:
```
```
Write path:
```
1. Write goes to any node (coordinator)
2. Coordinator replicates to N nodes
3. Returns success after W nodes acknowledge
4. Continues replicating in background


```
Example configuration:
```
- N = 3 (replicate to 3 nodes)
- W = 1 (return success after 1 node)

```
Result:
```
- ✅ Always available (any node can accept writes)
- ❌ Temporary inconsistency (other 2 nodes lag)
- Eventually consistent (background replication)

```
Tunable consistency:
```
- W = 1: Max availability, eventual consistency
- W = 2: Balance
- W = 3: Strong consistency, less availability

#### Interview Answer for AP: "For Twitter’s tweet system, I’d choose AP (availability

#### over consistency):

```
def post_tweet(user_id, content):
# Write to nearest data center
local_datacenter.write({
'tweet_id': generate_id(),
'user_id': user_id,
'content': content,
'timestamp': now()
})
```
```
# Return success immediately
# Don't wait for global replication
```
```
# Background: replicate globally
async_replicate_to_other_datacenters()
```
```
During partition:
```
- US users post to US datacenter
- EU users post to EU datacenter
- Both work independently
- Followers see tweets with slight delay
- Eventually all datacenters sync

```
Why this works:
```

- Tweet posting must be instant (UX critical)
- Followers don't need real-time consistency
- 30-second delay acceptable for global propagation
- Better to have delayed tweets than failed posts

#### Trade-offs accepted:

#### Follower counts might be slightly off

#### Tweet ordering might differ across regions temporarily

#### Duplicate detection might miss some (rare)

#### Trade-offs rejected (CP alternative):

#### Tweet posting fails during partition

#### Users can’t express themselves

#### Platform appears broken

#### Lost engagement and revenue"

## 5.2 Consistency Models - The Spectrum

### Strong Consistency

#### Definition: All reads see the most recent write

#### Example:

```
Time 10:00:00 - Write: balance = $500
Time 10:00:01 - Read from any server: balance = $500
Time 10:00:02 - Write: balance = $600
Time 10:00:03 - Read from any server: balance = $600
```
```
Every read reflects latest write, always
```
#### How to Achieve:


1. Single leader (master)
- All reads/writes go to master
- Replicas only for backup
2. Synchronous replication
- Wait for all replicas before confirming write
- Slow but consistent
3. Consensus protocols (Paxos, Raft)
- Majority agreement required
- Strong consistency guaranteed

#### Use Cases:

#### Financial systems

#### Booking systems

#### Inventory management

### Eventual Consistency

#### Definition: All nodes will eventually converge to same value

#### Example:

```
Time 10:00:00 - Write to Node A: likes = 100
Time 10:00:01 - Read from Node B: likes = 99 (stale)
Time 10:00:02 - Read from Node C: likes = 99 (stale)
Time 10:00:05 - Replication completes
Time 10:00:06 - Read from any node: likes = 100 (consistent)
```
```
Eventually consistent, but temporary inconsistency OK
```
#### Conflict Resolution:

```
Concurrent writes:
```
```
Node A: likes = 100 → 101 (user X likes)
```

```
Node B: likes = 100 → 101 (user Y likes)
```
```
Resolution strategies:
```
1. Last Write Wins: Check timestamp, latest wins (loses one like)
2. Application merge: 101 + 101 - 100 = 102 (correct!)
3. Vector clocks: Track causality, merge intelligently

#### Use Cases:

#### Social media feeds

#### View counts

#### DNS

#### Shopping carts

### Causal Consistency

#### Definition: Operations that are causally related are seen in same order

#### Example:

```
Correct (Causal):
User A: Posts "What's your favorite color?"
User B: Sees post, replies "Blue"
User C: Sees both in order (question then answer)
```
```
Violation (Non-Causal):
User C: Sees "Blue" (reply)
User C: Then sees "What's your favorite color?" (question)
Confusing!
```
```
Causal consistency prevents this
```
#### Implementation - Vector Clocks:

```
# Each post tracks version from each datacenter
post_question = {
'content': "What's your favorite color?",
```

```
'vector_clock': {'US': 1, 'EU': 0, 'Asia': 0}
}
```
```
post_reply = {
'content': "Blue",
'vector_clock': {'US': 1, 'EU': 1, 'Asia': 0},
'caused_by': post_question.id
}
```
```
# When displaying:
def display_posts(posts):
# Sort by causal order
for post in posts:
if post.caused_by:
# Show after causal parent
wait_for(post.caused_by)
display(post)
```
#### Use Cases:

#### Comment threads

#### Collaborative editing

#### Chat applications

### Read-Your-Writes Consistency

#### Definition: User always sees their own updates

#### Example:

```
User posts comment:
```
1. Write to Master: "Great article!"
2. Redirect to feed
3. Read from Replica: ... comment appears
(Even if replica hasn't synced yet)

```
How:
```
- Track user's last write timestamp


- Route reads to servers caught up to that timestamp
- Or read from master for user's own data

#### Implementation:

```
def post_comment(user_id, content):
timestamp = master.write(content)
```
```
# Store in user session
session[user_id]['last_write'] = timestamp
```
```
return timestamp
```
```
def get_comments(user_id):
last_write = session[user_id].get('last_write', 0)
```
```
# Find replica caught up to user's writes
for replica in replicas:
if replica.replication_lag <= (now() - last_write):
return replica.query()
```
```
# All replicas lagging, use master
return master.query()
```
#### Use Cases:

#### Any system where users expect to see their own actions

#### Social media posts

#### Profile updates

#### E-commerce orders

### Monotonic Reads

#### Definition: Once you’ve seen a value, you never see older values

#### Example:


```
Violation:
Time 10:00 - Read from Replica A: likes = 105
Time 10:01 - Read from Replica B: likes = 100 (WENT BACKWARDS!)
```
```
Monotonic Reads:
Time 10:00 - Read from Replica A: likes = 105
Time 10:01 - Read from Replica A: likes = 105 or higher (NEVER LESS)
```
```
Solution: Sticky sessions (always same replica for user)
```
#### Implementation:

```
def get_data(user_id):
# Hash user to replica (sticky)
replica_id = hash(user_id) % num_replicas
```
```
# Always read from same replica
return replicas[replica_id].query()
```
```
# User always sees monotonically increasing values
```
# 6. Caching Strategies - The

# Performance Multiplier

# {#caching}

## 6.1 Why Caching Matters

#### Performance Impact:


```
Without cache:
```
- Database query: 50-200ms
- 1000 RPS → 1000 DB queries/sec
- Database overloaded, queries slow to 500ms+

```
With cache:
```
- Cache hit: 1-5ms
- Cache miss: 50-200ms (then cached)
- 95% cache hit rate
- Effective latency: (0.95 × 2ms) + (0.05 × 100ms) = 6.9ms
- 30x improvement!

#### Cost Impact:

```
Database:
```
- PostgreSQL: 32 cores, 256GB RAM = $500/month
- Handles 5,000 RPS max

```
Cache layer:
```
- Redis: 8 cores, 64GB RAM = $100/month
- Handles 100,000 RPS

```
Serving 50,000 RPS:
```
- No cache: Need 10 DB servers = $5,000/month
- With cache (95% hit): 1 DB + 1 Redis = $600/month

```
8x cost reduction!
```
## 6.2 Cache Levels - Where to Cache

### 1. Client-Side Caching (Browser)

#### HTTP Headers:

```
Cache-Control: max-age=3600, public
ETag: "686897696a7c876b7e"
```

```
Last-Modified: Mon, 25 Nov 2024 10:00:00 GMT
```
```
Client behavior:
```
- Stores response for 1 hour
- Subsequent requests: Check ETag
- If unchanged: 304 Not Modified (no download)
- If changed: 200 OK with new content

#### Use Cases:

```
✅ Static assets (CSS, JS, images)
✅ Product images
✅ User avatars
```
```
❌ User-specific data
❌ Real-time data
❌ Sensitive information
```
### 2. CDN (Content Delivery Network)

#### Architecture:

```
User in Tokyo:
```
- Requests image
- CDN edge server in Tokyo checks cache
- Cache hit: Returns in 10ms
- Cache miss: Fetches from origin (US), caches, returns (200ms)
- Next request: 10ms (cached)

```
Global CDN:
```
- 200+ edge locations
- 95%+ cache hit rate
- Sub-50ms latency worldwide

#### Example - Netflix:


```
Popular show released:
```
1. Pre-push to all CDN edge servers
2. User in Brazil streams
3. CDN in São Paulo serves (15ms)
4. No load on US origin servers

```
1 billion streaming hours/month:
```
- Without CDN: Origin servers crushed
- With CDN: Origin serves 1%, CDN serves 99%

### 3. Application-Level Cache (Redis/Memcached)

#### Architecture:

```
Application Server:
```
1. Receive request
2. Check Redis cache
3. If hit: Return (2ms)
4. If miss: Query database (50ms)
5. Store in cache
6. Return

```
Next requests: Served from cache (2ms)
```
#### What to Cache:

```
# User profiles
cache_key = f"user:profile:{user_id}"
ttl = 600 # 10 minutes
```
```
# Product details
cache_key = f"product:{product_id}"
ttl = 3600 # 1 hour
```
```
# Search results
cache_key = f"search:{query_hash}"
ttl = 300 # 5 minutes
```

```
# Session data
cache_key = f"session:{session_id}"
ttl = 1800 # 30 minutes
```
### 4. Database Query Cache

#### MySQL Query Cache:

```
SELECT * FROM products WHERE category = 'electronics';
-- First execution: 100ms
-- MySQL caches result
```
```
-- Same query again: 5ms (cache hit)
```
```
-- Table updated:
INSERT INTO products VALUES (...);
-- Cache invalidated automatically
```
#### Limitations:

```
❌ Disabled in MySQL 8.0+ (not effective)
❌ Invalidates on ANY table write
❌ Not useful for high-write tables
```
```
Better: Application-level caching with Redis
```
## 6.3 Cache Write Policies

### Write-Through Cache

#### How It Works:


```
def write_data(key, value):
# Write to cache
cache.set(key, value)
```
```
# Write to database (synchronously)
database.write(key, value)
```
```
# Return success after both complete
return "Success"
```
#### Characteristics:

```
✅ Cache and DB always in sync
✅ No data loss
❌ Slower writes (wait for both)
❌ Cache might contain rarely-read data
```
```
Use when: Data is read frequently after write
```
#### Example:

```
def update_user_profile(user_id, data):
cache_key = f"user:profile:{user_id}"
```
```
# Update cache
redis.set(cache_key, data, ttl=600)
```
```
# Update database
db.execute("""
UPDATE users
SET name=?, email=?, ...
WHERE user_id=?
""", data)
```
```
# Both updated, guaranteed consistency
```

```
# Immediate next read:
profile = redis.get(cache_key) # Cache hit!
```
### Write-Back (Write-Behind) Cache

#### How It Works:

```
def write_data(key, value):
# Write to cache immediately
cache.set(key, value)
```
```
# Queue database write for later
write_queue.add(key, value)
```
```
# Return success (fast!)
return "Success"
```
```
# Background worker:
while True:
batch = write_queue.get_batch(size=1000)
database.batch_write(batch)
sleep(5)
```
#### Characteristics:

```
✅ Very fast writes (async DB write)
✅ Can batch database writes (efficient)
❌ Risk of data loss if cache crashes
❌ Cache and DB temporarily inconsistent
```
```
Use when: High write throughput needed
```
#### Example - Analytics:

```
def track_page_view(page_id):
# Increment in cache (fast)
cache.incr(f"pageviews:{page_id}")
```

```
# Batch write to DB every 5 minutes
# Millions of increments → one DB write
```
```
# If cache crashes:
# - Lose last 5 minutes of data
# - Acceptable for analytics
# - Not acceptable for financial data!
```
### Write-Around Cache

#### How It Works:

```
def write_data(key, value):
# Write directly to database
database.write(key, value)
```
```
# Don't write to cache
# Cache will be populated on first read
```
```
return "Success"
```
#### Characteristics:

```
✅ Avoids cache pollution (rarely-read data)
✅ Simple implementation
❌ First read after write is slow (cache miss)
```
```
Use when: Data rarely read after write
```
#### Example - Logs:

```
def write_log(log_entry):
# Write to database
db.insert_log(log_entry)
```
```
# Don't cache (logs rarely re-read)
```

```
# Later: Search logs (rare)
logs = db.search_logs(query)
# Slow, but infrequent, so acceptable
```
## 6.4 Cache Eviction Policies

### LRU (Least Recently Used)

#### How It Works:

```
Cache full, need to add new item:
```
1. Remove item that was accessed longest ago
2. Add new item

```
Data structure: HashMap + Doubly Linked List
```
#### Implementation:

```
class LRUCache:
def __init__(self, capacity):
self.capacity = capacity
self.cache = {} # key -> node
self.head = Node() # dummy head
self.tail = Node() # dummy tail
self.head.next = self.tail
self.tail.prev = self.head
```
```
def get(self, key):
if key in self.cache:
node = self.cache[key]
self._move_to_front(node) # Mark as recently used
return node.value
return None
```

```
def put(self, key, value):
if key in self.cache:
node = self.cache[key]
node.value = value
self._move_to_front(node)
else:
if len(self.cache) >= self.capacity:
# Remove least recently used (tail)
lru = self.tail.prev
self._remove(lru)
del self.cache[lru.key]
```
```
# Add new node at head (most recently used)
node = Node(key, value)
self.cache[key] = node
self._add_to_front(node)
```
#### When to Use:

```
✅ General-purpose caching
✅ Access patterns: some items hot, others cold
✅ Temporal locality (recently used likely to be used again)
```
```
Example: Web page cache, user sessions
```
### LFU (Least Frequently Used)

#### How It Works:

```
Cache full:
```
1. Remove item accessed the fewest times
2. Add new item

```
Tracks access frequency, not recency
```
#### Example:


```
Cache state:
```
- Item A: 100 accesses
- Item B: 50 accesses
- Item C: 10 accesses
- Item D: 5 accesses

```
New item arrives:
```
- Remove Item D (lowest frequency)
- Add new item with frequency = 1

#### When to Use:

```
✅ Items have long-term popularity
✅ Access patterns stable over time
❌ Not good for changing trends
```
```
Example: Popular products cache, frequently searched terms
```
### FIFO (First In, First Out)

#### How It Works:

```
Cache full:
```
1. Remove oldest item
2. Add new item

```
Simple queue
```
#### When to Use:

```
✅ Simple implementation needed
✅ All items equally important
❌ Doesn't consider access patterns
```
```
Example: Simple log buffers, simple caches
```

### TTL (Time To Live)

#### How It Works:

```
cache.set(key, value, ttl=300) # 5 minutes
```
```
After 300 seconds:
```
- Item automatically removed
- Next access: cache miss

#### When to Use:

```
✅ Data changes predictably over time
✅ Combined with other policies
```
```
Examples:
```
- Session data: TTL = 30 minutes
- Product prices: TTL = 1 hour
- Weather data: TTL = 15 minutes

## 6.5 Cache Invalidation - The Hard

## Problem

#### “There are only two hard things in Computer Science: cache invalidation and

#### naming things.” - Phil Karlton

### Strategies

#### 1. TTL-Based

```
# Set expiration
cache.set("user:123", user_data, ttl=600) # 10 minutes
```

```
# Auto-expires after 10 minutes
# Simple but can serve stale data
```
#### Pros/Cons:

```
✅ Simple
✅ Automatic
❌ Might serve stale data
❌ Might evict data still being used
```
```
Use when: Data changes slowly, approximate data OK
```
#### 2. Event-Based

```
def update_user(user_id, data):
# Update database
db.update(user_id, data)
```
```
# Invalidate cache
cache.delete(f"user:{user_id}")
```
```
# Also invalidate dependent caches
cache.delete(f"user:{user_id}:posts")
cache.delete(f"user:{user_id}:followers")
```
#### Pros/Cons:

```
✅ Cache always fresh
✅ No stale data
❌ Complex (must track all dependencies)
❌ Easy to miss invalidations (bugs)
```
```
Use when: Strong consistency required
```
#### 3. Write-Through


```
def update_user(user_id, data):
# Update database
db.update(user_id, data)
```
```
# Update cache with new data
cache.set(f"user:{user_id}", data, ttl=600)
```
```
# Cache immediately has fresh data
```
#### Pros/Cons:

```
✅ Cache always fresh
✅ Next read is fast (cache hit)
❌ Writes are slower
❌ Might cache rarely-read data
```
```
Use when: Data read soon after write
```
#### 4. Cache-Aside (Lazy Loading)

```
def get_user(user_id):
# Try cache
data = cache.get(f"user:{user_id}")
if data:
return data
```
```
# Cache miss - load from DB
data = db.get(user_id)
```
```
# Store in cache
cache.set(f"user:{user_id}", data, ttl=600)
```
```
return data
```
```
def update_user(user_id, data):
# Update database
db.update(user_id, data)
```

```
# Invalidate cache (will be lazy loaded)
cache.delete(f"user:{user_id}")
```
#### Pros/Cons:

```
✅ Only caches requested data
✅ Simple logic
❌ First read after invalidation is slow
❌ Cache stampede risk
```
```
Use when: Most common pattern, general purpose
```
### Cache Stampede Problem

#### The Problem:

1. Popular item in cache expires
2. 10,000 simultaneous requests
3. All see cache miss
4. All query database
5. Database overloaded!
6. Queries timeout
7. More requests pile up
8. System crashes

#### Solution 1: Lock-Based

```
def get_data(key):
data = cache.get(key)
if data:
return data
```
```
# Acquire lock
if cache.set(f"{key}:lock", "1", nx=True, ex=5):
# This process rebuilds cache
data = database.query(key)
cache.set(key, data, ttl=600)
```

```
cache.delete(f"{key}:lock")
return data
else:
# Another process rebuilding, wait
time.sleep(0.1)
return get_data(key) # Retry
```
#### Solution 2: Probabilistic Early Expiration

```
def get_data(key):
data, expiry = cache.get_with_expiry(key)
if data:
# Check if close to expiring
if random.random() < calculate_refresh_probability(expiry):
# Rebuild in background
async_rebuild_cache(key)
return data
```
```
# Cache miss - rebuild
return rebuild_cache(key)
```
```
def calculate_refresh_probability(expiry):
time_left = expiry - now()
if time_left < 60: # Last minute
return 0.1 # 10% chance to rebuild
return 0
```
#### Solution 3: Background Refresh

```
# Pre-emptively refresh popular items
while True:
for key in popular_keys:
expiry = cache.ttl(key)
if expiry < 60: # Less than 1 minute left
data = database.query(key)
cache.set(key, data, ttl=600)
```
```
sleep(30)
```

## 6.6 Interview Example - Complete

## Caching Strategy

#### Question: “Design caching for Instagram’s user profile page”

#### Perfect Answer:

#### "I’d implement a multi-level caching strategy:

#### Level 1: CDN (CloudFront)

```
Cache static assets:
```
- Profile photos: Cache-Control: max-age=86400 (24 hours)
- CSS/JS: max-age=31536000 (1 year, versioned URLs)

```
Why: 95% of page weight is static, served in <50ms globally
```
#### Level 2: Redis Cluster

```
def get_user_profile(user_id, requesting_user_id):
cache_key = f"profile:{user_id}:v2"
```
```
# Try cache
profile = redis.get(cache_key)
if profile:
return json.loads(profile)
```
```
# Cache miss - build from database
profile = {
'user': db.get_user(user_id),
'post_count': db.count_posts(user_id),
'follower_count': db.count_followers(user_id),
'following_count': db.count_following(user_id)
}
```

```
# Cache for 10 minutes
redis.setex(cache_key, 600, json.dumps(profile))
```
```
return profile
```
#### Invalidation Strategy:

```
def update_profile(user_id, data):
# Update database
db.update_user(user_id, data)
```
```
# Invalidate cache
redis.delete(f"profile:{user_id}:v2")
```
```
# Next request rebuilds cache
```
```
def post_photo(user_id):
db.insert_post(user_id, ...)
```
```
# Increment cached count (if exists)
cache_key = f"profile:{user_id}:v2"
profile = redis.get(cache_key)
if profile:
profile = json.loads(profile)
profile['post_count'] += 1
redis.setex(cache_key, 600, json.dumps(profile))
```
#### Cache Stampede Prevention:

```
# For viral profiles (millions of views)
def get_viral_profile(user_id):
cache_key = f"profile:{user_id}:v2"
lock_key = f"{cache_key}:lock"
```
```
profile = redis.get(cache_key)
if profile:
# Probabilistic refresh before expiry
ttl = redis.ttl(cache_key)
if ttl < 60 and random.random() < 0.1:
```

```
async_rebuild_profile(user_id)
return profile
```
```
# Cache miss - try to acquire lock
if redis.set(lock_key, 1, nx=True, ex=10):
# Build cache
profile = build_profile(user_id)
redis.setex(cache_key, 600, profile)
redis.delete(lock_key)
return profile
else:
# Wait for other process
time.sleep(0.05)
return get_viral_profile(user_id)
```
#### Performance Metrics:

```
Without cache:
```
- Profile page load: 500ms (4 DB queries)
- 10,000 RPS = 10,000 DB queries/sec
- Database overloaded

```
With cache (95% hit rate):
```
- Cache hit: 10ms
- Cache miss: 500ms
- Average: (0.95 × 10) + (0.05 × 500) = 34.5ms
- 500 DB queries/sec (manageable)

```
Result:
```
- 15x faster page loads
- 20x less database load
- Can handle 10x more traffic

#### Trade-offs:

#### Counts might be slightly stale (up to 10 minutes old)

#### Acceptable for social media

#### Critical updates (profile photo) invalidate immediately

#### Storage cost: 1KB × 1B users × 0.1 (cache hit rate) = 100GB Redis


#### Cost: $200/month for huge performance gain"

# 7. Networking Fundamentals

# {#networking}

## 7.1 TCP vs UDP - The Transport Layer

## Choice

### TCP (Transmission Control Protocol)

#### Characteristics:

```
✅ Reliable delivery (guaranteed)
✅ Ordered packets (arrive in sequence)
✅ Connection-oriented (handshake)
✅ Flow control (prevents overwhelming)
✅ Congestion control (adapts to network)
❌ Slower (overhead from guarantees)
❌ Higher latency (acknowledgments)
```
#### How It Works - 3-Way Handshake:

```
Client Server
| |
|-------- SYN ----------->| "Want to connect"
| |
|<----- SYN-ACK ----------| "OK, here's my info"
| |
|-------- ACK ----------->| "Great, connected!"
```

##### | |

##### |<===== DATA FLOW =======>|

#### Reliability Mechanism:

```
Client sends: Packet 1, 2, 3, 4, 5
```
```
Server receives: 1, 2, 4, 5 (missing 3)
Server ACKs: 1, 2 (waits for 3)
```
```
Client: Doesn't get ACK for 3
Client: Retransmits packet 3
```
```
Server receives: 3
Server ACKs: 3, 4, 5 (all received!)
```
```
Result: All packets delivered, in order
```
#### When to Use TCP:

```
✅ HTTP/HTTPS - Web traffic
✅ Email - SMTP, IMAP
✅ File transfers - FTP, SFTP
✅ Database connections
✅ SSH - Remote access
✅ Any data that MUST arrive completely
```
```
Examples:
```
- E-commerce checkout (can't lose order data)
- Banking transactions
- File downloads
- Chat messages (must arrive)

#### Interview Example: "For an online banking app, TCP is mandatory:

#### Transfer $1000: Packet loss would lose money

#### View account: Must see accurate balance


#### Download statement: Must be complete

#### TCP ensures:

#### 1. All data arrives

#### 2. In correct order

#### 3. No corruption

#### Latency penalty (50-100ms extra) is acceptable for correctness."

### UDP (User Datagram Protocol)

#### Characteristics:

```
✅ Fast (minimal overhead)
✅ Low latency
✅ No connection setup
✅ Lightweight
❌ No delivery guarantee
❌ Packets can arrive out of order
❌ No congestion control
❌ Application must handle reliability
```
#### How It Works:

```
Client Server
| |
|-------- Data ---------->| "Here's packet 1"
|-------- Data ---------->| "Here's packet 2"
|-------- Data ---------->| "Here's packet 3"
| |
```
```
No handshake, no ACKs, just send!
```
```
If packet 2 is lost:
```
- Server receives 1, 3


- No retransmission
- Application must detect and handle

#### When to Use UDP:

```
✅ Video streaming - Netflix, YouTube
✅ Video calls - Zoom, FaceTime
✅ Online gaming - FPS games
✅ Voice over IP - Phone calls
✅ DNS queries
✅ IoT sensor data (can tolerate loss)
```
```
Examples:
```
- Live video: Skip lost frames (better than pausing)
- Gaming: Old positions don't matter
- VoIP: Drop garbled audio (better than delay)

#### Interview Example - Video Streaming: "For Netflix live streaming, UDP is better

#### than TCP:

#### With TCP:

```
Packet 100 lost
TCP retransmits packet 100
Packets 101-110 wait (held in buffer)
Retransmit succeeds
Play packets 100-110 (2-second delay accumulated)
User sees lag, buffering spinner
```
#### With UDP:

```
Packet 100 lost
Play packets 101-110 immediately
User might see 1 frame of artifacts
Stream continues smoothly
No lag, no buffering
```

#### For live content, a small visual glitch is better than delay.

#### Implementation:

```
# Netflix uses UDP with custom reliability
class AdaptiveStreaming:
def send_video(self):
for chunk in video_chunks:
# Send via UDP (fast)
udp_socket.send(chunk)
```
```
# Application-level selective retransmit
if chunk.is_critical(): # I-frames
wait_for_ack(chunk)
# P-frames: skip if lost
```
#### Trade-offs accepted:

#### Occasional frame drop: Yes

#### Delayed/frozen video: No

#### This is why UDP is used despite no reliability."

## 7.2 HTTP Versions - Evolution of the

## Web

### HTTP/1.1 - The Standard (1997-2015)

#### How It Works:

```
Client opens TCP connection
Client sends request:
GET /index.html HTTP/1.1
Host: http://www.example.com
```

```
Server sends response:
HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 1234
```
```
<html>...</html>
```
```
Connection stays open (keep-alive)
Client can send more requests
```
#### Problems:

```
❌ Head-of-Line Blocking:
Request 1 (large image): 2 seconds
Request 2 (small CSS): waits 2 seconds
Request 3 (small JS): waits 4 seconds
```
```
❌ No multiplexing:
One request at a time per connection
```
```
❌ Workaround: Open 6 connections
More overhead, still limited
```
```
❌ Header overhead:
Every request sends full headers (cookies, etc)
Headers often bigger than response!
```
### HTTP/2 - The Modern Web (2015+)

#### Key Features:

#### 1. Multiplexing:

```
Single TCP connection
Multiple requests simultaneously
```
```
Timeline:
```

```
0ms: Request HTML, CSS, JS, 3 images (parallel)
100ms: All responses start arriving
200ms: All complete
```
```
HTTP/1.1 would take:
0ms: HTML
100ms: CSS (waited for HTML)
200ms: JS (waited for CSS)
...
600ms: Done (6x slower!)
```
#### 2. Header Compression (HPACK):

##### HTTP/1.1:

```
Request 1 headers: 800 bytes
Request 2 headers: 800 bytes (same headers!)
Request 3 headers: 800 bytes
Total: 2400 bytes
```
##### HTTP/2:

```
Request 1 headers: 800 bytes
Request 2 headers: 50 bytes (compressed, only differences)
Request 3 headers: 50 bytes
Total: 900 bytes (62% reduction)
```
#### 3. Server Push:

```
Client requests: /index.html
```
```
Server responds:
```
- Sends index.html
- Also pushes: style.css, app.js (before client asks!)

```
Client receives everything in one round trip
Faster page load
```
#### Performance Comparison:


```
Load webpage with 100 resources:
```
##### HTTP/1.1:

- 6 parallel connections
- 100 resources / 6 = ~17 round trips
- ~850ms total

```
HTTP/2:
```
- 1 connection, multiplexed
- All 100 resources simultaneously
- ~150ms total

```
5-6x faster!
```
#### Interview Answer: "For a modern web application like Google Docs, I’d require

#### HTTP/2:

#### Benefits:

#### 1. 30+ resources per page (HTML, CSS, JS, fonts, icons)

#### 2. Multiplexing loads all resources in parallel

#### 3. Real-time updates benefit from single connection

#### 4. Header compression reduces overhead

#### Implementation:

#### Enable HTTP/2 on load balancers

#### Use server push for critical CSS/JS

#### Reduces page load from 2s to 400ms

#### Better user experience, higher engagement"

### HTTP/3 - The Future (2020+)

#### Key Innovation: Built on QUIC (UDP + Reliability)

#### Why UDP?


```
Problem with HTTP/2:
```
- Uses TCP
- TCP head-of-line blocking:
If packet 5 is lost, packets 6-10 wait
Even though they arrived!

##### HTTP/3 + QUIC:

- Uses UDP
- Application-layer reliability
- Lost packet 5: Only stream using packet 5 blocks
- Other streams continue

#### Benefits:

```
✅ No head-of-line blocking
✅ Faster connection setup (0-RTT)
✅ Better on mobile (connection migration)
✅ Improved packet loss recovery
```
```
Mobile scenario:
HTTP/2 over TCP:
```
- WiFi → Cell transition
- TCP connection breaks
- Reconnect: 3-way handshake + TLS = 200ms

```
HTTP/3 over QUIC:
```
- WiFi → Cell transition
- Connection migrates seamlessly
- 0 RTT reconnection
- No interruption

#### Adoption:

```
2024 Status:
```
- Google: 100% HTTP/3
- Facebook: 75% HTTP/3
- CloudFlare: Supports HTTP/3
- Chrome, Firefox, Safari: Full support


```
Use cases:
```
- Video streaming (YouTube uses QUIC)
- Mobile apps (connection migration)
- Real-time apps (lower latency)

## 7.3 WebSockets - Real-Time

## Communication

#### The Problem with HTTP:

```
Real-time chat with HTTP:
```
```
Client polls every 1 second:
GET /messages?since=1234 HTTP/1.1
```
```
Server: "No new messages"
Client: (waits 1 second)
GET /messages?since=1234 HTTP/1.1
Server: "No new messages"
...
(Repeat 100 times)
GET /messages?since=1234 HTTP/1.1
Server: "1 new message!"
```
```
Problems:
```
- 99 wasted requests
- 1-second delay
- Server load: 1000 users = 1000 RPS (doing nothing!)

#### WebSocket Solution:

```
Client initiates WebSocket:
GET /chat HTTP/1.1
Upgrade: websocket
```

```
Server accepts:
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
```
```
Connection upgraded to WebSocket
Now bidirectional:
```
```
Client ←===Real-time channel===> Server
```
```
Server pushes messages instantly:
"New message from Alice"
```
```
Client sends message:
"Hello everyone!"
```
```
No polling, no latency, no waste!
```
#### How It Works:

```
# Server-side (Python with asyncio)
async def handle_websocket(websocket, path):
# User connected
users.add(websocket)
```
```
try:
async for message in websocket:
# Received message from client
# Broadcast to all users
for user in users:
await user.send(message)
finally:
# User disconnected
users.remove(websocket)
```
```
# Client-side (JavaScript)
const ws = new WebSocket('wss://chat.example.com');
```
```
ws.onopen = () => {
console.log('Connected');
```

##### };

```
ws.onmessage = (event) => {
console.log('Received:', event.data);
displayMessage(event.data);
};
```
```
ws.send('Hello everyone!');
```
#### When to Use WebSockets:

```
✅ Real-time chat (WhatsApp, Slack)
✅ Live notifications
✅ Collaborative editing (Google Docs)
✅ Online gaming
✅ Live sports scores
✅ Stock tickers
✅ IoT dashboards
```
```
❌ Simple request-response (use HTTP)
❌ Infrequent updates (use polling)
❌ Large file transfers (use HTTP)
```
#### Interview Example - Slack: "For Slack’s real-time messaging:

#### Architecture:

```
User A ──WebSocket──> WebSocket Server ──> Message Queue
↓
User B ──WebSocket──────────┘
```
```
Flow:
```
1. User A sends message
2. WebSocket server receives
3. Publishes to message queue
4. WebSocket server subscribed to queue
5. Pushes to User B instantly


#### Scaling:

```
1 WebSocket server:
```
- 10,000 concurrent connections
- 1GB RAM (100KB per connection)

```
1 million users:
```
- 100 WebSocket servers
- Load balanced by user_id
- Redis pub/sub for cross-server messages

```
# Server 1 has User A
# Server 2 has User B
# Message from A to B:
```
```
Server 1 → Redis pub/sub → Server 2 → User B
```
#### Fallback Strategy:

```
# Client tries WebSocket
try:
connect_websocket()
except:
# Fallback to long polling
connect_long_polling()
```
```
# Handles corporate firewalls blocking WebSockets
```
#### Benefits:

#### Real-time: <50ms latency

#### Efficient: 1 connection vs 1000s of polls

#### Scalable: 10K+ connections per server

#### Trade-offs:

#### Stateful: Servers track connections

#### Connection management complexity


#### Load balancing requires sticky sessions"

## 7.4 WebRTC - Peer-to-Peer Real-Time

#### What is WebRTC:

```
Web Real-Time Communication
Browser-to-browser direct connection
No server in the middle (after setup)
```
#### Architecture:

```
Traditional (Zoom with server relay):
User A → Server → User B
```
- All video goes through server
- Server bandwidth: 2x video streams
- Latency: 2 hops

```
WebRTC (Peer-to-peer):
User A ←---direct connection---→ User B
```
- Video streams directly
- Server bandwidth: Only signaling (tiny)
- Latency: 1 hop (50% reduction)

#### How It Works:

#### Step 1: Signaling (Via Server):

```
User A creates offer:
{
"type": "offer",
"sdp": "v=0\r\no=- ... (network info)"
}
```
```
Server relays to User B
```

```
User B creates answer:
{
"type": "answer",
"sdp": "v=0\r\no=- ... (network info)"
}
```
```
Server relays to User A
```
#### Step 2: ICE (Find Best Path):

```
Both users gather network paths:
```
- Local IP: 192.168.1.5
- Public IP: 203.0.113.50
- TURN relay: relay.example.com

```
Try connections in order:
```
1. Direct LAN (both on same network) ← Fastest
2. Direct Internet (P2P) ← Good
3. TURN relay (via server) ← Last resort

```
Establish best connection
```
#### Step 3: Media Exchange:

```
Peer-to-peer connection established
Stream video/audio directly
No server relay needed
```
#### Interview Example - Google Meet: "For 1-on-1 video calls, WebRTC is ideal:

#### Benefits:

```
Direct connection:
```
- Latency: 50ms (vs 150ms via server)
- Quality: Full HD (no server bandwidth limits)
- Privacy: Encrypted end-to-end


- Cost: No server bandwidth costs

```
Server only used for:
```
1. Signaling (tiny data)
2. NAT traversal help
3. Fallback relay (5% of connections)

#### Scaling to Group Calls:

```
2 people: P2P (easy)
```
```
5 people: Mesh (everyone connects to everyone)
```
- User A sends to B, C, D, E
- 4 outbound streams
- 4 inbound streams
- Upload: 4x video bitrate (4-8 Mbps)
- Works for small groups

```
50 people: SFU (Selective Forwarding Unit)
```
- Everyone sends to server once
- Server forwards to everyone
- Upload: 1x video bitrate
- Scales better

#### Implementation:

```
// Browser-side WebRTC
const peerConnection = new RTCPeerConnection({
iceServers: [
{ urls: 'stun:stun.l.google.com:19302' }
]
});
```
```
// Add local video
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
.then(stream => {
stream.getTracks().forEach(track => {
peerConnection.addTrack(track, stream);
});
```

##### });

```
// Create offer
const offer = await peerConnection.createOffer();
await peerConnection.setLocalDescription(offer);
```
```
// Send offer to peer via signaling server
socket.emit('offer', offer);
```
```
// Receive answer from peer
socket.on('answer', async (answer) => {
await peerConnection.setRemoteDescription(answer);
});
```
```
// Display remote video
peerConnection.ontrack = (event) => {
remoteVideo.srcObject = event.streams[0];
};
```
#### Trade-offs:

#### Best for 1-on-1 or small groups

#### Requires good upload bandwidth

#### NAT traversal can be complex

#### 5-10% need TURN relay

#### When to use:

#### Video calls: Google Meet, Zoom

#### Screen sharing

#### File transfer (P2P)

#### Gaming (low latency critical)"

# 8. Load Balancing and Traffic

# Management {#load-balancing}


## 8.1 Why Load Balancing Matters

#### The Single Server Problem:

```
One server handling all traffic:
```
- Capacity: 1,000 RPS
- Current load: 900 RPS (90% utilized)
- Black Friday traffic: 10,000 RPS
- Result: 9,000 requests timeout, server crashes

#### Load Balancer Solution:

```
Load Balancer distributes to 10 servers:
```
- Total capacity: 10,000 RPS
- Current load: 900 RPS (9% utilized, room to grow)
- Black Friday: 10,000 RPS (100% utilized, all succeed)
- Result: No timeouts, no crashes

## 8.2 Load Balancing Algorithms

### 1. Round Robin - Simple and Fair

#### How It Works:

```
Requests arrive:
Request 1 → Server A
Request 2 → Server B
Request 3 → Server C
Request 4 → Server A (cycle repeats)
Request 5 → Server B
...
```
#### Characteristics:


```
✅ Simple
✅ Fair distribution
✅ No state needed
❌ Ignores server load
❌ Ignores server capacity
❌ Treats all requests equally
```
#### When It Fails:

```
Scenario:
Request 1 → Server A (quick query: 10ms)
Request 2 → Server B (complex report: 30s)
Request 3 → Server C (quick query: 10ms)
Request 4 → Server A (quick query: 10ms)
```
```
Server B: Overloaded (one slow request)
Servers A, C: Idle (handled quick requests)
```
```
Round robin doesn't account for this!
```
#### When to Use:

```
✅ All servers identical capacity
✅ All requests similar size/duration
✅ Simple setup needed
```
```
Example: Serving static images
```
### 2. Weighted Round Robin

#### How It Works:

```
Server A: weight = 5 (powerful: 32 cores)
Server B: weight = 3 (medium: 16 cores)
Server C: weight = 2 (weak: 8 cores)
```

```
Distribution:
A, A, A, A, A, B, B, B, C, C (repeat)
```
```
Server A gets 50% of traffic
Server B gets 30% of traffic
Server C gets 20% of traffic
```
#### When to Use:

```
✅ Heterogeneous servers (different capacities)
✅ Gradual rollout (new version gets 10% traffic)
✅ Cost optimization (cheaper servers handle less)
```
#### Interview Example - Canary Deployment:

```
Old version: 90% traffic (weight = 9)
New version: 10% traffic (weight = 1)
```
```
If new version works well:
```
- Old: 70%, New: 30%
- Old: 50%, New: 50%
- Old: 0%, New: 100%

```
Gradual migration with rollback capability
```
### 3. Least Connections

#### How It Works:

```
Current state:
Server A: 10 active connections
Server B: 25 active connections
Server C: 5 active connections
```
```
New request arrives:
Load balancer picks Server C (least connections)
```

```
Updated state:
Server A: 10
Server B: 25
Server C: 6 ← New request here
```
#### Why It’s Better:

```
Scenario: Long-polling connections
```
```
Round Robin:
Server A: 100 connections (all long-polling)
Server B: 100 connections (all long-polling)
Server C: 100 connections (all long-polling)
New request: Goes to Server A (already overloaded!)
```
```
Least Connections:
Server A: 100
Server B: 100
Server C: 100
Server D: 0 ← New request goes here!
```
#### When to Use:

```
✅ Variable request duration
✅ WebSocket connections
✅ Long-polling
✅ Database connections
```
```
Example: Chat application
```
### 4. Least Response Time

#### How It Works:

```
Load balancer tracks response times:
Server A: avg 50ms, 10 connections
Server B: avg 200ms, 5 connections
```

```
Server C: avg 30ms, 15 connections
```
```
New request → Server C (fastest response)
```
#### When to Use:

```
✅ Servers at different geographic locations
✅ Heterogeneous workloads
✅ Want best user experience
```
```
Example: CDN origin selection
```
### 5. IP Hash (Sticky Sessions)

#### How It Works:

```
def get_server(client_ip):
server_index = hash(client_ip) % num_servers
return servers[server_index]
```
```
# Same client always routes to same server
client_192.168.1.1 → hash % 3 = Server B (always)
client_10.0.0.5 → hash % 3 = Server A (always)
```
#### Why It’s Needed:

```
Problem: Stateful sessions
```
```
User logs in:
```
- Request 1 → Server A (session created)
- Request 2 → Server B (session not found!)
- User sees login screen again (bad UX)

```
Solution: IP Hash
```
- Request 1 → Server A (session created)


- Request 2 → Server A (same server, session exists!)
- User stays logged in

#### Limitations:

```
❌ Uneven distribution if many users behind NAT
❌ Server failure requires re-hashing
❌ Not great for scaling up/down
```
```
Better alternative: Session store (Redis)
```
#### Interview Discussion: "I’d avoid IP hash for session management. Instead:

```
# Store sessions in Redis
def handle_request(request):
session_id = request.cookies['session_id']
session = redis.get(f"session:{session_id}")
```
```
# Any server can handle request
# No sticky sessions needed
```
#### Benefits:

#### Any server can handle any request

#### Server failure doesn’t lose sessions

#### Better load distribution

#### Easier scaling"

### 6. Consistent Hashing

#### How It Works:

```
Hash ring with virtual nodes
Requests hash to ring position
Route to next server clockwise
```

```
Add/remove servers: Minimal disruption
```
#### When to Use:

```
✅ Distributed caching
✅ Sharding
✅ Dynamic server pools
```
```
Example: Memcached cluster
```
## 8.3 Layer 4 vs Layer 7 Load Balancing

### Layer 4 (Transport Layer) - Network Load Balancer

#### What It Does:

```
Makes decisions based on:
```
- IP address
- Port number
- Protocol (TCP/UDP)

```
Cannot see:
```
- HTTP headers
- Cookies
- Request content

#### How It Works:

```
Client connects to LB:
TCP SYN → Load Balancer
```
```
Load Balancer forwards packets:
```

```
Client ←→ Load Balancer ←→ Server
```
```
Just forwards TCP/UDP packets
No inspection of application data
```
#### Characteristics:

```
✅ Very fast (minimal processing)
✅ High throughput (millions RPS)
✅ Low latency (<1ms overhead)
✅ Protocol-agnostic (works with any TCP/UDP)
❌ Limited routing logic
❌ No SSL termination
❌ No content-based routing
```
#### When to Use:

```
✅ High throughput needed (>100K RPS)
✅ Non-HTTP protocols (databases, game servers)
✅ SSL passthrough (end-to-end encryption)
✅ Cost-sensitive (cheaper than L7)
```
```
Example: Database load balancing, TCP proxying
```
#### Interview Example: "For a PostgreSQL database cluster:

```
Application → Layer 4 LB → Read Replicas
```
```
L4 LB benefits:
```
- Transparent proxy (apps see single endpoint)
- High performance (>50K queries/sec)
- Least connections algorithm (even distribution)
- Health checks (remove failed replicas)

```
No need for L7:
```
- PostgreSQL not HTTP
- No routing based on query content


- Just balance TCP connections
```"

```
### Layer 7 (Application Layer) - Application Load Balancer
```
```
**What It Does:**
```
#### Makes decisions based on:

#### HTTP headers

#### Cookies

#### URL path

#### Request method

#### Request content

#### Full application awareness

```
**Routing Examples:**
```
# Path-based routing

#### /api/* → API servers /images/* → Image servers /videos/* → Video servers

# Header-based routing

#### User-Agent: Mobile → Mobile-optimized servers User-Agent: Desktop → Desktop

#### servers

# Cookie-based routing


#### session=premium_user → Premium tier servers session=free_user → Standard tier

#### servers

# Method-based routing

#### POST/PUT/DELETE → Write servers GET → Read replicas

```
**Advanced Features:**
```python
# SSL/TLS termination
Client → HTTPS → Load Balancer (decrypt) → HTTP → Servers
# LB handles encryption, servers focus on logic
```
```
# Request modification
def modify_request(request):
# Add headers
request.headers['X-Forwarded-For'] = client_ip
request.headers['X-Request-ID'] = generate_id()
```
```
# Rewrite URLs
if '/old-api/' in request.path:
request.path = request.path.replace('/old-api/', '/api/v2/')
```
```
return request
```
```
# Response modification
def modify_response(response):
# Add security headers
response.headers['X-Frame-Options'] = 'DENY'
response.headers['Content-Security-Policy'] = "default-src 'self'"
```
```
# Compression
if 'gzip' in request.headers['Accept-Encoding']:
response.body = gzip.compress(response.body)
response.headers['Content-Encoding'] = 'gzip'
```
```
return response
```

#### When to Use:

```
✅ HTTP/HTTPS traffic
✅ Microservices (route by path)
✅ A/B testing (route by cookie)
✅ API versioning
✅ SSL termination needed
✅ Content-based routing
```
```
Example: Modern web applications, microservices
```
#### Interview Example - Microservices: "For an e-commerce platform with

#### microservices:

```
Application Load Balancer routing:
```
```
/api/users/* → User Service (port 8001)
/api/products/* → Product Service (port 8002)
/api/orders/* → Order Service (port 8003)
/api/payments/* → Payment Service (port 8004)
```
```
Header-based:
Authorization: Bearer premium_token → Fast lane servers
Authorization: Bearer regular_token → Standard servers
```
```
Benefits:
```
- Single endpoint for all services
- Service isolation
- Independent scaling per service
- Can deploy new service without changing clients
- SSL termination at LB (services use HTTP internally)
```"

```
**Comparison Table:**
```
```
| Feature | Layer 4 | Layer 7 |
|---------|---------|---------|
| Speed | Very fast (1M+ RPS) | Fast (100K+ RPS) |
| Latency | <1ms | 1-5ms |
```

```
| Protocols | Any TCP/UDP | HTTP/HTTPS mainly |
| Routing | IP:Port only | URL, headers, cookies |
| SSL | Passthrough | Termination |
| Complexity | Low | High |
| Cost | Lower | Higher |
| Use Case | Databases, games | Web apps, APIs |
```
```
---
```
```
## 8.4 Health Checks and Failover
```
```
**Why Health Checks Matter:**
```
#### Without health checks: Server crashes Load balancer keeps sending traffic All

#### requests timeout Users see errors

#### With health checks: Server crashes Health check fails within 5 seconds Load

#### balancer removes server Traffic reroutes to healthy servers Users unaffected

```
**Health Check Types:**
```
```
**1. Passive (Least Intrusive):**
```
#### Load balancer monitors actual traffic:

#### 3 consecutive request failures → Mark unhealthy

#### 5 consecutive successes → Mark healthy

#### Pros:

#### No extra traffic

#### Real user experience

#### Cons:

#### Slow to detect (needs failures)

#### Might route some users to failed server


```
**2. Active (Proactive):**
```python
# Load balancer pings every 5 seconds
def health_check():
while True:
for server in servers:
try:
response = requests.get(f"{server}/health")
if response.status_code == 200:
server.mark_healthy()
else:
server.mark_unhealthy()
except:
server.mark_unhealthy()
```
```
sleep(5)
```
```
# Server endpoint
@app.route('/health')
def health():
# Check dependencies
if database.ping() and redis.ping():
return "OK", 200
else:
return "Unhealthy", 503
```
#### 3. Deep Health Check:

```
@app.route('/health/deep')
def deep_health():
checks = {
'database': database.ping(),
'cache': redis.ping(),
'disk_space': get_disk_usage() < 90,
'memory': get_memory_usage() < 85,
'api_dependencies': check_external_apis()
}
```

```
if all(checks.values()):
return {"status": "healthy", "checks": checks}, 200
else:
return {"status": "unhealthy", "checks": checks}, 503
```
#### Interview Example - Production Health Checks:

```
Netflix-style health checks:
```
1. Basic health (/health):
- Runs every 10 seconds
- Fast (<50ms)
- Just checks process alive
2. Ready check (/health/ready):
- Checks dependencies
- Database reachable
- Cache connected
- Returns 200 only if ready to serve traffic
3. Live check (/health/live):
- Process not deadlocked
- Memory not exhausted
- Returns 200 unless critically broken

```
Kubernetes uses:
```
- readinessProbe: /health/ready (routing decision)
- livenessProbe: /health/live (restart decision)

#### Failover Strategies:

#### 1. Active-Passive:

```
Primary (active): Handles all traffic
Secondary (passive): Standby, ready to take over
```
```
Primary fails:
```
1. Health check detects failure (5 seconds)


2. DNS updated to point to Secondary (30 seconds)
3. Secondary becomes active
Total failover time: ~35 seconds

```
Pros: Simple, predictable
Cons: Wasted resources (passive idle), slow failover
```
#### 2. Active-Active:

```
Both servers active:
```
- Server A: 50% traffic
- Server B: 50% traffic

```
Server A fails:
```
1. Health check detects (5 seconds)
2. Reroute A's traffic to B
3. Server B handles 100%
Total failover time: ~5 seconds

```
Pros: Fast failover, no waste
Cons: Both must handle full load at 50% capacity
```
#### 3. Multi-Region Failover:

```
Primary region (US East): 100% traffic
```
```
Region fails (data center outage):
```
1. Health checks fail
2. DNS failover to Europe region
3. Europe takes over
Failover time: DNS TTL (60 seconds typical)

```
Route53 health-based routing:
```
- Continuous health monitoring
- Automatic failover
- Can test with Route53 health check simulator


## 8.5 Rate Limiting - Protecting Your

## System

#### Why Rate Limiting:

```
Without rate limiting:
```
- DDoS attack: 1M requests/second
- Servers crash
- Database overloaded
- Legitimate users can't access

```
With rate limiting:
```
- Limit: 1000 requests/minute per IP
- Attack requests rejected at load balancer
- Servers protected
- Legitimate users unaffected

#### Algorithms:

#### 1. Fixed Window:

```
def allow_request(user_id):
key = f"rate_limit:{user_id}:{current_minute}"
count = redis.incr(key)
redis.expire(key, 60)
```
```
if count <= 1000: # Limit: 1000/minute
return True
else:
return False # Rate limited
```
```
Problem: Burst at window edge
10:00:59 → 1000 requests (allowed)
10:01:00 → 1000 requests (allowed)
Result: 2000 requests in 2 seconds!
```

#### 2. Sliding Window:

```
def allow_request(user_id):
key = f"rate_limit:{user_id}"
now = time.time()
```
```
# Remove requests older than 1 minute
redis.zremrangebyscore(key, 0, now - 60)
```
```
# Count requests in last minute
count = redis.zcard(key)
```
```
if count < 1000:
redis.zadd(key, {str(now): now})
redis.expire(key, 60)
return True
else:
return False
```
```
Pros: No burst issue, accurate
Cons: Memory intensive (stores all timestamps)
```
#### 3. Token Bucket:

```
class TokenBucket:
def __init__(self, capacity, refill_rate):
self.capacity = capacity
self.tokens = capacity
self.refill_rate = refill_rate # tokens per second
self.last_refill = time.time()
```
```
def allow_request(self):
# Refill tokens
now = time.time()
elapsed = now - self.last_refill
self.tokens = min(
self.capacity,
self.tokens + elapsed * self.refill_rate
)
```

```
self.last_refill = now
```
```
# Check if token available
if self.tokens >= 1:
self.tokens -= 1
return True
else:
return False
```
```
# Example: 1000 tokens capacity, refill 100/second
# Allows bursts up to 1000 requests
# Sustained rate: 100 RPS
```
#### 4. Leaky Bucket:

```
class LeakyBucket:
def __init__(self, capacity, leak_rate):
self.capacity = capacity
self.queue = []
self.leak_rate = leak_rate # requests per second
```
```
def allow_request(self, request):
# Leak requests at constant rate
self.leak()
```
```
if len(self.queue) < self.capacity:
self.queue.append(request)
return True
else:
return False # Bucket full
```
```
def leak(self):
# Process requests at constant rate
while self.queue and can_process():
process(self.queue.pop(0))
sleep(1 / self.leak_rate)
```
```
# Smooths traffic to constant rate
# Good for protecting downstream services
```

#### Interview Example - API Rate Limiting:

```
GitHub API rate limits:
```
```
Tier 1 (unauthenticated): 60 requests/hour
Tier 2 (authenticated): 5,000 requests/hour
Tier 3 (enterprise): 15,000 requests/hour
```
```
Implementation:
```python
def rate_limit(request):
user = get_user(request.headers['Authorization'])
tier = user.tier
```
```
limits = {
'tier1': 60,
'tier2': 5000,
'tier3': 15000
}
```
```
limit = limits[tier]
key = f"rate_limit:{user.id}:{current_hour}"
count = redis.incr(key)
redis.expire(key, 3600)
```
```
# Set response headers
response.headers['X-RateLimit-Limit'] = limit
response.headers['X-RateLimit-Remaining'] = max(0, limit - count)
response.headers['X-RateLimit-Reset'] = next_hour_timestamp
```
```
if count > limit:
return 429, "Rate limit exceeded. Try again later."
```
```
return process_request(request)
```
#### Benefits:

#### Protects API from abuse

#### Prevents single user from hogging resources

#### Monetization (paid tiers get higher limits)


#### Transparent (users see limits in headers)"

# 9. Message Queues and

# Asynchronous Processing

# {#message-queues}

## 9.1 Why Message Queues Matter

#### The Synchronous Problem:

```
def create_user_account(email, password):
# Create account (50ms)
user = database.create_user(email, hash(password))
```
```
# Send welcome email (2000ms) ← User waits for this!
email_service.send_welcome_email(user)
```
```
# Generate thumbnail (500ms) ← And this!
avatar_service.create_default_avatar(user)
```
```
# Update analytics (200ms) ← And this!
analytics.track_signup(user)
```
```
# Total: 2750ms
return "Account created!" # Finally!
```
```
User experience: 3 seconds to see "Account created!"
```
#### Asynchronous with Message Queue:


```
def create_user_account(email, password):
# Create account (50ms)
user = database.create_user(email, hash(password))
```
```
# Queue background jobs (1ms each)
queue.publish('send_email', {'user_id': user.id})
queue.publish('create_avatar', {'user_id': user.id})
queue.publish('track_analytics', {'user_id': user.id})
```
```
# Total: 53ms
return "Account created!"
```
```
# Background workers process queue
Worker 1: Sends email
Worker 2: Creates avatar
Worker 3: Updates analytics
```
```
User experience: 53ms (50x faster!)
Non-critical tasks happen in background
```
## 9.2 Core Concepts

### Producer-Consumer Pattern

```
Producers (API Servers) Queue Consumers (Workers)
| | |
[Create] ──> Message ──> [ Queue ] ──> [Process]
[Order ] [ 1. Email ] [Worker1]
| [ 2. SMS ] |
[Upload] ──> Message ──> [ 3. Resize] [Worker2]
[Photo ] [ 4. PDF ] |
[ 5. ... ] [Worker3]
```
#### Decoupling Benefits:


```
Without queue:
```
- API server must wait for all processing
- If email service down, user signup fails
- Cannot scale independently

```
With queue:
```
- API server returns immediately
- Email service down? Messages queued, retry later
- Can scale workers independently (10 email workers, 3 image workers)

### At-Least-Once vs Exactly-Once Delivery

#### At-Least-Once:

```
Message delivered ≥ 1 time
Worker might process same message multiple times
```
```
Example:
```
1. Worker receives message
2. Worker processes message
3. Worker crashes before ACK
4. Message redelivered
5. Worker processes AGAIN

```
Solution: Make operations idempotent
```
#### Idempotent Operations:

```
# ❌ Not idempotent
def process_payment(order_id, amount):
account.balance -= amount # Run twice = double charge!
```
```
# ✅ Idempotent
def process_payment(order_id, amount):
if not payment_exists(order_id):
account.balance -= amount
```

```
record_payment(order_id, amount)
# Running twice is safe
```
#### Exactly-Once (Rare):

```
Message delivered exactly 1 time
Very hard to achieve in distributed systems
Kafka with transactional producers can do it
```
```
Most systems use at-least-once + idempotency
```
## 9.3 Popular Message Queue Systems

### Kafka - The High-Throughput Champion

#### Architecture:

```
Topic: "user_signups"
├── Partition 0: [msg1, msg5, msg9, ...]
├── Partition 1: [msg2, msg6, msg10, ...]
├── Partition 2: [msg3, msg7, msg11, ...]
└── Partition 3: [msg4, msg8, msg12, ...]
```
```
Each partition is ordered, append-only log
Different partitions can be processed in parallel
```
#### How It Works:

```
Producer:
```
1. Sends message to topic "orders"
2. Kafka assigns to partition based on key
3. Appends to partition log
4. Returns offset (position in log)


```
Consumer Group:
```
1. Multiple consumers in group
2. Each consumer reads from different partitions
3. Parallelism = number of partitions

```
Example:
```
- Topic "orders" with 12 partitions
- Consumer group with 4 consumers
- Each consumer reads 3 partitions
- 4x parallelism!

#### Key Features:

```
✅ Extremely high throughput (millions of messages/second)
✅ Persistent (messages stored on disk)
✅ Replay (can re-read old messages)
✅ Ordering per partition
✅ Multiple consumers can read same messages
❌ Complex setup and operations
❌ Ordering only within partition, not across
```
#### When to Use Kafka:

```
✅ Event streaming (analytics, logging)
✅ Real-time data pipelines
✅ Activity tracking (user actions)
✅ Metrics and monitoring
✅ Need message replay
✅ High throughput (>10K msgs/sec)
```
```
Examples:
```
- LinkedIn activity streams
- Netflix viewing history
- Uber trip events

#### Interview Example - Analytics Pipeline: "For tracking user behavior on an e-

#### commerce site:


```
# Producer (Web Application)
def track_event(user_id, event_type, data):
event = {
'user_id': user_id,
'event_type': event_type, # 'view', 'click', 'purchase'
'data': data,
'timestamp': now()
}
```
```
# Partition by user_id (all user events in order)
kafka.produce(
topic='user_events',
key=user_id,
value=json.dumps(event)
)
```
```
# Consumer Group 1: Real-time Analytics
@kafka_consumer(topic='user_events', group='analytics')
def update_realtime_dashboard(message):
event = json.loads(message.value)
redis.incr(f"events:{event['event_type']}:count")
# Dashboard updated in real-time
```
```
# Consumer Group 2: Data Warehouse
@kafka_consumer(topic='user_events', group='warehouse')
def store_in_warehouse(message):
event = json.loads(message.value)
s3.write(f"events/{date}/{hour}/{message.offset}.json", event)
# Batch load into Redshift later
```
```
# Consumer Group 3: ML Recommendations
@kafka_consumer(topic='user_events', group='ml')
def update_recommendations(message):
event = json.loads(message.value)
if event['event_type'] == 'purchase':
ml_model.update_user_preferences(event['user_id'], event['data']
```
#### Benefits:

#### Single event stream → multiple use cases


#### Analytics team and ML team independent

#### Can replay events if bug in consumer

#### Handles 100K events/second easily

#### 7-day retention for replay/debugging"

### RabbitMQ - The Feature-Rich Traditional Queue

#### Architecture:

```
Producer → Exchange → Queue → Consumer
```
```
Exchange types:
```
1. Direct: Route by exact routing key
2. Fanout: Broadcast to all queues
3. Topic: Route by pattern matching
4. Headers: Route by message headers

#### Example - Direct Exchange:

```
# Producer
channel.basic_publish(
exchange='tasks',
routing_key='email',
body='{"to": "user@example.com", "subject": "Welcome"}'
)
```
```
channel.basic_publish(
exchange='tasks',
routing_key='sms',
body='{"to": "+1234567890", "message": "OTP: 123456"}'
)
```
```
# Consumer 1: Email worker
channel.queue_bind(exchange='tasks', queue='email_queue', routing_key='e
```
```
# Consumer 2: SMS worker
channel.queue_bind(exchange='tasks', queue='sms_queue', routing_key='sms
```

#### Example - Fanout (Broadcast):

```
# Producer
channel.basic_publish(
exchange='notifications',
routing_key='', # Ignored in fanout
body='{"event": "user_signup", "user_id": 123}'
)
```
```
# Consumer 1: Email notifications
channel.queue_bind(exchange='notifications', queue='email_notifications'
```
```
# Consumer 2: SMS notifications
channel.queue_bind(exchange='notifications', queue='sms_notifications')
```
```
# Consumer 3: Push notifications
channel.queue_bind(exchange='notifications', queue='push_notifications')
```
```
# All three consumers get the same message!
```
#### Key Features:

```
✅ Flexible routing (exchanges, bindings)
✅ Priority queues
✅ Message TTL (time-to-live)
✅ Dead letter queues
✅ Per-message acknowledgment
✅ Easy to setup and use
❌ Lower throughput than Kafka (~10K-50K msgs/sec)
❌ No replay (messages deleted after consumption)
```
#### When to Use RabbitMQ:

```
✅ Traditional task queues
✅ Background job processing
✅ Request-reply pattern (RPC)
✅ Complex routing needs
✅ Need message prioritization
```

```
Examples:
```
- Email sending
- Image processing
- PDF generation
- Scheduled tasks

#### Interview Example - E-commerce Order Processing:

```
# Order placed
def place_order(user_id, items):
order = create_order(user_id, items)
```
```
# Publish to fanout exchange
channel.basic_publish(
exchange='order_placed',
routing_key='',
body=json.dumps(order)
)
```
```
# Consumer 1: Inventory
@rabbitmq_consumer(queue='inventory_queue')
def reserve_inventory(message):
order = json.loads(message.body)
for item in order['items']:
inventory.reserve(item['product_id'], item['quantity'])
```
```
# Consumer 2: Payment
@rabbitmq_consumer(queue='payment_queue')
def process_payment(message):
order = json.loads(message.body)
payment_gateway.charge(order['user_id'], order['total'])
```
```
# Consumer 3: Shipping
@rabbitmq_consumer(queue='shipping_queue')
def create_shipping_label(message):
order = json.loads(message.body)
shipping.create_label(order)
```
```
# Consumer 4: Notification
```

```
@rabbitmq_consumer(queue='notification_queue')
def notify_user(message):
order = json.loads(message.body)
email.send_order_confirmation(order['user_id'], order)
```
#### Dead Letter Queue (DLQ):

```
# Main queue with DLQ
channel.queue_declare(
queue='tasks',
arguments={
'x-dead-letter-exchange': 'dlx',
'x-message-ttl': 300000, # 5 minutes
'x-max-retries': 3
}
)
```
```
# Failed messages go to DLQ
channel.queue_declare(queue='failed_tasks')
channel.queue_bind(exchange='dlx', queue='failed_tasks')
```
```
# Consumer
def process_message(message):
try:
do_work(message)
channel.basic_ack(message.delivery_tag)
except Exception:
retries = message.headers.get('x-retry-count', 0)
if retries < 3:
# Retry
channel.basic_nack(message.delivery_tag, requeue=True)
message.headers['x-retry-count'] = retries + 1
else:
# Give up, send to DLQ
channel.basic_nack(message.delivery_tag, requeue=False)
```
### Redis Pub/Sub - Simple and Fast


#### How It Works:

```
# Publisher
redis.publish('channel:notifications', json.dumps({
'type': 'new_message',
'from': 'Alice',
'to': 'Bob'
}))
```
```
# Subscriber
pubsub = redis.pubsub()
pubsub.subscribe('channel:notifications')
```
```
for message in pubsub.listen():
if message['type'] == 'message':
data = json.loads(message['data'])
notify_user(data['to'], data)
```
#### Characteristics:

```
✅ Extremely fast (in-memory)
✅ Simple API
✅ Low latency (<1ms)
❌ No persistence (messages lost if no subscribers)
❌ No acknowledgments
❌ No ordering guarantees
❌ Fire-and-forget only
```
#### When to Use:

```
✅ Real-time notifications
✅ Cache invalidation
✅ Pub/sub patterns where loss acceptable
```
```
Example:
```
- Chat application (online/offline status)


- Live dashboards
- Cache coordination

#### Interview Example - Cache Invalidation:

```
# Server 1: Update database
def update_user(user_id, data):
db.update(user_id, data)
```
```
# Invalidate cache on all servers
redis.publish('cache:invalidate', json.dumps({
'type': 'user',
'id': user_id
}))
```
```
# All servers subscribe
pubsub = redis.pubsub()
pubsub.subscribe('cache:invalidate')
```
```
def cache_invalidation_listener():
for message in pubsub.listen():
data = json.loads(message['data'])
if data['type'] == 'user':
local_cache.delete(f"user:{data['id']}")
```
```
# Server 1 updates user
# All servers invalidate their local caches
# Next request: cache miss → fresh data from DB
```
## 9.4 Common Patterns

### 1. Work Queue Pattern

```
# Producer adds tasks
queue.publish('resize_image', {
```

```
'image_id': 12345,
'sizes': ['thumbnail', 'medium', 'large']
})
```
```
# Multiple workers compete for tasks
@worker(queue='resize_image', concurrency=10)
def resize_image(task):
image = s3.get(task['image_id'])
for size in task['sizes']:
resized = image.resize(size)
s3.put(f"{task['image_id']}_{size}", resized)
```
```
# Benefits:
# - 10 workers process in parallel
# - Automatic load balancing
# - Worker failure → task requeued
```
### 2. Priority Queue

```
# High priority: Password reset (immediate)
queue.publish('email',
{'type': 'password_reset', 'to': 'user@example.com'},
priority=10
)
```
```
# Low priority: Newsletter (can wait)
queue.publish('email',
{'type': 'newsletter', 'to': 'user@example.com'},
priority=1
)
```
```
# Worker processes high priority first
@worker(queue='email')
def send_email(task):
send(task['to'], task['type'])
```
### 3. Delayed/Scheduled Messages


```
# Send reminder in 1 hour
queue.publish('reminder',
{'user_id': 123, 'message': 'Complete your profile'},
delay=3600 # seconds
)
```
```
# Worker receives message after 1 hour
@worker(queue='reminder')
def send_reminder(task):
notify_user(task['user_id'], task['message'])
```
```
# Use cases:
# - Abandoned cart reminders
# - Trial expiration warnings
# - Subscription renewals
```
### 4. Request-Reply (RPC)

```
# Client
def get_user_recommendations(user_id):
correlation_id = generate_uuid()
```
```
# Send request
queue.publish('rpc_requests',
{'user_id': user_id, 'reply_to': correlation_id}
)
```
```
# Wait for reply
result = queue.wait_for_reply(correlation_id, timeout=5)
return result
```
```
# Server
@worker(queue='rpc_requests')
def process_recommendation_request(task):
recommendations = ml_model.get_recommendations(task['user_id'])
```
```
# Send reply
queue.publish(task['reply_to'], recommendations)
```

## 9.5 Error Handling and Reliability

### Retry Strategies

#### Exponential Backoff:

```
def process_with_retry(message):
max_retries = 5
retry_count = message.headers.get('retry_count', 0)
```
```
try:
process(message)
except Exception as e:
if retry_count < max_retries:
# Exponential backoff: 1s, 2s, 4s, 8s, 16s
delay = 2 ** retry_count
```
```
queue.publish(
message.queue,
message.body,
delay=delay,
headers={'retry_count': retry_count + 1}
)
else:
# Max retries exceeded, send to DLQ
dead_letter_queue.publish(message)
```
#### Circuit Breaker:

```
class CircuitBreaker:
def __init__(self, failure_threshold=5, timeout=60):
self.failure_count = 0
self.failure_threshold = failure_threshold
self.timeout = timeout
self.last_failure = None
self.state = 'CLOSED' # CLOSED, OPEN, HALF_OPEN
```

```
def call(self, func, *args):
if self.state == 'OPEN':
if time.time() - self.last_failure > self.timeout:
self.state = 'HALF_OPEN'
else:
raise Exception("Circuit breaker OPEN")
```
```
try:
result = func(*args)
self.on_success()
return result
except Exception as e:
self.on_failure()
raise e
```
```
def on_failure(self):
self.failure_count += 1
self.last_failure = time.time()
```
```
if self.failure_count >= self.failure_threshold:
self.state = 'OPEN'
```
```
def on_success(self):
self.failure_count = 0
self.state = 'CLOSED'
```
```
# Usage
circuit_breaker = CircuitBreaker()
```
```
@worker(queue='send_email')
def send_email(task):
circuit_breaker.call(email_service.send, task)
# If email service failing, circuit opens
# Messages queued without hammering failed service
```
## 9.6 Complete Interview Example


#### Question: “Design the notification system for Instagram (push, email, SMS)”

#### Perfect Answer:

#### "I’d use a multi-queue architecture with Kafka for events and RabbitMQ for

#### delivery:

#### Architecture:

```
Event Sources → Kafka → Fanout → RabbitMQ Queues → Workers
```
```
Events:
```
- User posts photo
- Someone likes post
- Someone comments
- New follower
- Tagged in photo

```
Kafka Topic: "user_events"
```
- High throughput (millions/second)
- All events logged
- Multiple consumers can process

```
Fanout to notification queues:
```
- push_notifications
- email_notifications
- sms_notifications

#### Implementation:

```
# Event producer (API servers)
def handle_like(post_id, liker_id):
post = db.get_post(post_id)
db.increment_likes(post_id)
```
```
# Publish event to Kafka
kafka.produce('user_events', {
'type': 'like',
'post_id': post_id,
```

'post_owner_id': post.user_id,
'liker_id': liker_id,
'timestamp': now()
})

# Notification dispatcher (Kafka consumer)
@kafka_consumer('user_events', group='notifications')
def dispatch_notification(event):
if event['type'] == 'like':
user_prefs = get_notification_preferences(event['post_owner_id']

if user_prefs['push_enabled']:
rabbitmq.publish('push_notifications', event)

if user_prefs['email_enabled']:
rabbitmq.publish('email_notifications', event, delay=300)
# Batch emails, send after 5 min

if user_prefs['sms_enabled'] and event['is_important']:
rabbitmq.publish('sms_notifications', event)

# Workers
@rabbitmq_worker('push_notifications', concurrency=50)
def send_push(event):
fcm.send_notification(
user_id=event['post_owner_id'],
title="New like",
body=f"{get_username(event['liker_id'])} liked your post"
)

@rabbitmq_worker('email_notifications', concurrency=10)
def send_email(event):
# Batch multiple notifications
batch = collect_events_for_user(event['post_owner_id'])

email.send(
to=event['post_owner_id'],
subject=f"{len(batch)} new interactions",
body=render_template('notifications_digest', batch)
)

@rabbitmq_worker('sms_notifications', concurrency=5)


```
def send_sms(event):
twilio.send_sms(
to=get_phone(event['post_owner_id']),
body=f"New like from {get_username(event['liker_id'])}"
)
```
#### Error Handling:

```
# Retry with exponential backoff
@rabbitmq_worker('push_notifications')
def send_push_with_retry(event):
try:
fcm.send_notification(event)
except FCMError:
retry_count = event.get('retry_count', 0)
if retry_count < 3:
rabbitmq.publish(
'push_notifications',
{**event, 'retry_count': retry_count + 1},
delay=2 ** retry_count * 60 # 1m, 2m, 4m
)
else:
# Give up, log to dead letter queue
dead_letter_queue.publish(event)
```
```
# Circuit breaker for external services
@rabbitmq_worker('sms_notifications')
def send_sms_protected(event):
circuit_breaker.call(twilio.send_sms, event)
# If Twilio down, circuit opens
# Messages queued without overwhelming Twilio
```
#### Scaling:

```
Traffic: 500M users, 10B events/day
```
```
Kafka:
```
- 12 partitions per topic
- 100K events/second


- 7-day retention

```
RabbitMQ:
```
- 50 push workers (10K notifications/second)
- 10 email workers (batching)
- 5 SMS workers (rate limits)

```
Monitoring:
```
- Queue depth (alert if >10K)
- Processing latency (alert if >5s)
- Error rate (alert if >1%)
- Dead letter queue size

#### Benefits:

#### Kafka ensures no event loss

#### RabbitMQ provides flexible routing

#### Scales horizontally (add workers)

#### Graceful degradation (queues buffer during spikes)

#### User preferences respected

#### Batching reduces costs"

# 10. Microservices vs Monoliths

# {#architecture-patterns}

## 10.1 Monolithic Architecture

#### What It Is:

```
Single deployable unit containing:
```
- User service
- Product service


- Order service
- Payment service
- Notification service

```
All in one codebase, one database, one deployment
```
#### Advantages:

```
✅ Simple to develop (everything in one place)
✅ Simple to deploy (one artifact)
✅ Simple to test (start one process)
✅ Easy to debug (single call stack)
✅ No network latency between components
✅ ACID transactions across entire system
```
#### Disadvantages:

```
❌ Tight coupling (change one thing, test everything)
❌ Single point of failure (one bug crashes entire app)
❌ Scaling limitations (must scale entire app, not just bottleneck)
❌ Technology lock-in (can't use different languages/frameworks)
❌ Long deployment cycles (small change = full redeploy)
❌ Large teams step on each other
```
#### When to Use Monolith:

```
✅ Small teams (<10 people)
✅ Simple domain
✅ Early-stage startup (move fast)
✅ Uncertain requirements (avoid premature optimization)
✅ Limited traffic (<10K RPS)
```
#### Interview Wisdom: “Start with monolith, migrate to microservices when needed.

#### Don’t start with microservices complexity for a system that might not need it.”


## 10.2 Microservices Architecture

#### What It Is:

```
Independent services, each with:
```
- Own codebase
- Own database
- Own deployment
- Own team

```
Communication via APIs (HTTP, gRPC, message queues)
```
#### Advantages:

```
✅ Independent scaling (scale payment service 10x, others 1x)
✅ Technology freedom (Python, Go, Java, whatever fits)
✅ Team autonomy (payments team owns payment service)
✅ Fault isolation (payment service down ≠ entire site down)
✅ Faster deployments (update one service, not all)
✅ Easier to understand (each service smaller)
```
#### Disadvantages:

```
❌ Distributed system complexity
❌ Network latency and failures
❌ Distributed transactions (hard to maintain consistency)
❌ Testing complexity (need all services running)
❌ Debugging difficulty (errors span services)
❌ Operational overhead (deploy/monitor N services)
❌ Data consistency challenges
```
#### When to Use Microservices:

```
✅ Large teams (>30 people)
✅ Different scaling needs per component
```

```
✅ Need technology flexibility
✅ Mature product with stable boundaries
✅ High traffic (>100K RPS)
```
## 10.3 Breaking Down a Monolith

#### Example - E-Commerce Monolith → Microservices:

#### Monolith:

```
ecommerce-app/
├── controllers/
│ ├── UserController
│ ├── ProductController
│ ├── OrderController
│ └── PaymentController
├── services/
├── models/
└── database (single MySQL)
```
#### Microservices:

```
User Service (Port 8001)
├── API: /users/*
├── Database: PostgreSQL (users, auth)
└── Team: Authentication team
```
```
Product Service (Port 8002)
├── API: /products/*
├── Database: PostgreSQL (products, inventory)
└── Team: Catalog team
```
```
Order Service (Port 8003)
├── API: /orders/*
├── Database: PostgreSQL (orders)
└── Team: Fulfillment team
```

```
Payment Service (Port 8004)
├── API: /payments/*
├── Database: PostgreSQL (transactions)
└── Team: Payments team
```
```
Recommendation Service (Port 8005)
├── API: /recommendations/*
├── Database: Cassandra (user behavior)
└── Team: ML team
```
#### API Gateway:

```
# Routes requests to appropriate service
@app.route('/users/<user_id>')
def get_user(user_id):
response = requests.get(f'http://user-service:8001/users/{user_id}')
return response.json()
```
```
@app.route('/products/<product_id>')
def get_product(product_id):
response = requests.get(f'http://product-service:8002/products/{prod
return response.json()
```
```
@app.route('/orders', methods=['POST'])
def create_order():
# Calls multiple services
user = requests.get(f'http://user-service:8001/users/{user_id}')
product = requests.get(f'http://product-service:8002/products/{produ
order = requests.post('http://order-service:8003/orders', data=...)
return order
```
## 10.4 Inter-Service Communication

### Synchronous (REST/gRPC)


#### REST Example:

```
# Order service needs user info
def create_order(user_id, items):
# HTTP call to user service
user = requests.get(f'http://user-service/users/{user_id}')
```
```
if not user:
return error("User not found")
```
```
# Create order
order = {
'user_id': user_id,
'user_email': user['email'], # Denormalize
'items': items
}
```
```
db.insert(order)
```
```
# HTTP call to payment service
payment = requests.post('http://payment-service/charge', {
'user_id': user_id,
'amount': calculate_total(items)
})
```
```
return order
```
#### Problems:

```
❌ Tight coupling (order service depends on user/payment)
❌ Cascading failures (user service down = can't create order)
❌ Latency (3 network calls = 150ms)
❌ Distributed transactions are hard
```
#### Solutions:

```
# 1. Circuit breaker
from circuitbreaker import circuit
```

```
@circuit(failure_threshold=5, recovery_timeout=60)
def call_user_service(user_id):
return requests.get(f'http://user-service/users/{user_id}')
```
```
# 2. Timeouts
def call_user_service(user_id):
return requests.get(f'http://user-service/users/{user_id}', timeout=
```
```
# 3. Fallback
def get_user_info(user_id):
try:
return call_user_service(user_id)
except:
# Fallback to cached data
return cache.get(f'user:{user_id}') or {'user_id': user_id}
```
```
# 4. Retry with backoff
@retry(stop=stop_after_attempt(3), wait=wait_exponential())
def call_user_service(user_id):
return requests.get(f'http://user-service/users/{user_id}')
```
### Asynchronous (Message Queues)

#### Event-Driven Example:

```
# Order service publishes event
def create_order(user_id, items):
order = db.insert_order(user_id, items)
```
```
# Publish event (don't wait)
event_bus.publish('order_created', {
'order_id': order.id,
'user_id': user_id,
'items': items,
'total': calculate_total(items)
})
```
```
return order # Return immediately
```

```
# Payment service subscribes
@subscribe('order_created')
def charge_payment(event):
payment = charge(event['user_id'], event['total'])
event_bus.publish('payment_processed', payment)
```
```
# Inventory service subscribes
@subscribe('order_created')
def reserve_inventory(event):
for item in event['items']:
inventory.reserve(item['product_id'], item['quantity'])
```
```
# Notification service subscribes
@subscribe('order_created')
def send_confirmation(event):
user = db.get_user(event['user_id'])
email.send(user.email, "Order confirmed!")
```
#### Benefits:

```
✅ Loose coupling (services don't call each other)
✅ Fault tolerant (payment service down = message queued)
✅ Fast response (order service returns immediately)
✅ Easy to add consumers (new service subscribes to events)
```
#### Trade-offs:

```
❌ Eventual consistency (payment processed later)
❌ Harder to debug (events flow through multiple services)
❌ Need message queue infrastructure
```
## 10.5 Data Management in Microservices

### Database Per Service


#### Pattern:

```
User Service → User DB
Product Service → Product DB
Order Service → Order DB
```
```
Each service owns its data
No shared database
```
#### Advantages:

```
✅ Services truly independent
✅ Can use different databases (SQL for users, NoSQL for products)
✅ Schema changes don't affect other services
✅ Easier to scale individual databases
```
#### Challenge: Data Consistency

#### Problem:

```
-- How to get user + their orders?
```
```
-- Before (monolith):
SELECT u.*, o.*
FROM users u
JOIN orders o ON u.user_id = o.user_id
WHERE u.user_id = 123
```
```
-- After (microservices):
-- Can't join across databases!
```
#### Solutions:

#### 1. API Composition:


```
def get_user_with_orders(user_id):
# Call user service
user = requests.get(f'http://user-service/users/{user_id}')
```
```
# Call order service
orders = requests.get(f'http://order-service/users/{user_id}/orders'
```
```
# Combine in application
return {
**user,
'orders': orders
}
```
#### 2. CQRS (Command Query Responsibility Segregation):

```
Write: Each service writes to own database
Read: Separate read database with denormalized data
```
```
Event flow:
```
1. Order created → Order Service writes to Order DB
2. Order Service publishes "OrderCreated" event
3. Read Model Consumer updates read database
4. Read database has user + orders together

#### 3. Saga Pattern (Distributed Transactions):

```
# Create order saga
def create_order_saga(user_id, items):
saga_id = generate_id()
```
```
# Step 1: Reserve inventory
inventory_reserved = inventory_service.reserve(items)
if not inventory_reserved:
return error("Out of stock")
```
```
# Step 2: Charge payment
try:
payment_successful = payment_service.charge(user_id, total)
```

```
except PaymentFailed:
# Compensate: unreserve inventory
inventory_service.unreserve(items)
return error("Payment failed")
```
```
# Step 3: Create order
order = order_service.create(user_id, items)
```
```
return order
```
```
# If any step fails, previous steps are compensated (rolled back)
```
## 11. Monitoring, Logging, and

## Observability {#monitoring}

## 11.1 Why Monitoring Matters

#### Without Monitoring:

- Server crashes
- No one knows for 30 minutes
- Users calling support
- Revenue lost
- Reputation damaged

#### With Monitoring:

- Server health drops
- Alert fires in 30 seconds
- Engineers paged immediately
- Auto-scaling kicks in
- Issue resolved in 2 minutes


## 11.2 The Three Pillars

### 1. Metrics (What is happening?)

#### Key Metrics:

```
Infrastructure:
```
- CPU usage: 75%
- Memory usage: 60%
- Disk I/O: 1000 IOPS
- Network: 100 Mbps

```
Application:
```
- Request rate: 5000 RPS
- Error rate: 0.5%
- Latency: p50=50ms, p95=200ms, p99=500ms
- Active users: 50,000

```
Business:
```
- Orders per minute: 200
- Revenue per hour: $10,000
- Cart abandonment rate: 30%

#### Tools:

```
Prometheus: Time-series database
Grafana: Visualization
Datadog: All-in-one
CloudWatch: AWS metrics
```
#### Implementation:

```
from prometheus_client import Counter, Histogram, Gauge
```

```
# Counter: Monotonically increasing
requests_total = Counter('requests_total', 'Total requests', ['method',
```
```
@app.route('/api/users')
def get_users():
requests_total.labels(method='GET', endpoint='/api/users').inc()
# ...
```
```
# Histogram: Distribution of values
request_duration = Histogram('request_duration_seconds', 'Request durati
```
```
@app.route('/api/products')
@request_duration.time()
def get_products():
# Automatically tracked
pass
```
```
# Gauge: Current value (can go up/down)
active_users = Gauge('active_users', 'Currently active users')
```
```
def update_active_users():
count = redis.scard('active_users')
active_users.set(count)
```
### 2. Logs (What happened?)

#### Structured Logging:

```
# Bad: Unstructured
logger.info(f"User {user_id} created order {order_id} for ${total}")
```
```
# Good: Structured (JSON)
logger.info("order_created", extra={
"user_id": user_id,
"order_id": order_id,
"total": total,
"items_count": len(items),
"payment_method": payment_method
})
```

```
# Output:
{
"timestamp": "2024-11-30T10:30:00Z",
"level": "INFO",
"message": "order_created",
"user_id": 12345,
"order_id": 67890,
"total": 99.99,
"items_count": 3,
"payment_method": "credit_card",
"service": "order-service",
"instance": "i-abc123"
}
```
#### Centralized Logging (ELK Stack):

```
Application Servers → Logstash → Elasticsearch → Kibana
(collect) (store/index) (visualize)
```
#### Log Levels:

```
logger.debug("User profile query: SELECT * FROM users WHERE id=123")
# Only in development
```
```
logger.info("User 123 logged in from IP 192.168.1.1")
# Normal operations
```
```
logger.warning("Rate limit exceeded for user 123 (10 requests in 1 secon
# Potential issues
```
```
logger.error("Failed to charge user 123: Payment gateway timeout")
# Errors that need attention
```
```
logger.critical("Database connection lost! Cannot process orders!")
# System-breaking issues
```
### 3. Tracing (Where is the bottleneck?)


#### Distributed Tracing:

```
Request flow:
API Gateway (5ms)
→ User Service (20ms)
→ Database query (15ms)
→ Product Service (50ms) ← SLOW!
→ Cache miss (1ms)
→ Database query (48ms) ← BOTTLENECK!
→ Order Service (10ms)
```
```
Total: 85ms (50ms in product service)
```
#### Implementation (OpenTelemetry):

```
from opentelemetry import trace
```
```
tracer = trace.get_tracer(__name__)
```
```
@app.route('/api/orders')
def create_order():
with tracer.start_as_current_span("create_order"):
user = get_user_info(user_id)
product = get_product_info(product_id)
order = save_order(user, product)
return order
```
```
def get_user_info(user_id):
with tracer.start_as_current_span("get_user_info"):
# HTTP call traced
return requests.get(f'http://user-service/users/{user_id}')
```
```
def get_product_info(product_id):
with tracer.start_as_current_span("get_product_info"):
# This span will show it's slow
return requests.get(f'http://product-service/products/{product_i
```
#### Tools:


```
Jaeger: Distributed tracing
Zipkin: Distributed tracing
AWS X-Ray: AWS tracing
Datadog APM: All-in-one
```
## 11.3 Alerting

#### Alert on Symptoms, Not Causes:

```
❌ Bad: "CPU usage > 80%"
(CPU high might be fine if handling traffic)
```
```
✅ Good: "Request latency p95 > 1 second"
(Users are experiencing slow response)
```
```
✅ Good: "Error rate > 1%"
(Users are seeing errors)
```
#### Alert Fatigue Prevention:

```
# Aggregate related alerts
# Instead of 100 alerts for 100 failed servers:
if failed_servers.count() > 10:
alert("Multiple servers failing (15 in us-east-1)")
```
```
# Use thresholds and duration
if error_rate > 5% for 5 minutes:
alert("High error rate sustained")
# Not: Single spike triggers alert
```
```
# Different severities
if error_rate > 10%:
page_oncall() # Wake someone up
elif error_rate > 5%:
slack_alert() # Notify team channel
```

```
elif error_rate > 1%:
log_warning() # Just track it
```
# 12. Security Fundamentals

# {#security}

## 12.1 Authentication vs Authorization

#### Authentication: Who are you? Authorization: What can you do?

#### Example:

```
User logs in with username/password → Authentication
User tries to delete post → Check if post owner → Authorization
```
## 12.2 Authentication Methods

### 1. Session-Based (Traditional)

```
# Login
def login(username, password):
user = db.authenticate(username, password)
if user:
# Create session
session_id = generate_secure_token()
redis.setex(f"session:{session_id}", 3600, json.dumps({
'user_id': user.id,
'roles': user.roles
```

##### }))

```
# Set cookie
response.set_cookie('session_id', session_id, httponly=True, sec
return "Logged in"
```
```
# Authenticate request
def authenticate(request):
session_id = request.cookies.get('session_id')
session_data = redis.get(f"session:{session_id}")
if session_data:
return json.loads(session_data)
return None
```
#### Pros:

```
✅ Simple
✅ Easy to revoke (delete session)
✅ Server has full control
```
#### Cons:

```
❌ Stateful (must store sessions)
❌ Doesn't scale across services (without shared session store)
❌ Cookie-based (doesn't work for mobile apps)
```
### 2. Token-Based (JWT)

```
import jwt
```
```
# Login
def login(username, password):
user = db.authenticate(username, password)
if user:
# Generate JWT
token = jwt.encode({
'user_id': user.id,
```

```
'roles': user.roles,
'exp': datetime.utcnow() + timedelta(hours=1)
}, SECRET_KEY, algorithm='HS256')
```
```
return {'token': token}
```
```
# Authenticate request
def authenticate(request):
token = request.headers.get('Authorization').split(' ')[1]
try:
payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
return payload
except jwt.ExpiredSignatureError:
return None
```
#### Pros:

```
✅ Stateless (no server storage)
✅ Works across services
✅ Works for mobile apps
✅ Contains user info (no DB lookup)
```
#### Cons:

```
❌ Can't easily revoke (valid until expiration)
❌ Token can grow large (lots of claims)
❌ Must protect secret key
```
### 3. OAuth 2.0 (Third-Party Login)

```
# User clicks "Login with Google"
def initiate_oauth():
# Redirect to Google
redirect(f"https://accounts.google.com/oauth/authorize?" +
f"client_id={CLIENT_ID}&" +
f"redirect_uri={CALLBACK_URL}&" +
f"scope=email profile")
```

```
# Google redirects back with code
def oauth_callback(code):
# Exchange code for token
response = requests.post('https://oauth2.googleapis.com/token', data
'code': code,
'client_id': CLIENT_ID,
'client_secret': CLIENT_SECRET,
'redirect_uri': CALLBACK_URL,
'grant_type': 'authorization_code'
})
```
```
access_token = response.json()['access_token']
```
```
# Get user info
user_info = requests.get('https://www.googleapis.com/oauth2/v1/useri
headers={'Authorization': f'Bearer {access_token}'}
).json()
```
```
# Create or update user
user = upsert_user(user_info['email'], user_info['name'])
```
```
# Create session
return create_session(user)
```
## 12.3 Authorization (Access Control)

### RBAC (Role-Based Access Control)

```
# Define roles and permissions
PERMISSIONS = {
'admin': ['read', 'write', 'delete', 'manage_users'],
'editor': ['read', 'write'],
'viewer': ['read']
}
```
```
# Check permission
```

```
def can_user_perform(user, action):
user_permissions = PERMISSIONS.get(user.role, [])
return action in user_permissions
```
```
# Decorator for endpoints
def require_permission(permission):
def decorator(func):
def wrapper(request, *args, **kwargs):
user = authenticate(request)
if not can_user_perform(user, permission):
return 403, "Forbidden"
return func(request, *args, **kwargs)
return wrapper
return decorator
```
```
@require_permission('delete')
def delete_post(request, post_id):
# Only users with 'delete' permission can access
db.delete_post(post_id)
```
## 12.4 Encryption

#### At Rest:

```
# Encrypt before storing
from cryptography.fernet import Fernet
```
```
key = Fernet.generate_key()
cipher = Fernet(key)
```
```
# Encrypt
plaintext = "sensitive data"
encrypted = cipher.encrypt(plaintext.encode())
db.store(encrypted)
```
```
# Decrypt
```

```
encrypted = db.retrieve()
plaintext = cipher.decrypt(encrypted).decode()
```
#### In Transit (TLS/HTTPS):

```
All communication over HTTPS
Load balancer terminates TLS
Or end-to-end encryption
```
#### Sensitive Data:

```
# Hash passwords (never store plaintext!)
import bcrypt
```
```
# Store
password_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
db.store(password_hash)
```
```
# Verify
stored_hash = db.retrieve()
if bcrypt.checkpw(password.encode(), stored_hash):
# Password correct
```
# 13. Complete System Design

# Examples {#examples}

## 13.1 Design URL Shortener (bit.ly)

#### Requirements:


#### Given long URL, generate short URL

#### Redirect short URL to long URL

#### Track click analytics

#### Scale: 100M URLs, 10K writes/sec, 100K reads/sec

#### Solution:

#### 1. URL Generation:

```
import hashlib
import base62
```
```
def shorten_url(long_url):
# Generate unique ID
url_id = generate_unique_id() # e.g., 1234567
```
```
# Encode to base62 (a-zA-Z0-9)
short_code = base62.encode(url_id) # e.g., "dQw4w"
```
```
# Store mapping
db.insert({
'short_code': short_code,
'long_url': long_url,
'created_at': now()
})
```
```
return f"https://short.ly/{short_code}"
```
```
def generate_unique_id():
# Option 1: Auto-increment in database
# Option 2: Snowflake ID (distributed unique IDs)
# Option 3: Hash of URL + timestamp
pass
```
#### 2. Redirect:

```
@app.route('/<short_code>')
def redirect_url(short_code):
# Check cache first
```

```
long_url = cache.get(f"url:{short_code}")
```
```
if not long_url:
# Cache miss - get from database
row = db.query(f"SELECT long_url FROM urls WHERE short_code = '{
if not row:
return 404
```
```
long_url = row['long_url']
```
```
# Cache for 1 hour
cache.set(f"url:{short_code}", long_url, ttl=3600)
```
```
# Track analytics asynchronously
analytics_queue.publish({
'short_code': short_code,
'ip': request.remote_addr,
'user_agent': request.user_agent,
'timestamp': now()
})
```
```
return redirect(long_url, code=301)
```
#### 3. Architecture:

```
User → CDN → Load Balancer → App Servers → Cache (Redis)
↓
Database (PostgreSQL)
↓
Analytics Queue (Kafka)
↓
Analytics Workers → Cassandra
```
#### 4. Database Schema:

```
CREATE TABLE urls (
short_code VARCHAR(10) PRIMARY KEY,
long_url TEXT NOT NULL,
user_id BIGINT,
```

```
created_at TIMESTAMP,
expires_at TIMESTAMP,
INDEX idx_user_id (user_id)
);
```
```
-- Sharding key: short_code (hash-based)
```
#### 5. Analytics:

```
@kafka_consumer('url_clicks')
def process_analytics(event):
# Aggregate clicks
cassandra.execute("""
UPDATE url_stats
SET click_count = click_count + 1
WHERE short_code =? AND date =?
""", [event['short_code'], today()])
```
```
# Store detailed click
cassandra.execute("""
INSERT INTO clicks (short_code, timestamp, ip, user_agent)
VALUES (?, ?, ?, ?)
""", [event['short_code'], event['timestamp'], event['ip'], event['u
```
#### 6. Scaling:

```
100M URLs:
```
- Database: 10GB (sharded across 10 nodes)
- Cache: Popular URLs (80/20 rule) = 20M URLs × 1KB = 20GB Redis

```
10K writes/sec:
```
- PostgreSQL: 1K writes/sec per node → 10 shards

```
100K reads/sec:
```
- Cache hit rate: 95%
- 95K from cache (Redis handles easily)
- 5K from database (500 reads/sec per shard)


## 13.2 Design Twitter

#### Requirements:

#### Post tweets (280 chars)

#### Follow users

#### View timeline (tweets from followed users)

#### Search tweets

#### Trending topics

#### Scale: 500M users, 200M DAU, 500M tweets/day

#### Solution:

#### 1. High-Level Architecture:

```
User → Load Balancer → API Gateway
↓
┌──────────────────┼──────────────────┐
▼ ▼ ▼
Tweet Service User Service Timeline Service
↓ ↓ ↓
Cassandra PostgreSQL Redis Cache
```
#### 2. Post Tweet:

```
def post_tweet(user_id, content):
# Validate
if len(content) > 280:
return error("Tweet too long")
```
```
# Create tweet
tweet_id = generate_id()
tweet = {
'tweet_id': tweet_id,
'user_id': user_id,
'content': content,
'timestamp': now()
```

##### }

```
# Store in Cassandra (partitioned by user_id)
cassandra.execute("""
INSERT INTO tweets (user_id, tweet_id, content, timestamp)
VALUES (?, ?, ?, ?)
""", [user_id, tweet_id, content, now()])
```
```
# Fan out to followers (async)
fanout_queue.publish({
'tweet_id': tweet_id,
'user_id': user_id,
'followers': get_follower_ids(user_id)
})
```
```
return tweet
```
```
# Fanout worker
@worker('fanout_queue')
def fanout_tweet(event):
for follower_id in event['followers']:
# Add to follower's timeline in Redis
redis.lpush(f"timeline:{follower_id}", event['tweet_id'])
redis.ltrim(f"timeline:{follower_id}", 0, 999) # Keep latest 10
```
#### 3. View Timeline:

```
def get_timeline(user_id, page=1, size=20):
# Get tweet IDs from Redis
start = (page - 1) * size
end = start + size - 1
tweet_ids = redis.lrange(f"timeline:{user_id}", start, end)
```
```
# Hydrate tweets from Cassandra
tweets = []
for tweet_id in tweet_ids:
tweet = cassandra.execute("""
SELECT * FROM tweets WHERE tweet_id =?
""", [tweet_id])
tweets.append(tweet)
```

```
return tweets
```
#### 4. Database Schemas:

```
-- PostgreSQL (User Service)
CREATE TABLE users (
user_id BIGINT PRIMARY KEY,
username VARCHAR(50) UNIQUE,
email VARCHAR(255) UNIQUE,
created_at TIMESTAMP
);
```
```
CREATE TABLE follows (
follower_id BIGINT,
following_id BIGINT,
created_at TIMESTAMP,
PRIMARY KEY (follower_id, following_id)
);
CREATE INDEX idx_following ON follows(following_id);
```
```
-- Cassandra (Tweet Service)
CREATE TABLE tweets (
user_id BIGINT,
tweet_id BIGINT,
content TEXT,
timestamp TIMESTAMP,
PRIMARY KEY ((user_id), tweet_id)
) WITH CLUSTERING ORDER BY (tweet_id DESC);
```
```
-- Redis (Timeline Service)
# timeline:{user_id} → LIST of tweet_ids
```
#### 5. Search & Trending:

```
# Elasticsearch for search
def search_tweets(query):
results = elasticsearch.search(
index="tweets",
```

```
body={
"query": {
"multi_match": {
"query": query,
"fields": ["content", "hashtags"]
}
}
}
)
return results
```
```
# Trending topics (Redis sorted set)
@kafka_consumer('tweets')
def track_trending(tweet):
hashtags = extract_hashtags(tweet['content'])
for tag in hashtags:
# Increment in time window
redis.zincrby(f"trending:{current_hour}", 1, tag)
redis.expire(f"trending:{current_hour}", 3600)
```
```
def get_trending():
# Get top 10 from current hour
return redis.zrevrange(f"trending:{current_hour}", 0, 9, withscores=
```
#### 6. Scaling:

```
500M DAU × 20 tweets viewed/day = 10B timeline reads/day
= 115K reads/second
With caching (95% hit rate): 5.75K DB reads/second
```
```
500M tweets/day = 5,787 writes/second
Cassandra sharded: 100 nodes × 100 writes/sec = 10K writes/sec capacity
```
```
Storage:
```
- 500M tweets/day × 500 bytes = 250GB/day
- 1 year = 91TB
- With replication (3x): 273TB
- Compression: ~100TB actual


#### This comprehensive guide now covers all major system design topics with

#### interview-ready examples, real-world implementations, and trade-off discussions!

# QUICK REFERENCE GUIDE

## Decision Trees for Common Scenarios

### Database Selection

```
Need transactions + complex queries? → PostgreSQL/MySQL
Need flexible schema? → MongoDB
Need time-series data? → Cassandra/InfluxDB
Need graph relationships? → Neo4j
Need caching? → Redis
Need full-text search? → Elasticsearch
```
### When to Scale

```
Single server OK: < 10K users, < 1K RPS
Vertical scaling: 10K - 100K users
Horizontal scaling: > 100K users
Microservices: > 50 engineers, > 1M users
```
### Communication Patterns

```
Need immediate response? → Synchronous (HTTP/gRPC)
Can tolerate delay? → Asynchronous (Message Queue)
Need bidirectional? → WebSocket
Need peer-to-peer? → WebRTC
```

### Caching Strategy

```
Read-heavy (90%+ reads)? → Cache aggressively (95% hit rate)
Write-heavy? → Write-through or write-back cache
Session data? → Redis with TTL
Static assets? → CDN
```
### Consistency Requirements

```
Financial transactions? → CP (Consistency over Availability)
Social media? → AP (Availability over Consistency)
Critical data? → Strong consistency
Analytics? → Eventual consistency OK
```
## Common Capacity Calculations

### Storage

```
1M users × 10KB profile = 10GB
1B images × 200KB avg = 200TB
1B videos × 2MB avg = 2PB
```
### Bandwidth

```
10K RPS × 50KB response = 500MB/sec = 4Gbps
1M concurrent streams × 5Mbps = 5Tbps
```
### Servers

```
1 server = ~1K RPS (API)
1 server = ~10K RPS (cache)
```

```
1 server = ~100K RPS (static content)
```
## Interview Checklist

### Before Design

#### [ ] Clarify functional requirements

#### [ ] Clarify non-functional requirements (scale, latency, consistency)

#### [ ] Estimate capacity (users, requests, storage)

#### [ ] Identify constraints (budget, time, team)

### During Design

#### [ ] Start with high-level architecture

#### [ ] Identify major components

#### [ ] Choose appropriate databases

#### [ ] Design APIs

#### [ ] Consider caching strategy

#### [ ] Plan for scaling

#### [ ] Think about failure modes

#### [ ] Discuss trade-offs

### Deep Dive Topics

#### [ ] Database schema

#### [ ] Sharding strategy

#### [ ] Replication approach

#### [ ] Cache invalidation

#### [ ] Load balancing algorithm

#### [ ] Message queue architecture

#### [ ] Monitoring and alerting

#### [ ] Security considerations


## Key Numbers to Remember

### Latency

```
L1 cache: 0.5 ns
L2 cache: 7 ns
RAM: 100 ns
SSD: 150 μs
HDD: 10 ms
Network (same datacenter): 0.5 ms
Network (cross-country): 50 ms
Network (intercontinental): 150 ms
```
### Throughput

```
Single core CPU: 1-10 GFLOPS
RAM bandwidth: 10-100 GB/s
SSD read: 500 MB/s - 3 GB/s
HDD read: 100 MB/s
Network (1Gbps): 125 MB/s
Network (10Gbps): 1.25 GB/s
```
### Availability

```
99%: 3.65 days/year downtime
99.9%: 8.76 hours/year
99.99%: 52 minutes/year
99.999%: 5.26 minutes/year
```
## Common Interview Questions

#### 1. Design Instagram - Focus on: Feed generation, image storage, caching


#### 2. Design Twitter - Focus on: Fanout, timeline generation, trending topics

#### 3. Design WhatsApp - Focus on: Real-time messaging, WebSocket, message

#### delivery

#### 4. Design Uber - Focus on: Real-time location, matching algorithm, surge

#### pricing

#### 5. Design Netflix - Focus on: Video encoding, CDN, recommendations

#### 6. Design URL Shortener - Focus on: Hash generation, redirection, analytics

#### 7. Design Google Drive - Focus on: File storage, sync, sharing permissions

#### 8. Design Ticketmaster - Focus on: Inventory management, serializable

#### transactions

#### 9. Design Zoom - Focus on: Video streaming, WebRTC, signaling server

#### 10. Design YouTube - Focus on: Video upload, encoding, streaming,

#### recommendations

## Final Tips

#### Do:

#### Ask clarifying questions

#### State assumptions explicitly

#### Draw diagrams

#### Discuss trade-offs

#### Consider failure scenarios

#### Think about scalability

#### Use numbers (calculate capacity)

#### Be open to feedback

#### Don’t:

#### Jump to solution immediately

#### Ignore requirements

#### Over-engineer for small scale

#### Under-engineer for large scale

#### Ignore trade-offs

#### Forget about monitoring

#### Neglect security


#### Be dogmatic about choices

#### Remember:

#### There’s no single correct answer

#### Process matters more than final design

#### Communication is key

#### Trade-offs are everywhere

#### Real-world experience helps

#### Practice makes perfect

# Good Luck with Your Interview!

# 🚀

#### This guide covers everything you need to ace system design interviews.

#### Remember:

#### Master the fundamentals

#### Practice with real examples

#### Think about trade-offs

#### Communicate clearly

#### You’ve got this!


