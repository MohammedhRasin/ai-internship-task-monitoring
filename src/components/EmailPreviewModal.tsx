import React from 'react';
import { Mail, ExternalLink, Copy, Check, X } from 'lucide-react';

interface EmailPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  emailData: {
    to: string;
    subject: string;
    body: string;
    type?: string;
    scheduledTime?: string;
    meetingLink?: string;
  } | null;
}

export const EmailPreviewModal: React.FC<EmailPreviewModalProps> = ({ isOpen, onClose, emailData }) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !emailData) return null;

  const encodedTo = encodeURIComponent(emailData.to);
  const encodedSubject = encodeURIComponent(emailData.subject);
  const encodedBody = encodeURIComponent(emailData.body);
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedTo}&su=${encodedSubject}&body=${encodedBody}`;
  const mailtoUrl = `mailto:${encodedTo}?subject=${encodedSubject}&body=${encodedBody}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`To: ${emailData.to}\nSubject: ${emailData.subject}\n\n${emailData.body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <Mail className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Automated Email Notification</h3>
              <p className="text-xs text-blue-200">Dispatched by Internship Evaluation System</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-2 gap-1">
              <span className="text-slate-500 font-medium">To Recipient:</span>
              <span className="font-semibold text-slate-800 bg-white px-2.5 py-0.5 rounded border border-slate-200">
                {emailData.to}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-2 gap-1">
              <span className="text-slate-500 font-medium">Subject Line:</span>
              <span className="font-medium text-slate-800">{emailData.subject}</span>
            </div>
            {emailData.scheduledTime && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-2 gap-1">
                <span className="text-slate-500 font-medium">Presentation Time:</span>
                <span className="text-indigo-700 font-semibold">{emailData.scheduledTime}</span>
              </div>
            )}
            {emailData.meetingLink && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-slate-500 font-medium">Meeting Link:</span>
                <a
                  href={emailData.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline font-mono text-xs break-all"
                >
                  {emailData.meetingLink}
                </a>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Email Body Content
            </label>
            <div className="p-4 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm whitespace-pre-wrap font-sans leading-relaxed shadow-inner max-h-72 overflow-y-auto">
              {emailData.body}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied to Clipboard' : 'Copy Email Text'}
          </button>

          <div className="flex items-center gap-2">
            <a
              href={mailtoUrl}
              className="px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Default Mail Client
            </a>
            <a
              href={gmailUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors"
            >
              <span>Open in Gmail</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
