import { describe, test, vi, expect } from 'vitest';
import { generatePDF } from './pdfGenerator';
import jsPDF from 'jspdf';

// Mock jsPDF para evitar crear PDFs reales durante los tests
vi.mock('jspdf', () => {
  const jsPDFMock = vi.fn(() => ({
    addImage: vi.fn(),
    setFontSize: vi.fn(),
    setFont: vi.fn(),
    text: vi.fn(),
    splitTextToSize: vi.fn((text) => [text]),
    line: vi.fn(),
    save: vi.fn(),
    setLineWidth: vi.fn(),
  }));
  jsPDFMock.API = {}; // si alguna librería externa usa jsPDF.API
  return { default: jsPDFMock };
});

describe('generatePDF', () => {
  test('debería generar y guardar un PDF sin lanzar errores', () => {
    const mockReport = {
      first_name: 'Juan',
      last_name: 'Pérez',
      dni: '12345678',
      phone: '987654321',
      vehicle_type: 'Bus',
      plate: 'ABC-123',
      weight: 80,
      height: 175,
      estado: 'no revisado',
      gravedad: 'Alta',
      critical_events: ['Microsueño moderado (Ojos cerrados 7-10seg - 9 segundos)'],
      generated_at: new Date().toISOString(),
    };

    expect(() => generatePDF(mockReport)).not.toThrow();

    const instance = jsPDF.mock.results[0].value;
    expect(instance.addImage).toHaveBeenCalled();
    expect(instance.text).toHaveBeenCalled();
    expect(instance.save).toHaveBeenCalledWith(expect.stringContaining('reporte_somnolencia_Juan_Pérez.pdf'));
  });
});
