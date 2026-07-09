import { describe, it, expect } from 'vitest';
import { appointmentSchema } from '../validations/appointment.schema';

describe('appointmentSchema', () => {
  const validAppointment = {
    dependency_id: 1,
    scheduled_date: '2026-07-10', // Un día hábil en el futuro
    scheduled_time: '10:00',
    reason: 'Necesito una consulta de psicología para manejo de estrés',
  };

  it('debería validar una cita válida', () => {
    const result = appointmentSchema.safeParse(validAppointment);
    expect(result.success).toBe(true);
  });

  it('debería rechazar dependency_id inválido', () => {
    const result = appointmentSchema.safeParse({
      ...validAppointment,
      dependency_id: -1,
    });
    expect(result.success).toBe(false);
  });

  it('debería rechazar dependency_id como string', () => {
    const result = appointmentSchema.safeParse({
      ...validAppointment,
      dependency_id: 'abc',
    });
    expect(result.success).toBe(false);
  });

  it('debería rechazar fecha en fin de semana', () => {
    // Nota: new Date('YYYY-MM-DD') crea fecha en UTC, no en hora local
    // Usamos '2026-07-12' que es domingo y funciona independiente del timezone
    const result = appointmentSchema.safeParse({
      ...validAppointment,
      scheduled_date: '2026-07-12', // Domingo
    });
    expect(result.success).toBe(false);
  });

  it('debería rechazar fecha en el pasado', () => {
    const result = appointmentSchema.safeParse({
      ...validAppointment,
      scheduled_date: '2020-01-01',
    });
    expect(result.success).toBe(false);
  });

  it('debería rechazar hora fuera de horario laboral', () => {
    const result = appointmentSchema.safeParse({
      ...validAppointment,
      scheduled_time: '07:00', // Antes de las 8 AM
    });
    expect(result.success).toBe(false);

    const result2 = appointmentSchema.safeParse({
      ...validAppointment,
      scheduled_time: '17:00', // Después de las 5 PM
    });
    expect(result2.success).toBe(false);
  });

  it('debería aceptar hora en horario laboral', () => {
    const result = appointmentSchema.safeParse({
      ...validAppointment,
      scheduled_time: '08:00',
    });
    expect(result.success).toBe(true);

    const result2 = appointmentSchema.safeParse({
      ...validAppointment,
      scheduled_time: '16:00',
    });
    expect(result2.success).toBe(true);
  });

  it('debería rechazar motivo muy corto', () => {
    const result = appointmentSchema.safeParse({
      ...validAppointment,
      reason: 'Corto',
    });
    expect(result.success).toBe(false);
  });

  it('debería rechazar motivo muy largo', () => {
    const result = appointmentSchema.safeParse({
      ...validAppointment,
      reason: 'a'.repeat(501),
    });
    expect(result.success).toBe(false);
  });

  it('debería aceptar motivo de longitud válida', () => {
    const result = appointmentSchema.safeParse({
      ...validAppointment,
      reason: 'a'.repeat(10),
    });
    expect(result.success).toBe(true);

    const result2 = appointmentSchema.safeParse({
      ...validAppointment,
      reason: 'a'.repeat(500),
    });
    expect(result2.success).toBe(true);
  });

  it('debería aceptar notas opcionales', () => {
    const result = appointmentSchema.safeParse({
      ...validAppointment,
      notes: 'Alguna nota adicional',
    });
    expect(result.success).toBe(true);
  });

  it('debería rechazar notas muy largas', () => {
    const result = appointmentSchema.safeParse({
      ...validAppointment,
      notes: 'a'.repeat(1001),
    });
    expect(result.success).toBe(false);
  });
});
