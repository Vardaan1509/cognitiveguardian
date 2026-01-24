# 🧠 Cognitive Guardian: Hospital-Induced Delirium Prevention
A specialized cognitive assessment system designed to detect and prevent hospital-induced delirium in patients. This tool leverages interactive hardware and AI-driven analysis to monitor cognitive health, enabling early intervention and reducing patient recovery complications.

# 🚀 Features
Interactive Cognitive Assessment: A gamified testing interface that uses hardware inputs (buttons/LEDs) to assess patient reaction times and memory retention.

Real-time Monitoring: Instantly processes patient inputs to calculate cognitive scores, flagging potential delirium symptoms for medical staff.

Hardware-Software Integration: Seamlessly connects physical assessment tools (Arduino-based) with a web-based dashboard for data visualization.

Longitudinal Tracking: Stores patient performance history to identify cognitive decline trends over time rather than just isolated incidents.

Clinician Dashboard: A clean, responsive interface for doctors and nurses to review patient metrics and manage assessment schedules.

# 🛠️ Tech Stack
Frontend: React, TypeScript, Tailwind CSS

Backend/Database: Supabase

Hardware Logic: C++ (Arduino/ESP32)

Deployment: Netlify

# 📋 Architecture
The project is architected to prioritize reliability in a clinical setting:

Input: Patients interact with physical buttons in response to LED sequences (Simon Says style game).

Data Transmission: Hardware signals are processed via Serial communication/WebSocket to the frontend application.

Analysis: The system calculates reaction latency and accuracy, comparing results against baseline cognitive models.

Persistence: Patient sessions and longitudinal data are securely stored and managed via a scalable Supabase backend.

# ⚙️ Installation & Setup
### 1. Clone the repository
```bash
git clone https://github.com/Vardaan1509/cognitiveguardian.git
cd cognitiveguardian
```
### 2. Install dependencies
```bash
npm install
```
### 3. Run the application
```bash
npm run dev
```

# 🔑 Environment Variables
To run this project, you will need to add the following environment variables to your .env file in the root directory:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_AI_API_KEY=your_ai_provider_key
```
# 🌟 About the Developer
Developed by Vardaan Mehandiratta, a Computer Engineering student at the University of Waterloo. This project showcases expertise in embedded systems, full-stack healthcare applications, and hardware-software integration.
