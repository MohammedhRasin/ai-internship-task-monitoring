import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { VoiceCallModal } from './components/VoiceCallModal';
import { EmailPreviewModal } from './components/EmailPreviewModal';
import { DashboardPage } from './pages/DashboardPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { SubmissionPage } from './pages/SubmissionPage';
import { VoiceBriefingPage } from './pages/VoiceBriefingPage';
import { ReviewSchedulePage } from './pages/ReviewSchedulePage';
import { ChatPage } from './pages/ChatPage';
import { FeedbackPage } from './pages/FeedbackPage';
import { CompletionPage } from './pages/CompletionPage';
import { INITIAL_TASKS } from './lib/roadmapData';
import { TaskItem, Submission, ReviewSchedule, NotificationItem, ChatMessage, PlatformFeedback } from './types';
import { db } from './lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: 'sub-1',
    taskId: 'task-1',
    taskWeek: 1,
    internId: 'demo-intern-101',
    internName: 'Sarah Chen (Intern)',
    internEmail: 'intern.sarah@example.com',
    iterationNumber: 1,
    submissionText: 'Standardized retail transaction dates using Text to Columns and TRIM. Deduped 124 redundant customer invoice rows. Cleaned currency strings.',
    fileNames: 'cleaned_sales_q1.xlsx',
    deliverableUrl: 'https://github.com/intern/sales-cleaning',
    status: 'approved',
    score: 94,
    strengths: 'Excellent whitespace trimming, zero formula errors, and comprehensive data audit sheet.',
    missingGaps: 'None for core requirements.',
    improvements: 'Next time consider wrapping formulas with LET for added readability.',
    mentorNotes: 'Solid foundation for week 1!',
    submittedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    reviewedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'sub-2',
    taskId: 'task-2',
    taskWeek: 2,
    internId: 'demo-intern-101',
    internName: 'Sarah Chen (Intern)',
    internEmail: 'intern.sarah@example.com',
    iterationNumber: 1,
    submissionText: 'Used VLOOKUP without exact match flag causing #N/A errors on regional codes.',
    fileNames: 'vlookup_pricing.xlsx',
    status: 'needs_revision',
    score: 68,
    strengths: 'Table ranges were named properly.',
    missingGaps: 'Exact match FALSE was missing; 14 rows returned mismatched pricing.',
    improvements: 'Upgrade formulas to modern XLOOKUP with fourth argument fallback for missing customer keys.',
    mentorNotes: 'Please correct the lookup arguments and resubmit.',
    submittedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    reviewedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'sub-3',
    taskId: 'task-2',
    taskWeek: 2,
    internId: 'demo-intern-101',
    internName: 'Sarah Chen (Intern)',
    internEmail: 'intern.sarah@example.com',
    iterationNumber: 2,
    submissionText: 'Refactored to XLOOKUP with IFERROR and added customer tier verification sheet.',
    fileNames: 'vlookup_pricing_v2.xlsx',
    status: 'approved',
    score: 96,
    strengths: 'Outstanding recovery! Clean XLOOKUP syntax with automated fallback labels.',
    missingGaps: 'All prior gaps resolved.',
    improvements: 'Ready for conditional formulas in Week 3.',
    mentorNotes: 'Approved after revision round 2.',
    submittedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    reviewedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'sub-4',
    taskId: 'task-3',
    taskWeek: 3,
    internId: 'demo-intern-101',
    internName: 'Sarah Chen (Intern)',
    internEmail: 'intern.sarah@example.com',
    iterationNumber: 1,
    submissionText: 'Created dynamic summary tables with SUMIFS and COUNTIFS for quarterly bonus thresholds.',
    fileNames: 'quarterly_bonus_sumifs.xlsx',
    status: 'approved',
    score: 91,
    strengths: 'Accurate multi-criteria logic and well-formatted KPI cards.',
    missingGaps: 'None.',
    improvements: 'Can use conditional formatting to highlight top performers.',
    mentorNotes: 'Great work! Proceed to Week 4.',
    submittedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    reviewedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

