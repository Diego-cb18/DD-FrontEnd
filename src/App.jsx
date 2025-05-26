import { useEffect, useState } from 'react';
import ReportCard from './components/ReportCard';
import Sidebar from './components/Sidebar';
import VideoModal from './components/VideoModal';

function App() {
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeDate, setActiveDate] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null); // Reporte para el modal

  useEffect(() => {
    fetch('http://127.0.0.1:8000/reports/')
      .then(res => res.json())
      .then(data => setReports(data))
      .catch(err => console.error("Error al cargar reportes:", err));
  }, []);

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
          {filterReports().length === 0
            ? <p>No hay reportes disponibles.</p>
            : filterReports().map((r, i) => (
                <ReportCard
                  key={i}
                  report={r}
                  onViewVideo={() => setSelectedReport(r)}
                />
              ))}
        </div>
      </main>

      {selectedReport && (
        <VideoModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </div>
  );
}

export default App;
