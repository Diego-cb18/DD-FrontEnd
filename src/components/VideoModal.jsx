import React, { useState } from 'react';

const VideoModal = ({ report, onClose, onMarkReviewed }) => {
  const { url_videos = [], critical_events, estado, generated_at, first_name, last_name, id } = report;
  const [currentIndex, setCurrentIndex] = useState(0);

  const fecha = new Date(generated_at);
  const fechaStr = fecha.toLocaleDateString();
  const rawHours = fecha.getHours();
  const minutes = fecha.getMinutes().toString().padStart(2, '0');
  const period = rawHours >= 12 ? 'PM' : 'AM';
  const hours = ((rawHours + 11) % 12 + 1).toString().padStart(2, '0');
  const horaStr = `${hours}:${minutes} ${period}`;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : url_videos.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < url_videos.length - 1 ? prev + 1 : 0));
  };

    const handleMarkReviewed = async () => {
    try {
        await fetch(`http://127.0.0.1:8000/reports/${id}/mark-reviewed/`, {
        method: 'PATCH',
        });
        window.location.reload();  // <-- fuerza la recarga completa
    } catch (error) {
        console.error("Error al marcar como revisado:", error);
    }
    };


  const isRevisado = estado?.toLowerCase() === 'revisado';

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-70 flex justify-center items-center z-50 px-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-6 text-xl font-bold text-gray-500 hover:text-black cursor-pointer"
        >
          ✕
        </button>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-center w-full">
            VIDEO DEL INCIDENTE SELECCIONADO <span>{`${currentIndex + 1}/${url_videos.length}`}</span>
          </h2>
        </div>

        {url_videos.length > 0 ? (
          <div className="flex flex-col items-center mb-4">
            <video key={url_videos[currentIndex]} controls className="rounded w-full max-w-3xl">
              <source src={url_videos[currentIndex]} type="video/mp4" />
              Tu navegador no soporta videos.
            </video>
          </div>
        ) : (
          <p className="text-center text-red-600">No se encontraron videos</p>
        )}

        <div className="grid grid-cols-[1fr_3fr] gap-6 mb-6 px-12 py-4">

          {/* Columna izquierda (2/5) */}
          
          <div className="text-left">
            <div className="flex ml-6 mb-4 space-x-8">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className={`text-4xl font-bold transition ${
                  currentIndex === 0
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-black hover:text-gray-600 cursor-pointer'
                }`}
              >
                &#129044;
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex === url_videos.length - 1}
                className={`text-4xl font-bold transition ${
                  currentIndex === url_videos.length - 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-black hover:text-gray-600 cursor-pointer'
                }`}
              >
                &#129046;
              </button>
            </div>
            <p>
              Estado:{' '}
              <span
                className={`font-bold ${
                  isRevisado ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {estado}
              </span>
            </p>
            <p>{fechaStr} - {horaStr}</p>
            <p>{`${first_name} ${last_name}`}</p>
          </div>

          {/* Columna derecha (3/5) con scroll */}
          <div className="max-h-[120px] overflow-y-auto pr-2 mt-2">
            <h3 className="text-lg font-semibold mb-2">Eventos registrados:</h3>
            <ul className="list-disc ml-6 space-y-1">
              {critical_events && critical_events.length > 0 ? (
                critical_events.map((event, i) => <li key={i}>{event}</li>)
              ) : (
                <li>No se registraron eventos críticos.</li>
              )}
            </ul>
          </div>
        </div>

        <div className="text-center mb-4">
          <button
            onClick={handleMarkReviewed}
            disabled={isRevisado}
            className={`px-6 py-2 rounded transition ${
              isRevisado
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-black text-white hover:bg-gray-700 cursor-pointer'
            }`}
          >
            Marcar como revisado
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
