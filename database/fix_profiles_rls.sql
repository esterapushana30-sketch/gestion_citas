-- ============================================
-- FIX: Agregar políticas INSERT y SELECT faltantes
-- para la tabla profiles
-- ============================================
-- Ejecuta este script en el SQL Editor de Supabase Dashboard

-- 1. Política INSERT: Usuarios autenticados pueden crear su propio perfil
CREATE POLICY IF NOT EXISTS "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. Política INSERT: Admin puede crear perfiles de otros usuarios
CREATE POLICY IF NOT EXISTS "Admin can insert profiles" ON profiles
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role_id = 1)
  );

-- 3. Política SELECT: Coordinación y Admin pueden ver todos los perfiles
CREATE POLICY IF NOT EXISTS "Coordination can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role_id IN (1, 2))
  );

-- 4. Política SELECT: Profesionales pueden ver perfiles de su dependencia
CREATE POLICY IF NOT EXISTS "Professionals can view dependency profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role_id IN (3, 4, 5)
      AND dependency_id = profiles.dependency_id
    )
  );

-- Verificar políticas creadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'profiles';
