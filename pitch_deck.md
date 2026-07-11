# Pitch Deck Slides — LiveShop AI

This document contains slide content for investor or executive presentation. Use these structured layouts for PowerPoint, Google Slides, or Keynote decks.

---

### Slide 1: Cover Page
* **Title**: LiveShop AI
* **Subtitle**: The Shop-While-Watching Live Commerce Revolution
* **Presenter**: [Your Name/Title]
* **Logo description**: Sparkle icon + Camera silhouette inside neon magenta gradient frame.

---

### Slide 2: The Core Problem
* **Title**: Purchasing Friction in Social Live Streaming
* **Bullet Points**:
  - **Redirect Drop-offs**: Over **70%** of potential buyers drop off when redirected to external browsers from video feeds.
  - **Search Blindness**: Static search bars fail to understand natural language expressions like *"comfortable street hoodies under 3000"*.
  - **Cold Broadcaster Analytics**: Sellers streaming to platforms lack real-time conversion insights or direct viewer interaction.

---

### Slide 3: The LiveShop AI Solution
* **Title**: Zero-Friction Shop-While-Watching Portal
* **Visual Mock Layout Description**:
  - Left panel: Ultra-low latency stream (WebRTC) with pinned deal overlays.
  - Right panel: Dynamic live buyer chats + audience poll widgets.
  - Bottom panel: NLP Semantic AI search input + Visual Object Scanner.
* **Core Benefit**: Purchase items securely in under **15 seconds** without closing the live video.

---

### Slide 4: AI Discovery & Vision Tech
* **Title**: Context-Aware Semantic Engines
* **Bullet Points**:
  - **NLP Query Intent**: Utilizes OpenAI embedding vector coordinates inside Qdrant database to match descriptions, budgets, and green scores.
  - **Visual Object Scanner**: Computer vision overlays coordinate bounding boxes over streams/photos, allowing instant checkout on items seen.
  - **Conversational Assistant**: Chat guide compares specifications, suggests items, and applies live codes inline.

---

### Slide 5: Platform Architecture
* **Title**: Scalable, High-Availability Cloud Framework
* **Diagram Ref**: *Refer to final_report.md Section 5 for System Architecture*
* **Core Components**:
  - **FastAPI / Node.js API Gateway** (Kong)
  - **LiveKit / Agora SFU Media Clusters** for adaptive HD streaming
  - **Dual Database Core**: PostgreSQL (Transact/Users) + MongoDB (Dynamic Catalog)
  - **Redis Caches** sliding rate-limiters preventing fraud bots

---

### Slide 6: Database & API Design
* **Title**: Transaction Integrity & Product Schemas
* **Details**:
  - **PostgreSQL Relational DB**: Dedicated ACID compliance for buyer registrations, merchant credentials, cart receipts, and transaction logs.
  - **MongoDB Document DB**: Flexible schema mapping for product variants (colors, sizing, discount ratios) and real-time streams statistics.
  - **Restful APIs**: Endpoint schemas mapped to JWT auth handlers keeping all operations secure.

---

### Slide 7: Security & Fraud Node
* **Title**: Zero-Trust Transaction Compliance
* **Bullet Points**:
  - **Encrypted Transfers**: TLS 1.3 encryption across all internal microservice boundaries.
  - **PCI-DSS Gateway**: Complete vault integration for Cards, wallets, UPI address inputs, and automated invoices.
  - **AI Moderation Logs**: AI monitoring scanning spam rates, profanities, and double-billing gateway retries.

---

### Slide 8: The Business Model
* **Title**: Triple-Engine Monetization
* **Monetization Details**:
  - **Merchants SaaS subscriptions**: Starter Tier (15% commission) vs Pro Tier (₹2,999/mo + 8% commission) vs Enterprise Tier (₹14,999/mo + 5% commission).
  - **Live Marketplace Cut**: Standard 10% fee on basic non-subscribers.
  - **Promotional Bids**: Sellers bid to rank their active stream in user landing screen overlays.

---

### Slide 9: Growth & Roadmap (12 Months)
* **Title**: Execution Schedule & Strategy
* **Milestones**:
  - **Months 1-3**: Core platform build, closed alpha with regional streetwear brands.
  - **Months 4-6**: Integration of UPI deep-linking and subscription items.
  - **Months 7-9**: LLM adaptation for regional dialects.
  - **Months 10-12**: Broadcaster SDK rollout and Smart TV app release.

---

### Slide 10: Call to Action / Closing
* **Title**: Join the Live Commerce Revolution
* **Footer Text**:
  - *Website*: www.liveshopai.com
  - *Contact Email*: partner@liveshopai.com
  - *Slogan*: "Don't just watch. Shop in real-time."
