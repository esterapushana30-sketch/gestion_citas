import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProtectedRoute } from '../../routes/ProtectedRoute';
import { useAuth } from '../../providers/AuthProvider';

vi.mock('../../providers/AuthProvider', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../../shared/components/LoadingSpinner', () => ({
  LoadingSpinner: ({ message }) => <div data-testid="loading-spinner">{message}</div>,
}));

describe('ProtectedRoute Component', () => {
  const mockUseAuth = useAuth;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debería mostrar loading cuando está cargando', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: true,
      hasRole: vi.fn(),
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Contenido protegido</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(screen.queryByText('Contenido protegido')).not.toBeInTheDocument();
  });

  it('debería redirigir a login cuando no hay usuario', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      hasRole: vi.fn(),
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Contenido protegido</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.queryByText('Contenido protegido')).not.toBeInTheDocument();
  });

  it('debería renderizar children cuando hay usuario', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'user-123' },
      loading: false,
      hasRole: vi.fn().mockReturnValue(true),
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Contenido protegido</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText('Contenido protegido')).toBeInTheDocument();
  });

  it('debería verificar roles requeridos', () => {
    const mockHasRole = vi.fn().mockReturnValue(false);
    mockUseAuth.mockReturnValue({
      user: { id: 'user-123' },
      loading: false,
      hasRole: mockHasRole,
    });

    render(
      <MemoryRouter>
        <ProtectedRoute requiredRoles={['SUPERADMIN']}>
          <div>Contenido protegido</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(mockHasRole).toHaveBeenCalledWith(['SUPERADMIN']);
    expect(screen.queryByText('Contenido protegido')).not.toBeInTheDocument();
  });

  it('debería renderizar children cuando tiene el rol requerido', () => {
    const mockHasRole = vi.fn().mockReturnValue(true);
    mockUseAuth.mockReturnValue({
      user: { id: 'user-123' },
      loading: false,
      hasRole: mockHasRole,
    });

    render(
      <MemoryRouter>
        <ProtectedRoute requiredRoles={['SUPERADMIN']}>
          <div>Contenido protegido</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText('Contenido protegido')).toBeInTheDocument();
  });

  it('debería funcionar sin requiredRoles', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'user-123' },
      loading: false,
      hasRole: vi.fn(),
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Contenido protegido</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText('Contenido protegido')).toBeInTheDocument();
  });
});
