import { describe, it, expect } from 'vitest';
import { formatDate, formatDateTime, formatDocumentNumber } from '../utils/formatters';

describe('formatters', () => {
  describe('formatDate', () => {
    it('debería formatear una fecha válida', () => {
      const result = formatDate('2026-07-07');
      expect(result).toBe('7 de julio de 2026');
    });

    it('debería formatear fecha con patrón personalizado', () => {
      const result = formatDate('2026-07-07', 'dd/MM/yyyy');
      expect(result).toBe('07/07/2026');
    });

    it('debería formatear fecha con mes en español', () => {
      const result = formatDate('2026-12-25', 'MMMM yyyy');
      expect(result).toBe('diciembre 2026');
    });

    it('debería lanzar error con fecha inválida', () => {
      expect(() => formatDate('fecha-invalida')).toThrow();
    });
  });

  describe('formatDateTime', () => {
    it('debería formatear fecha y hora', () => {
      const result = formatDateTime('2026-07-07T14:30:00');
      expect(result).toBe('7 de julio de 2026 a las 14:30');
    });

    it('debería formatear fecha y hora por la mañana', () => {
      const result = formatDateTime('2026-07-07T09:00:00');
      expect(result).toBe('7 de julio de 2026 a las 09:00');
    });

    it('debería formatear fecha y hora por la noche', () => {
      const result = formatDateTime('2026-07-07T20:45:00');
      expect(result).toBe('7 de julio de 2026 a las 20:45');
    });

    it('debería lanzar error con fecha inválida', () => {
      expect(() => formatDateTime('invalid')).toThrow();
    });
  });

  describe('formatDocumentNumber', () => {
    it('debería formatear número de documento con puntos', () => {
      const result = formatDocumentNumber(1234567890);
      expect(result).toBe('1.234.567.890');
    });

    it('debería formatear número corto', () => {
      const result = formatDocumentNumber(123456);
      expect(result).toBe('123.456');
    });

    it('debería formatear número largo', () => {
      const result = formatDocumentNumber(1234567890123);
      expect(result).toBe('1.234.567.890.123');
    });

    it('debería manejar null o undefined', () => {
      expect(formatDocumentNumber(null)).toBe('');
      expect(formatDocumentNumber(undefined)).toBe('');
    });

    it('debería manejar número como string', () => {
      const result = formatDocumentNumber('1234567890');
      expect(result).toBe('1.234.567.890');
    });

    it('debería manejar cero', () => {
      const result = formatDocumentNumber(0);
      expect(result).toBe('0');
    });
  });
});
