import React from 'react';
import {
  CheckCircle2,
  Clock,
  Sparkles,
  PhoneCall,
  Calendar,
  ArrowRight,
  TrendingUp,
  FileCheck2,
  Users,
  AlertCircle,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TaskItem, Submission, ReviewSchedule } from '../types';

interface DashboardPageProps {
  tasks: TaskItem[];
  submissions: Submission[];
  reviews: ReviewSchedule[];
  onStartVoiceCall: (task: TaskItem) => void;
  onNavigateTab: (tab: string, task?: TaskItem) => void;
  onReviewSubmission?: (sub: Submission) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  tasks,
  submissions,
  reviews,
  onStartVoiceCall,
  onNavigateTab,
  onReviewSubmission,
}) => {
  const { user } = useAuth();

  const isMentor = user?.role === 'mentor';
  const currentWeek = user?.currentWeek || 1;
  const currentTask = tasks.find((t) => t.weekNumber === currentWeek) || tasks[0];
  const completedCount = user?.completedTasksCount || 0;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  // Scheduled calls
  const upcomingReviews = reviews.filter((r) => r.status === 'scheduled');
  const nextCall = upcomingReviews[0];

  // Intern submissions
  const internSubmissions = submissions.filter((s) => isMentor || s.internId === user?.id);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Welcome & Mode Indicator */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-950/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-blue-200 mb-3 border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isMentor ? 'Mentor Control Center' : 'Active Internship Cycle'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.fullName}!
            </h1>
            <p className="text-blue-100/90 text-sm mt-1 max-w-xl">
              {isMentor
                ? 'Monitor intern deliverables, run automated AI criteria evaluations, schedule live presentation reviews, and dispatch feedback emails.'
                : `You are on Week ${currentWeek} of 48. Follow your roadmap, listen to voice briefings, and submit your work for instant automated AI comparison and feedback.`}
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15 min-w-[240px] flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-blue-200">
              <span>Overall Roadmap Progress</span>
              <span className="font-bold text-white text-base">{progressPercent}%</span>
            </div>
            <div className="w-full bg-black/30 h-2.5 rounded-full overflow-hidden my-2.5">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-700 shadow-sm"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-blue-200">
              <span>{completedCount} of 48 tasks approved</span>
              <button
                onClick={() => onNavigateTab('roadmap')}
                className="text-white hover:text-blue-200 underline text-xs font-medium"
              >
                View Roadmap →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* INTERN VIEW */}
      {!isMentor && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Current Task Hero Card (Left 2 cols) */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 font-bold flex items-center justify-center text-sm border border-blue-100">
                  W{currentTask.weekNumber}
                </span>
                <div>
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                    Current Active Assignment
                  </span>
                  <h2 className="text-xl font-bold text-slate-900">{currentTask.title}</h2>
                </div>
              </div>
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold border border-indigo-100">
                {currentTask.skill}
              </span>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Task Overview</h4>
              <p className="text-sm text-slate-700 leading-relaxed">{currentTask.description}</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-blue-600" /> Deliverable Requirements:
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">{currentTask.deliverableRequirements}</p>
            </div>

            {/* Quick Action Buttons for Current Task */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <button
                onClick={() => onStartVoiceCall(currentTask)}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl text-xs shadow-sm shadow-blue-500/20 transition-all hover:scale-[1.01]"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Listen to Voice Call</span>
              </button>

              <button
                onClick={() => onNavigateTab('submission', currentTask)}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl text-xs transition-colors"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>Submit Work & Review</span>
              </button>

              <button
                onClick={() => onNavigateTab('chat', currentTask)}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-xl text-xs transition-colors"
              >
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Ask AI Mentor</span>
              </button>
            </div>
          </div>

          {/* Right Column: Next Scheduled Presentation & Status */}
          <div className="space-y-6">
            {/* Next Scheduled Review */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  <span>Scheduled Presentation Call</span>
                </h3>
                <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  Confirmed
                </span>
              </div>

              {nextCall ? (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 text-xs">
                  <div>
                    <span className="text-slate-500 text-[11px]">Topic:</span>
                    <p className="font-semibold text-slate-900">{nextCall.taskTitle}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px]">Date & Time:</span>
                    <p className="font-bold text-indigo-700 text-sm">{nextCall.scheduledTime}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px]">Meeting URL:</span>
                    <a
                      href={nextCall.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 font-medium underline flex items-center gap-1 mt-0.5"
                    >
                      <span>Join Presentation</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs">
                  <p>No presentation scheduled yet.</p>
                  <button
                    onClick={() => onNavigateTab('reviews')}
                    className="mt-3 px-3 py-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-medium bg-indigo-50 rounded-lg inline-block"
                  >
                    Schedule Review →
                  </button>
                </div>
              )}
            </div>

            {/* Quick Tips */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl p-6 border border-indigo-100 text-xs space-y-2.5">
              <span className="font-bold text-indigo-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" /> Automated Evaluation Cycle
              </span>
              <p className="text-slate-600 leading-relaxed">
                1. Submit your code, workbook, or deliverable.
                <br />
                2. Gemini AI automatically compares your work against the rubric.
                <br />
                3. Receive detailed feedback on what was good, what was missed, and how to update it.
                <br />
                4. Repeat revision cycles until the task is approved!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MENTOR VIEW */}
      {isMentor && (
        <div className="space-y-6">
          {/* Mentor KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                <span>Total Interns Active</span>
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-2">12 Interns</div>
              <p className="text-[11px] text-emerald-600 mt-1 font-medium">↑ 3 joined this month</p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                <span>Submissions Under Review</span>
                <FileCheck2 className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-2">
                {submissions.filter((s) => s.status !== 'approved').length} Pending
              </div>
              <p className="text-[11px] text-indigo-600 mt-1 font-medium">AI evaluated & ready for sign-off</p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                <span>Scheduled Presentations</span>
                <Calendar className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-2">{upcomingReviews.length} Upcoming</div>
              <p className="text-[11px] text-slate-500 mt-1">Calendar & Google Meet invites sent</p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                <span>Avg. Approval Score</span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-2">88.4 / 100</div>
              <p className="text-[11px] text-emerald-600 mt-1 font-medium">Across all revision cycles</p>
            </div>
          </div>

          {/* Quick Action Ribbon for Mentor */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-semibold text-slate-700">Quick Mentor Actions:</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onNavigateTab('reviews')}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Schedule New Presentation Call</span>
              </button>
              <button
                onClick={() => onNavigateTab('submission')}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5"
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>Evaluate Deliverables Lab</span>
              </button>
              <button
                onClick={() => onNavigateTab('roadmap')}
                className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-medium transition-colors"
              >
                <span>Curriculum Manager</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submissions & Revision Cycles Table (Both Roles) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Recent Submissions & Evaluation Cycles</h3>
            <p className="text-xs text-slate-500">
              Iterative revision loops with automated criteria comparison and email dispatches
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('submission')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>Open Submission Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {internSubmissions.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs">
            <FileCheck2 className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p>No deliverables submitted yet.</p>
            <button
              onClick={() => onNavigateTab('submission', currentTask)}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-xl font-medium"
            >
              Submit Week {currentTask.weekNumber} Deliverable
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5">Task / Week</th>
                  <th className="py-2.5">Intern</th>
                  <th className="py-2.5">Iteration</th>
                  <th className="py-2.5">Score</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5">Submitted At</th>
                  <th className="py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {internSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 font-semibold text-slate-900">
                      Week {sub.taskWeek}: {tasks.find((t) => t.weekNumber === sub.taskWeek)?.title || sub.taskId}
                    </td>
                    <td className="py-3 text-slate-600">{sub.internName}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-semibold text-[11px]">
                        Round #{sub.iterationNumber}
                      </span>
                    </td>
                    <td className="py-3">
                      {sub.score !== undefined ? (
                        <span
                          className={`font-bold ${
                            sub.score >= 85 ? 'text-emerald-600' : 'text-amber-600'
                          }`}
                        >
                          {sub.score} / 100
                        </span>
                      ) : (
                        <span className="text-slate-400">Evaluating...</span>
                      )}
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          sub.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : sub.status === 'needs_revision'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {sub.status === 'approved' ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ) : sub.status === 'needs_revision' ? (
                          <RotateCcw className="w-3 h-3 text-amber-600" />
                        ) : (
                          <Clock className="w-3 h-3 text-blue-600" />
                        )}
                        <span>
                          {sub.status === 'approved'
                            ? 'Approved'
                            : sub.status === 'needs_revision'
                            ? 'Needs Revision'
                            : 'Submitted'}
                        </span>
                      </span>
                    </td>
                    <td className="py-3 text-slate-500">
                      {new Date(sub.submittedAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => {
                          const associatedTask = tasks.find((t) => t.weekNumber === sub.taskWeek);
                          onNavigateTab('submission', associatedTask);
                          if (onReviewSubmission) onReviewSubmission(sub);
                        }}
                        className="px-3 py-1 bg-slate-100 hover:bg-blue-50 text-blue-700 hover:text-blue-800 rounded-lg font-medium transition-colors"
                      >
                        {isMentor ? 'Review & Grade' : 'View AI Feedback'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
