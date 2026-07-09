import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

const mockCreateAppointment = vi.fn().mockResolvedValue({ success: true });
const mockCheckAvailability = vi.fn(() => new Promise((resolve) => {
  setTimeout(() => resolve({ available: true, professionalCount: 2 }), 100);
}));

vi.mock('../hooks/useAppointments', () => ({
  useAppointments: vi.fn(() => ({
    createAppointment: mockCreateAppointment,
    isCreating: false,
  })),
}));

vi.mock('../../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockResolvedValue({
        data: [
          { id: 1, name: 'Psicología' },
          { id: 2, name: 'Enfermería' },
          { id: 3, name: 'Trabajo Social' },
        ],
        error: null,
      }),
    })),
  },
}));

vi.mock('../api/appointments.repository', () => ({
  AppointmentRepository: {
    checkProfessionalAvailability: mockCheckAvailability,
  },
}));

describe('AppointmentForm Component', () => {
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debería renderizar el formulario de citas', async () => {
    const { AppointmentForm } = await import('../components/AppointmentForm');

    render(
      <BrowserRouter>
        <AppointmentForm onSuccess={mockOnSuccess} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /solicitar cita/i })).toBeInTheDocument();
    });

    expect(screen.getByText('Dependencia')).toBeInTheDocument();
    expect(screen.getByText('Fecha')).toBeInTheDocument();
    expect(screen.getByText('Hora')).toBeInTheDocument();
    expect(screen.getByText('Motivo de consulta')).toBeInTheDocument();
  });

  it('debería cargar y mostrar las dependencias', async () => {
    const { AppointmentForm } = await import('../components/AppointmentForm');

    render(
      <BrowserRouter>
        <AppointmentForm onSuccess={mockOnSuccess} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Psicología')).toBeInTheDocument();
      expect(screen.getByText('Enfermería')).toBeInTheDocument();
      expect(screen.getByText('Trabajo Social')).toBeInTheDocument();
    });
  });

  it('debería permitir seleccionar una dependencia', async () => {
    const { AppointmentForm } = await import('../components/AppointmentForm');

    render(
      <BrowserRouter>
        <AppointmentForm onSuccess={mockOnSuccess} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Psicología')).toBeInTheDocument();
    });

    const select = screen.getByDisplayValue('Selecciona una dependencia...');
    fireEvent.change(select, { target: { value: '1' } });

    expect(select.value).toBe('1');
  });

  it('debería mostrar las opciones de hora disponibles', async () => {
    const { AppointmentForm } = await import('../components/AppointmentForm');

    render(
      <BrowserRouter>
        <AppointmentForm onSuccess={mockOnSuccess} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('08:00')).toBeInTheDocument();
      expect(screen.getByText('16:00')).toBeInTheDocument();
    });
  });

  it('debería mostrar error de validación para motivo vacío', async () => {
    const { AppointmentForm } = await import('../components/AppointmentForm');

    render(
      <BrowserRouter>
        <AppointmentForm onSuccess={mockOnSuccess} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /solicitar cita/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /solicitar cita/i }));

    await waitFor(() => {
      expect(screen.getByText('Describe tu situación en al menos 10 caracteres')).toBeInTheDocument();
    });
  });

  it('debería deshabilitar el botón durante el envío', async () => {
    const { useAppointments } = await import('../hooks/useAppointments');
    useAppointments.mockReturnValue({
      createAppointment: mockCreateAppointment,
      isCreating: true,
    });

    const { AppointmentForm } = await import('../components/AppointmentForm');

    render(
      <BrowserRouter>
        <AppointmentForm onSuccess={mockOnSuccess} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Agendando...')).toBeInTheDocument();
    });

    expect(screen.getByText('Agendando...').closest('button')).toBeDisabled();
  });

  it('debería mostrar indicador de disponibilidad', async () => {
    const { AppointmentForm } = await import('../components/AppointmentForm');

    render(
      <BrowserRouter>
        <AppointmentForm onSuccess={mockOnSuccess} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Psicología')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByDisplayValue('Selecciona una dependencia...'), {
      target: { value: '1' },
    });

    const dateInput = document.querySelector('input[type="date"]');
    fireEvent.change(dateInput, { target: { value: '2026-07-10' } });

    await waitFor(() => {
      expect(screen.getByText('Verificando disponibilidad...')).toBeInTheDocument();
    });
  });
});
