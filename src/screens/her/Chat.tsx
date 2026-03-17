import { useState, useRef, useEffect } from 'react';
import { Send, PenLine } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCycle } from '../../hooks/useCycle';
import { sendMessage } from '../../lib/em';
import { getPhase } from '../../lib/phases';
import type { ChatMessage } from '../../types';

export default function Chat() {
  const { profile } = useAuth();
  const { currentPhase, dayOfCycle } = useCycle(profile);
  const phase = getPhase(currentPhase);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      role: 'assistant',
      content: `Hi ${profile?.name ?? 'there'}. I'm Em. I'm here whenever you need me, whether you have a question, want some advice, or just need to talk. What's on your mind?`,
      created_at: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function handleSend() {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const text = await sendMessage([...messages, userMsg], {
        phase: currentPhase,
        dayOfCycle,
        recentSymptoms: [],
        medications: [],
        userName: profile?.name ?? 'there',
      });

      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: text,
          created_at: new Date().toISOString(),
        },
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "I'm having a little trouble at the moment — please try again in a moment.",
          created_at: new Date().toISOString(),
        },
      ]);
    }

    setLoading(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex flex-col h-svh bg-em-cream">
      {/* Header */}
      <div className="px-6 pt-12 pb-4 border-b border-em-border">
        <h1 className="font-heading text-2xl text-em-text">Em</h1>
        <p className="text-xs text-em-muted mt-0.5">
          Day {dayOfCycle} · {phase.name} phase
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[82%] px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-em-rose text-white rounded-3xl rounded-br-lg'
                  : 'bg-em-surface text-em-text border border-em-border rounded-3xl rounded-bl-lg'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-em-surface border border-em-border px-4 py-3.5 rounded-3xl rounded-bl-lg">
              <div className="flex gap-1.5 items-center">
                {[0, 150, 300].map(delay => (
                  <div
                    key={delay}
                    className="w-2 h-2 rounded-full bg-em-muted animate-bounce"
                    style={{ animationDelay: `${delay}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="px-4 py-3 border-t border-em-border">
        <div className="flex gap-2 items-end">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-4 py-3 rounded-2xl border border-em-border bg-em-surface text-em-text placeholder:text-em-muted focus:outline-none focus:border-em-rose transition-colors resize-none text-sm leading-relaxed"
            placeholder="Message Em..."
            rows={1}
            style={{ maxHeight: '120px' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="w-11 h-11 rounded-2xl bg-em-rose flex items-center justify-center disabled:opacity-40 transition-opacity flex-shrink-0"
          >
            <Send size={17} className="text-white" />
          </button>
        </div>
        <div className="flex items-center justify-between mt-2 px-1">
          <p className="text-[10px] text-em-muted">Em is not a medical professional — always see a GP for medical concerns.</p>
          {messages.length > 1 && (
            <Link
              to="/log"
              className="flex items-center gap-1 text-[11px] text-em-rose font-medium whitespace-nowrap ml-3"
            >
              <PenLine size={11} />
              Log today
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
