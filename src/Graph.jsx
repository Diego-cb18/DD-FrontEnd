import React, { useEffect, useRef } from 'react';
import { Pie, Line } from '@antv/g2plot';

const WEEK_KPIS = {
  avgTimeSaved: 18, // minutos por día
  totalTimeSavedWeek: 18 * 7,
  avgEnergySaved: 8, // kWh por día
  totalEnergySavedWeek: 8 * 7,
};

function Graph() {
  const pieRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    if (pieRef.current) {
      const piePlot = new Pie(pieRef.current, {
        data: [
          { type: 'Minutos totales promedio', value: 120 },
          { type: 'Minutos grabados promedio', value: 75 },
        ],
        angleField: 'value',
        colorField: 'type',
        radius: 0.6,
        appendPadding: [20, 20, 20, 20],
        legend: {
          position: 'right',
          layout: 'vertical',
        },
        label: {
          type: 'spider',
          content: (item) => `${item.value} min`,
          style: {
            fontSize: 14,
            textAlign: 'center',
          },
        },
        tooltip: {
          formatter: (datum) => {
            return { name: datum.type, value: `${datum.value} min` };
          },
        },
        statistic: {
          title: false,
          content: {
            style: {
              fontSize: 12,
            },
            content: 'Distribución de minutos',
          },
        },
        color: ['#D45151', '#587FD4'],
      });
      piePlot.render();

      return () => piePlot.destroy();
    }
  }, []);

  useEffect(() => {
    if (lineRef.current) {
      const data = [
        { day: 'Lun', type: 'Minutos ahorrados revisión', value: 12 },
        { day: 'Mar', type: 'Minutos ahorrados revisión', value: 14 },
        { day: 'Mié', type: 'Minutos ahorrados revisión', value: 12 },
        { day: 'Jue', type: 'Minutos ahorrados revisión', value: 20 },
        { day: 'Vie', type: 'Minutos ahorrados revisión', value: 16 },
        { day: 'Sáb', type: 'Minutos ahorrados revisión', value: 10 },
        { day: 'Dom', type: 'Minutos ahorrados revisión', value: 12 },
        { day: 'Lun', type: 'Energía ahorrada', value: 5 },
        { day: 'Mar', type: 'Energía ahorrada', value: 11 },
        { day: 'Mié', type: 'Energía ahorrada', value: 14 },
        { day: 'Jue', type: 'Energía ahorrada', value: 12 },
        { day: 'Vie', type: 'Energía ahorrada', value: 24 },
        { day: 'Sáb', type: 'Energía ahorrada', value: 20 },
        { day: 'Dom', type: 'Energía ahorrada', value: 15 },
      ];

      const linePlot = new Line(lineRef.current, {
        data,
        xField: 'day',
        yField: 'value',
        seriesField: 'type',
        smooth: true,
        appendPadding: [40, 20, 40, 20],
        xAxis: {
          title: null,
        },
        yAxis: {
          title: {
            text: 'Valor',
          },
          label: {
            formatter: (v) => `${v}`,
          },
        },
        legend: {
          position: 'top-right',
          offsetY: 20,
        },
        color: ['#D12D2D', '#2563EB'],
        label: {
          style: {
            fill: '#374151',
            fontSize: 10,
          },
          formatter: (datum) =>
            datum.type.startsWith('Minutos') ? `${datum.value} min` : `${datum.value} kWh`,
        },
        tooltip: {
          formatter: (datum) => {
            const valueWithUnit = datum.type.startsWith('Minutos')
              ? `${datum.value} min`
              : `${datum.value} kWh`;
            return { name: datum.type, value: valueWithUnit };
          },
        },
        animation: {
          appear: {
            animation: 'path-in',
            duration: 1000,
          },
        },
      });

      linePlot.render();

      return () => linePlot.destroy();
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#C4C4C4] flex">
      <main className="ml-20 p-10 w-full flex flex-col">
        {/* Sección superior (30%): KPIs */}
        <section className="flex-[0.3] mb-6">
          <div className="h-full bg-white/70 border border-black/40 rounded-2xl p-6 shadow-md flex flex-col justify-center">
            <h1 className="text-2xl font-bold mb-4">Resumen semanal</h1>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/80 border border-black/10 rounded-2xl p-4 flex flex-col justify-between">
                <p className="text-sm font-semibold text-gray-700 mb-2">Tiempo ahorrado</p>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold">{WEEK_KPIS.totalTimeSavedWeek} min</p>
                    <p className="text-xs text-gray-600 mt-1">Promedio diario: {WEEK_KPIS.avgTimeSaved} min</p>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 border border-green-300">
                    Revisión optimizada
                  </span>
                </div>
              </div>

              <div className="bg-white/80 border border-black/10 rounded-2xl p-4 flex flex-col justify-between">
                <p className="text-sm font-semibold text-gray-700 mb-2">Energía ahorrada</p>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold">{WEEK_KPIS.totalEnergySavedWeek} kWh</p>
                    <p className="text-xs text-gray-600 mt-1">Promedio diario: {WEEK_KPIS.avgEnergySaved} kWh</p>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-300">
                    Impacto energético
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sección inferior (70%): gráficos */}
        <section className="flex-[0.7]">
          <div className="h-full bg-white/70 border border-black/40 rounded-2xl p-6 shadow-md flex gap-6">
            {/* Izquierda: gráfico de pie (G2Plot) */}
            <div className="w-1/2 flex flex-col">
              <h2 className="text-lg font-semibold mb-4">Distribución de minutos</h2>
              <div className="flex-1 border border-black/20 rounded-xl bg-white/80 px-2 py-2 overflow-hidden flex items-center justify-center">
                <div ref={pieRef} className="w-full h-full" />
              </div>
            </div>

            {/* Derecha: gráfico de líneas (G2Plot) */}
            <div className="w-1/2 flex flex-col">
              <h2 className="text-lg font-semibold mb-4">Tendencia semanal</h2>
              <div className="flex-1 flex flex-col">
                <div className="flex-1 border border-black/20 rounded-xl bg-white/80 px-2 py-2 overflow-hidden">
                  <div ref={lineRef} className="w-full h-full" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Graph;
