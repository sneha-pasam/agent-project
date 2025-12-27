# 🤖 Terminal-Bench Observer

A real-time AI Agent observability dashboard built with **Next.js**, **Python**, and **LocalStack (S3)**. This project simulates an AI agent's evaluation loop and monitors system reliability, latency, and accuracy in a local cloud environment.

## 🏗️ Architecture
- **Producer:** Python script simulating AI agent performance with randomized "chaos" (failures).
- **Storage:** LocalStack S3 bucket acting as a serverless data lake.
- **Consumer:** Next.js 15 dashboard fetching telemetry via AWS SDK and rendering live updates.

## 🚀 Getting Started

### 1. Start the Infrastructure
```powershell
docker-compose up -d
./init-s3.sh
