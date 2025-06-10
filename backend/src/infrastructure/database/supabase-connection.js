
const { createClient } = require('@supabase/supabase-js');

class SupabaseConnection {
  constructor() {
    this.supabase = null;
  }

  connect() {
    try {
      const supabaseUrl = "https://chgpkpxwtksapjjwvfgf.supabase.co";
      const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoZ3BrcHh3dGtzYXBqand2ZmdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1MDcxMDYsImV4cCI6MjA2NTA4MzEwNn0.nuaCN5CsIAd9sPOOOgMxzpT10Av87qlBTf2AkKWuVb0";
      
      this.supabase = createClient(supabaseUrl, supabaseKey);
      console.log('Connected to Supabase database');
      return Promise.resolve();
    } catch (error) {
      console.error('Error connecting to Supabase:', error);
      return Promise.reject(error);
    }
  }

  getDatabase() {
    return this.supabase;
  }

  close() {
    console.log('Supabase connection closed');
    return Promise.resolve();
  }
}

module.exports = new SupabaseConnection();
