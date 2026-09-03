/**
 * OtaHub Asia - Supabase Client Singleton
 * Project URL: https://xmrctipywjevrknxzjau.supabase.co
 */
(function () {
  const SUPABASE_URL = 'https://xmrctipywjevrknxzjau.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_pojfdFC8-XJP-OAC0PCj9A_cXqMrs_r';

  function initClient() {
    if (window.supabase && window.supabase.createClient) {
      window.otahubSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        },
        realtime: {
          params: {
            eventsPerSecond: 10
          }
        }
      });
      console.log('⚡ [OtaHub] Supabase Client Initialized Successfully.');
      window.dispatchEvent(new CustomEvent('otahub:supabase:ready', { detail: window.otahubSupabase }));
    }
  }

  if (window.supabase) {
    initClient();
  } else {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    script.async = true;
    script.onload = initClient;
    document.head.appendChild(script);
  }
})();