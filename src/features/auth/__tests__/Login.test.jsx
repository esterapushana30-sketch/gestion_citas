import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';

vi.mock('../../../providers/AuthProvider', () => ({
  useAuth: vi.fn(() => ({
    signIn: vi.fn(),
    error: null,
  })),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debería renderizar el formulario de login', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { name: 'Iniciar Sesión' })).toBeInTheDocument();
    expect(screen.getByText('SENA Bienestar — Acceso institucional')).toBeInTheDocument();
    expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  it('debería permitir escribir en los campos de email y contraseña', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText('Correo electrónico');
    const passwordInput = screen.getByLabelText('Contraseña');

    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@test.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('debería mostrar/ocultar contraseña al hacer clic en el botón', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const passwordInput = screen.getByLabelText('Contraseña');
    const toggleButton = screen.getByText('Ver');

    expect(passwordInput.type).toBe('password');

    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('text');
    expect(screen.getByText('Ocultar')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Ocultar'));
    expect(passwordInput.type).toBe('password');
  });

  it('debería llamar a signIn al enviar el formulario', async () => {
    const { useAuth } = await import('../../../providers/AuthProvider');
    const mockSignIn = vi.fn().mockResolvedValue({ success: true });
    useAuth.mockReturnValue({
      signIn: mockSignIn,
      error: null,
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
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

  it('debería mostrar error de autenticación', async () => {
    const { useAuth } = await import('../../../providers/AuthProvider');
    useAuth.mockReturnValue({
      signIn: vi.fn(),
      error: 'Credenciales inválidas',
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(screen.getByText('Credenciales inválidas')).toBeInTheDocument();
  });

  it('debería tener enlace a registro', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(screen.getByText('Regístrate aquí')).toHaveAttribute('href', '/register');
  });

  it('debería tener enlace a recuperar contraseña', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(screen.getByText('¿Olvidaste?')).toHaveAttribute('href', '/forgot-password');
  });
});