const INITIAL_REVIEWS: ReviewSchedule[] = [
  {
    id: 'rev-1',
    internId: 'demo-intern-101',
    internName: 'Sarah Chen',
    internEmail: 'intern.sarah@example.com',
    taskId: 'task-4',
    taskTitle: 'Week 4: Data Sorting, Advanced Filtering & Quality Checklist',
    scheduledTime: 'Tomorrow at 14:00 UTC',
    meetingLink: 'https://meet.google.com/ais-intern-review',
    status: 'scheduled',
    notes: 'Live walkthrough of outlier heatmaps and inventory checklist.',
    createdAt: new Date().toISOString(),
  },
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    recipientId: 'demo-intern-101',
    recipientEmail: 'intern.sarah@example.com',
    type: 'review_scheduled',
    subject: 'Presentation Call Scheduled: Week 4 Inventory Quality Review',
    body: 'Hi Sarah, your presentation call has been confirmed for Tomorrow at 14:00 UTC. Meeting URL: https://meet.google.com/ais-intern-review. Please prepare your Excel workbook.',
    sentAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    isRead: false,
  },
  {
    id: 'notif-2',
    recipientId: 'demo-intern-101',
    recipientEmail: 'intern.sarah@example.com',
    type: 'feedback_ready',
    subject: 'AI Evaluation Complete: Week 3 Deliverable Approved (Score 91/100)',
    body: 'Hi Sarah, your SUMIFS quarterly bonus deliverable has passed automated evaluation with a score of 91/100. Excellent logic and dynamic cell references.',
    sentAt: new Date(Date.now() - 86400000).toISOString(),
    isRead: true,
  },
];

