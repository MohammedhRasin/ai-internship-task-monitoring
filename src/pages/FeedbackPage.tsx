import React, { useState } from 'react';
import { Star, CheckCircle2, MessageSquare, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PlatformFeedback } from '../types';

interface FeedbackPageProps {
  feedbacks: PlatformFeedback[];
  onAddFeedback: (feedback: PlatformFeedback) => void;
}

export const FeedbackPage: React.FC<FeedbackPageProps> = ({ feedbacks, onAddFeedback }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const userFeedbacks = feedbacks.filter((f) => f.userId === user?.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a star rating (1 to 5).');
      return;
    }

    const newFeedback: PlatformFeedback = {
      id: 'fb-' + Date.now(),
      userId: user?.id || 'demo-user',
      userName: user?.fullName || 'Intern',
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };

    onAddFeedback(newFeedback);
    setSubmitted(true);
    setRating(0);
    setComment('');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm text-center">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-3 border border-amber-100">
          <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">Internship Experience Feedback</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
          Share your feedback on the tasks, voice briefings, AI evaluations, and mentoring guidance to help
          improve the curriculum.
        </p>
      </div>

      {/* Feedback Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        {submitted ? (
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3 animate-in zoom-in-95 duration-200">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-emerald-900 text-base">Thank you for your feedback!</h3>
            <p className="text-xs text-emerald-800">
              Your rating and suggestions have been recorded in the database.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold"
            >
              Submit Another Review
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Clickable 1-5 Stars */}
            <div className="text-center space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Overall Learning Rating (1 to 5 Stars) *
              </label>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const filled = (hoverRating || rating) >= star;
                  return (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 text-slate-300 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          filled ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-slate-400">
                {rating > 0 ? `Selected: ${rating} of 5 Stars` : 'Click a star to rate'}
              </p>
            </div>

            {/* Comment Area */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Suggestions, Comments & Experience
              </label>
              <textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What was most helpful? How was the voice explanation and automated review feedback?"
                className="w-full text-xs p-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-hidden focus:border-indigo-500 text-slate-800 leading-relaxed"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Submit Feedback</span>
            </button>
          </form>
        )}
      </div>

      {/* Previous Submissions List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-sm">Your Previous Feedback</h3>

        {userFeedbacks.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">No previous reviews submitted yet.</p>
        ) : (
          <div className="space-y-3">
            {userFeedbacks.map((fb) => (
              <div
                key={fb.id}
                className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          fb.rating >= s ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {new Date(fb.createdAt).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                {fb.comment && <p className="text-slate-700 leading-relaxed">"{fb.comment}"</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
