import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  Clock,
  Sparkles,
  PhoneCall,
  FileCheck2,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TaskItem } from '../types';

interface RoadmapPageProps {
  tasks: TaskItem[];
  onStartVoiceCall: (task: TaskItem) => void;
  onSubmitTask: (task: TaskItem) => void;
  onAskMentor: (task: TaskItem) => void;
}

export const RoadmapPage: React.FC<RoadmapPageProps> = ({
  tasks,
  onStartVoiceCall,
  onSubmitTask,
  onAskMentor,
}) => {
  const { user } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState<number | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'done' | 'current' | 'upcoming'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  const currentWeek = user?.currentWeek || 1;
  const completedCount = user?.completedTasksCount || 0;

  // Month skills map for headings
  const MONTH_HEADERS: Record<number, string> = {
    1: 'Month 1: Excel Basics (Formulas, Cleaning, Sorting, Filtering)',
    2: 'Month 2: Excel Advanced (Pivot Tables, Charts, First Dashboard)',
    3: 'Month 3: SQL Basics (SELECT, WHERE, GROUP BY, Aggregates)',
    4: 'Month 4: SQL Advanced (Joins, Subqueries, Window Functions)',
    5: 'Month 5: Python Basics (Syntax, Loops, Functions, Files)',
    6: 'Month 6: Python for Analysis (Pandas & NumPy)',
    7: 'Month 7: Data Visualization (Matplotlib, Seaborn, Chart Design)',
    8: 'Month 8: Power BI Basics (Importing Data, Cleaning, Reports)',
    9: 'Month 9: Power BI Advanced (DAX Measures, Interactive Dashboards)',
    10: 'Month 10: Statistics (Mean, Variance, Distributions, Hypothesis Tests)',
    11: 'Month 11: Statistics + Storytelling (Regression, Presenting Insights)',
    12: 'Month 12: Final Capstone Project (End-to-End Enterprise Project)',
  };

  const getTaskStatus = (weekNum: number): 'done' | 'current' | 'upcoming' => {
    if (weekNum < currentWeek) return 'done';
    if (weekNum === currentWeek) return 'current';
    return 'upcoming';
  };

  const filteredTasks = tasks.filter((t) => {
    if (selectedMonth !== 'all' && t.monthNumber !== selectedMonth) return false;
    const status = getTaskStatus(t.weekNumber);
    if (selectedStatus !== 'all' && status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.skill.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Group by month
  const groupedTasks: Record<number, TaskItem[]> = {};
  filteredTasks.forEach((t) => {
    if (!groupedTasks[t.monthNumber]) groupedTasks[t.monthNumber] = [];
    groupedTasks[t.monthNumber].push(t);
  });

  const monthsPresent = Object.keys(groupedTasks).map(Number).sort((a, b) => a - b);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>12 Months • 48 Weekly Tasks Curriculum</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Data Analytics Internship Roadmap</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Each week has one concrete deliverable. Complete them in order to trigger AI criteria comparison,
            feedback reports, and presentation scheduling.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-slate-500">Current Position</div>
            <div className="text-base font-bold text-blue-700">Week {currentWeek} of 48</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black flex items-center justify-center text-sm shadow-md shadow-blue-500/20">
            {Math.round((completedCount / tasks.length) * 100)}%
          </div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks, skills, or deliverables..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-500 text-slate-800"
          />
        </div>

        {/* Month Selector */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Month:
          </span>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-700 focus:outline-hidden"
          >
            <option value="all">All 12 Months</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                Month {m}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
          {(['all', 'current', 'done', 'upcoming'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1 rounded-lg font-medium capitalize transition-colors ${
                selectedStatus === st ? 'bg-white text-blue-700 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks Grouped by Month */}
      <div className="space-y-8">
        {monthsPresent.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center text-slate-400 text-xs border border-slate-200">
            No tasks found matching your filters.
          </div>
        ) : (
          monthsPresent.map((monthNum) => (
            <div key={monthNum} className="space-y-4">
              {/* Month Header Banner */}
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-slate-900 text-white font-bold rounded-xl text-xs">
                  Month {monthNum}
                </span>
                <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                  {MONTH_HEADERS[monthNum] || `Month ${monthNum}`}
                </h3>
              </div>

              {/* Tasks in this month */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {groupedTasks[monthNum].map((task) => {
                  const status = getTaskStatus(task.weekNumber);
                  const isExpanded = expandedTaskId === task.id;

                  return (
                    <div
                      key={task.id}
                      className={`bg-white rounded-2xl border p-5 transition-all shadow-xs flex flex-col justify-between ${
                        status === 'current'
                          ? 'border-blue-400 ring-2 ring-blue-500/10 shadow-blue-500/5'
                          : status === 'done'
                          ? 'border-emerald-200/80 bg-emerald-50/20'
                          : 'border-slate-200 opacity-90'
                      }`}
                    >
                      <div className="space-y-3">
                        {/* Top row: Week badge & Status badge */}
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-800 text-xs font-bold">
                            Week {task.weekNumber}
                          </span>

                          {/* Status Badge as specified in PDF */}
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 ${
                              status === 'done'
                                ? 'bg-emerald-100 text-emerald-800'
                                : status === 'current'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {status === 'done' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                            {status === 'current' && <Clock className="w-3 h-3 text-blue-600" />}
                            <span className="capitalize">{status}</span>
                          </span>
                        </div>

                        {/* Task Title & Skill */}
                        <div>
                          <span className="text-[11px] font-semibold text-indigo-600 block mb-0.5">
                            {task.skill} {task.isFinalProject ? '• Final Capstone' : ''}
                          </span>
                          <h4 className="font-bold text-slate-900 text-sm leading-snug">{task.title}</h4>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                          {task.description}
                        </p>

                        {/* Collapsible details for deliverables and rubrics */}
                        {isExpanded && (
                          <div className="pt-3 border-t border-slate-100 space-y-2.5 text-xs animate-in fade-in duration-150">
                            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80">
                              <span className="font-bold text-slate-800 block mb-1">
                                Deliverable Requirements:
                              </span>
                              <p className="text-slate-600 leading-relaxed text-[11px]">
                                {task.deliverableRequirements}
                              </p>
                            </div>

                            <div className="bg-indigo-50/50 rounded-xl p-3 border border-indigo-100">
                              <span className="font-bold text-indigo-900 block mb-1">
                                Evaluation Rubric & Criteria:
                              </span>
                              <p className="text-indigo-800 leading-relaxed text-[11px]">
                                {task.evaluationRubric}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Card Footer Actions */}
                      <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button
                          onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                          className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
                        >
                          <span>{isExpanded ? 'Less details' : 'View deliverable & rubric'}</span>
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => onStartVoiceCall(task)}
                            className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors"
                            title="Listen to Voice Call Briefing"
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onAskMentor(task)}
                            className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors"
                            title="Ask AI Mentor"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onSubmitTask(task)}
                            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors"
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
