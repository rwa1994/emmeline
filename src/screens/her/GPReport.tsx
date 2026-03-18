import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, Check, FileText } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

export default function GPReport() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [report, setReport] = useState('');
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  async function generateReport() {
    if (!user || !profile) return;
    setGenerating(true);
    setError('');

    // Fetch last 90 days of logs
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    const since = ninetyDaysAgo.toISOString().split('T')[0];

    const [{ data: logs }, { data: meds }] = await Promise.all([
      supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('log_date', since)
        .order('log_date', { ascending: false }),
      supabase
        .from('medications')
        .select('name, dosage')
        .eq('user_id', user.id)
        .eq('active', true),
    ]);

    const medications = (meds ?? []).map(m => m.dosage ? `${m.name} ${m.dosage}` : m.name);

    const response = await fetch('/api/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        profile,
        medications,
        logs: logs ?? [],
      }),
    });

    if (!response.ok) {
      setError('Something went wrong. Please try again.');
      setGenerating(false);
      return;
    }

    const data = await response.json();
    setReport(data.text);
    setGenerating(false);
  }

  function copyReport() {
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="px-6 pt-12 pb-8">
      <button onClick={() => navigate('/')} className="text-em-muted text-sm mb-6 block">← Back</button>

      <h1 className="font-heading text-4xl text-em-text mb-2">GP Report</h1>
      <p className="text-em-muted text-sm leading-relaxed mb-8">
        Em will write a formal summary of your cycle, symptoms, and medications that you can share with your doctor. It's based on everything you've logged.
      </p>

      {!report && !generating && (
        <div className="space-y-4">
          <div className="bg-em-surface rounded-3xl p-5 border border-em-border">
            <div className="flex items-start gap-3">
              <FileText size={18} className="text-em-rose mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-em-text mb-1">What's included</p>
                <ul className="text-sm text-em-muted space-y-1 leading-relaxed">
                  <li>Cycle length and period details</li>
                  <li>Symptoms from the past 3 months</li>
                  <li>Energy and wellbeing trends</li>
                  <li>Current medications</li>
                </ul>
              </div>
            </div>
          </div>

          {error && (
            <p className="text-em-rose text-sm text-center bg-em-rose-light px-4 py-2 rounded-xl">{error}</p>
          )}

          <button
            onClick={generateReport}
            className="w-full py-3.5 rounded-2xl bg-em-rose text-white font-medium"
          >
            Generate report
          </button>
        </div>
      )}

      {generating && (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-em-rose border-t-transparent animate-spin" />
          <p className="text-em-muted text-sm">Em is writing your report...</p>
        </div>
      )}

      {report && (
        <div className="space-y-4">
          <div className="bg-em-surface rounded-3xl p-5 border border-em-border">
            <pre className="text-sm text-em-text leading-relaxed whitespace-pre-wrap font-sans">{report}</pre>
          </div>

          <button
            onClick={copyReport}
            className="w-full py-3.5 rounded-2xl border border-em-border bg-em-surface text-em-text font-medium flex items-center justify-center gap-2"
          >
            {copied ? <Check size={16} className="text-em-sage" /> : <Copy size={16} />}
            {copied ? 'Copied' : 'Copy report'}
          </button>

          <button
            onClick={() => { setReport(''); setError(''); }}
            className="w-full py-2 text-em-muted text-sm"
          >
            Regenerate
          </button>

          <p className="text-center text-xs text-em-muted leading-relaxed">
            This report is meant to support a conversation with your doctor, not replace one.
          </p>
        </div>
      )}
    </div>
  );
}
