import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, Compass, Star, CheckCircle, Sparkles, Download, Share2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface CompletionPageProps {
  onNavigateTab: (tab: string) => void;
}

export const CompletionPage: React.FC<CompletionPageProps> = ({ onNavigateTab }) => {
  const { user } = useAuth();

  useEffect(() => {
    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // ignore
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in zoom-in-95 duration-300">
      {/* Celebration Hero Card */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-900 rounded-3xl p-8 sm:p-12 text-white text-center shadow-2xl relative overflow-hidden">
        {/* CSS floating sparkles */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0,transparent_70%)] animate-pulse" />

        <div className="relative z-10 space-y-4">
          <div className="w-20 h-20 bg-amber-400 text-amber-950 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-amber-400/30">
            <Award className="w-10 h-10" />
          </div>

          {/* Exact required text from specification */}
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight max-w-2xl mx-auto leading-tight">
            Congratulations! You have successfully completed your internship!
          </h1>

          <p className="text-blue-100 text-sm max-w-lg mx-auto">
            You have mastered 48 weekly curriculum milestones, passed automated AI criteria evaluations,
            defended your deliverables in presentation reviews, and concluded your final capstone project.
          </p>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto pt-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <span className="text-2xl font-black text-white">48 / 48</span>
              <span className="block text-[11px] text-blue-200 uppercase tracking-wider mt-1">
                Tasks Completed
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <span className="text-2xl font-black text-white">12 Months</span>
              <span className="block text-[11px] text-blue-200 uppercase tracking-wider mt-1">
                Full Roadmap
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <span className="text-2xl font-black text-white">6 Core Skills</span>
              <span className="block text-[11px] text-blue-200 uppercase tracking-wider mt-1">
                Excel to Capstone
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <span className="text-2xl font-black text-emerald-300">100%</span>
              <span className="block text-[11px] text-blue-200 uppercase tracking-wider mt-1">
                Evaluation Pass
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Official Certificate of Completion Card */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border-4 border-double border-amber-300 shadow-xl space-y-6 text-center relative">
        <div className="space-y-1">
          <span className="text-xs font-bold text-amber-700 tracking-widest uppercase block">
            Google AI Studio • Data Analytics Internship Program
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900">
            Certificate of Completion
          </h2>
          <p className="text-xs text-slate-400">Awarded for demonstration of technical and analytical mastery</p>
        </div>

        <div className="py-4 border-y border-slate-100 space-y-1">
          <span className="text-xs text-slate-500 uppercase tracking-wider">This acknowledges that</span>
          <h3 className="text-2xl font-bold text-indigo-700">{user?.fullName || 'Sarah Chen'}</h3>
          <p className="text-xs text-slate-600 max-w-xl mx-auto pt-2">
            has diligently completed all requirements of the 48-Week Data Analytics Internship, covering
            Advanced Excel Modeling, Relational SQL, Python Data Science, Power BI Business Intelligence,
            Statistical Analysis, and the End-to-End Capstone Project.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 pt-2 gap-4">
          <div className="text-center sm:text-left">
            <span className="block font-semibold text-slate-800">Date Issued:</span>
            <span>{new Date().toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div className="text-center sm:text-right">
            <span className="block font-semibold text-slate-800">Verification ID:</span>
            <span className="font-mono text-[11px] text-slate-400">CERT-AIS-2026-TASK48-PASS</span>
          </div>
        </div>
      </div>

      {/* Required Navigation Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={() => onNavigateTab('roadmap')}
          className="px-6 py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-2xl text-xs flex items-center gap-2 shadow-xs transition-colors"
        >
          <Compass className="w-4 h-4 text-blue-600" />
          <span>Review 48-Week Roadmap</span>
        </button>

        <button
          onClick={() => onNavigateTab('feedback')}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs flex items-center gap-2 shadow-md shadow-indigo-600/20 transition-colors"
        >
          <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
          <span>Leave Program Feedback</span>
        </button>
      </div>
    </div>
  );
};
