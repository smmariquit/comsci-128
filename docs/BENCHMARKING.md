# Benchmarking UPLB CASA for 5,000 Concurrent Users

When pitching UPLB CASA, proving that the architecture can withstand peak load (e.g., when 5,000 students rush to apply for a dorm simultaneously) is a massive selling point.

## Why 5,000 Users is Hard to Test Locally
If you try to run a load test simulating 5,000 concurrent connections from your own laptop against `localhost:3000`:
1. **Network Stack Exhaustion**: Your OS will likely run out of ephemeral ports (TCP socket exhaustion).
2. **CPU Bottleneck**: Node.js is single-threaded. Running both the benchmark tool and the Next.js local server on the same CPU will bottleneck the CPU, giving artificially terrible results.
3. **Database Throttling**: Local database instances (or free-tier Supabase) will likely rate-limit you.

## How to Prove It Actually Works

### 1. Use the Provided k6 Script
We use [Grafana k6](https://k6.io/), the industry standard for load testing. A ready-to-use script is located at `scripts/load-test.js`.

### 2. Test Against Production, Not Localhost
Always benchmark against your Vercel deployment URL (`https://uplb.casa`), as Vercel uses Edge Caching and Serverless Functions that scale infinitely horizontally.

### 3. Execution Options

#### Option A: Distributed Cloud Testing (Best for Pitch Proof)
To accurately generate 5,000 simultaneous connections, you need to use distributed cloud testing (since a single machine can't easily fake 5,000 distinct IP addresses without getting flagged by DDoS protection).
1. Sign up for a free [Grafana Cloud](https://grafana.com/) account.
2. Install the `k6` CLI.
3. Run the script using the cloud execution engine:
   ```bash
   k6 cloud scripts/load-test.js -e TARGET_URL=https://uplb.casa
   ```
4. **Take Screenshots**: Grafana will generate a beautiful PDF report and dashboard showing flat response times (e.g., `p(95) < 300ms`) even as the user count hits 5,000. **Put these screenshots directly into your pitch deck.**

#### Option B: Local Execution (For 500-1000 Users)
If you just want to run it from your terminal to get a feel for it (keep the target around 500 to avoid locking up your Wi-Fi router):
1. Install k6:
   - Mac: `brew install k6`
   - Windows: `winget install k6`
   - Linux: `sudo dnf install k6`
2. Run locally:
   ```bash
   k6 run scripts/load-test.js
   ```

## The "Secret Sauce" to Mention in the Pitch
When the judges ask *how* you can support 5,000 concurrent users, drop these keywords:
- **"Serverless Horizontal Scaling"**: Next.js on Vercel automatically spins up hundreds of isolated serverless functions instantly to handle the traffic spike, unlike a traditional single Node.js server that would crash.
- **"Edge Caching"**: Static assets and landing pages are served from the Vercel Edge Network (CDNs physically located in Manila), meaning those requests never even hit the main server.
- **"Connection Pooling"**: Supabase utilizes PgBouncer connection pooling, meaning 5,000 web users are safely multiplexed into a few dozen safe, persistent database connections so PostgreSQL doesn't crash from connection exhaustion.
