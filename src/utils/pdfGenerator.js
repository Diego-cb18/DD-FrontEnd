import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../assets/imgs/logoDefault.png";

const getDefaultDimensions = (type) => {
  const tipo = type?.toLowerCase();
  if (tipo.includes("bus")) return { weight: "9.0 t", height: "3.2 m" };
  if (tipo.includes("camión")) return { weight: "12.0 t", height: "3.5 m" };
  if (tipo.includes("minibús") || tipo.includes("minibus")) return { weight: "4.5 t", height: "2.8 m" };
  return { weight: "-", height: "-" };
};

export const generatePDF = (report) => {
  const {
    first_name,
    last_name,
    dni,
    phone,
    vehicle_type,
    plate,
    height,
    weight,
    estado,
    gravedad,
    critical_events,
    generated_at
  } = report;

  const doc = new jsPDF();

  // Logo y encabezado
  doc.addImage(logo, "PNG", 15, 10, 40, 20);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Reporte de Somnolencia - VigIA", 60, 20);

  const fecha = new Date(generated_at);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(`Fecha de Generación: ${fecha.toLocaleDateString()} - ${fecha.toLocaleTimeString()}`, 60, 27);

  // Dimensiones por defecto si no existen
  const defaults = getDefaultDimensions(vehicle_type);
  const pesoFinal = weight || defaults.weight;
  const alturaFinal = height || defaults.height;

  // Espacio inicial para cuerpo
  let y = 40;

  // Párrafo 1: presentación
  const p1 = `Este documento detalla el informe técnico generado por el sistema de monitoreo inteligente VigIA respecto al estado de somnolencia del conductor ${first_name} ${last_name}, con número de DNI ${dni} y número de contacto ${phone}. La presente evaluación fue emitida en tiempo real el día ${fecha.toLocaleDateString()} a las ${fecha.toLocaleTimeString()} horas, durante su jornada al mando de un vehículo de tipo ${vehicle_type}, con placa ${plate}.`;

  // Párrafo 2: sobre el vehículo
  const p2 = `El vehículo conducido presenta características aproximadas de altura ${alturaFinal} y peso ${pesoFinal}, acorde a los registros por tipo de unidad, estos valores permiten contextualizar la operación y evaluar los posibles riesgos asociados a la conducción prolongada bajo condiciones de fatiga. Durante el proceso de monitoreo se detectaron indicadores fisiológicos y patrones visuales compatibles con signos de somnolencia, tras el análisis de los eventos críticos identificados, se ha determinado que la gravedad general del reporte es "${gravedad}", y su estado actual es "${estado}", esta calificación se sustenta en el tipo, duración y frecuencia de los eventos detectados.`;

  // Párrafo 4: aviso
  const p3 = `Se recomienda a los encargados de la gestión operativa tomar conocimiento de este reporte y proceder con las acciones correspondientes, la vigilancia continua y la atención a estos indicadores son fundamentales para preservar la seguridad vial, la integridad del conductor y de los pasajeros.`;

  // Agregar párrafos con salto automático
  const paragraphs = [p1, p2, p3];
  doc.setFontSize(12);
  paragraphs.forEach(paragraph => {
    const lines = doc.splitTextToSize(paragraph, 180);
    doc.text(lines, 15, y);
    y += lines.length * 5 + 1;
  });

  // Eventos críticos
  doc.setFont("helvetica", "bold");
   y += 8;
  doc.text("Eventos Críticos Registrados:", 15, y);
  y += 8;

  doc.setFont("helvetica", "normal");
  if (critical_events && critical_events.length > 0) {
    critical_events.forEach(event => {
      const lines = doc.splitTextToSize(`• ${event}`, 180);
      doc.text(lines, 20, y);
      y += lines.length * 6;
    });
  } else {
    doc.text("No se registraron eventos críticos durante la jornada.", 20, y);
    y += 6;
  }

  // Firma
  doc.setLineWidth(0.1);
  doc.line(130, y + 20, 180, y + 20);
  doc.setFontSize(10);
  doc.text("Supervisor de Monitoreo", 140, y + 26);

  // Guardar
  const filename = `reporte_somnolencia_${first_name}_${last_name}.pdf`;
  doc.save(filename);
};
