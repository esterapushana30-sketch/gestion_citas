import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

const mockCreateAppointment = vi.fn().mockResolvedValue({ success: true });

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
    checkProfessionalAvailability: vi.fn().mockResolvedValue({
      available: true,
      professionalCount: 2,
    }),
  },
}));

describe('Flujo de Gestión de Citas - Integración', () => {
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debería cargar dependencias al montar el formulario', async () => {
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

  it('debería mostrar error de validación al enviar formulario vacío', async () => {
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

  it('debería permitir seleccionar dependencia', async () => {
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

  it('debería llamar a createAppointment con datos válidos', async () => {
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

    fireEvent.change(screen.getByLabelText('Motivo de consulta'), {
      target: { value: 'Necesito una consulta de psicología para manejo de estrés laboral' },
    });

    fireEvent.click(screen.getByRole('button', { name: /solicitar cita/i }));

    await waitFor(() => {
      expect(mockCreateAppointment).toHaveBeenCalled();
    });
  });

  it('debería llamar a onSuccess cuando la cita se crea exitosamente', async () => {
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

    fireEvent.change(screen.getByLabelText('Motivo de consulta'), {
      target: { value: 'Necesito una consulta de psicología para manejo de estrés laboral' },
    });

    fireEvent.click(screen.getByRole('button', { name: /solicitar cita/i }));

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('debería mostrar estado de carga durante el envío', async () => {
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
});
