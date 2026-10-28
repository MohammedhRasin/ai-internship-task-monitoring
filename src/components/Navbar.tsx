import React, { useState } from 'react';
import {
  BrainCircuit,
  LayoutDashboard,
  Compass,
  FileCheck2,
  PhoneCall,
  CalendarDays,
  MessageSquare,
  Award,
  Star,
  Bell,
  Shield,
  UserCheck,
  LogOut,
  LogIn,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { NotificationItem } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  notifications: NotificationItem[];
  onOpenEmailPreview?: (email: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  notifications,
  onOpenEmailPreview,
}) => {
  const { user, loginWithGoogle, logout, switchRole, dbConnected } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'roadmap', label: '48-Week Roadmap', icon: Compass },
    { id: 'submission', label: 'Submission & Review', icon: FileCheck2 },
    { id: 'voice', label: 'Voice Call Briefing', icon: PhoneCall },
    { id: 'reviews', label: 'Presentation & Emails', icon: CalendarDays },
    { id: 'chat', label: 'AI Mentor Chat', icon: MessageSquare },
    { id: 'feedback', label: 'Rate Platform', icon: Star },
    { id: 'completed', label: 'Celebration', icon: Award },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Banner with Role Switcher & Database Sync Indicator */}
      <div className="bg-slate-900 text-white text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-medium text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            AI Internship Automation System
          </span>
          <span className="hidden sm:inline text-slate-500">•</span>
          <span className="hidden sm:inline text-slate-400">
            Cloud Firestore: {dbConnected ? 'Connected (Enterprise)' : 'Ready'}
          </span>
        </div>

        {/* Dual-Role Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-[11px]">Current Mode:</span>
          <div className="flex bg-slate-800 p-0.5 rounded-lg border border-slate-700">
            <button
              onClick={() => switchRole('intern')}
              className={`flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-medium transition-colors ${
                user?.role === 'intern'
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserCheck className="w-3 h-3" />
              <span>Intern</span>
            </button>
            <button
              onClick={() => switchRole('mentor')}
              className={`flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-medium transition-colors ${
                user?.role === 'mentor'
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Shield className="w-3 h-3" />
              <span>Mentor / Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-600/20">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-base leading-tight">MentorAI</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    user?.role === 'mentor'
                      ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                      : 'bg-blue-100 text-blue-700 border border-blue-200'
                  }`}
                >
                  {user?.role === 'mentor' ? 'Admin / Mentor' : 'Intern'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">Task Monitoring & Evaluation Automation</p>
            </div>
          </div>

          {/* Desktop Navigation Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold shadow-xs border border-blue-100'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Notifications & Auth */}
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title="Email & System Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
                    <span className="font-semibold text-slate-900 text-sm">Dispatched Email Alerts</span>
                    <span className="text-[11px] text-blue-600 font-medium">{notifications.length} total</span>
                  </div>
                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-4">No notifications yet.</p>
                    ) : (
                      notifications.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            setShowNotifications(false);
                            if (onOpenEmailPreview) {
                              onOpenEmailPreview({
                                to: item.recipientEmail,
                                subject: item.subject,
                                body: item.body,
                                type: item.type,
                              });
                            }
                          }}
                          className="p-3 bg-slate-50 hover:bg-blue-50/70 border border-slate-200/80 rounded-xl cursor-pointer transition-colors"
                        >
                          <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                            <span className="truncate max-w-[200px]">{item.subject}</span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(item.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 line-clamp-2 mt-1">{item.body}</p>
                          <span className="text-[10px] text-blue-600 font-medium inline-block mt-1">
                            Click to preview full email & open in Gmail →
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile / Auth Button */}
            <div className="flex items-center gap-2">
              <div className="hidden md:flex flex-col text-right">
                <span className="text-xs font-semibold text-slate-900 leading-tight">{user?.fullName}</span>
                <span className="text-[11px] text-slate-500">{user?.email}</span>
              </div>
              <button
                onClick={user?.id.startsWith('demo-') ? loginWithGoogle : logout}
                className="p-2 text-slate-600 hover:text-red-600 hover:bg-slate-100 rounded-xl transition-colors"
                title={user?.id.startsWith('demo-') ? 'Sign in with Google' : 'Sign out'}
              >
                {user?.id.startsWith('demo-') ? <LogIn className="w-5 h-5" /> : <LogOut className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden border-t border-slate-100 px-2 py-2 overflow-x-auto flex items-center gap-1 bg-slate-50/80">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                isActive ? 'bg-blue-600 text-white font-semibold' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
