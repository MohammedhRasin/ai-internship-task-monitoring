import React, { useState } from 'react';
import {
  FileCheck2,
  Upload,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Send,
  Calendar,
  ExternalLink,
  FileCode,
  FileText,
  Clock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TaskItem, Submission } from '../types';

interface SubmissionPageProps {
  tasks: TaskItem[];
  currentTask: TaskItem;
  onSelectTask: (task: TaskItem) => void;
  submissions: Submission[];
  onAddSubmission: (sub: Submission) => void;
  onUpdateSubmission: (sub: Submission) => void;
  onScheduleReview: (task: TaskItem) => void;
  onOpenEmailPreview: (emailData: any) => void;
}

export const SubmissionPage: React.FC<SubmissionPageProps> = ({
  tasks,
  currentTask,
  onSelectTask,
  submissions,
  onAddSubmission,
  onUpdateSubmission,
  onScheduleReview,
  onOpenEmailPreview,
}) => {
  const { user, updateUserProgress } = useAuth();
  const isMentor = user?.role === 'mentor';

  // Submission form state
  const [deliverableUrl, setDeliverableUrl] = useState('');
  const [submissionText, setSubmissionText] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: number }[]>([]);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any | null>(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSentSuccess, setEmailSentSuccess] = useState(false);

  // Find existing submissions for this task
  const taskSubmissions = submissions.filter((s) => s.taskWeek === currentTask.weekNumber);
  const latestSubmission = taskSubmissions[taskSubmissions.length - 1];
  const iterationNumber = (latestSubmission?.iterationNumber || 0) + 1;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).map((f) => ({
        name: f.name,
        size: f.size,
      }));
      setUploadedFiles((prev) => [...prev, ...filesArray]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRunEvaluation = async () => {
    if (!submissionText.trim() && uploadedFiles.length === 0 && !deliverableUrl.trim()) {
      alert('Please provide code/notes, attach a file, or provide a deliverable link.');
      return;
    }

    try {
      setIsEvaluating(true);
      setEvaluationResult(null);
      setEmailSentSuccess(false);

      const fileNames = uploadedFiles.map((f) => f.name).join(', ');

      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: currentTask,
          submissionText,
          fileNames,
          deliverableUrl,
          iterationNumber,
          internName: user?.fullName || 'Intern',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Evaluation failed');

      setEvaluationResult(data);

      // Create new submission record
      const newSubmission: Submission = {
        id: 'sub-' + Date.now(),
        taskId: currentTask.id,
        taskWeek: currentTask.weekNumber,
        internId: user?.id || 'demo-intern',
        internName: user?.fullName || 'Intern',
        internEmail: user?.email || 'intern@example.com',
        iterationNumber,
        submissionText,
        fileNames,
        deliverableUrl,
        status: data.status as any,
        score: data.score,
        strengths: data.strengths,
        missingGaps: data.missingGaps,
        improvements: data.improvements,
        mentorNotes: data.mentorNotes,
        submittedAt: new Date().toISOString(),
        reviewedAt: new Date().toISOString(),
      };

      onAddSubmission(newSubmission);

      // If approved, update progress
      if (data.status === 'approved' && user) {
        const nextWeek = Math.max(user.currentWeek, currentTask.weekNumber + 1);
        const newCount = Math.max(user.completedTasksCount, currentTask.weekNumber);
        updateUserProgress(newCount, nextWeek);
      }
    } catch (err: any) {
      console.error('Evaluation error:', err);
      alert('Error running automated evaluation: ' + (err.message || 'Gemini service error'));
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleSendFeedbackEmail = async () => {
    if (!evaluationResult) return;

    try {
      setIsSendingEmail(true);

      const recipientEmail = user?.email || 'intern@example.com';
      const subject = `AI Evaluation Feedback (Iteration #${iterationNumber}): Week ${currentTask.weekNumber} - ${currentTask.title}`;
      const emailBody = `Hi ${user?.fullName || 'Intern'},

Your deliverable for Week ${currentTask.weekNumber} ("${currentTask.title}") has undergone automated AI criteria comparison against the task rubric.

=========================================
REVIEW SUMMARY (Iteration #${iterationNumber})
=========================================
Outcome Status: ${evaluationResult.status === 'approved' ? 'APPROVED (Completed)' : 'NEEDS REVISION'}
Overall Score: ${evaluationResult.score} / 100

WHAT WAS GOOD & STRENGTHS:
${evaluationResult.strengths}

WHAT WAS MISSED OR INCOMPLETE:
${evaluationResult.missingGaps}

WHAT SHOULD BE ADDED & HOW TO UPDATE IT:
${evaluationResult.improvements}

MENTOR NOTES:
${evaluationResult.mentorNotes}

RECOMMENDED NEXT REVIEW CALL:
${evaluationResult.suggestedNextReviewDate || 'Check calendar in dashboard'}

Please log into the platform to review your full submission feedback and upload your revised deliverable.

Best regards,
Automated Internship Mentorship System`;

      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: recipientEmail,
          subject,
          body: emailBody,
          type: 'feedback_ready',
          internName: user?.fullName,
          taskTitle: currentTask.title,
        }),
      });

      const resData = await res.json();
      setEmailSentSuccess(true);

      // Open email preview modal so user can view & launch in Gmail
      onOpenEmailPreview({
        to: recipientEmail,
        subject,
        body: emailBody,
        type: 'feedback_ready',
      });
    } catch (err) {
      console.error('Email error:', err);
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header and Task Selector */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Automated Task Comparison & Feedback Loop</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Work Submission & Review Lab</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Upload candidate code or deliverables. The system compares your work against the actual task
            specifications, identifies gaps, generates actionable updates, and logs email feedback.
          </p>
        </div>

        {/* Task Selector Dropdown */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 min-w-[280px]">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Target Assignment:
          </label>
          <select
            value={currentTask.id}
            onChange={(e) => {
              const selected = tasks.find((t) => t.id === e.target.value);
              if (selected) {
                onSelectTask(selected);
                setEvaluationResult(null);
              }
            }}
            className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden"
          >
            {tasks.map((t) => (
              <option key={t.id} value={t.id}>
                Week {t.weekNumber}: {t.title} ({t.skill})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Task Specification Card */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-7 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-white/10 font-bold text-xs text-blue-300">
              Week {currentTask.weekNumber}
            </span>
            <span className="text-xs text-slate-300 font-semibold">{currentTask.skill}</span>
          </div>
          <span className="text-xs text-indigo-300 font-medium">
            Revision Round #{iterationNumber}
          </span>
        </div>

        <h3 className="text-lg font-bold">{currentTask.title}</h3>
        <p className="text-xs text-slate-300 mt-1 leading-relaxed">{currentTask.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 text-xs">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <span className="font-bold text-blue-300 block mb-1">Required Deliverable:</span>
            <p className="text-slate-200 leading-relaxed text-[11px]">{currentTask.deliverableRequirements}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <span className="font-bold text-emerald-300 block mb-1">Evaluation Rubric:</span>
            <p className="text-slate-200 leading-relaxed text-[11px]">{currentTask.evaluationRubric}</p>
          </div>
        </div>
      </div>

      {/* Submission Input Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Deliverable Entry */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-blue-600" />
              <span>Submit Candidate Work (Iteration #{iterationNumber})</span>
            </h3>
            <span className="text-xs text-slate-500">All file formats accepted</span>
          </div>

          {/* Deliverable Link */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Deliverable URL (GitHub / Google Drive / Colab / Live Dashboard)
            </label>
            <input
              type="url"
              value={deliverableUrl}
              onChange={(e) => setDeliverableUrl(e.target.value)}
              placeholder="https://github.com/intern/data-cleaning-project or Google Drive link"
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-500 text-slate-800"
            />
          </div>

          {/* File Upload Zone */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Upload Work Files (.xlsx, .sql, .py, .pbix, .csv, .pdf, .zip, .png)
            </label>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-6 cursor-pointer bg-slate-50/50 hover:bg-blue-50/20 transition-colors">
              <Upload className="w-8 h-8 text-blue-600 mb-2" />
              <span className="text-xs font-semibold text-slate-700">Click to attach solution files</span>
              <span className="text-[11px] text-slate-400 mt-0.5">Drag and drop or browse files</span>
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {/* Uploaded File Pills */}
            {uploadedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {uploadedFiles.map((f, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-lg text-xs font-medium text-blue-800"
                  >
                    <FileCode className="w-3.5 h-3.5 text-blue-600" />
                    <span>{f.name}</span>
                    <span className="text-[10px] text-blue-500 font-normal">
                      ({Math.round(f.size / 1024)} KB)
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="text-blue-400 hover:text-red-500 font-bold ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Submission Notes & Code Snippet */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Solution Code, Formulas & Written Explanations
            </label>
            <textarea
              rows={6}
              value={submissionText}
              onChange={(e) => setSubmissionText(e.target.value)}
              placeholder="Paste your SQL queries, Python script, Excel formula logic, or summary of your cleaning methodology..."
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-500 font-mono text-slate-800 leading-relaxed"
            />
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              onClick={handleRunEvaluation}
              disabled={isEvaluating}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isEvaluating ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Comparing Actual Task Criteria with Candidate Deliverable...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run AI Automated Evaluation & Criteria Comparison</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Col: Iteration History on this Task */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-indigo-600" />
            <span>Revision Iterations for Week {currentTask.weekNumber}</span>
          </h3>

          {taskSubmissions.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-8">
              No submissions yet for this task. Submit your first draft on the left!
            </p>
          ) : (
            <div className="space-y-3">
              {taskSubmissions.map((sub, idx) => (
                <div
                  key={sub.id}
                  onClick={() => setEvaluationResult(sub)}
                  className="p-3.5 bg-slate-50 hover:bg-blue-50/60 border border-slate-200/80 rounded-2xl cursor-pointer transition-colors text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Iteration Round #{sub.iterationNumber}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        sub.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {sub.status === 'approved' ? 'Approved' : 'Needs Revision'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span>Score: {sub.score || 0}/100</span>
                    <span>
                      {new Date(sub.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Next Presentation Scheduling Button */}
          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={() => onScheduleReview(currentTask)}
              className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule Presentation Review</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Evaluation Report (Handwritten note breakdown) */}
      {evaluationResult && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-indigo-200 shadow-xl space-y-6 animate-in slide-in-from-bottom-3 duration-300">
          {/* Result Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-3">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-md ${
                  evaluationResult.status === 'approved'
                    ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                    : 'bg-amber-500 text-white shadow-amber-500/20'
                }`}
              >
                {evaluationResult.score}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-extrabold text-slate-900">
                    {evaluationResult.status === 'approved' ? 'Task Approved!' : 'Revision Required'}
                  </h3>
                  <span
                    className={`px-3 py-0.5 rounded-full text-xs font-bold ${
                      evaluationResult.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {evaluationResult.status === 'approved' ? 'Ready for Next Week' : 'Needs Revision'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Automated comparison against Week {currentTask.weekNumber} rubric specifications
                </p>
              </div>
            </div>

            {/* Email Dispatch & Scheduling Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleSendFeedbackEmail}
                disabled={isSendingEmail}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <Mail className="w-4 h-4" />
                <span>{emailSentSuccess ? 'Email Dispatched (Preview)' : 'Send Feedback Email'}</span>
              </button>

              <button
                onClick={() => onScheduleReview(currentTask)}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-2 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                <span>Schedule Review Call</span>
              </button>
            </div>
          </div>

          {/* 4 Pillars from Handwritten Notes:
              1. What is good / strengths
              2. What is missed
              3. Which should be added & how it should be updated
              4. Mentor notes & review presentation date */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Box 1: Strengths / What was good */}
            <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-5 space-y-2">
              <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5 uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>What Was Good (Strengths)</span>
              </h4>
              <p className="text-xs text-emerald-950 leading-relaxed whitespace-pre-wrap">
                {evaluationResult.strengths}
              </p>
            </div>

            {/* Box 2: What was missed */}
            <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-5 space-y-2">
              <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5 uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>What Was Missed (Criteria Gaps)</span>
              </h4>
              <p className="text-xs text-amber-950 leading-relaxed whitespace-pre-wrap">
                {evaluationResult.missingGaps}
              </p>
            </div>

            {/* Box 3: What should be added & how to update */}
            <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-5 space-y-2">
              <h4 className="text-xs font-bold text-blue-900 flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>What Should Be Added & How To Update</span>
              </h4>
              <p className="text-xs text-blue-950 leading-relaxed whitespace-pre-wrap">
                {evaluationResult.improvements}
              </p>
            </div>
          </div>

          {/* Mentor Advice & Next Review Date */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <span className="font-bold text-slate-700">Mentor Coaching Advice:</span>
              <p className="text-slate-600 italic">"{evaluationResult.mentorNotes}"</p>
            </div>
            {evaluationResult.suggestedNextReviewDate && (
              <div className="shrink-0 bg-white border border-slate-200 px-4 py-2 rounded-xl text-right">
                <span className="text-[11px] text-slate-400 block">Suggested Review Call:</span>
                <span className="font-bold text-indigo-700 text-xs">
                  {evaluationResult.suggestedNextReviewDate}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
