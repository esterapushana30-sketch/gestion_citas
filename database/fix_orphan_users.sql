-- ============================================
-- FIX: Limpiar usuarios huérfanos y verificar integridad
-- ============================================
-- Ejecuta este script en el SQL Editor de Supabase Dashboard

-- 1. Verificar usuarios en auth.users sin perfil
SELECT 
  au.id,
  au.email,
  au.created_at as auth_created_at,
  p.id as profile_id
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
WHERE p.id IS NULL;

-- 2. Verificar perfiles sin usuario en auth.users
SELECT 
  p.id,
  p.email,
  p.full_name,
  au.id as auth_user_id
FROM profiles p
LEFT JOIN auth.users au ON p.id = au.id
WHERE au.id IS NULL;

-- 3. Eliminar perfiles huérfanos (sin usuario en auth)
DELETE FROM profiles 
WHERE id NOT IN (SELECT id FROM auth.users);

-- 4. Verificar constraint de profiles
SELECT 
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name = 'profiles';

-- 5. Verificar RLS en profiles
SELECT policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'profiles';
