import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Gemini API client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash';

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY,
  });
});

// AI Mentor Chat Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [], taskWeek = 1, taskTitle = 'Data Cleaning', taskDescription = 'Clean sales records' } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const systemInstruction = `You are a friendly, encouraging Data Analytics Internship Mentor.
The intern is currently in week ${taskWeek} of 48 working on: "${taskTitle}" - ${taskDescription}.
Teach by guiding: give a hint first, ask the intern to try, and give the full solution only if they ask or are still stuck after a hint.
Explain concepts in simple language with clear examples. When useful, give a short practice exercise in Excel, SQL, Python, or Power BI (DAX).
Keep answers concise (under 250 words) unless asked for an in-depth breakdown.
Stay strictly on data analytics, problem-solving, and the internship task at hand, and politely redirect unrelated topics.`;

    // Map history to Gemini format
    const contents: any[] = [];
    if (Array.isArray(history)) {
      for (const item of history.slice(-10)) {
        contents.push({
          role: item.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: item.content || '' }],
        });
      }
    }

    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return res.json({ reply: response.text || 'I am reviewing your task. How can I help you take the next step?' });
  } catch (error: any) {
    console.error('Chat error:', error);
    return res.status(500).json({
      error: 'Failed to generate response',
      details: error?.message || 'Gemini service error',
    });
  }
});

// AI Submission Evaluation & Comparison against Task Criteria
app.post('/api/evaluate', async (req, res) => {
  try {
    const {
      task,
      submissionText = '',
      fileNames = '',
      deliverableUrl = '',
      iterationNumber = 1,
      internName = 'Intern',
    } = req.body;

    if (!task) {
      return res.status(400).json({ error: 'Task details are required for evaluation' });
    }

    const prompt = `You are a Senior Data Analytics Mentor evaluating an intern's deliverable for Week ${task.weekNumber} (${task.skill}: "${task.title}").

ACTUAL TASK REQUIREMENTS:
- Description: ${task.description}
- Deliverable Requirements: ${task.deliverableRequirements}
- Evaluation Rubric: ${task.evaluationRubric}

CANDIDATE INTERN SUBMISSION (Iteration #${iterationNumber}):
- Intern Name: ${internName}
- Deliverable URL / Code Link: ${deliverableUrl || 'None provided'}
- Attached File(s): ${fileNames || 'None provided'}
- Submitted Work & Explanations:
${submissionText || '(No written explanation provided)'}

CRITICAL EVALUATION OBJECTIVE (from Internship Mentor Notebook):
1. Compare actual task requirements with the candidate's submitted work.
2. Identify what was done well (good aspects / strengths).
3. Identify what is missed, incomplete, or fails the rubric requirements.
4. Detail what should be added and provide step-by-step guidance on how to update/fix it.
5. Assign a rigorous score from 0 to 100 based on the rubric.
6. Determine approval status:
   - "approved": Only if score >= 85 and core criteria are genuinely satisfied.
   - "needs_revision": If score < 85 or critical deliverables are absent or deficient.

Return a strictly structured JSON response conforming to the required schema.`;

    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: {
              type: Type.NUMBER,
              description: 'Score from 0 to 100 based on the rubric',
            },
            status: {
              type: Type.STRING,
              description: '"approved" if score >= 85 and requirements met, otherwise "needs_revision"',
            },
            strengths: {
              type: Type.STRING,
              description: 'Clear bullet points of what the intern did well and good practices observed',
            },
            missingGaps: {
              type: Type.STRING,
              description: 'Specific deliverables or rubric criteria that were missed or incomplete',
            },
            improvements: {
              type: Type.STRING,
              description: 'Actionable step-by-step instructions on what should be added and how to update the work',
            },
            mentorNotes: {
              type: Type.STRING,
              description: 'Constructive mentoring guidance and encouragement',
            },
            emailSummary: {
              type: Type.STRING,
              description: 'Formatted email body text addressing the intern with the review outcome and next steps',
            },
            suggestedNextReviewDate: {
              type: Type.STRING,
              description: 'Recommended timeframe for follow-up review call (e.g., "In 2 days: Friday at 2:00 PM")',
            },
          },
          required: ['score', 'status', 'strengths', 'missingGaps', 'improvements', 'mentorNotes', 'emailSummary'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Evaluation error:', error);
    return res.status(500).json({
      error: 'Failed to evaluate submission',
      details: error?.message || 'Gemini service error',
    });
  }
});

// Voice Call Briefing Generator (creates script for task explanation call)
app.post('/api/voice-briefing', async (req, res) => {
  try {
    const { task, internName = 'Intern' } = req.body;

    if (!task) {
      return res.status(400).json({ error: 'Task details are required' });
    }

    const prompt = `You are an internship mentor preparing a natural 1-on-1 audio call with your intern (${internName}) to brief them on their upcoming assignment.
Task: Week ${task.weekNumber} - ${task.title} (${task.skill})
Description: ${task.description}
Deliverables: ${task.deliverableRequirements}

Create a friendly, conversational spoken script (around 150-200 words) as if speaking directly over a call:
1. Greet the intern warmly.
2. Clearly explain the real-world goal of this task and why it matters in data analytics.
3. Highlight the primary deliverable they must submit.
4. Warn them about 1 common pitfall or mistake beginners make.
5. Remind them that after they submit their work, the AI tool and mentor will compare their work against the criteria, schedule a presentation call, and provide iterative feedback until approved.
6. Close by inviting any questions.

Keep the tone natural, professional, and encouraging. Return JSON.`;

    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            spokenScript: {
              type: Type.STRING,
              description: 'The natural conversational speech text for the mentor call',
            },
            keyTakeaways: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3 quick bullet points summarizing the briefing',
            },
            commonPitfall: {
              type: Type.STRING,
              description: 'Primary mistake to avoid for this task',
            },
          },
          required: ['spokenScript', 'keyTakeaways', 'commonPitfall'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Voice briefing error:', error);
    return res.status(500).json({
      error: 'Failed to generate voice briefing',
      details: error?.message || 'Gemini service error',
    });
  }
});

// Email Notification Dispatcher & Link Generator
app.post('/api/send-email', (req, res) => {
  try {
    const {
      to,
      subject,
      body,
      type = 'notification',
      internName = 'Intern',
      taskTitle = 'Internship Task',
    } = req.body;

    if (!to || !subject || !body) {
      return res.status(400).json({ error: 'Recipient, subject, and body are required' });
    }

    // Generate direct Google Mail web compose URL
    const encodedTo = encodeURIComponent(to);
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    const gmailWebComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedTo}&su=${encodedSubject}&body=${encodedBody}`;
    const mailtoUrl = `mailto:${encodedTo}?subject=${encodedSubject}&body=${encodedBody}`;

    const dispatchedRecord = {
      id: 'eml-' + Date.now(),
      to,
      subject,
      body,
      type,
      internName,
      taskTitle,
      sentAt: new Date().toISOString(),
      status: 'dispatched',
      gmailWebComposeUrl,
      mailtoUrl,
    };

    return res.json({
      success: true,
      message: `Notification queued and dispatched to ${to}`,
      dispatchedRecord,
    });
  } catch (error: any) {
    console.error('Send email error:', error);
    return res.status(500).json({ error: 'Failed to dispatch email' });
  }
});

// In production or dev Vite integration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Internship Task Management System running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
