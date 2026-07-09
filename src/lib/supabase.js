import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Mock Supabase client para desarrollo y pruebas
const mockSupabaseClient = {
  auth: {
    getSession: () => Promise.resolve({ data: { session: null } }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: new Error("Modo demo - usa SUPABASE_SERVICE_ROLE_KEY para autenticar") }),
    signOut: () => Promise.resolve({ error: null }),
    resetPasswordForEmail: () => Promise.resolve({ error: null }),
    signUp: () => Promise.resolve({ data: { user: null, session: null }, error: new Error("Modo demo - usa SUPABASE_SERVICE_ROLE_KEY para crear usuarios") }),
  },
  from: (_tableName) => ({
    select: (_columns) => ({
      eq: (_key, _value) => ({
        eq: (_secondKey, _secondValue) => ({
          single: () => Promise.resolve({ data: null, error: new Error("Modo demo - usa SUPABASE_SERVICE_ROLE_KEY para acceder a base de datos reales") }) 
        })
      })
    })
  }),
};

// Verificar si estamos en modo producción vs desarrollo
const isDevelopment = !supabaseUrl || !supabaseKey || 
  supabaseUrl.includes("placeholder") || 
  supabaseUrl.includes("tu-"); // Detectar URLs de placeholder

let supabase;

if (isDevelopment) {
  console.warn("⚠️  MODO DESARROLLO DETECTADO: Usando cliente Supabase simulado. Para producción, configura tu proyecto Supabase real.");
  console.log("Para configurar Supabase real:");
  console.log("  1. Ve a https://supabase.com");
  console.log("  2. Crea un proyecto (ejemplo: gestion-citas-proyecto)");
  console.log("  3. Obtén Project URL y ANON KEY");
  console.log("  4. Agrega VITE_SUPABASE_URL=tu-url-real");
  console.log("  5. Agrega VITE_SUPABASE_ANON_KEY=tu-anon-key-real");
  console.log("");
  
  supabase = mockSupabaseClient;
} else {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
    console.log("✅ Conectado a Supabase real");
  } catch (err) {
    console.error("Error conectando a Supabase:", err.message);
    supabase = mockSupabaseClient;
  }
}

export { supabase };
