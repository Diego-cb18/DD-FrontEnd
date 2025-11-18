import React from 'react';

const TermsModal = ({ onAccept, onReject }) => {
  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-70 flex justify-center items-center z-50 px-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-4xl relative max-h-[90vh] overflow-y-auto">

        <h2 className="text-2xl font-bold text-center mb-6">
          Términos y Condiciones de Uso y Aviso de Privacidad
        </h2>

        <div className="text-sm leading-relaxed mb-8 space-y-4">
          <p>1. Al ingresar y utilizar el sistema VigIA, el usuario declara comprender y aceptar que la plataforma captura y analiza imágenes de su rostro con el único propósito de evaluar signos de somnolencia durante sesiones controladas. Estas grabaciones forman parte de un proyecto académico y experimental que emplea visión computacional e IoT para estudiar patrones como pestañeos prolongados, bostezos o cabeceos, y no persiguen fines comerciales, clínicos o de vigilancia personal. El ingreso al sistema implica consentimiento expreso para que estas imágenes sean procesadas según lo descrito.</p>

          <p>2. El usuario acepta que los videos, imágenes y métricas generadas solo serán revisados por un supervisor autorizado, quien es el responsable directo del uso, validación y manejo ético de la información. Los desarrolladores del sistema declaran que no emplearán estos datos con fines maliciosos, ajenos al proyecto o que comprometan la privacidad del participante, limitando su uso estrictamente al análisis académico y al funcionamiento del software. El supervisor asume la responsabilidad del uso adecuado de los datos que revise dentro del sistema.</p>

          <p>3. El usuario comprende y acepta que los datos recolectados, incluidos los videos y registros generados por los eventos detectados, serán almacenados de forma segura en servicios en la nube ubicados en los Estados Unidos, específicamente en un bucket de Amazon Web Services (AWS S3), en la región us-east-2 (Ohio), así como en una base de datos Firestore de Google Cloud Platform para los reportes estructurados. Al continuar, el usuario autoriza el uso de estas plataformas y reconoce que la información se rige también por las políticas y normativas internas de dichas empresas de servicios en la nube.</p>

          <p>4. El sistema aplica medidas razonables de seguridad como comunicación cifrada, control de acceso por roles y almacenamiento privado, pero el usuario acepta que ningún entorno digital puede garantizar protección absoluta contra riesgos externos. Los desarrolladores se comprometen a emplear buenas prácticas de seguridad, preservar la confidencialidad y evitar el acceso no autorizado; sin embargo, no asumen responsabilidad por daños derivados de eventos fuera de su control, siempre que no exista negligencia directa en la gestión del sistema.</p>

          <p>5. La información recopilada será conservada únicamente durante el tiempo necesario para el análisis académico y la validación de los resultados del proyecto, tras lo cual será eliminada o anonimizada de forma progresiva. El usuario puede solicitar la eliminación anticipada de sus datos cuando lo considere necesario, siempre que ello no interfiera con fases críticas del estudio. La continuidad en el uso del sistema implica aceptación plena de estas condiciones de retención, tratamiento y eliminación de los datos generados.</p>

          <p>6. Finalmente, al seleccionar la opción de aceptación, el usuario manifiesta que ha leído y comprende la naturaleza del proyecto, la finalidad del tratamiento de sus datos, el modo en que serán almacenados, el rol del supervisor en su uso y la ausencia de fines maliciosos por parte de los creadores del software. Asimismo, reconoce que la plataforma es exclusivamente experimental, no constituye un sistema médico ni un servicio comercial, y que su participación es voluntaria. Si el usuario no está de acuerdo con estas condiciones, debe abstenerse de continuar o seleccionar la opción "No acepto".</p>
        </div>

        <div className="text-center space-x-4">
          <button
            onClick={onAccept}
            className="bg-[#0C0C0C] text-white px-6 py-3 rounded border hover:bg-gray-700 text-sm cursor-pointer"
          >
            Aceptar
          </button>
          <button
            onClick={onReject}
            className="bg-transparent text-[#0C0C0C] px-6 py-3 rounded border border-[#0C0C0C] hover:bg-gray-100 text-sm cursor-pointer"
          >
            No acepto
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
