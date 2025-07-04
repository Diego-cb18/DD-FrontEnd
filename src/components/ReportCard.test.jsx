import { render, screen } from '@testing-library/react';
import ReportCard from './ReportCard';

const mockReport = {
  first_name: 'Juan',
  last_name: 'Pérez',
  dni: '12345678',
  phone: '987654321',
  vehicle_type: 'Bus',
  plate: 'ABC-123',
  weight: 80,
  height: 175,
  status: 'no revisado',
  date: '2025-06-23',
  time: '15:00',
  state: 'Somnoliento',
  cause: 'Microsueño Moderado',
  severity: 'Alta',
  critical_events: ['Microsueño moderado (Ojos cerrados 7-10seg - 9 segundos)'],
  video_names: ['evento_1.mp4'],
  url_videos: ['https://s3.amazonaws.com/test/evento_1.mp4'],
};

describe('ReportCard', () => {
  test('renderiza correctamente nombre y apellido', () => {
    render(<ReportCard report={mockReport} />);
    expect(screen.getByText(/Juan Pérez/)).toBeInTheDocument();
  });

  test('muestra el tipo de vehículo y placa', () => {
    render(<ReportCard report={mockReport} />);
    expect(screen.getByText(/Bus/)).toBeInTheDocument();
    expect(screen.getByText(/ABC-123/)).toBeInTheDocument();
  });

  test('muestra la causa del evento crítico', () => {
    render(<ReportCard report={mockReport} />);
    expect(screen.getByText(/Microsueño Moderado/)).toBeInTheDocument();
  });

  test('muestra el botón Ver video', () => {
    render(<ReportCard report={mockReport} />);
    expect(screen.getByText(/Ver video/)).toBeInTheDocument();
  });
});
