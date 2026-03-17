import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types';

interface PartnerLinkState {
  herProfile: Profile | null;
  linkId: string | null;
  permissions: { phase: boolean; mood: boolean; symptoms: boolean };
  loading: boolean;
}

export function usePartnerLink(partnerId: string | undefined) {
  const [state, setState] = useState<PartnerLinkState>({
    herProfile: null,
    linkId: null,
    permissions: { phase: true, mood: true, symptoms: false },
    loading: true,
  });

  useEffect(() => {
    if (!partnerId) return;
    loadLink(partnerId);
  }, [partnerId]);

  async function loadLink(partnerId: string) {
    const { data: link } = await supabase
      .from('partner_links')
      .select('*')
      .eq('partner_id', partnerId)
      .eq('status', 'active')
      .single();

    if (!link) {
      setState({ herProfile: null, linkId: null, permissions: { phase: true, mood: true, symptoms: false }, loading: false });
      return;
    }

    const { data: herProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', link.her_id)
      .single();

    setState({
      herProfile: herProfile ?? null,
      linkId: link.id,
      permissions: link.permissions,
      loading: false,
    });
  }

  return state;
}
