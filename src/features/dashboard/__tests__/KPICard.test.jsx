import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { KPICard } from '../components/KPICard';

describe('KPICard Component', () => {
  const defaultProps = {
    title: 'Total Citas',
    value: '150',
    subtitle: 'Este mes',
    trend: 12.5,
    color: '#39a900',
    icon: null,
  };

  it('debería renderizar el título y valor', () => {
    render(<KPICard {...defaultProps} />);

    expect(screen.getByText('Total Citas')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
  });

  it('debería renderizar el subtítulo cuando se proporciona', () => {
    render(<KPICard {...defaultProps} />);

    expect(screen.getByText('Este mes')).toBeInTheDocument();
  });

  it('no debería renderizar subtítulo cuando no se proporciona', () => {
    render(<KPICard {...defaultProps} subtitle={null} />);

    expect(screen.queryByText('Este mes')).not.toBeInTheDocument();
  });

  it('debería mostrar tendencia positiva', () => {
    render(<KPICard {...defaultProps} trend={12.5} />);

    expect(screen.getByText('12.5%')).toBeInTheDocument();
    expect(screen.getByText('12.5%').closest('.kpi-trend-v2')).toHaveClass('positive');
  });

  it('debería mostrar tendencia negativa', () => {
    render(<KPICard {...defaultProps} trend={-5.2} />);

    expect(screen.getByText('5.2%')).toBeInTheDocument();
    expect(screen.getByText('5.2%').closest('.kpi-trend-v2')).toHaveClass('negative');
  });

  it('no debería mostrar tendencia cuando es null o undefined', () => {
    render(<KPICard {...defaultProps} trend={null} />);

    expect(screen.queryByText('%')).not.toBeInTheDocument();
  });

  it('debería aplicar el color personalizado', () => {
    render(<KPICard {...defaultProps} color="#ff0000" />);

    const valueElement = screen.getByText('150');
    expect(valueElement).toHaveStyle({ color: '#ff0000' });
  });

  it('debería renderizar el icono cuando se proporciona', () => {
    const MockIcon = () => <span data-testid="mock-icon">Icon</span>;
    render(<KPICard {...defaultProps} icon={MockIcon} />);

    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
  });

  it('debería tener estructura HTML correcta', () => {
    render(<KPICard {...defaultProps} />);

    expect(screen.getByText('Total Citas').closest('.kpi-card-v2')).toBeInTheDocument();
    expect(screen.getByText('150').closest('.kpi-content-v2')).toBeInTheDocument();
  });
});
