// supabaseClient.js
// Global Supabase client configuration

// Make sure the Supabase SDK is loaded BEFORE this file in your HTML
const { createClient } = supabase;

const SUPABASE_URL = "https://hcjeqhswxyxjcpawiluf.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjamVxaHN3eHl4amNwYXdpbHVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4NjU3NTksImV4cCI6MjA3NjQ0MTc1OX0.lDXTVsC6Z6FFuKB6oi3X5TcDfY90fZMhJ83ZtyQONNE";

// This creates one global Supabase client
window.supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper function to check if user is authenticated
window.isAuthenticated = async function() {
    const { data: { session } } = await window.supabaseClient.auth.getSession();
    return session !== null;
};

// Helper function to get current user
window.getCurrentUser = async function() {
    const { data: { user } } = await window.supabaseClient.auth.getUser();
    return user;
};

// Helper function to sign out
window.signOut = async function() {
    const { error } = await window.supabaseClient.auth.signOut();
    if (!error) {
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    }
    return error;
};
