import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Register from '../pages/Register';

vi.mock('../../../providers/AuthProvider', () => ({
  useAuth: vi.fn(() => ({
    signUp: vi.fn(),
    error: null,
  })),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    })),
  },
}));

describe('Register Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debería renderizar el formulario de registro', () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { name: 'Crear cuenta' })).toBeInTheDocument();
    expect(screen.getByText('SENA Bienestar — Agenda tus citas de bienestar')).toBeInTheDocument();
    expect(screen.getByLabelText('Nombre completo')).toBeInTheDocument();
    expect(screen.getByLabelText('Número de documento')).toBeInTheDocument();
    expect(screen.getByLabelText('Email institucional')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirmar contraseña')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /crear cuenta/i })).toBeInTheDocument();
  });

  it('debería permitir escribir en todos los campos', () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
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

    expect(screen.getByLabelText('Nombre completo').value).toBe('Juan Pérez');
    expect(screen.getByLabelText('Número de documento').value).toBe('1234567890');
    expect(screen.getByLabelText('Email institucional').value).toBe('juan@test.com');
    expect(screen.getByLabelText('Contraseña').value).toBe('password123');
    expect(screen.getByLabelText('Confirmar contraseña').value).toBe('password123');
  });

  it('debería mostrar error cuando las contraseñas no coinciden', async () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
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
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
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

  it('debería llamar a signUp con los datos correctos', async () => {
    const { useAuth } = await import('../../../providers/AuthProvider');
    const mockSignUp = vi.fn().mockResolvedValue({ success: true });
    useAuth.mockReturnValue({
      signUp: mockSignUp,
      error: null,
    });

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
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

  it('debería tener enlace a login', () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    expect(screen.getByText('Inicia sesión aquí')).toHaveAttribute('href', '/login');
  });
});
