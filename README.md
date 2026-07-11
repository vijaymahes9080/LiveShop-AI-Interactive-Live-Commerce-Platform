# 🎥 LiveShop AI — Interactive Live Commerce Platform (V2.0)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite-blue)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-green)](https://fastapi.tiangolo.com/)
[![Database](https://img.shields.io/badge/Databases-PostgreSQL%20%2B%20MongoDB%20%2B%20Qdrant-orange)](https://qdrant.tech/)

> **Shop While Watching:** A next-generation interactive live commerce platform that merges low-latency streaming entertainment with instant purchasing.

---

## 🌟 Key Features

*   **Zero-Friction Checkout:** Buy showcased or pinned products in under 15 seconds via side-by-side transaction overlays without leaving the stream.
*   **AI-Powered Semantic Discovery:** Intent-driven conversational search combining OpenAI text embeddings (`text-embedding-3-small`) and Qdrant vector database queries for semantic product recommendations.
*   **Visual Product Search:** Drag-and-drop video frame scanner to map visual coordinates and find similar catalog items using visual embeddings.
*   **Synchronized Host Overlays:** Live broadcaster interaction tools including interactive polling, real-time reactions, flash deal pins, and live chat.
*   **Merchant Console:** Real-time stream performance analytics, SVG revenue charts, active poll builder, and catalog management panel.

---

## 🛠 Tech Stack

### Frontend
- **Framework:** React 19 (SPA)
- **Bundler & Dev Server:** Vite 8
- **Styling:** Vanilla CSS (Glassmorphism & micro-animations)
- **Icons:** Lucide React

### Backend & AI Infrastructure (Production Architecture)
- **Application Services:** FastAPI (Python) on AWS EKS
- **Databases:** PostgreSQL (Relational transactions/users), MongoDB (Catalog & streams), Qdrant (1536-dim Vector Database)
- **Real-Time StreamSFU:** LiveKit SFU / Agora WebRTC channels
- **Transcoding Pipeline:** AWS Elemental MediaLive (multirate HLS) + Amazon S3 & CloudFront CDN
- **AI Models:** OpenAI Embeddings API & GPT-based conversational parsing

---

## 📐 System Architecture

### High-Level System Workflow
```mermaid
graph TD
    Client[Web & Mobile Apps] -->|Route requests| CDN[Cloudflare CDN]
    CDN -->|Inspect traffic| Gateway[Kong API Gateway]

    subgraph Security & Session
        Gateway -->|Validate JWT| Auth[Cognito/OAuth Service]
        Gateway -->|Rate limiting| RedisCache[(Redis Rate-Limiter)]
    end

    subgraph Core Microservices
        Gateway -->|Stream metadata| StreamSvc[LiveKit Streaming Service]
        Gateway -->|Catalog CRUD| CatalogSvc[Product Catalog Service]
        Gateway -->|Semantic Search| AISvc[AI Search & NLP Engine]
        Gateway -->|Orders & Payments| OrderSvc[Transaction Service]
    end

    subgraph Data Stores
        StreamSvc --> MongoDB[(MongoDB: Stream Sessions)]
        CatalogSvc --> Postgres[(PostgreSQL: Catalog Metadata)]
        AISvc --> Qdrant[(Qdrant: 1536-dim Vector DB)]
        AISvc --> ES[(Elasticsearch: Text Inverted Index)]
        OrderSvc --> Postgres
    end
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- Git

### Installation & Development Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/vijaymahes9080/LiveShop-AI-Interactive-Live-Commerce-Platform.git
   cd "LiveShop AI — Interactive Live Commerce Platform"
   ```

2. **Install Frontend Dependencies:**
   ```bash
   npm install
   ```

3. **Start Frontend Development Server:**
   ```bash
   npm run dev
   ```
   *The client application will run at `http://localhost:5173`.*

4. **Build for Production:**
   ```bash
   npm run build
   ```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Vijay Mahes**
- Email: [Vijaypradhap2004@gmail.com](mailto:Vijaypradhap2004@gmail.com)
- GitHub: [@vijaymahes9080](https://github.com/vijaymahes9080)
