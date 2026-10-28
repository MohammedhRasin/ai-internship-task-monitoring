# AI-Powered Internship Task Monitoring, Evaluation and Feedback Automation System

A production-grade full-stack platform that automates the internship task management, live voice briefing, automated submission criteria comparison, rubric grading, email notification dispatch, and presentation review scheduling workflows.

---

## 🚀 Key Features

1. **Role-Based Access Control (Admin / Mentor & Intern)**:
   - Dedicated dashboards tailored for Mentors and Interns.
   - Quick one-click Role Switcher in the top bar for testing and evaluation.
   - Authenticated with Google Firebase Authentication and Cloud Firestore Enterprise database.

2. **12-Month / 48-Week Data Analytics Roadmap**:
   - Structured curriculum from Month 1 (Excel Basics) through Month 12 (Final Capstone Project).
   - Clear status indicators: **Done** (green), **Current** (blue), and **Upcoming** (gray).
   - Filterable by Month and Status with instant keyword search.
   - Every week defines concrete deliverables and evaluation rubrics.

3. **Natural Voice Task Explanation Call (Web Speech API)**:
   - Automated Mentor Call Briefing: explains task goals, deliverables, and common pitfalls using browser Speech Synthesis.
   - Interactive Voice Q&A: Interns can speak via microphone (Speech Recognition) or type questions during the call.
   - Live transcript with audio soundwave visualization.

4. **Automated AI Submission Evaluation & Criteria Comparison (Gemini 3.8 Flash)**:
   - Compares candidate code, files (.xlsx, .sql, .py, .pbix, .csv, .pdf), or written explanations against the exact task requirements and evaluation rubrics.
   - Generates a structured 4-part breakdown:
     - **What was good / Strengths**
     - **What was missed / Criteria gaps**
     - **What should be added & how to update it**
     - **Mentor coaching notes & suggested presentation date**
   - Assigns a rubric score (0-100) and marks status: **Approved** (score >= 85) or **Needs Revision**.
   - Iteration round tracking (Round #1 -> Round #2 -> Approved).

5. **Automated Email Notification Dispatch & Presentation Review Scheduler**:
   - Automatically schedules live presentation sessions with Google Meet links, dates, and times.
   - Dispatches formatted notification emails with direct Gmail web compose links (`https://mail.google.com/mail/...`) and `mailto:`.
   - In-app notification center with unread counters and email preview modals.

6. **Task-Aware AI Mentor Chatbot**:
   - Real-time mentoring powered by server-side Gemini 3.8 Flash (`gemini-3.8-flash`).
   - Contextually aware of the intern's active week and assignment.
   - Quick prompt pills: *"Give me a hint"*, *"Explain this task"*, *"Give me a practice exercise"*.

7. **Completion Celebration & Certificate**:
   - Unlocked upon completing the 48-week curriculum (with demo preview access).
   - Confetti animation and official Certificate of Completion.

8. **Feedback & Rating System**:
   - Interactive 1 to 5 star rating with suggestions and database history log.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide React, Canvas Confetti
- **Backend**: Node.js, Express running via `tsx`
- **AI Engine**: Google Gemini API (`@google/genai` with `gemini-3.8-flash`) via secure server-side proxy
- **Database**: Cloud Firestore Enterprise (`plasma-discipline-x5v9p`)
- **Authentication**: Firebase Authentication (Google Auth Provider)
- **Voice**: Browser Speech Synthesis (`window.speechSynthesis`) & Speech Recognition (`webkitSpeechRecognition`)
- **Email**: Automated notification logging and Gmail web compose links
