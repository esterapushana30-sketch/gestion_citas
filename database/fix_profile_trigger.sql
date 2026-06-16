-- ============================================
-- FIX: Trigger para crear perfil automáticamente
-- al registrar usuario en auth.users
-- ============================================
-- Ejecuta este script en el SQL Editor de Supabase Dashboard

-- 1. Eliminar trigger existente si lo hay
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2. Eliminar función existente si la hay
DROP FUNCTION IF EXISTS handle_new_user();

-- 3. Crear función para manejar nuevo usuario
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role_id, is_active)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    6, -- APRENDIZ por defecto
    true
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Crear trigger que se ejecuta al crear usuario
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- 5. Verificar que el trigger se creó correctamente
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- 6. Verificar las políticas RLS para profiles
SELECT policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'profiles';
