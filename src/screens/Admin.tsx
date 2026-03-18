import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

interface FeedbackItem {
  id: string;
  user_name: string;
  category: string;
  content: string;
  created_at: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  love: 'Love something',
  suggestion: 'Suggestion',
  bug: 'Something broke',
  general: 'General',
};

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  love:       { bg: '#D4E8D1', text: '#4A6945' },
  suggestion: { bg: '#DDD9EE', text: '#7A6FA8' },
  bug:        { bg: '#EDD5D7', text: '#9E6F73' },
  general:    { bg: '#F5F0E8', text: '#9A8080' },
};

export default function Admin() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (profile && profile.name !== 'Ryan') {
      navigate('/');
      return;
    }
    loadFeedback();
  }, [profile]);

  async function loadFeedback() {
    const { data } = await supabase
      .from('feedback')
      .select('*')
      .order('created_at', { ascending: false });
    setItems(data ?? []);
    setLoading(false);
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }

  const filtered = filter === 'all' ? items : items.filter(i => i.category === filter);

  if (loading) return null;

  return (
    <div className="px-6 pt-12 pb-8 max-w-lg mx-auto">
      <button onClick={() => navigate('/')} className="text-em-muted text-sm mb-6 block">← Back</button>

      <h1 className="font-heading text-4xl text-em-text mb-1">Feedback</h1>
      <p className="text-em-muted text-sm mb-6">{items.length} {items.length === 1 ? 'response' : 'responses'} total</p>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        {['all', 'love', 'suggestion', 'bug', 'general'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
            style={
              filter === f
                ? { backgroundColor: '#C49A9E', color: 'white', borderColor: '#C49A9E' }
                : { backgroundColor: 'white', color: '#9A8080', borderColor: '#E8DADA' }
            }
          >
            {f === 'all' ? 'All' : CATEGORY_LABELS[f]}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-em-surface rounded-2xl px-4 py-8 border border-em-border text-center">
          <p className="text-em-muted text-sm">No feedback yet.</p>
        </div>
      )}

      <div className="space-y-3">
        {filtered.map(item => {
          const colors = CATEGORY_COLORS[item.category] ?? CATEGORY_COLORS.general;
          return (
            <div key={item.id} className="bg-em-surface rounded-2xl p-4 border border-em-border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs font-medium px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: colors.bg, color: colors.text }}
                  >
                    {CATEGORY_LABELS[item.category] ?? item.category}
                  </span>
                  <span className="text-xs font-medium text-em-text">{item.user_name}</span>
                </div>
                <span className="text-xs text-em-muted">{formatDate(item.created_at)}</span>
              </div>
              <p className="text-sm text-em-text leading-relaxed">{item.content}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