const INITIAL_CHATS: ChatMessage[] = [
  {
    id: 'chat-1',
    userId: 'demo-intern-101',
    role: 'assistant',
    content: 'Hello! I am your AI Internship Mentor. How can I help you tackle your Week 4 Data Filtering and Quality Checklist deliverable?',
    taskWeek: 4,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

const INITIAL_FEEDBACKS: PlatformFeedback[] = [
  {
    id: 'fb-1',
    userId: 'demo-intern-101',
    userName: 'Sarah Chen',
    rating: 5,
    comment: 'The automated voice briefing on the call and instant AI rubric comparison helped me spot errors before my mentor presentation!',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

function AppContent() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [submissions, setSubmissions] = useState<Submission[]>(() => {
    const saved = localStorage.getItem('internship_submissions');
    return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
  });
  const [reviews, setReviews] = useState<ReviewSchedule[]>(() => {
    const saved = localStorage.getItem('internship_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('internship_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('internship_chats');
    return saved ? JSON.parse(saved) : INITIAL_CHATS;
  });
  const [feedbacks, setFeedbacks] = useState<PlatformFeedback[]>(() => {
    const saved = localStorage.getItem('internship_feedbacks');
    return saved ? JSON.parse(saved) : INITIAL_FEEDBACKS;
  });

  const [activeTask, setActiveTask] = useState<TaskItem>(tasks[3] || tasks[0]);
  const [voiceCallTask, setVoiceCallTask] = useState<TaskItem | null>(null);
  const [emailModalData, setEmailModalData] = useState<any | null>(null);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('internship_submissions', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem('internship_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('internship_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('internship_chats', JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem('internship_feedbacks', JSON.stringify(feedbacks));
  }, [feedbacks]);

  // Keep active task synced with currentWeek
  useEffect(() => {
    if (user?.currentWeek) {
      const match = tasks.find((t) => t.weekNumber === user.currentWeek);
      if (match) setActiveTask(match);
    }
  }, [user?.currentWeek, tasks]);

  // Handle adding submission
  const handleAddSubmission = (sub: Submission) => {
    setSubmissions((prev) => [sub, ...prev]);

    // Also add automated notification
    const notif: NotificationItem = {
      id: 'notif-' + Date.now(),
      recipientId: sub.internId,
      recipientEmail: sub.internEmail,
      type: 'feedback_ready',
      subject: `Evaluation Ready: Week ${sub.taskWeek} (Score: ${sub.score ?? 0}/100)`,
      body: `Your submission for Week ${sub.taskWeek} has received automated feedback. Status: ${sub.status}.`,
      sentAt: new Date().toISOString(),
      isRead: false,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const handleUpdateSubmission = (updated: Submission) => {
    setSubmissions((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleAddReview = (review: ReviewSchedule) => {
    setReviews((prev) => [review, ...prev]);

    const notif: NotificationItem = {
      id: 'notif-' + Date.now(),
      recipientId: review.internId,
      recipientEmail: review.internEmail,
      type: 'review_scheduled',
      subject: `Review Scheduled: ${review.taskTitle}`,
      body: `Presentation scheduled on ${review.scheduledTime}. Link: ${review.meetingLink}`,
      sentAt: new Date().toISOString(),
      isRead: false,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const handleAddFeedback = (fb: PlatformFeedback) => {
    setFeedbacks((prev) => [fb, ...prev]);
  };

  const handleSendMessage = (msg: ChatMessage) => {
    setChatMessages((prev) => [...prev, msg]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        notifications={notifications}
        onOpenEmailPreview={(email) => setEmailModalData(email)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <DashboardPage
            tasks={tasks}
            submissions={submissions}
            reviews={reviews}
            onStartVoiceCall={(task) => setVoiceCallTask(task)}
            onNavigateTab={(tab, task) => {
              if (task) setActiveTask(task);
              setActiveTab(tab);
            }}
          />
        )}

        {activeTab === 'roadmap' && (
          <RoadmapPage
            tasks={tasks}
            onStartVoiceCall={(task) => setVoiceCallTask(task)}
            onSubmitTask={(task) => {
              setActiveTask(task);
              setActiveTab('submission');
            }}
            onAskMentor={(task) => {
              setActiveTask(task);
              setActiveTab('chat');
            }}
          />
        )}

        {activeTab === 'submission' && (
          <SubmissionPage
            tasks={tasks}
            currentTask={activeTask}
            onSelectTask={(task) => setActiveTask(task)}
            submissions={submissions}
            onAddSubmission={handleAddSubmission}
            onUpdateSubmission={handleUpdateSubmission}
            onScheduleReview={(task) => {
              setActiveTask(task);
              setActiveTab('reviews');
            }}
            onOpenEmailPreview={(email) => setEmailModalData(email)}
          />
        )}

        {activeTab === 'voice' && (
          <VoiceBriefingPage
            tasks={tasks}
            currentTask={activeTask}
            onSelectTask={(task) => setActiveTask(task)}
            onSubmitTask={(task) => {
              setActiveTask(task);
              setActiveTab('submission');
            }}
          />
        )}

        {activeTab === 'reviews' && (
          <ReviewSchedulePage
            tasks={tasks}
            reviews={reviews}
            onAddReview={handleAddReview}
            onOpenEmailPreview={(email) => setEmailModalData(email)}
            preselectedTask={activeTask}
          />
        )}

        {activeTab === 'chat' && (
          <ChatPage
            currentTask={activeTask}
            chatMessages={chatMessages}
            onSendMessage={handleSendMessage}
            onClearChat={() => setChatMessages([])}
          />
        )}

        {activeTab === 'feedback' && (
          <FeedbackPage feedbacks={feedbacks} onAddFeedback={handleAddFeedback} />
        )}

        {activeTab === 'completed' && (
          <CompletionPage onNavigateTab={(tab) => setActiveTab(tab)} />
        )}
      </main>

      {/* Floating Voice Call Modal */}
      {voiceCallTask && (
        <VoiceCallModal
          isOpen={!!voiceCallTask}
          onClose={() => setVoiceCallTask(null)}
          task={voiceCallTask}
          internName={user?.fullName || 'Intern'}
        />
      )}

      {/* Email Preview & Gmail Compose Modal */}
      {emailModalData && (
        <EmailPreviewModal
          isOpen={!!emailModalData}
          onClose={() => setEmailModalData(null)}
          emailData={emailModalData}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>AI-Powered Internship Task Monitoring, Evaluation & Feedback Automation System</span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('completed')}
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Preview Completion Screen
            </button>
            <span className="text-slate-300">•</span>
            <span>Gemini 3.8 Flash • Cloud Firestore • Web Speech API</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
