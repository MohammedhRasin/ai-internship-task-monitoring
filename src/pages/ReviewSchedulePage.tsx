import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Video,
  Mail,
  Send,
  ExternalLink,
  Plus,
  CheckCircle2,
  CalendarDays,
  Sparkles,
  User,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TaskItem, ReviewSchedule } from '../types';

interface ReviewSchedulePageProps {
  tasks: TaskItem[];
  reviews: ReviewSchedule[];
  onAddReview: (review: ReviewSchedule) => void;
  onOpenEmailPreview: (emailData: any) => void;
  preselectedTask?: TaskItem;
}

export const ReviewSchedulePage: React.FC<ReviewSchedulePageProps> = ({
  tasks,
  reviews,
  onAddReview,
  onOpenEmailPreview,
  preselectedTask,
}) => {
  const { user } = useAuth();
  const isMentor = user?.role === 'mentor';

  const [selectedTaskId, setSelectedTaskId] = useState(preselectedTask?.id || tasks[0]?.id || '');
  const [internName, setInternName] = useState(isMentor ? 'Sarah Chen (Intern)' : user?.fullName || 'Intern');
  const [internEmail, setInternEmail] = useState(isMentor ? 'intern.sarah@example.com' : user?.email || 'intern@example.com');
  const [scheduledDate, setScheduledDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [scheduledTime, setScheduledTime] = useState('14:30');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/ais-intern-review');
  const [agendaNotes, setAgendaNotes] = useState('Deliverable presentation, rubric review, Q&A on data transformations.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedTask = tasks.find((t) => t.id === selectedTaskId) || tasks[0];

  const handleScheduleReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingLink || !scheduledDate || !scheduledTime) {
      alert('Please fill out date, time, and meeting link.');
      return;
    }

    try {
      setIsSubmitting(true);
      const fullDateTimeString = `${scheduledDate} at ${scheduledTime} UTC`;

      const newReview: ReviewSchedule = {
        id: 'rev-' + Date.now(),
        internId: user?.id || 'demo-intern',
        internName,
        internEmail,
        taskId: selectedTask.id,
        taskTitle: `Week ${selectedTask.weekNumber}: ${selectedTask.title}`,
        scheduledTime: fullDateTimeString,
        meetingLink,
        status: 'scheduled',
        notes: agendaNotes,
        createdAt: new Date().toISOString(),
      };

      onAddReview(newReview);

      // Automated email composition as per handwritten note item #2
      const subject = `Presentation Review Scheduled: Week ${selectedTask.weekNumber} - ${selectedTask.title}`;
      const emailBody = `Hi ${internName},

Your presentation review for Week ${selectedTask.weekNumber} (${selectedTask.title}) has been scheduled.

=========================================
PRESENTATION DETAILS
=========================================
Topic: ${selectedTask.title} (${selectedTask.skill})
Date & Time: ${fullDateTimeString}
Google Meet Link: ${meetingLink}

Agenda & Objectives:
- 10 min presentation of your submitted code and deliverables.
- Review of automated AI criteria comparison and rubric scoring.
- Guidance on revisions or greenlight for task completion.

Notes from Mentor:
${agendaNotes}

Please ensure you are ready with your screen shared and code open.

Best regards,
Internship Mentorship Team`;

      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: internEmail,
          subject,
          body: emailBody,
          type: 'review_scheduled',
          internName,
          taskTitle: selectedTask.title,
        }),
      });

      // Open email preview modal for user
      onOpenEmailPreview({
        to: internEmail,
        subject,
        body: emailBody,
        type: 'review_scheduled',
        scheduledTime: fullDateTimeString,
        meetingLink,
      });
    } catch (err) {
      console.error('Schedule review error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 mb-2">
            <Mail className="w-3.5 h-3.5" />
            <span>Automated Email Dispatch & Presentation Scheduler</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Presentation Reviews & Calendar</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Schedule live presentation meetings with Google Meet links. The system automatically drafts and
            dispatches calendar invitation emails directly to the intern.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Schedule Form (Left 1 col) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <CalendarDays className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">Schedule Presentation Call</h3>
          </div>

          <form onSubmit={handleScheduleReview} className="space-y-3.5 text-xs">
            {/* Task Select */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Task / Week</label>
              <select
                value={selectedTaskId}
                onChange={(e) => setSelectedTaskId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden text-slate-800 font-medium"
              >
                {tasks.map((t) => (
                  <option key={t.id} value={t.id}>
                    Week {t.weekNumber}: {t.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Intern Name & Email */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Intern Name</label>
                <input
                  type="text"
                  value={internName}
                  onChange={(e) => setInternName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden text-slate-800"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Intern Email</label>
                <input
                  type="email"
                  value={internEmail}
                  onChange={(e) => setInternEmail(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden text-slate-800"
                />
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Review Date</label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden text-slate-800"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Review Time</label>
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden text-slate-800"
                />
              </div>
            </div>

            {/* Meeting Link */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Meeting Link (Google Meet / Zoom)
              </label>
              <div className="flex gap-1.5">
                <input
                  type="url"
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden text-slate-800 font-mono text-[11px]"
                />
              </div>
            </div>

            {/* Agenda Notes */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Agenda / Mentor Notes</label>
              <textarea
                rows={3}
                value={agendaNotes}
                onChange={(e) => setAgendaNotes(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden text-slate-800"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-sm shadow-blue-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <Mail className="w-4 h-4" />
              <span>Schedule Call & Send Email</span>
            </button>
          </form>
        </div>

        {/* Scheduled Reviews Calendar & Dispatched Emails Log (Right 2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Scheduled Presentation Calls</h3>
              <p className="text-[11px] text-slate-500">Live review sessions with automated calendar notifications</p>
            </div>
            <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 font-bold rounded-full text-xs">
              {reviews.length} Total
            </span>
          </div>

          {reviews.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              <Calendar className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p>No presentation sessions scheduled yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 rounded-2xl transition-colors text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{rev.taskTitle}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {rev.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                      <span className="flex items-center gap-1 font-semibold text-indigo-700">
                        <Clock className="w-3.5 h-3.5" /> {rev.scheduledTime}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" /> {rev.internName} ({rev.internEmail})
                      </span>
                    </div>
                    {rev.notes && <p className="text-slate-600 text-[11px] italic mt-1">"{rev.notes}"</p>}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={rev.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Call</span>
                    </a>
                    <button
                      onClick={() =>
                        onOpenEmailPreview({
                          to: rev.internEmail,
                          subject: `Presentation Review: ${rev.taskTitle}`,
                          body: `Scheduled presentation for ${rev.taskTitle} on ${rev.scheduledTime}.\nMeeting Link: ${rev.meetingLink}\n\nNotes: ${rev.notes || 'None'}`,
                          scheduledTime: rev.scheduledTime,
                          meetingLink: rev.meetingLink,
                        })
                      }
                      className="p-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl transition-colors"
                      title="Preview Invitation Email"
                    >
                      <Mail className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
