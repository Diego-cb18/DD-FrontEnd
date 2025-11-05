import React from "react";
import userDefault from "../assets/imgs/userDefault.png";
import busDefault from "../assets/imgs/minibusDefault.png";
import camionDefault from "../assets/imgs/camionDefault.png";
import minibusDefault from "../assets/imgs/minibusDefault.png";
import descargaDefault from "../assets/imgs/descargaDefault.png";
import { generatePDF } from "../utils/pdfGenerator";

function ReportCard({ report, onViewVideo, onMarkReviewed }) {
  const {
    first_name,
    last_name,
    dni,
    phone,
    vehicle_type,
    plate,
    height,
    weight,
    generated_at,
    critical_events,
    video_names,
    estado,
    gravedad,
  } = report;

  const severities = {
    "microsueño profundo": 4,
    "microsueño moderado": 3,
    "microsueño leve": 2,
    "parpadeo prolongado": 1,
    "parpadeos constantes": 0,
    "bostezos constantes": 0,
    "cabeceos constantes": 0,
  };

  const getMostSevereEvent = () => {
    if (!critical_events || critical_events.length === 0) return "Sin causa";
    const sorted = [...critical_events].sort((a, b) => {
      const aKey =
        Object.keys(severities).find((k) => a.toLowerCase().includes(k)) || "";
      const bKey =
        Object.keys(severities).find((k) => b.toLowerCase().includes(k)) || "";
      return (severities[bKey] || -1) - (severities[aKey] || -1);
    });
    const causeText = sorted[0]?.split(" (")[0] || "Sin causa";
    return causeText.charAt(0).toUpperCase() + causeText.slice(1);
  };

  const getVehicleImage = (type) => {
    const tipo = type?.toLowerCase();
    if (tipo.includes("bus")) return busDefault;
    if (tipo.includes("camión")) return camionDefault;
    if (tipo.includes("minibús") || tipo.includes("minibus"))
      return minibusDefault;
    return null;
  };
  const getDefaultDimensions = (type) => {
    const tipo = type?.toLowerCase();
    if (tipo.includes("bus")) return { weight: "9.0 t", height: "3.2 m" };
    if (tipo.includes("camión")) return { weight: "12.0 t", height: "3.5 m" };
    if (tipo.includes("minibús") || tipo.includes("minibus"))
      return { weight: "4.5 t", height: "2.8 m" };
    return { weight: "-", height: "-" };
  };

  const fecha = new Date(generated_at);
  const fechaStr = fecha.toLocaleDateString();
  const rawHours = fecha.getHours();
  const minutes = fecha.getMinutes().toString().padStart(2, "0");
  const period = rawHours >= 12 ? "P.M." : "A.M.";
  const hours = (((rawHours + 11) % 12) + 1).toString().padStart(2, "0");
  const horaStr = `${hours}:${minutes} ${period}`;

  return (
    <div className="bg-white/40 rounded-2xl shadow-[0_10px_15px_-3px_rgba(0,0,0,0.4)] p-8 w-2/3 max-w-6xl mx-auto mb-6 grid grid-cols-[1.3fr_1.3fr_2.5fr] gap-6">
      {/* Columna 1: Conductor */}
      <div className="text-[15px] font-semibold space-y-1">
        <div className="flex justify-center">
          <img
            src={userDefault}
            alt="Foto conductor"
            className="w-25 h-25 rounded-full mb-4 mr-8 object-cover"
          />
        </div>
        <p>
          Nombre: {first_name} {last_name}
        </p>
        <p>DNI: {dni}</p>
        <p>Teléfono: {phone}</p>
      </div>

      {/* Columna 2: Vehículo */}
      <div className="text-[15px] font-semibold space-y-1">
        <div className="flex justify-center">
          <img
            src={getVehicleImage(vehicle_type)}
            alt="Vehículo"
            className={`object-contain mb-2 mt-2 mr-8 ${
              vehicle_type?.toLowerCase().includes("minibús") ||
              vehicle_type?.toLowerCase().includes("minibus")
                ? "w-28 h-20"
                : "w-36 h-20"
            }`}
          />
        </div>
        <hr className="border-2 border-t border-[#0C0C0C] mb-4 w-5/6" />
        <p>Placa: {plate}</p>
        <p>Tipo: {vehicle_type}</p>
        <div className="gap-y-1">
          {(() => {
            const defaults = getDefaultDimensions(vehicle_type);
            return (
              <>
                <p>
                  Peso: {weight ?? defaults.weight} - Altura:{" "}
                  {height ?? defaults.height}
                </p>
              </>
            );
          })()}
        </div>
      </div>

      {/* Columna 3: Reporte */}
      <div className="text-[15px] font-semibold col-span-1 grid grid-cols-[4.5fr_0.5fr] gap-4">
        {/* Parte izquierda: datos */}
        <div className="space-y-1">
          <p className="text-center text-lg font-bold mb-2 mr-2 py-2">
            REPORTE:
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <p>Gravedad: {gravedad}</p>
            <p>
              Estado:{" "}
              <span
                className={`font-bold ${
                  estado?.toLowerCase() === "revisado"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {estado}
              </span>
            </p>

            <p>Fecha: {fechaStr}</p>
            <p>Hora: {horaStr}</p>
          </div>
          <p className="mt-2">Causa: {getMostSevereEvent()}</p>


            <div className="mt-6 flex justify-center w-full">
              {video_names?.[0] && (
              <button
                onClick={onViewVideo}
                className="bg-[#0C0C0C] text-white px-4 py-2 rounded border hover:bg-gray-700 text-sm cursor-pointer mr-2"
              >
                Ver video
              </button>
              )}
              <button
                onClick={() => onMarkReviewed(report.id)}
                className="bg-[#0C0C0C] text-white px-4 py-2 rounded border hover:bg-gray-700 text-sm cursor-pointer mr-2"
              >
                Marcar Revisado
              </button>
            </div>
        </div>

        {/* Parte derecha: ícono descarga */}
        <div className="flex">
          <img
            src={descargaDefault}
            alt="Descargar"
            className="w-8 h-10 cursor-pointer"
            onClick={() => generatePDF(report)}
          />
        </div>
      </div>
    </div>
  );
}

export default ReportCard;
