import React, { useState, useEffect, useRef } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, Sparkles, User, RefreshCw, Send } from 'lucide-react';
import { TaskItem } from '../types';

interface VoiceCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: TaskItem;
  internName: string;
}

export const VoiceCallModal: React.FC<VoiceCallModalProps> = ({ isOpen, onClose, task, internName }) => {
  const [callActive, setCallActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [muted, setMuted] = useState(false);
  const [briefingScript, setBriefingScript] = useState<string>('');
  const [keyTakeaways, setKeyTakeaways] = useState<string[]>([]);
  const [commonPitfall, setCommonPitfall] = useState<string>('');
  const [loadingBriefing, setLoadingBriefing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [transcript, setTranscript] = useState<{ role: 'mentor' | 'intern'; text: string; time: string }[]>([]);
  const [userQuery, setUserQuery] = useState('');
  const [isAnswering, setIsAnswering] = useState(false);

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadBriefing();
      startCall();
    } else {
      endCall();
    }
    return () => {
      endCall();
    };
  }, [isOpen, task.id]);

  useEffect(() => {
    if (callActive) {
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setCallDuration(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callActive]);

  const loadBriefing = async () => {
    try {
      setLoadingBriefing(true);
      const res = await fetch('/api/voice-briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task, internName }),
      });
      const data = await res.json();
      if (data.spokenScript) {
        setBriefingScript(data.spokenScript);
        setKeyTakeaways(data.keyTakeaways || []);
        setCommonPitfall(data.commonPitfall || '');
        addTranscript('mentor', data.spokenScript);
        speakText(data.spokenScript);
      }
    } catch (err) {
      console.error('Failed to load briefing:', err);
      const fallback = `Hello ${internName}! In week ${task.weekNumber}, we are focusing on ${task.title}. Your main goal is ${task.description}. Make sure to test your code thoroughly before submitting your deliverable. Once submitted, our AI evaluation system and I will compare your submission against the criteria and schedule a review presentation!`;
      setBriefingScript(fallback);
      addTranscript('mentor', fallback);
      speakText(fallback);
    } finally {
      setLoadingBriefing(false);
    }
  };

  const addTranscript = (role: 'mentor' | 'intern', text: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setTranscript((prev) => [...prev, { role, text, time }]);
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    if (muted) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Pick best English voice
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
    if (naturalVoice) utterance.voice = naturalVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const startCall = () => {
    setCallActive(true);
  };

  const endCall = () => {
    setCallActive(false);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    stopListening();
  };

  const toggleMute = () => {
    if (muted) {
      setMuted(false);
      if (briefingScript && !isSpeaking) {
        speakText(briefingScript);
      }
    } else {
      setMuted(true);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
    }
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use the text input below to ask your question!');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const spoken = event.results[0][0].transcript;
        if (spoken) {
          handleInternQuestion(spoken);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.warn('Speech recognition start failed:', e);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const handleInternQuestion = async (question: string) => {
    if (!question.trim()) return;
    addTranscript('intern', question);
    setUserQuery('');
    setIsAnswering(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `On our voice call, the intern asked: "${question}". Answer directly and concisely as their spoken mentor.`,
          taskWeek: task.weekNumber,
          taskTitle: task.title,
          taskDescription: task.description,
        }),
      });
      const data = await res.json();
      const reply = data.reply || 'Great question! Focus on following the rubric criteria step-by-step.';
      addTranscript('mentor', reply);
      speakText(reply);
    } catch (err) {
      console.error('Call Q&A error:', err);
    } finally {
      setIsAnswering(false);
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Call Header */}
        <div className="bg-slate-800/80 px-6 py-4 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold">
                M
              </div>
              {isSpeaking && (
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full animate-ping" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-base">Internship Mentor Briefing Call</h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Live Audio
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Week {task.weekNumber}: {task.title} • {formatSeconds(callDuration)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className={`p-2.5 rounded-xl border transition-colors ${
                muted ? 'bg-red-500/20 border-red-500/40 text-red-400' : 'bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700'
              }`}
              title={muted ? 'Unmute Mentor Voice' : 'Mute Mentor Voice'}
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors flex items-center gap-1.5 text-xs font-semibold"
            >
              <PhoneOff className="w-4 h-4" />
              <span>End Call</span>
            </button>
          </div>
        </div>

        {/* Call Visualizer & Centerpiece */}
        <div className="p-6 bg-gradient-to-b from-slate-900 via-indigo-950/30 to-slate-900 flex flex-col items-center justify-center border-b border-slate-800">
          <div className="relative mb-4">
            <div
              className={`w-24 h-24 rounded-full flex items-center justify-center bg-gradient-to-tr from-indigo-600 to-blue-500 shadow-lg shadow-indigo-500/30 transition-transform ${
                isSpeaking ? 'scale-110' : 'scale-100'
              }`}
            >
              <Sparkles className="w-10 h-10 text-white animate-pulse" />
            </div>
            {isSpeaking && (
              <div className="absolute inset-0 rounded-full border-2 border-indigo-400 animate-ping opacity-30" />
            )}
          </div>

          {/* Sound wave bars */}
          <div className="flex items-center gap-1.5 h-8 mb-2">
            {[40, 75, 55, 90, 60, 85, 45, 95, 65, 80, 50, 70].map((h, i) => (
              <div
                key={i}
                className="w-1.5 rounded-full bg-indigo-400 transition-all duration-150"
                style={{
                  height: isSpeaking ? `${h}%` : '20%',
                  opacity: isSpeaking ? 1 : 0.3,
                }}
              />
            ))}
          </div>

          <p className="text-sm font-medium text-slate-300">
            {isSpeaking
              ? 'Mentor is speaking with natural voice...'
              : isAnswering
              ? 'Mentor is thinking...'
              : isListening
              ? 'Listening to your voice...'
              : 'Mentor ready for questions.'}
          </p>
        </div>

        {/* Live Call Transcript & Highlights */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 max-h-64 bg-slate-950/60">
          {keyTakeaways.length > 0 && (
            <div className="bg-indigo-950/40 border border-indigo-800/40 rounded-xl p-3.5 text-xs space-y-2">
              <span className="font-semibold text-indigo-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Call Key Takeaways:
              </span>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                {keyTakeaways.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
              {commonPitfall && (
                <div className="text-amber-300/90 pt-1 border-t border-indigo-900/40">
                  <span className="font-semibold">⚠️ Pitfall to avoid:</span> {commonPitfall}
                </div>
              )}
            </div>
          )}

          <div className="space-y-3">
            {transcript.map((item, idx) => (
              <div
                key={idx}
                className={`flex gap-3 text-xs leading-relaxed ${
                  item.role === 'mentor' ? 'justify-start' : 'justify-end'
                }`}
              >
                {item.role === 'mentor' && (
                  <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center shrink-0 text-[10px] font-bold">
                    M
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[80%] ${
                    item.role === 'mentor'
                      ? 'bg-slate-800 text-slate-200 border border-slate-700'
                      : 'bg-indigo-600 text-white'
                  }`}
                >
                  <p>{item.text}</p>
                  <span className="text-[10px] opacity-60 block mt-1">{item.time}</span>
                </div>
                {item.role === 'intern' && (
                  <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center shrink-0 text-[10px] font-bold">
                    <User className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Intern Interactive Speaking / Typing Controls */}
        <div className="bg-slate-900 p-4 border-t border-slate-800 flex items-center gap-3">
          <button
            onClick={isListening ? stopListening : startListening}
            className={`p-3 rounded-xl flex items-center gap-2 text-xs font-semibold transition-all ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/30'
            }`}
            title="Speak your question over microphone"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            <span>{isListening ? 'Stop Mic' : 'Speak to Mentor'}</span>
          </button>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleInternQuestion(userQuery);
            }}
            className="flex-1 flex items-center gap-2"
          >
            <input
              type="text"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder="Or type a question during the call..."
              className="flex-1 bg-slate-800 border border-slate-700 text-white text-xs px-3.5 py-2.5 rounded-xl focus:outline-hidden focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={!userQuery.trim() || isAnswering}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-300 disabled:opacity-40 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <button
            onClick={() => speakText(briefingScript)}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-300 text-xs flex items-center gap-1.5 transition-colors"
            title="Replay Spoken Briefing"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Replay</span>
          </button>
        </div>
      </div>
    </div>
  );
};
