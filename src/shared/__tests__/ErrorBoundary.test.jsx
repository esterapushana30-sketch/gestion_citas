import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '../components/ErrorBoundary';

// Componente que lanza error para probar el ErrorBoundary
function BuggyComponent() {
  throw new Error('Error de prueba');
}

// Componente que no lanza error
function SafeComponent() {
  return <div>Contenido seguro</div>;
}

describe('ErrorBoundary Component', () => {
  it('debería renderizar children cuando no hay error', () => {
    render(
      <ErrorBoundary>
        <SafeComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Contenido seguro')).toBeInTheDocument();
  });

  it('debería mostrar UI de error cuando hay un error', () => {
    // Suprimir console.error para este test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <BuggyComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Algo salió mal')).toBeInTheDocument();
    expect(screen.getByText('Error de prueba')).toBeInTheDocument();
    expect(screen.getByText('Recargar página')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it('debería mostrar mensaje de error genérico cuando error.message no existe', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    function BuggyWithoutMessage() {
      throw new Error();
    }

    render(
      <ErrorBoundary>
        <BuggyWithoutMessage />
      </ErrorBoundary>
    );

    expect(screen.getByText('Error inesperado')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it('debería tener botón de recargar', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <BuggyComponent />
      </ErrorBoundary>
    );

    const reloadButton = screen.getByText('Recargar página');
    expect(reloadButton).toBeInTheDocument();
    expect(reloadButton).toHaveClass('btn-primary');

    consoleSpy.mockRestore();
  });

  it('debería capturar errores en componentes hijos', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const spy = vi.spyOn(ErrorBoundary.prototype, 'componentDidCatch');

    render(
      <ErrorBoundary>
        <BuggyComponent />
      </ErrorBoundary>
    );

    expect(spy).toHaveBeenCalled();

    consoleSpy.mockRestore();
    spy.mockRestore();
  });
});
