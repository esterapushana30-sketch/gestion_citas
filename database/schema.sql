-- ============================================
-- MÓDULO DE PROFESIONALES - SCHEMA SQL
-- ============================================

-- 1. Tabla de roles (ya existe, pero se asegura)
CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertar roles por defecto si no existen
INSERT INTO roles (name, description, permissions) VALUES
  ('SUPERADMIN', 'Super Administrador', '{"all": true}'),
  ('COORDINACION', 'Coordinación', '{"view_all": true, "manage_appointments": true}'),
  ('PSICOLOGIA', 'Psicología', '{"manage_own_appointments": true, "view_history": true}'),
  ('ENFERMERIA', 'Enfermería', '{"manage_own_appointments": true, "view_history": true}'),
  ('TRABAJO_SOCIAL', 'Trabajo Social', '{"manage_own_appointments": true, "view_history": true}'),
  ('APRENDIZ', 'Aprendiz', '{"request_appointments": true, "view_own": true}')
ON CONFLICT (name) DO NOTHING;

-- 2. Tabla de dependencias (ya existe)
CREATE TABLE IF NOT EXISTS dependencies (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertar dependencias por defecto
INSERT INTO dependencies (name, color) VALUES
  ('Psicología', '#8b5cf6'),
  ('Enfermería', '#06b6d4'),
  ('Trabajo Social', '#f97316')
ON CONFLICT (name) DO NOTHING;

-- 3. Tabla de perfiles (extiende auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT NOT NULL,
  document_number TEXT,
  phone TEXT,
  profession TEXT,
  specialty TEXT,
  role_id INTEGER REFERENCES roles(id) DEFAULT 6,
  dependency_id INTEGER REFERENCES dependencies(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabla de citas
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  professional_id UUID REFERENCES profiles(id),
  dependency_id INTEGER REFERENCES dependencies(id),
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show', 'rescheduled')),
  reason TEXT,
  notes TEXT,
  observations TEXT,
  rescheduled_from UUID REFERENCES appointments(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tabla de disponibilidad de profesionales
CREATE TABLE IF NOT EXISTS professional_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Domingo, 6=Sábado
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(professional_id, day_of_week, start_time)
);

-- 6. Tabla de logs de auditoría
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  old_data JSONB,
  new_data JSONB,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Tabla de configuración del sistema
CREATE TABLE IF NOT EXISTS system_config (
  key TEXT PRIMARY KEY,
  value TEXT,
  update_by UUID REFERENCES profiles(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ÍNDICES PARA MEJOR RENDIMIENTO
-- ============================================

CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_professional_id ON appointments(professional_id);
CREATE INDEX IF NOT EXISTS idx_appointments_dependency_id ON appointments(dependency_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_profiles_role_id ON profiles(role_id);
CREATE INDEX IF NOT EXISTS idx_profiles_dependency_id ON profiles(dependency_id);
CREATE INDEX IF NOT EXISTS idx_professional_availability_professional ON professional_availability(professional_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);

-- ============================================
-- FUNCIONES RPC PARA DASHBOARD
-- ============================================

-- Función para obtener KPIs del dashboard
CREATE OR REPLACE FUNCTION get_dashboard_kpis(start_date DATE, end_date DATE)
RETURNS TABLE (
  total_appointments BIGINT,
  completed_appointments BIGINT,
  cancelled_appointments BIGINT,
  no_show_count BIGINT,
  avg_wait_days NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT as total_appointments,
    COUNT(*) FILTER (WHERE status = 'completed')::BIGINT as completed_appointments,
    COUNT(*) FILTER (WHERE status = 'cancelled')::BIGINT as cancelled_appointments,
    COUNT(*) FILTER (WHERE status = 'no_show')::BIGINT as no_show_count,
    COALESCE(
      AVG(EXTRACT(DAY FROM (updated_at - created_at)))::NUMERIC(10,1),
      0
    ) as avg_wait_days
  FROM appointments
  WHERE scheduled_date BETWEEN start_date AND end_date;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener tendencia mensual
CREATE OR REPLACE FUNCTION get_monthly_appointments(year_param INTEGER)
RETURNS TABLE (
  month TEXT,
  total BIGINT,
  completed BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    TO_CHAR(scheduled_date, 'Mon') as month,
    COUNT(*)::BIGINT as total,
    COUNT(*) FILTER (WHERE status = 'completed')::BIGINT as completed
  FROM appointments
  WHERE EXTRACT(YEAR FROM scheduled_date) = year_param
  GROUP BY TO_CHAR(scheduled_date, 'Mon'), EXTRACT(MONTH FROM scheduled_date)
  ORDER BY EXTRACT(MONTH FROM scheduled_date);
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- POLÍTICAS RLS (Row Level Security)
-- ============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_config ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admin can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role_id = 1)
  );

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admin can insert profiles" ON profiles
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role_id = 1)
  );

CREATE POLICY "Admin can update profiles" ON profiles
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role_id = 1)
  );

CREATE POLICY "Coordination can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role_id IN (1, 2))
  );

-- Políticas para appointments
CREATE POLICY "Users can view own appointments" ON appointments
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Professionals can view dependency appointments" ON appointments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role_id IN (3, 4, 5)
      AND dependency_id = appointments.dependency_id
    )
  );

CREATE POLICY "Admin can view all appointments" ON appointments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role_id = 1)
  );

CREATE POLICY "Users can insert own appointments" ON appointments
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Professionals can update appointments" ON appointments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role_id IN (3, 4, 5)
      AND dependency_id = appointments.dependency_id
    )
  );

-- Políticas para professional_availability
CREATE POLICY "Professionals can manage own availability" ON professional_availability
  FOR ALL USING (professional_id = auth.uid());

CREATE POLICY "Admin can manage all availability" ON professional_availability
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role_id = 1)
  );
