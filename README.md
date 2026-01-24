# 🧠 Cognitive Guardian: Hospital-Induced Delirium Prevention
A specialized cognitive assessment system (CAS) designed to detect and prevent hospital-induced delirium (HID) in ICU patients. This ecosystem integrates Arduino telemetry with a gamified interface to monitor cognitive health, validated by medical professionals to reduce manual screening time by ~40%.

# 🚀 Features
Adaptive Cognitive Testing: Gamified assessments tailored across 4 distinct age demographics, ensuring accessibility and accurate baselining for elderly patients.

Secure Authentication: Robust login verification system to ensure patient data privacy and secure access for authorized medical personnel.

CSV Telemetry Archival: Built a scalable backend that archives patient performance data in CSV format, enabling easy data export for long-term trend analysis.

Multi-User Management: Supports 25+ distinct user profiles, allowing clinicians to track individual patient progress and switch contexts seamlessly.

Clinical Workflow Optimization: Streamlines the assessment process, significantly reducing the burden on nursing staff while improving response times for potential delirium symptoms.

# 🛠️ Tech Stack
Frontend: React, TypeScript, Tailwind CSS

Backend/Database: Supabase (with CSV Data Export)

Hardware Logic: C++ (Arduino/ESP32)

AI Integration: Lovable AI (Interface Prototyping & Logic)

Deployment: Netlify 

# 📋 Architecture
The project is architected to prioritize data integrity and clinical utility:

Input: Patients engage with physical hardware buttons in response to LED sequences, minimizing screen fatigue.

Processing: The system synthesizes sensor inputs to calculate reaction latency and accuracy.

Persistence: Patient telemetry is securely logged and formatted into CSV files within the Supabase backend for easy retrieval.

Visualization: Individualized dashboards render the CSV data into actionable performance trends for doctors.

# ⚙️ Installation & Setup
### 1. Clone the repository
```bash
git clone https://github.com/Vardaan1509/cognitiveguardian.git
cd cognitiveguardian
```
###2. Install dependencies
```bash
npm install
```
### 3. Run the application
```bash
npm run dev
```
### 🔑 Environment Variables
To run this project, you will need to add the following environment variables to your .env file in the root directory:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```
# 🌟 About the Developer
Developed by Vardaan Mehandiratta, a Computer Engineering student at the University of Waterloo. This project represents a convergence of embedded systems and healthcare software, specifically engineered to mitigate hospital-induced complications through non-invasive monitoring.
