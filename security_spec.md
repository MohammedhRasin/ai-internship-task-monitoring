# Security Specification & Threat Model

## Application Architecture
System: AI-Powered Internship Task Monitoring, Evaluation and Feedback Automation System
Admin / Mentor Email: `mohammedhrasin@gmail.com`

## Data Invariants
1. A user profile (`/users/{userId}`) can only be created with `userId == request.auth.uid`. Admin role escalation is restricted: only the designated mentor email `mohammedhrasin@gmail.com` or existing mentors can assign/assume mentor status.
2. Curriculum tasks (`/tasks/{taskId}`) are publicly readable by authenticated users so interns can view weekly learning tracks. Only mentors can create, update, or delete tasks.
3. Submissions (`/submissions/{submissionId}`) belong to an intern (`internId == request.auth.uid`). Interns can create submissions and update non-reviewed submissions. Mentors can review and update evaluation results.
4. Review schedules (`/review_schedules/{scheduleId}`) can be scheduled by mentors or requested by the respective intern (`internId == request.auth.uid`). Both participant intern and mentor can read them.
5. Notifications (`/notifications/{notificationId}`) can only be read by the designated recipient (`recipientId == request.auth.uid` or mentor).
6. Chat messages (`/chat_messages/{messageId}`) can only be read and written by the owner intern (`userId == request.auth.uid`).
7. Feedback reviews (`/feedback/{feedbackId}`) can be submitted by authenticated users for their own id (`userId == request.auth.uid`).

## The Dirty Dozen Payloads (Rejection Matrix)
1. Identity Spoofing on User Profile: User attempts to create a profile for another `userId`. Expected: PERMISSION_DENIED.
2. Role Escalation: Intern attempts to set `role: "mentor"` without authorization. Expected: PERMISSION_DENIED.
3. Task Tampering: Regular intern tries to overwrite curriculum task criteria. Expected: PERMISSION_DENIED.
4. Submission Theft: Intern A tries to update Intern B's submission. Expected: PERMISSION_DENIED.
5. Direct AI Score Tampering: Intern attempts to manually set `status: "approved"` and `score: 100` bypassing review. Expected: PERMISSION_DENIED.
6. Chat Snooping: Intern A queries or reads Intern B's chat history. Expected: PERMISSION_DENIED.
7. Review Schedule Hijacking: Unauthorized user attempts to delete a scheduled presentation. Expected: PERMISSION_DENIED.
8. Notification Snooping: Intern attempts to read notification addressed to another intern. Expected: PERMISSION_DENIED.
9. Rating Forgery: Intern posts feedback on behalf of someone else. Expected: PERMISSION_DENIED.
10. Unbounded Payload Attack: Client sends a 10MB payload in `submissionText`. Expected: PERMISSION_DENIED via size validation.
11. Unauthenticated Read: Anonymous or unauthenticated client accesses internal task or submission data. Expected: PERMISSION_DENIED.
12. Malicious Document ID Poisoning: Path variable injection with malformed IDs. Expected: PERMISSION_DENIED.
