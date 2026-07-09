import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

// 1 Creamos el contenedor (context)

const AuthContext = createContext(null);

// 2. Hook personalizado para usar el contexto facilmente
//esto evita importar useContext y AuthContext en cada archivo

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("UseAuth debe usarse dentro de AuthProvider");
  }
  return context;
};

//3 El provider que envuelve la aplicacion
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); //usuario de Supabase Auth
  const [profile, setProfile] = useState(null); //Datos adicionales de nuestra tabla de perfil o profiles
  const [loading, setLoading] = useState(true); //Estado de cargar inicial
  const [error, setError] = useState(null); //manejo o gestion de errores

  //funcion auxiliar: obterner el perfil + el rol desde nuestra base de datos
  const fetchProfile = useCallback(async (userId) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select(
          `
            *,
            roles (name, permissions),
            dependencies(name)            
            `,
        )
        .eq("id", userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (err) {
      console.error("Error cargando perfil", err);
      setError("No se pudo cargar el perfil de usuario");
    }
  }, []);

  //Efecto Escuchar cambios de sesion( login, logout, refresh)
  useEffect(() => {
    let mounted = true;

    // Verificar sesion existente al cargar la app
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        if (!mounted) return;
        if (session?.user) {
          setUser(session.user);
          fetchProfile(session.user.id);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al obtener sesión:", err);
        if (mounted) setLoading(false);
      });

    // Suscribirse a cambios de autenticacion
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log("Evento de autenticación:", event);

        switch (event) {
          case "SIGNED_IN":
            if (session?.user) {
              setUser(session.user);
              await fetchProfile(session.user.id);
            }
            break;
          case "SIGNED_OUT":
            setUser(null);
            setProfile(null);
            break;
          case "TOKEN_REFRESHED":
            if (session?.user) {
              setUser(session.user);
            }
            break;
          case "USER_UPDATED":
            if (session?.user) {
              setUser(session.user);
              await fetchProfile(session.user.id);
            }
            break;
        }

        // Asegurar que loading se ponga en false en el primer evento
        setLoading(false);
      },
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [fetchProfile]);

  //Método de autenticacion (clean code: funciones puras y descriptivas)
  const signIn = async (email, password) => {
    try {
      setError(null);
      
      // Validación de credenciales antes de intentar
      if (!email || !password) {
        throw new Error("El correo electrónico y la contraseña son requeridos");
      }
      
      // Intentar inicio de sesión con Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        // Manejar diferentes tipos de errores
        if (error.message.includes("Invalid login credentials")) {
          throw new Error("Correo electrónico o contraseña incorrectos");
        } else if (error.message.includes("Email not confirmed")) {
          throw new Error("Por favor, confirma tu correo electrónico antes de iniciar sesión");
        } else if (error.message.includes("rate limit")) {
          throw new Error("Demasiados intentos de inicio de sesión. Intenta más tarde");
        } else {
          throw new Error(`Error de inicio de sesión: ${error.message}`);
        }
      }
      
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const signUp = async (email, password, userData) => {
    try {
      setError(null);

      // El trigger on_auth_user_created crea el perfil automáticamente
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.full_name,
            document_number: userData.document_number,
          },
        },
      });

      if (error) {
        if (error.message.includes("Database error")) {
          throw new Error(
            "Error al crear la cuenta. Por favor, contacta al administrador.",
          );
        }
        throw error;
      }
      if (!data.user) throw new Error("No se pudo crear el usuario");

      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };
  const updateProfile = async (updates) => {
    try {
      setError(null);
      if (!user) throw new Error("No hay sesión activa");

      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id);

      if (error) throw error;
      await fetchProfile(user.id);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      //El estado se limpia automaticamente por onAuthStateChange
    } catch (err) {
      setError(err.message);
    }
  };

  //SISTEMA RBAC: helper functions para verificar permisos
  const hasRole = (requiredRoles) => {
    if (!profile?.roles?.name) return false;
    if (Array.isArray(requiredRoles)) {
      return requiredRoles.includes(profile.roles.name);
    }
    return profile.roles.name === requiredRoles;
  };

  const isAdmin = () => hasRole("SUPERADMIN");
  const isCoordination = () => hasRole(["COORDINACION", "SUPERADMIN"]);
  const isProfessional = () =>
    hasRole(["PSICOLOGIA", "ENFERMERIA", "TRABAJO_SOCIAL"]);
  const isAprendiz = () => hasRole("APRENDIZ");

  //valor proporcionado a toda la app
  const value = {
    user,
    profile,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    updateProfile,
    //helpers RBAC
    hasRole: hasRole,
    isAdmin,
    isCoordination,
    isProfessional,
    isAprendiz,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
