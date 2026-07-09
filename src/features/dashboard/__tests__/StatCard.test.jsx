import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatCard } from '../components/StatCard';

describe('StatCard Component', () => {
  const defaultProps = {
    title: 'Citas Pendientes',
    value: '25',
    trend: 8.3,
    color: '#39a900',
    icon: null,
  };

  it('debería renderizar el título y valor', () => {
    render(<StatCard {...defaultProps} />);

    expect(screen.getByText('Citas Pendientes')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
  });

  it('debería mostrar tendencia positiva con porcentaje', () => {
    render(<StatCard {...defaultProps} trend={8.3} />);

    expect(screen.getByText('8.3% vs semana anterior')).toBeInTheDocument();
    expect(screen.getByText('8.3% vs semana anterior').closest('.stat-trend-mobile')).toHaveClass('positive');
  });

  it('debería mostrar tendencia negativa con porcentaje', () => {
    render(<StatCard {...defaultProps} trend={-3.2} />);

    expect(screen.getByText('3.2% vs semana anterior')).toBeInTheDocument();
    expect(screen.getByText('3.2% vs semana anterior').closest('.stat-trend-mobile')).toHaveClass('negative');
  });

  it('no debería mostrar tendencia cuando es undefined', () => {
    render(<StatCard {...defaultProps} trend={undefined} />);

    expect(screen.queryByText(/vs semana anterior/)).not.toBeInTheDocument();
  });

  it('debería aplicar el color personalizado', () => {
    render(<StatCard {...defaultProps} color="#ff0000" />);

    const valueElement = screen.getByText('25');
    expect(valueElement).toHaveStyle({ color: '#ff0000' });
  });

  it('debería renderizar el icono cuando se proporciona', () => {
    const MockIcon = () => <span data-testid="mock-icon">Icon</span>;
    render(<StatCard {...defaultProps} icon={MockIcon} />);

    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
  });

  it('debería tener estructura HTML correcta', () => {
    render(<StatCard {...defaultProps} />);

    expect(screen.getByText('Citas Pendientes').closest('.stat-card-mobile')).toBeInTheDocument();
    expect(screen.getByText('25').closest('.stat-content-mobile')).toBeInTheDocument();
  });

  it('debería manejar tendencia de 0 correctamente', () => {
    render(<StatCard {...defaultProps} trend={0} />);

    expect(screen.getByText('0% vs semana anterior')).toBeInTheDocument();
    expect(screen.getByText('0% vs semana anterior').closest('.stat-trend-mobile')).toHaveClass('positive');
  });
});
