import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';

// Mock del AuthContext
// eslint-disable-next-line no-unused-vars
const MockAuthProvider = ({ children, user = null, profile = null }) => {
  return (
    <div data-testid="mock-auth-provider">
      {children}
    </div>
  );
};

// Wrapper personalizado para renderizar con providers
const AllProviders = ({ children, authUser, authProfile }) => (
  <BrowserRouter>
    <MockAuthProvider user={authUser} profile={authProfile}>
      {children}
      <Toaster position="top-right" richColors />
    </MockAuthProvider>
  </BrowserRouter>
);

// Custom render con providers
const customRender = (ui, options = {}) => {
  const { authUser, authProfile, ...renderOptions } = options;
  
  return render(ui, {
    wrapper: ({ children }) => (
      <AllProviders authUser={authUser} authProfile={authProfile}>
        {children}
      </AllProviders>
    ),
    ...renderOptions,
  });
};

// Re-exportar todo de testing-library
export * from '@testing-library/react';

// Exportar custom render como render por defecto
export { customRender as render };

// Datos de prueba mock
export const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
};

export const mockProfile = {
  id: 'test-profile-id',
  user_id: 'test-user-id',
  full_name: 'Usuario de Prueba',
  roles: {
    name: 'APRENDIZ',
  },
  dependencies: {
    name: 'Psicología',
  },
};

export const mockProfessionalProfile = {
  id: 'test-professional-id',
  user_id: 'test-professional-id',
  full_name: 'Profesional de Prueba',
  roles: {
    name: 'PSICOLOGIA',
  },
  dependencies: {
    name: 'Psicología',
  },
};

export const mockAdminProfile = {
  id: 'test-admin-id',
  user_id: 'test-admin-id',
  full_name: 'Administrador de Prueba',
  roles: {
    name: 'SUPERADMIN',
  },
  dependencies: null,
};
