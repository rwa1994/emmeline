import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, Check, ShieldOff, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

function generateCode(): string {
  return Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join('');
}

interface PartnerLink {
  id: string;
  invite_code: string;
  status: string;
  partner_id: string | null;
  permissions: { phase: boolean; mood: boolean; symptoms: boolean };
}

export default function PartnerControl() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [link, setLink] = useState<PartnerLink | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [revoking, setRevoking] = useState(false);
  const [revoked, setRevoked] = useState(false);

  useEffect(() => {
    if (user) loadLink();
  }, [user]);

  async function loadLink() {
    const { data } = await supabase
      .from('partner_links')
      .select('*')
      .eq('her_id', user!.id)
      .neq('status', 'revoked')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    setLink(data ?? null);
    setLoading(false);
  }

  async function generateInvite() {
    if (!user) return;
    const code = generateCode();
    const { data } = await supabase
      .from('partner_links')
      .insert({ her_id: user.id, invite_code: code })
      .select()
      .single();
    setLink(data);
  }

  function copyCode() {
    if (!link) return;
    navigator.clipboard.writeText(link.invite_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function copyLink() {
    if (!link) return;
    navigator.clipboard.writeText(`${window.location.origin}/join/${link.invite_code}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function revokeAccess() {
    if (!link || !user) return;
    setRevoking(true);
    await supabase
      .from('partner_links')
      .update({ status: 'revoked' })
      .eq('id', link.id);
    setRevoking(false);
    setRevoked(true);
    setLink(null);
  }

  async function togglePermission(key: 'phase' | 'mood' | 'symptoms') {
    if (!link || !user) return;
    const updated = { ...link.permissions, [key]: !link.permissions[key] };
    await supabase
      .from('partner_links')
      .update({ permissions: updated })
      .eq('id', link.id);
    setLink({ ...link, permissions: updated });
  }

  if (loading) return null;

  return (
    <div className="px-6 pt-12 pb-8">
      <button onClick={() => navigate('/')} className="text-em-muted text-sm mb-6 block">← Back</button>

      <h1 className="font-heading text-4xl text-em-text mb-2">Partner access</h1>
      <p className="text-em-muted text-sm leading-relaxed mb-8">
        You are always in control of what your partner can see. You can change or remove this at any time.
      </p>

      {revoked && (
        <div className="rounded-2xl p-4 bg-em-sage-light border border-em-sage mb-6">
          <p className="text-sm text-em-sage-dark font-medium">Access removed.</p>
          <p className="text-xs text-em-sage-dark mt-0.5">Your partner can no longer see your information.</p>
        </div>
      )}

      {!link ? (
        /* No active link — generate one */
        <div className="space-y-4">
          <div className="bg-em-surface rounded-3xl p-5 border border-em-border">
            <p className="text-sm text-em-text mb-1 font-medium">No partner connected</p>
            <p className="text-sm text-em-muted leading-relaxed">
              Generate an invite code to share with your partner. They'll use it to connect their account to yours.
            </p>
          </div>
          <button
            onClick={generateInvite}
            className="w-full py-3.5 rounded-2xl bg-em-rose text-white font-medium"
          >
            Generate invite code
          </button>
        </div>
      ) : link.status === 'pending' ? (
        /* Pending — waiting for partner to accept */
        <div className="space-y-4">
          <div className="bg-em-surface rounded-3xl p-5 border border-em-border">
            <p className="text-xs text-em-muted uppercase tracking-widest mb-3">Invite code</p>
            <p className="text-4xl font-heading text-em-text tracking-widest text-center py-2">{link.invite_code}</p>
            <p className="text-xs text-em-muted text-center mt-1">Waiting for your partner to connect</p>
          </div>

          <button
            onClick={copyCode}
            className="w-full py-3 rounded-2xl border border-em-border bg-em-surface text-em-text font-medium flex items-center justify-center gap-2"
          >
            {copied ? <Check size={16} className="text-em-sage" /> : <Copy size={16} />}
            {copied ? 'Copied' : 'Copy code'}
          </button>

          <button
            onClick={copyLink}
            className="w-full py-3 rounded-2xl bg-em-rose text-white font-medium flex items-center justify-center gap-2"
          >
            <Copy size={16} />
            Copy invite link
          </button>

          <button
            onClick={revokeAccess}
            className="w-full py-3 text-em-muted text-sm"
          >
            Cancel invite
          </button>
        </div>
      ) : (
        /* Active link */
        <div className="space-y-4">
          <div className="rounded-3xl p-4 bg-em-sage-light border border-em-sage flex items-center gap-3">
            <Check size={16} className="text-em-sage-dark" />
            <p className="text-sm text-em-sage-dark font-medium">Partner connected</p>
          </div>

          {/* Permissions */}
          <div className="bg-em-surface rounded-3xl p-5 border border-em-border">
            <p className="text-xs text-em-muted uppercase tracking-widest mb-4">What they can see</p>
            <div className="space-y-3">
              <PermissionRow
                label="Current phase"
                description="Which phase you're in today"
                enabled={link.permissions.phase}
                locked={true}
              />
              <PermissionRow
                label="General mood"
                description="High-level energy and mood"
                enabled={link.permissions.mood}
                onToggle={() => togglePermission('mood')}
              />
              <PermissionRow
                label="Symptoms"
                description="Physical and emotional symptoms you've logged"
                enabled={link.permissions.symptoms}
                onToggle={() => togglePermission('symptoms')}
              />
            </div>
          </div>

          {/* Revoke */}
          <button
            onClick={revokeAccess}
            disabled={revoking}
            className="w-full py-3.5 rounded-2xl border-2 border-em-rose text-em-rose font-medium flex items-center justify-center gap-2 hover:bg-em-rose-light transition-colors disabled:opacity-50"
          >
            <ShieldOff size={16} />
            {revoking ? 'Removing...' : 'Remove partner access'}
          </button>
          <p className="text-center text-xs text-em-muted">This happens instantly and silently.</p>
        </div>
      )}
    </div>
  );
}

function PermissionRow({
  label,
  description,
  enabled,
  locked,
  onToggle,
}: {
  label: string;
  description: string;
  enabled: boolean;
  locked?: boolean;
  onToggle?: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex-1">
        <p className="text-sm font-medium text-em-text">{label}</p>
        <p className="text-xs text-em-muted mt-0.5">{description}</p>
      </div>
      {locked ? (
        <div className="w-11 h-6 rounded-full bg-em-rose flex items-center justify-end px-1">
          <div className="w-4 h-4 rounded-full bg-white" />
        </div>
      ) : (
        <button
          onClick={onToggle}
          className="w-11 h-6 rounded-full transition-colors flex items-center px-1"
          style={{
            backgroundColor: enabled ? '#C49A9E' : '#E8DADA',
            justifyContent: enabled ? 'flex-end' : 'flex-start',
          }}
        >
          <div className="w-4 h-4 rounded-full bg-white" />
        </button>
      )}
      {enabled ? (
        <Eye size={14} className="text-em-muted flex-shrink-0" />
      ) : (
        <EyeOff size={14} className="text-em-muted flex-shrink-0" />
      )}
    </div>
  );
}
