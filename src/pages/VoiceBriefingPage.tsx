import React, { useState, useEffect, useRef } from 'react';
import {
  PhoneCall,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Sparkles,
  RefreshCw,
  Send,
  AlertCircle,
  CheckCircle2,
  ListOrdered,
  FileCheck2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TaskItem } from '../types';

interface VoiceBriefingPageProps {
  tasks: TaskItem[];
  currentTask: TaskItem;
  onSelectTask: (task: TaskItem) => void;
  onSubmitTask: (task: TaskItem) => void;
}

export const VoiceBriefingPage: React.FC<VoiceBriefingPageProps> = ({
  tasks,
  currentTask,
  onSelectTask,
  onSubmitTask,
}) => {
  const { user } = useAuth();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [muted, setMuted] = useState(false);
  const [spokenScript, setSpokenScript] = useState('');
  const [keyTakeaways, setKeyTakeaways] = useState<string[]>([]);
  const [commonPitfall, setCommonPitfall] = useState('');
  const [loading, setLoading] = useState(false);
  const [userQuestion, setUserQuestion] = useState('');
  const [conversation, setConversation] = useState<{ role: 'mentor' | 'intern'; text: string }[]>([]);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    fetchBriefing();
    return () => {
      stopSpeech();
    };
  }, [currentTask.id]);

  const fetchBriefing = async () => {
    stopSpeech();
    setLoading(true);
    try {
      const res = await fetch('/api/voice-briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: currentTask, internName: user?.fullName || 'Intern' }),
      });
      const data = await res.json();
      if (data.spokenScript) {
        setSpokenScript(data.spokenScript);
        setKeyTakeaways(data.keyTakeaways || []);
        setCommonPitfall(data.commonPitfall || '');
        setConversation([{ role: 'mentor', text: data.spokenScript }]);
        speakText(data.spokenScript);
      }
    } catch (err) {
      console.error('Error fetching voice briefing:', err);
    } finally {
      setLoading(false);
    }
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window) || muted) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(
      (v) =>
        v.lang.startsWith('en') &&
        (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel'))
    );
    if (naturalVoice) utterance.voice = naturalVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const handleVoiceQuery = async (queryText: string) => {
    if (!queryText.trim()) return;
    setConversation((prev) => [...prev, { role: 'intern', text: queryText }]);
    setUserQuestion('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `On the task briefing voice call, the intern asked: "${queryText}". Answer in concise conversational speech as their mentor.`,
          taskWeek: currentTask.weekNumber,
          taskTitle: currentTask.title,
          taskDescription: currentTask.description,
        }),
      });
      const data = await res.json();
      const reply = data.reply || 'Make sure to follow the deliverable instructions carefully.';
      setConversation((prev) => [...prev, { role: 'mentor', text: reply }]);
      speakText(reply);
    } catch (err) {
      console.error('Query error:', err);
    }
  };

  const startVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not available in your browser. Use the text input below.');
      return;
    }
    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = 'en-US';
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (e: any) => {
        const spoken = e.results[0][0].transcript;
        if (spoken) handleVoiceQuery(spoken);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 mb-2">
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Interactive Mentor Audio Call & Task Briefing</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Task Audio Explanation</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Listen to your mentor walk through the expectations, criteria, and common pitfalls using browser
            natural speech synthesis. Ask voice questions directly over the call.
          </p>
        </div>

        {/* Task Selector */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 min-w-[280px]">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Switch Week:
          </label>
          <select
            value={currentTask.id}
            onChange={(e) => {
              const selected = tasks.find((t) => t.id === e.target.value);
              if (selected) onSelectTask(selected);
            }}
            className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden"
          >
            {tasks.map((t) => (
              <option key={t.id} value={t.id}>
                Week {t.weekNumber}: {t.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Voice Briefing Hero Panel */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl overflow-hidden relative">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Animated Call Avatar */}
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div
                className={`w-28 h-28 rounded-full flex items-center justify-center bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-xl shadow-blue-500/30 transition-transform ${
                  isSpeaking ? 'scale-105' : 'scale-100'
                }`}
              >
                <Sparkles className="w-12 h-12 text-white animate-pulse" />
              </div>
              {isSpeaking && (
                <div className="absolute inset-0 rounded-full border-4 border-blue-400 animate-ping opacity-25" />
              )}
            </div>

            <h3 className="font-bold text-lg">AI Senior Mentor</h3>
            <p className="text-xs text-blue-300">Live Voice Briefing (Browser Speech)</p>

            {/* Sound Wave Animation */}
            <div className="flex items-center gap-1.5 h-8 my-3">
              {[40, 70, 50, 95, 60, 85, 40, 80, 55, 90, 45, 65].map((h, i) => (
                <div
                  key={i}
                  className="w-1.5 rounded-full bg-blue-400 transition-all duration-150"
                  style={{
                    height: isSpeaking ? `${h}%` : '20%',
                    opacity: isSpeaking ? 1 : 0.3,
                  }}
                />
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={isSpeaking ? stopSpeech : () => speakText(spokenScript)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow-xs transition-colors"
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span>{isSpeaking ? 'Pause Audio' : 'Play Explanation'}</span>
              </button>

              <button
                onClick={fetchBriefing}
                disabled={loading}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 transition-colors"
                title="Regenerate Voice Script"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Right: Spoken Script & Key Takeaways */}
          <div className="flex-1 space-y-4 max-w-xl">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-2">
              <span className="text-xs font-bold text-blue-300 uppercase tracking-wider block">
                Week {currentTask.weekNumber}: {currentTask.title}
              </span>
              <p className="text-xs text-slate-200 leading-relaxed italic font-serif">
                "{spokenScript || 'Generating audio briefing for this task...'}"
              </p>
            </div>

            {keyTakeaways.length > 0 && (
              <div className="bg-indigo-950/50 border border-indigo-800/40 rounded-2xl p-4 text-xs space-y-2">
                <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Key Focus Points:
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  {keyTakeaways.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
                {commonPitfall && (
                  <div className="text-amber-300 pt-2 border-t border-indigo-900/50">
                    <span className="font-bold">⚠️ Avoid this pitfall:</span> {commonPitfall}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Voice Q&A and Interactive Call Transcript */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Voice Call Q&A & Transcript</h3>
            <p className="text-xs text-slate-500">Ask questions using your microphone or keyboard</p>
          </div>
          <button
            onClick={() => onSubmitTask(currentTask)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Ready? Submit Work →</span>
          </button>
        </div>

        {/* Conversation Logs */}
        <div className="space-y-3 max-h-72 overflow-y-auto">
          {conversation.map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl text-xs leading-relaxed max-w-[85%] ${
                item.role === 'mentor'
                  ? 'bg-slate-50 border border-slate-200 text-slate-800 mr-auto'
                  : 'bg-blue-600 text-white ml-auto'
              }`}
            >
              <span className="font-bold block mb-1">
                {item.role === 'mentor' ? 'Senior Mentor:' : 'You (Intern):'}
              </span>
              <p>{item.text}</p>
            </div>
          ))}
        </div>

        {/* Voice Query Controls */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={startVoiceInput}
            className={`p-3 rounded-xl flex items-center gap-2 text-xs font-semibold transition-all ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            <span>{isListening ? 'Listening...' : 'Speak Question'}</span>
          </button>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleVoiceQuery(userQuestion);
            }}
            className="flex-1 flex items-center gap-2"
          >
            <input
              type="text"
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
              placeholder="Ask a clarifying question about this task..."
              className="flex-1 text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden text-slate-800"
            />
            <button
              type="submit"
              disabled={!userQuestion.trim()}
              className="p-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs transition-colors disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
