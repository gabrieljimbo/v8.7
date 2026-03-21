/**
 * DOM Store - Supabase Client
 */
const _supabase = window.supabase.createClient(
    'https://eszpvotwctknbotfjybn.supabase.co',
    'sb_publishable_Nhj_51pArA3Xl7dDPuabXw_ZYEJu1-w'
);
window._supabase = _supabase;
console.log('✅ Supabase client inicializado');
