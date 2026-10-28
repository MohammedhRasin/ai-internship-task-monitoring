import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  Bot,
  User,
  Lightbulb,
  HelpCircle,
  Code2,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TaskItem, ChatMessage } from '../types';

interface ChatPageProps {
  currentTask: TaskItem;
  chatMessages: ChatMessage[];
  onSendMessage: (msg: ChatMessage) => void;
  onClearChat?: () => void;
}

export const ChatPage: React.FC<ChatPageProps> = ({
  currentTask,
  chatMessages,
  onSendMessage,
  onClearChat,
}) => {
  const { user } = useAuth();
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      userId: user?.id || 'demo-user',
      role: 'user',
      content: text,
      taskWeek: currentTask.weekNumber,
      createdAt: new Date().toISOString(),
    };

    onSendMessage(userMsg);
    setInputMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: chatMessages.slice(-10),
          taskWeek: currentTask.weekNumber,
          taskTitle: currentTask.title,
          taskDescription: currentTask.description,
        }),
      });

      const data = await res.json();
      const replyText = data.reply || 'I am ready to guide you on this task.';

      const assistantMsg: ChatMessage = {
        id: 'msg-' + (Date.now() + 1),
        userId: user?.id || 'demo-user',
        role: 'assistant',
        content: replyText,
        taskWeek: currentTask.weekNumber,
        createdAt: new Date().toISOString(),
      };

      onSendMessage(assistantMsg);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: 'msg-' + (Date.now() + 1),
        userId: user?.id || 'demo-user',
        role: 'assistant',
        content: 'I had trouble connecting to the mentoring engine. Please try again.',
        taskWeek: currentTask.weekNumber,
        createdAt: new Date().toISOString(),
      };
      onSendMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    { label: 'Give me a hint', prompt: 'Give me a subtle hint on how to get started on this week’s deliverable without giving away the full answer.' },
    { label: 'Explain this task', prompt: 'Explain the core concept behind this task in simple language with a mini example.' },
    { label: 'Give me a practice exercise', prompt: 'Give me a short 5-minute practice coding exercise or formula challenge matching this week’s skill.' },
    { label: 'Common mistakes', prompt: 'What are the top 2 mistakes interns usually make on this specific task?' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl mx-auto">
      {/* Header with Task Context */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">AI Internship Mentor Chat</h1>
            <p className="text-xs text-slate-500">
              Active Context: <span className="font-semibold text-indigo-600">Week {currentTask.weekNumber} ({currentTask.skill}: {currentTask.title})</span>
            </p>
          </div>
        </div>

        {onClearChat && chatMessages.length > 0 && (
          <button
            onClick={onClearChat}
            className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1 self-start sm:self-center transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Quick Prompt Pills (Specified in PDF) */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 mr-1">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Quick guidance:
        </span>
        {quickPrompts.map((qp, i) => (
          <button
            key={i}
            onClick={() => handleSend(qp.prompt)}
            disabled={isLoading}
            className="px-3 py-1.5 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-xl text-xs font-medium text-slate-700 hover:text-indigo-700 transition-colors shadow-xs"
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 min-h-[460px] max-h-[580px] overflow-y-auto flex flex-col space-y-4">
        {chatMessages.length === 0 ? (
          <div className="my-auto text-center py-12 space-y-3">
            <Bot className="w-12 h-12 mx-auto text-indigo-400" />
            <h3 className="font-bold text-slate-800 text-base">Your AI Mentor is here to assist</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Ask questions about Week {currentTask.weekNumber}'s deliverable, ask for syntax hints in SQL or
              Python, or request a practice challenge.
            </p>
          </div>
        ) : (
          chatMessages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 text-xs leading-relaxed ${
                  isUser ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-xs shadow-xs ${
                    isUser ? 'bg-blue-600' : 'bg-indigo-600'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[80%] rounded-2xl p-4 shadow-xs ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none font-sans'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <span
                    className={`text-[10px] block mt-1.5 ${
                      isUser ? 'text-blue-100 text-right' : 'text-slate-400'
                    }`}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })
        )}

        {isLoading && (
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
              <span>Mentor is analyzing your question...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="bg-white rounded-2xl p-2.5 border border-slate-200 shadow-sm flex items-center gap-2"
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={`Ask about ${currentTask.title} (Press Enter to send)...`}
          disabled={isLoading}
          className="flex-1 text-xs px-3 py-2 bg-transparent text-slate-800 focus:outline-hidden disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!inputMessage.trim() || isLoading}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors disabled:opacity-40"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
};
