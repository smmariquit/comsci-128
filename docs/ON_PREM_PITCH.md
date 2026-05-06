# Pitching UPLB CASA: The "No Vendor Lock-In" Strategy

When pitching a web app deployed on modern cloud platforms (like Vercel and Supabase), judges often ask: **"What if Vercel suddenly starts charging us $10,000 a month? What if UPLB's strict data privacy requirements mandate that student data cannot leave campus servers?"**

This is the killer answer: **"We used Infrastructure as Code (IaC) principles. We have zero vendor lock-in. We can unplug from Vercel and Supabase today and deploy entirely on UPLB's own campus hardware tomorrow."**

## How to Explain It

### 1. The Frontend (Next.js)
While Vercel is highly optimized for Next.js, Next.js itself is an open-source framework. 
- We configured the app to output a **standalone build** (`output: 'standalone'` in `next.config.ts`).
- We wrote a **`Dockerfile`** that containerizes the entire frontend into a tiny, self-sufficient Linux image.
- **The Pitch:** *"If Vercel disappears tomorrow, we just take our Docker container and run it on any server running Linux, anywhere in the world, in under 5 minutes."*

### 2. The Backend (Supabase)
Supabase is an open-source Firebase alternative. It is not a proprietary black box.
- Under the hood, it's just **PostgreSQL** (the world's most stable open-source database) paired with open-source tools like GoTrue (for Auth) and PostgREST (for APIs).
- Supabase officially provides a `docker-compose` stack.
- **The Pitch:** *"Supabase is fully open-source. If UPLB requires student data to be air-gapped on campus servers, we can self-host the entire Supabase database and authentication stack on UPLB's internal IT servers using Docker Compose. Not a single line of our frontend code would need to change—we just update the environment variables to point to the local campus IP address."*

### 3. Orchestration (Docker Compose)
- Show them the `docker-compose.yml` file. This proves that you understand Infrastructure as Code (IaC). You aren't just clicking buttons on a website; you are programmatically defining the server infrastructure in text files that can be version-controlled and replicated.

## Summary Slide Idea
You can literally have a slide titled **"Deployment Architecture"**:
- **Current State (MVP / Beta):** Vercel Edge Network + Supabase Cloud (Zero infrastructure cost, global CDN, instant scalability).
- **Future State (Production / Compliance):** On-Premise Docker Swarm + Self-Hosted PostgreSQL (Complete data sovereignty, zero vendor lock-in, controlled within UPLB).
