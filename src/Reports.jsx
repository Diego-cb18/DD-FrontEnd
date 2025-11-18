import { useEffect, useState } from 'react';
import ReportCard from './components/ReportCard';
import Sidebar from './components/Sidebar';
import VideoModal from './components/VideoModal';
import TermsModal from './components/TermsModal';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { useNavigate } from 'react-router-dom';

// Funciones para generar datos aleatorios
const nombres = ["Diego", "Juan", "Luis", "Carlos"];
const apellidos = ["Pérez", "García", "Ramírez", "Campos"];

const generarNombreAleatorio = () => nombres[Math.floor(Math.random() * nombres.length)];
const generarApellidoAleatorio = () => apellidos[Math.floor(Math.random() * apellidos.length)];

const generarPlaca = () => {
  const letras = String.fromCharCode(...Array(3).fill().map(() => 65 + Math.floor(Math.random() * 26)));
  const numeros = Math.floor(100 + Math.random() * 900);
  return `${letras}-${numeros}`;
};

const tiposVehiculo = ["Bus", "Camión", "Minibús"];

function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeDate, setActiveDate] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null); // Reporte para el modal
  const [showTerms, setShowTerms] = useState(!localStorage.getItem('termsAccepted'));
  const navigate = useNavigate();

  const fetchReports = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'reports'));
      const reportsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        const conductor = data.conductor || {};
        const reporte = data.reporte_somnolencia || {};
        return {
          id: doc.id,
          first_name: conductor.nombre || conductor.first_name || generarNombreAleatorio(),
          last_name: conductor.apellidos || conductor.last_name || generarApellidoAleatorio(),
          dni: conductor.dni || String(Math.floor(10000000 + Math.random() * 90000000)),
          phone: conductor.phone || conductor.telefono || `9${Math.floor(100000000 + Math.random() * 900000000)}`,
          vehicle_type: conductor.vehicle_type || conductor.tipo_vehiculo || tiposVehiculo[Math.floor(Math.random() * tiposVehiculo.length)],
          plate: conductor.plate || conductor.placa || generarPlaca(),
          height: conductor.height || '',
          weight: conductor.weight || '',
          generated_at: data.fecha_generacion || (data.createdAt?.toDate()?.toISOString()) || '',
          critical_events: reporte.critical_events || [],
          url_videos: reporte.url_video_completo_test ? [reporte.url_video_completo_test] : [],
          video_names: reporte.url_video_completo_test ? [reporte.url_video_completo_test] : [],
          estado: reporte.estado || 'No revisado',
          gravedad: reporte.gravedad || 'Leve'
        };
      });
      setReports(reportsData);
    } catch (error) {
      console.error("Error al cargar reportes desde Firestore:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleMarkReviewed = async (reportId) => {
    try {
      const reportRef = doc(db, 'reports', reportId);
      await updateDoc(reportRef, {
        'reporte_somnolencia.estado': 'Revisado'
      });
      setReports(prev => prev.map(r => r.id === reportId ? {...r, estado: 'Revisado'} : r));
      setSelectedReport(null);
    } catch (error) {
      console.error("Error al marcar como revisado:", error);
    }
  };

  const gravedadOrden = {
    Grave: 3,
    Moderado: 2,
    Leve: 1
  };

  const handleDateSelect = (date) => {
    if (activeDate && date.toDateString() === activeDate.toDateString()) {
      setActiveDate(null);
      setSelectedDate(new Date());
    } else {
      setActiveDate(date);
      setSelectedDate(date);
    }
  };

  const filterReports = () => {
    let filtered = reports.filter(report => {

      const fullName = `${report.first_name} ${report.last_name}`.toLowerCase();

      const matchesSearch = fullName.includes(searchTerm.toLowerCase());

      const matchesDate = !activeDate || new Date(report.generated_at).toDateString() === activeDate.toDateString();

      let matchesEstado = true;
      if (filter === "Revisado" || filter === "No revisado") {
        matchesEstado = report.estado === filter;
      }

      return matchesSearch && matchesDate && matchesEstado;
    });

    if (filter === "Más recientes" || filter === "") {
      filtered.sort((a, b) => new Date(b.generated_at) - new Date(a.generated_at));
    } else if (filter === "Mas antiguos") {
      filtered.sort((a, b) => new Date(a.generated_at) - new Date(b.generated_at));
    } else if (filter === "Mayor gravedad" || filter === "Menor gravedad") {
      filtered.sort((a, b) => {
        const gravedadA = gravedadOrden[a.gravedad] || 0;
        const gravedadB = gravedadOrden[b.gravedad] || 0;
        if (gravedadA !== gravedadB) {
          return filter === "Mayor gravedad" ? gravedadB - gravedadA : gravedadA - gravedadB;
        }
        return new Date(b.generated_at) - new Date(a.generated_at);
      });
    }

    return filtered;
  };

  return (
    <div className="flex h-screen bg-[#C4C4C4] overflow-hidden">
      <Sidebar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filter={filter}
        setFilter={setFilter}
        selectedDate={selectedDate}
        handleDateSelect={handleDateSelect}
      />
      <main className="ml-80 p-10 flex justify-center items-start w-full">
        <div className="w-full h-full bg-[#C4C4C4] rounded-2xl overflow-y-auto">
          {loading
            ? <p>Cargando reportes...</p>
            : filterReports().length === 0
            ? <p>No hay reportes disponibles.</p>
            : filterReports().map((r, i) => (
                <ReportCard
                  key={i}
                  report={r}
                  onViewVideo={() => setSelectedReport(r)}
                  onMarkReviewed={handleMarkReviewed}
                />
              ))}
        </div>
      </main>

      {showTerms && (
        <TermsModal
          onAccept={() => { localStorage.setItem('termsAccepted', 'true'); setShowTerms(false); }}
          onReject={() => navigate('/')}
        />
      )}

      {selectedReport && (
        <VideoModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onMarkReviewed={handleMarkReviewed}
        />
      )}
    </div>
  );
}

export default Reports;
