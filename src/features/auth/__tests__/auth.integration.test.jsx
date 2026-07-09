import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import { useAuth } from '../../../providers/AuthProvider';

vi.mock('../../../providers/AuthProvider', () => ({
  useAuth: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('../../../lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    })),
  },
}));

describe('Flujo de Autenticación - Integración', () => {
  const mockUseAuth = useAuth;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Flujo de Login', () => {
    it('debería permitir login exitoso', async () => {
      const mockSignIn = vi.fn().mockResolvedValue({ success: true });
      mockUseAuth.mockReturnValue({
        signIn: mockSignIn,
        error: null,
      });

      render(
        <MemoryRouter initialEntries={['/login']}>
          <Login />
        </MemoryRouter>
      );

      fireEvent.change(screen.getByLabelText('Correo electrónico'), {
        target: { value: 'test@test.com' },
      });
      fireEvent.change(screen.getByLabelText('Contraseña'), {
        target: { value: 'password123' },
      });

      fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith('test@test.com', 'password123');
      });
    });

    it('debería mostrar error en login fallido', async () => {
      mockUseAuth.mockReturnValue({
        signIn: vi.fn(),
        error: 'Credenciales inválidas',
      });

      render(
        <MemoryRouter initialEntries={['/login']}>
          <Login />
        </MemoryRouter>
      );

      expect(screen.getByText('Credenciales inválidas')).toBeInTheDocument();
    });
  });

  describe('Flujo de Registro', () => {
    it('debería mostrar error cuando las contraseñas no coinciden', async () => {
      mockUseAuth.mockReturnValue({
        signUp: vi.fn(),
        error: null,
      });

      render(
        <MemoryRouter initialEntries={['/register']}>
          <Register />
        </MemoryRouter>
      );

      fireEvent.change(screen.getByLabelText('Nombre completo'), {
        target: { value: 'Juan Pérez' },
      });
      fireEvent.change(screen.getByLabelText('Número de documento'), {
        target: { value: '1234567890' },
      });
      fireEvent.change(screen.getByLabelText('Email institucional'), {
        target: { value: 'juan@test.com' },
      });
      fireEvent.change(screen.getByLabelText('Contraseña'), {
        target: { value: 'password123' },
      });
      fireEvent.change(screen.getByLabelText('Confirmar contraseña'), {
        target: { value: 'differentpassword' },
      });

      fireEvent.click(screen.getByRole('button', { name: /crear cuenta/i }));

      await waitFor(() => {
        expect(screen.getByText('Las contraseñas no coinciden')).toBeInTheDocument();
      });
    });

    it('debería mostrar error cuando la contraseña es muy corta', async () => {
      mockUseAuth.mockReturnValue({
        signUp: vi.fn(),
        error: null,
      });

      render(
        <MemoryRouter initialEntries={['/register']}>
          <Register />
        </MemoryRouter>
      );

      fireEvent.change(screen.getByLabelText('Nombre completo'), {
        target: { value: 'Juan Pérez' },
      });
      fireEvent.change(screen.getByLabelText('Número de documento'), {
        target: { value: '1234567890' },
      });
      fireEvent.change(screen.getByLabelText('Email institucional'), {
        target: { value: 'juan@test.com' },
      });
      fireEvent.change(screen.getByLabelText('Contraseña'), {
        target: { value: '12345' },
      });
      fireEvent.change(screen.getByLabelText('Confirmar contraseña'), {
        target: { value: '12345' },
      });

      fireEvent.click(screen.getByRole('button', { name: /crear cuenta/i }));

      await waitFor(() => {
        expect(screen.getByText('La contraseña debe tener al menos 6 caracteres')).toBeInTheDocument();
      });
    });

    it('debería permitir registro exitoso', async () => {
      const mockSignUp = vi.fn().mockResolvedValue({ success: true });
      mockUseAuth.mockReturnValue({
        signUp: mockSignUp,
        error: null,
      });

      render(
        <MemoryRouter initialEntries={['/register']}>
          <Register />
        </MemoryRouter>
      );

      fireEvent.change(screen.getByLabelText('Nombre completo'), {
        target: { value: 'Juan Pérez' },
      });
      fireEvent.change(screen.getByLabelText('Número de documento'), {
        target: { value: '1234567890' },
      });
      fireEvent.change(screen.getByLabelText('Email institucional'), {
        target: { value: 'juan@test.com' },
      });
      fireEvent.change(screen.getByLabelText('Contraseña'), {
        target: { value: 'password123' },
      });
      fireEvent.change(screen.getByLabelText('Confirmar contraseña'), {
        target: { value: 'password123' },
      });

      fireEvent.click(screen.getByRole('button', { name: /crear cuenta/i }));

      await waitFor(() => {
        expect(mockSignUp).toHaveBeenCalledWith('juan@test.com', 'password123', {
          full_name: 'Juan Pérez',
          document_number: '1234567890',
        });
      });
    });
  });

  describe('Navegación entre Login y Register', () => {
    it('debería navegar de Login a Register', () => {
      mockUseAuth.mockReturnValue({
        signIn: vi.fn(),
        error: null,
      });

      render(
        <MemoryRouter initialEntries={['/login']}>
          <Login />
        </MemoryRouter>
      );

      const registerLink = screen.getByText('Regístrate aquí');
      expect(registerLink).toHaveAttribute('href', '/register');
    });

    it('debería navegar de Register a Login', () => {
      mockUseAuth.mockReturnValue({
        signUp: vi.fn(),
        error: null,
      });

      render(
        <MemoryRouter initialEntries={['/register']}>
          <Register />
        </MemoryRouter>
      );

      const loginLink = screen.getByText('Inicia sesión aquí');
      expect(loginLink).toHaveAttribute('href', '/login');
    });
  });
});
