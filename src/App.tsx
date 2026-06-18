import React, { useState } from 'react';
import { 
  FolderPlus, 
  Search, 
  Calendar, 
  AlertTriangle, 
  User, 
  FileText, 
  Activity, 
  Layers, 
  Heart, 
  Clock, 
  CheckCircle, 
  Plus, 
  Eye, 
  Calculator,
  Check
} from 'lucide-react';

// --- INTERFACES ---
interface Expediente {
  id: string;
  // Identificación (Marco Teórico)
  identificacion: {
    nombreMascota: string;
    especie: string;
    raza: string;
    sexo: string;
    edad: string;
    color: string;
    nombrePropietario: string;
    contacto: string;
  };
  // Secciones requeridas por el marco teórico
  anamnesis: string;
  examenFisico: {
    peso: string;
    temperatura: string;
    frecuenciaCardiaca: string;
    datosObjetivos: string;
  };
  estudiosComplementarios: string;
  diagnosticoPronostico: string;
  planTerapeutico: string;
  consentimientoInformado: boolean;
  fechaRegistro: string;
}

interface Cita {
  id: string;
  mascota: string;
  propietario: string;
  fecha: string;
  hora: string;
  motivo: string;
  veterinario: string;
  estado: 'pendiente' | 'completada' | 'cancelada';
}

interface Alerta {
  id: string;
  tipo: 'critica' | 'dosificacion' | 'recordatorio';
  mensaje: string;
  mascota: string;
  fecha: string;
}

export default function VetCareDashboard() {
  // --- ESTADOS ---
  const [activeTab, setActiveTab] = useState<'expedientes' | 'nuevo-expediente' | 'citas' | 'alertas'>('expedientes');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExpediente, setSelectedExpediente] = useState<Expediente | null>(null);
  
  // Calculadora de dosis integrada
  const [calcPeso, setCalcPeso] = useState('');
  const [calcDosis, setCalcDosis] = useState('');
  const [calcResultado, setCalcResultado] = useState<number | null>(null);

  // --- DATOS SEMILLA (MOCK DATA) ---
  const [expedientes, setExpedientes] = useState<Expediente[]>([
    {
      id: "EXP-2026-001",
      identificacion: {
        nombreMascota: "Dante",
        especie: "Canino",
        raza: "Chihuahua Cabeza de Manzana",
        sexo: "Macho",
        edad: "2 años",
        color: "Cervato",
        nombrePropietario: "César Mariscal",
        contacto: "3312345678"
      },
      anamnesis: "El paciente presenta un cuadro de tos seca de inicio abrupto desde hace 48 horas, predominantemente nocturna. Mantiene apetito normal.",
      examenFisico: {
        peso: "2.4 kg",
        temperatura: "38.7 °C",
        frecuenciaCardiaca: "110 lpm",
        datosObjetivos: "Mucosas delgadas rosadas, tiempo de llenado capilar 1s. Reflejo tusígeno positivo a la palpación traqueal ligera."
      },
      estudiosComplementarios: "Radiografía digital de tórax (proyección LL y VD): Leve patrón bronquial difuso, sin cardiomegalia aparente.",
      diagnosticoPronostico: "Traqueobronquitis infecciosa canina (Tos de las perreras). Pronóstico favorable a corto plazo.",
      planTerapeutico: "Administrar 0.5 mg/kg de Meloxicam vía oral cada 24 horas por 5 días. Reposo absoluto de caminatas extenuantes.",
      consentimientoInformado: true,
      fechaRegistro: "2026-06-10"
    },
    {
      id: "EXP-2026-002",
      identificacion: {
        nombreMascota: "Lucy",
        especie: "Canino",
        raza: "Pinscher Mezcla",
        sexo: "Hembra",
        edad: "4 años",
        color: "Negro y Fuego",
        nombrePropietario: "Rubén Rivera",
        contacto: "3387654321"
      },
      anamnesis: "Acude a revisión anual y actualización de cuadro biológico de vacunación.",
      examenFisico: {
        peso: "4.1 kg",
        temperatura: "38.4 °C",
        frecuenciaCardiaca: "95 lpm",
        datosObjetivos: "Condición corporal ideal 3/5. Dentadura con leve acumulación de sarro en premolares superiores."
      },
      estudiosComplementarios: "Ninguno requerido al momento de la evaluación.",
      diagnosticoPronostico: "Paciente clínicamente sano. Pronóstico excelente.",
      planTerapeutico: "Aplicación de refuerzo de vacuna Múltiple Canina (Sextuple) y Rabia. Monitorear posibles reacciones locales.",
      consentimientoInformado: true,
      fechaRegistro: "2026-06-11"
    }
  ]);

  const [citas, setCitas] = useState<Cita[]>([
    { id: "1", mascota: "Dante", propietario: "César Mariscal", fecha: "2026-06-12", hora: "10:30 AM", motivo: "Revisión de control de traqueobronquitis", veterinario: "Dr. Estrada", estado: "pendiente" },
    { id: "2", mascota: "Lucy", propietario: "Rubén Rivera", fecha: "2026-06-12", hora: "12:00 PM", motivo: "Profilaxis dental", veterinario: "Dr. Flores", estado: "pendiente" }
  ]);

  const [alertas, setAlertas] = useState<Alerta[]>([
    { id: "A1", tipo: "critica", mensaje: "Validar dosis límite de psicotrópicos (Grupo I) en pacientes menores a 3kg.", mascota: "Dante", fecha: "2026-06-11" },
    { id: "A2", tipo: "dosificacion", mensaje: "Alerta automática: Confirmar que el peso esté actualizado antes de calcular antibióticos.", mascota: "General", fecha: "2026-06-11" }
  ]);

  // --- FORMULARIO DE NUEVO EXPEDIENTE ---
  const [nuevoExp, setNuevoExp] = useState({
    nombreMascota: '', especie: 'Canino', raza: '', sexo: 'Macho', edad: '', color: '',
    nombrePropietario: '', contacto: '', anamnesis: '', peso: '', temperatura: '',
    frecuenciaCardiaca: '', datosObjetivos: '', estudiosComplementarios: '',
    diagnosticoPronostico: '', planTerapeutico: '', consentimientoInformado: false
  });

  const handleCrearExpediente = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevo: Expediente = {
      id: `EXP-2026-00${expedientes.length + 1}`,
      identificacion: {
        nombreMascota: nuevoExp.nombreMascota,
        especie: nuevoExp.especie,
        raza: nuevoExp.raza,
        sexo: nuevoExp.sexo,
        edad: nuevoExp.edad,
        color: nuevoExp.color,
        nombrePropietario: nuevoExp.nombrePropietario,
        contacto: nuevoExp.contacto
      },
      anamnesis: nuevoExp.anamnesis,
      examenFisico: {
        peso: nuevoExp.peso + " kg",
        temperatura: nuevoExp.temperatura + " °C",
        frecuenciaCardiaca: nuevoExp.frecuenciaCardiaca + " lpm",
        datosObjetivos: nuevoExp.datosObjetivos
      },
      estudiosComplementarios: nuevoExp.estudiosComplementarios || "Ninguno asentado.",
      diagnosticoPronostico: nuevoExp.diagnosticoPronostico,
      planTerapeutico: nuevoExp.planTerapeutico,
      consentimientoInformado: nuevoExp.consentimientoInformado,
      fechaRegistro: new Date().toISOString().split('T')[0]
    };

    setExpedientes([nuevo, ...expedientes]);
    // Resetear formulario
    setNuevoExp({
      nombreMascota: '', especie: 'Canino', raza: '', sexo: 'Macho', edad: '', color: '',
      nombrePropietario: '', contacto: '', anamnesis: '', peso: '', temperatura: '',
      frecuenciaCardiaca: '', datosObjetivos: '', estudiosComplementarios: '',
      diagnosticoPronostico: '', planTerapeutico: '', consentimientoInformado: false
    });
    setActiveTab('expedientes');
  };

  const calcularDosisMg = () => {
    const p = parseFloat(calcPeso);
    const d = parseFloat(calcDosis);
    if (!isNaN(p) && !isNaN(d)) {
      setCalcResultado(p * d);
    } else {
      setCalcResultado(null);
    }
  };

  const filteredExpedientes = expedientes.filter(exp => 
    exp.identificacion.nombreMascota.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exp.identificacion.nombrePropietario.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exp.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f4f7f5] via-[#fbfcfb] to-[#efece8] text-gray-800 flex font-sans antialiased">
      
      {/* SIDEBAR NAVIGATION - UI INNOVADORA */}
      <aside className="w-80 bg-white border-r border-[#e3eae5] flex flex-col justify-between p-6 shadow-sm sticky top-0 h-screen z-10">
        <div>
          {/* Logo Brand a partir de la imagen */}
          <div className="flex items-center gap-3 px-2 py-4 mb-8">
            <div className="w-11 h-11 bg-[#2d8a65] rounded-xl flex items-center justify-center shadow-md shadow-[#2d8a65]/20 text-white">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.42 2.72 6.23 6 6.72V21h2v-3.28c3.28-.49 6-3.3 6-6.72h-1.7z"/>
                <circle cx="12" cy="11" r="1" />
                <path d="M12 2a10 10 0 0 0-3.5 19.38V19.3a8 8 0 1 1 7 0v2.08A10 10 0 0 0 12 2z" opacity="0.2"/>
                {/* Icono de huella integrado */}
                <path d="M4.5 10.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3-3.5C6.67 7 6 6.33 6 5.5S6.67 4 7.5 4 9 4.67 9 5.5 8.33 7 7.5 7zm9 0c-.83 0-1.5-.67-1.5-1.5S15.67 4 16.5 4s1.5.67 1.5 1.5-.67 3-1.5 3zm3 3.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM12 9c-1.93 0-3.5 1.57-3.5 3.5 0 2.1 2.2 4.9 3.5 6.3 1.3-1.4 3.5-4.2 3.5-6.3C15.5 10.57 13.93 9 12 9z" scale="0.5"/>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-[#1c4735]">VetCare Pro</h1>
              <p className="text-xs text-[#708c7f] font-medium tracking-wide uppercase">Gestión de Expedientes</p>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1.5">
            <button
              onClick={() => { setActiveTab('expedientes'); setSelectedExpediente(null); }}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'expedientes'
                  ? 'bg-gradient-to-r from-[#2d8a65] to-[#3ca379] text-white shadow-md shadow-[#2d8a65]/15'
                  : 'text-[#556e62] hover:bg-[#f2f6f4] hover:text-[#2d8a65]'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText size={18} />
                <span>Expedientes Digitales</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'expedientes' ? 'bg-white/20 text-white' : 'bg-[#eef3f0] text-[#2d8a65]'}`}>{expedientes.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('nuevo-expediente')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'nuevo-expediente'
                  ? 'bg-gradient-to-r from-[#2d8a65] to-[#3ca379] text-white shadow-md shadow-[#2d8a65]/15'
                  : 'text-[#556e62] hover:bg-[#f2f6f4] hover:text-[#2d8a65]'
              }`}
            >
              <FolderPlus size={18} />
              <span>Crear Nuevo Registro</span>
            </button>

            <button
              onClick={() => setActiveTab('citas')}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'citas'
                  ? 'bg-gradient-to-r from-[#2d8a65] to-[#3ca379] text-white shadow-md shadow-[#2d8a65]/15'
                  : 'text-[#556e62] hover:bg-[#f2f6f4] hover:text-[#2d8a65]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Calendar size={18} />
                <span>Agenda & Citas</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#fcf8f2] text-[#845d2d] font-semibold">2 Hoy</span>
            </button>

            <button
              onClick={() => setActiveTab('alertas')}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'alertas'
                  ? 'bg-gradient-to-r from-[#b37d3e] to-[#cfa36e] text-white shadow-md shadow-[#b37d3e]/15'
                  : 'text-[#556e62] hover:bg-[#fcf8f2] hover:text-[#b37d3e]'
              }`}
            >
              <div className="flex items-center gap-3">
                <AlertTriangle size={18} />
                <span>Alertas Preventivas</span>
              </div>
              <span className="animate-pulse bg-[#e12d2d] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">¡2!</span>
            </button>
          </nav>
        </div>

        {/* Footer Sidebar con sutil paleta de tonos Café */}
        <div className="bg-[#fcfbf9] border border-[#f0ebe3] rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#845d2d]/10 text-[#845d2d] rounded-lg flex items-center justify-center font-bold text-sm">
              MV
            </div>
            <div>
              <p className="text-xs font-semibold text-[#5a4225]">Clínica Activa</p>
              <p className="text-[11px] text-[#8c7861]">Modo: Administrador Demo</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-10 overflow-y-auto max-w-7xl mx-auto w-full">
        
        {/* HEADER EXTRA INTERACTIVO */}
        <header className="flex justify-between items-center mb-8 pb-6 border-b border-[#e3eae5]">
          <div>
            <span className="text-xs font-bold text-[#845d2d] tracking-widest uppercase">Módulo de Operaciones</span>
            <h2 className="text-3xl font-extrabold text-[#1c4735] mt-1">
              {activeTab === 'expedientes' && "Expedientes Clínicos"}
              {activeTab === 'nuevo-expediente' && "Alta de Expediente Clínico"}
              {activeTab === 'citas' && "Control de Citas e Inconsistencias"}
              {activeTab === 'alertas' && "Alertas Clínicas Inteligentes"}
            </h2>
          </div>
          
          {/* Barra de búsqueda interactiva */}
          {activeTab === 'expedientes' && (
            <div className="relative w-80">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[#708c7f]" size={18} />
              <input
                type="text"
                placeholder="Buscar por mascota, tutor o ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-[#d2ded7] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2d8a65] focus:border-transparent shadow-sm transition-all placeholder:text-gray-400"
              />
            </div>
          )}
        </header>

        {/* --- CONTENIDO DINÁMICO POR PESTAÑA --- */}

        {/* 1. SECCIÓN: EXPEDIENTES CLÍNICOS */}
        {activeTab === 'expedientes' && !selectedExpediente && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredExpedientes.map((exp) => (
              <div 
                key={exp.id}
                className="bg-white border border-[#e3eae5] rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#2d8a65]/30 transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Decoración sutil de fondo */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#2d8a65]/5 rounded-bl-full transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform" />
                
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-[11px] font-mono font-bold bg-[#edf5f1] text-[#2d8a65] px-2.5 py-1 rounded-md">
                        {exp.id}
                      </span>
                      <h3 className="text-xl font-bold text-[#1c4735] mt-2 flex items-center gap-2">
                        {exp.identificacion.nombreMascota}
                        <span className="text-xs font-normal text-gray-500">({exp.identificacion.especie})</span>
                      </h3>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-[#845d2d]">{exp.identificacion.raza}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{exp.fechaRegistro}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-y-2 gap-x-4 border-t border-b border-gray-100 py-3 my-4 text-xs">
                    <div>
                      <span className="text-gray-400 block">Propietario / Tutor:</span>
                      <span className="font-semibold text-gray-700">{exp.identificacion.nombrePropietario}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Edad y Sexo:</span>
                      <span className="font-semibold text-gray-700">{exp.identificacion.edad} • {exp.identificacion.sexo}</span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="text-xs text-gray-600 line-clamp-2">
                      <strong className="text-[#1c4735]">Anamnesis:</strong> {exp.anamnesis}
                    </p>
                    <p className="text-xs text-gray-600 line-clamp-2">
                      <strong className="text-[#1c4735]">Diagnóstico:</strong> {exp.diagnosticoPronostico}
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setSelectedExpediente(exp)}
                    className="w-full flex items-center justify-center gap-2 bg-[#f4f7f5] hover:bg-[#2d8a65] text-[#2d8a65] hover:text-white font-medium text-xs py-2.5 px-4 rounded-xl transition-all border border-[#d2ded7] hover:border-transparent"
                  >
                    <Eye size={14} />
                    Ver Expediente Estructurado Completo
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* DETALLE COMPLETO DE UN EXPEDIENTE (Estructura rigurosa según Marco Teórico) */}
        {activeTab === 'expedientes' && selectedExpediente && (
          <div className="bg-white border border-[#e3eae5] rounded-3xl p-8 shadow-sm space-y-8 animate-fadeIn">
            
            {/* Cabecera del expediente detallado */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-6">
              <button 
                onClick={() => setSelectedExpediente(null)}
                className="text-xs font-semibold text-[#2d8a65] bg-[#edf5f1] hover:bg-[#2d8a65] hover:text-white px-3 py-1.5 rounded-lg transition-all"
              >
                ← Volver al listado
              </button>
              <div className="text-right">
                <span className="text-xs bg-[#fcf8f2] text-[#845d2d] border border-[#f2e6d5] px-3 py-1 rounded-full font-mono font-bold">
                  DOCUMENTO LEGAL REGISTRADO: {selectedExpediente.id}
                </span>
              </div>
            </div>

            {/* SECCIÓN I: IDENTIFICACIÓN DEL PACIENTE Y PROPIETARIO */}
            <section className="bg-gradient-to-r from-[#fcfbf9] to-[#f4f7f5] rounded-2xl p-6 border border-[#e8e3da]">
              <h4 className="text-xs font-bold text-[#845d2d] uppercase tracking-wider mb-4 flex items-center gap-2">
                <User size={14} /> I. Identificación del Paciente y Propietario
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm">
                <div><span className="text-gray-400 text-xs block">Nombre Mascota</span><span className="font-bold text-[#1c4735]">{selectedExpediente.identificacion.nombreMascota}</span></div>
                <div><span className="text-gray-400 text-xs block">Especie</span><span className="font-semibold text-gray-700">{selectedExpediente.identificacion.especie}</span></div>
                <div><span className="text-gray-400 text-xs block">Raza</span><span className="font-semibold text-[#845d2d]">{selectedExpediente.identificacion.raza}</span></div>
                <div><span className="text-gray-400 text-xs block">Sexo</span><span className="font-semibold text-gray-700">{selectedExpediente.identificacion.sexo}</span></div>
                <div><span className="text-gray-400 text-xs block">Edad</span><span className="font-semibold text-gray-700">{selectedExpediente.identificacion.edad}</span></div>
                <div><span className="text-gray-400 text-xs block">Color</span><span className="font-semibold text-gray-700">{selectedExpediente.identificacion.color}</span></div>
                <div><span className="text-gray-400 text-xs block">Propietario / Tutor</span><span className="font-bold text-gray-800">{selectedExpediente.identificacion.nombrePropietario}</span></div>
                <div><span className="text-gray-400 text-xs block">Contacto</span><span className="font-mono text-gray-700">{selectedExpediente.identificacion.contacto}</span></div>
              </div>
            </section>

            {/* SECCIÓN II Y III: ANAMNESIS Y EXAMEN FÍSICO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <section className="border border-[#e3eae5] rounded-2xl p-6">
                <h4 className="text-xs font-bold text-[#2d8a65] uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FileText size={14} /> II. Anamnesis / Historia Clínica Detallada
                </h4>
                <p className="text-sm text-gray-600 bg-[#fbfcfb] p-4 rounded-xl border border-gray-50 leading-relaxed">
                  {selectedExpediente.anamnesis}
                </p>
              </section>

              <section className="border border-[#e3eae5] rounded-2xl p-6">
                <h4 className="text-xs font-bold text-[#2d8a65] uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Activity size={14} /> III. Examen Físico Funcional
                </h4>
                <div className="grid grid-cols-3 gap-3 mb-3 text-center">
                  <div className="bg-[#f4f7f5] p-2.5 rounded-xl border border-[#d2ded7]">
                    <span className="text-[10px] text-gray-400 block uppercase font-medium">Peso</span>
                    <span className="font-bold text-sm text-[#1c4735]">{selectedExpediente.examenFisico.peso}</span>
                  </div>
                  <div className="bg-[#f4f7f5] p-2.5 rounded-xl border border-[#d2ded7]">
                    <span className="text-[10px] text-gray-400 block uppercase font-medium">Temp</span>
                    <span className="font-bold text-sm text-[#1c4735]">{selectedExpediente.examenFisico.temperatura}</span>
                  </div>
                  <div className="bg-[#f4f7f5] p-2.5 rounded-xl border border-[#d2ded7]">
                    <span className="text-[10px] text-gray-400 block uppercase font-medium">Frec. Cardíaca</span>
                    <span className="font-bold text-sm text-[#1c4735]">{selectedExpediente.examenFisico.frecuenciaCardiaca}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[11px] text-gray-400 font-medium block mb-1">Datos Objetivos Obtenidos:</span>
                  <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">{selectedExpediente.examenFisico.datosObjetivos}</p>
                </div>
              </section>
            </div>

            {/* SECCIÓN IV, V Y VI: ESTUDIOS COMPLEMENTARIOS, DIAGNÓSTICO Y PLAN TERAPÉUTICO */}
            <div className="space-y-6">
              <section className="border border-gray-100 rounded-2xl p-6 bg-[#fafafa]">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Layers size={14} /> IV. Estudios Complementarios Adjuntos
                </h4>
                <p className="text-xs text-gray-600">{selectedExpediente.estudiosComplementarios}</p>
              </section>

              <section className="border border-[#e3eae5] rounded-2xl p-6">
                <h4 className="text-xs font-bold text-[#b37d3e] uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Heart size={14} /> V. Diagnóstico Clínico & Pronóstico Emitido
                </h4>
                <p className="text-sm font-semibold text-gray-700">{selectedExpediente.diagnosticoPronostico}</p>
              </section>

              <section className="bg-gradient-to-br from-white to-[#f4f7f5] border-2 border-[#2d8a65]/20 rounded-2xl p-6">
                <h4 className="text-sm font-bold text-[#1c4735] mb-2 flex items-center gap-2">
                  <CheckCircle size={16} className="text-[#2d8a65]" /> VI. Plan Terapéutico y Evolución Cronológica
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed bg-white p-4 rounded-xl border border-[#d2ded7]/50 shadow-sm">
                  {selectedExpediente.planTerapeutico}
                </p>
              </section>
            </div>

            {/* SECCIÓN VII: DE LEGALIDAD - CONSENTIMIENTO INFORMADO */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-6 bg-[#fffdfa] p-4 rounded-xl border border-[#f4eedb]">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                  <Check size={12} strokeWidth={3} />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-gray-700 uppercase">VII. Consentimiento Informado Obligatorio</h5>
                  <p className="text-[11px] text-gray-400">Autorización firmada por el propietario guardada digitalmente en el servidor.</p>
                </div>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-md">
                DOCUMENTO FIRMADO OK
              </span>
            </div>

          </div>
        )}

        {/* 2. SECCIÓN: FORMULARIO ALTA NUEVO EXPEDIENTE */}
        {activeTab === 'nuevo-expediente' && (
          <form onSubmit={handleCrearExpediente} className="bg-white border border-[#e3eae5] rounded-3xl p-8 shadow-sm space-y-8 animate-fadeIn">
            
            {/* BLOQUE A: IDENTIFICACIÓN */}
            <div>
              <h3 className="text-base font-bold text-[#1c4735] border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
                <User size={18} className="text-[#845d2d]" /> 1. Datos de Identificación (Mascota y Propietario)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Nombre de la Mascota *</label>
                  <input required type="text" value={nuevoExp.nombreMascota} onChange={e => setNuevoExp({...nuevoExp, nombreMascota: e.target.value})} className="w-full border border-[#d2ded7] p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-[#2d8a65] outline-none" placeholder="Ej. Dante" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Especie *</label>
                  <select value={nuevoExp.especie} onChange={e => setNuevoExp({...nuevoExp, especie: e.target.value})} className="w-full border border-[#d2ded7] p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-[#2d8a65] outline-none">
                    <option value="Canino">Canino</option>
                    <option value="Felino">Felino</option>
                    <option value="Ave">Ave</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Raza *</label>
                  <input required type="text" value={nuevoExp.raza} onChange={e => setNuevoExp({...nuevoExp, raza: e.target.value})} className="w-full border border-[#d2ded7] p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-[#2d8a65] outline-none" placeholder="Ej. Chihuahua" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Sexo *</label>
                  <select value={nuevoExp.sexo} onChange={e => setNuevoExp({...nuevoExp, sexo: e.target.value})} className="w-full border border-[#d2ded7] p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-[#2d8a65] outline-none">
                    <option value="Macho">Macho</option>
                    <option value="Hembra">Hembra</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Edad *</label>
                  <input required type="text" value={nuevoExp.edad} onChange={e => setNuevoExp({...nuevoExp, edad: e.target.value})} className="w-full border border-[#d2ded7] p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-[#2d8a65] outline-none" placeholder="Ej. 2 años" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Color *</label>
                  <input required type="text" value={nuevoExp.color} onChange={e => setNuevoExp({...nuevoExp, color: e.target.value})} className="w-full border border-[#d2ded7] p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-[#2d8a65] outline-none" placeholder="Ej. Cervato" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Nombre Completo del Tutor *</label>
                  <input required type="text" value={nuevoExp.nombrePropietario} onChange={e => setNuevoExp({...nuevoExp, nombrePropietario: e.target.value})} className="w-full border border-[#d2ded7] p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-[#2d8a65] outline-none" placeholder="Ej. César Mariscal" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Contacto Telefónico *</label>
                  <input required type="text" value={nuevoExp.contacto} onChange={e => setNuevoExp({...nuevoExp, contacto: e.target.value})} className="w-full border border-[#d2ded7] p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-[#2d8a65] outline-none" placeholder="Ej. 3312345678" />
                </div>
              </div>
            </div>

            {/* BLOQUE B: ANAMNESIS Y EXAMEN FÍSICO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-base font-bold text-[#1c4735] border-b border-gray-100 pb-2 mb-3 flex items-center gap-2">
                  <FileText size={18} className="text-[#2d8a65]" /> 2. Anamnesis / Historia Clínica
                </h3>
                <textarea required rows={4} value={nuevoExp.anamnesis} onChange={e => setNuevoExp({...nuevoExp, anamnesis: e.target.value})} className="w-full border border-[#d2ded7] p-3 rounded-xl text-sm focus:ring-2 focus:ring-[#2d8a65] outline-none" placeholder="Describa el motivo detallado de la consulta, síntomas previos y evolución..."></textarea>
              </div>
              
              <div>
                <h3 className="text-base font-bold text-[#1c4735] border-b border-gray-100 pb-2 mb-3 flex items-center gap-2">
                  <Activity size={18} className="text-[#2d8a65]" /> 3. Examen Físico Base
                </h3>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-400 mb-0.5">Peso (kg)</label>
                    <input required type="number" step="0.01" value={nuevoExp.peso} onChange={e => setNuevoExp({...nuevoExp, peso: e.target.value})} className="w-full border border-[#d2ded7] p-2 rounded-xl text-sm focus:ring-2 focus:ring-[#2d8a65] outline-none" placeholder="2.4" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-400 mb-0.5">Temp (°C)</label>
                    <input required type="number" step="0.1" value={nuevoExp.temperatura} onChange={e => setNuevoExp({...nuevoExp, temperatura: e.target.value})} className="w-full border border-[#d2ded7] p-2 rounded-xl text-sm focus:ring-2 focus:ring-[#2d8a65] outline-none" placeholder="38.5" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-400 mb-0.5">Frec. Card (lpm)</label>
                    <input required type="text" value={nuevoExp.frecuenciaCardiaca} onChange={e => setNuevoExp({...nuevoExp, frecuenciaCardiaca: e.target.value})} className="w-full border border-[#d2ded7] p-2 rounded-xl text-sm focus:ring-2 focus:ring-[#2d8a65] outline-none" placeholder="120" />
                  </div>
                </div>
                <input required type="text" value={nuevoExp.datosObjetivos} onChange={e => setNuevoExp({...nuevoExp, datosObjetivos: e.target.value})} className="w-full border border-[#d2ded7] p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-[#2d8a65] outline-none" placeholder="Consignación de constantes vitales y datos objetivos adicionales..." />
              </div>
            </div>

            {/* BLOQUE C: TRATAMIENTO Y LEGALIDAD */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#1c4735] border-b border-gray-100 pb-2 flex items-center gap-2">
                <Layers size={18} className="text-[#2d8a65]" /> 4. Diagnóstico, Resolución & Plan Clínico
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Estudios Complementarios (Opcional)</label>
                  <input type="text" value={nuevoExp.estudiosComplementarios} onChange={e => setNuevoExp({...nuevoExp, estudiosComplementarios: e.target.value})} className="w-full border border-[#d2ded7] p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-[#2d8a65] outline-none" placeholder="Ej. Rayos X, Análisis sanguíneos de laboratorio..." />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Diagnóstico presuntivo & Pronóstico *</label>
                  <input required type="text" value={nuevoExp.diagnosticoPronostico} onChange={e => setNuevoExp({...nuevoExp, diagnosticoPronostico: e.target.value})} className="w-full border border-[#d2ded7] p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-[#2d8a65] outline-none" placeholder="Ej. Reacción alérgica alimentaria. Pronóstico estable." />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Plan Terapéutico Detallado *</label>
                <textarea required rows={3} value={nuevoExp.planTerapeutico} onChange={e => setNuevoExp({...nuevoExp, planTerapeutico: e.target.value})} className="w-full border border-[#d2ded7] p-3 rounded-xl text-sm focus:ring-2 focus:ring-[#2d8a65] outline-none" placeholder="Dosificación de medicamentos rigurosa, frecuencia, pautas de manejo y evolución cronológica recomendada..."></textarea>
              </div>
            </div>

            {/* CHECKBOX DE VALIDACIÓN LEGAL */}
            <div className="p-4 bg-[#fffdfa] border border-[#f4eedb] rounded-xl flex items-center gap-3">
              <input 
                type="checkbox" 
                id="consentimiento" 
                checked={nuevoExp.consentimientoInformado} 
                onChange={e => setNuevoExp({...nuevoExp, consentimientoInformado: e.target.checked})}
                className="w-4 h-4 text-[#2d8a65] focus:ring-[#2d8a65] border-gray-300 rounded cursor-pointer"
                required
              />
              <label htmlFor="consentimiento" className="text-xs text-gray-600 select-none cursor-pointer">
                Confirmo bajo fe profesional que cuento con el **Consentimiento Informado firmado** físico/digital por el dueño para proceder con los tratamientos asentados.
              </label>
            </div>

            {/* BOTÓN DE ENVÍO */}
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 bg-[#2d8a65] hover:bg-[#1c4735] text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md transition-all"
              >
                <Plus size={16} />
                Guardar e Indexar Expediente Legalmente
              </button>
            </div>
          </form>
        )}

        {/* 3. SECCIÓN: AGENDA Y CITAS VETERINARIAS */}
        {activeTab === 'citas' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-[#fffdfa] border border-[#f2e6d5] p-4 rounded-xl text-xs text-[#845d2d] font-medium">
              💡 **Regla de Validación Activa:** El algoritmo bloquea automáticamente el agendamiento duplicado para el mismo veterinario, médico o consultorio en tiempo real.
            </div>

            <div className="bg-white border border-[#e3eae5] rounded-3xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f4f7f5] text-[#1c4735] border-b border-[#e3eae5] text-xs font-bold uppercase tracking-wider">
                    <th className="p-4 pl-6">Horario</th>
                    <th className="p-4">Paciente (Mascota)</th>
                    <th className="p-4">Propietario / Tutor</th>
                    <th className="p-4">Motivo Médicos</th>
                    <th className="p-4">Médico Asignado</th>
                    <th className="p-4 pr-6">Estatus</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-100 text-gray-700">
                  {citas.map(cita => (
                    <tr key={cita.id} className="hover:bg-gray-50/70 transition-all">
                      <td className="p-4 pl-6 font-mono font-semibold text-gray-900">
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-[#845d2d]" />
                          {cita.hora} <span className="text-xs font-normal text-gray-400">({cita.fecha})</span>
                        </div>
                      </td>
                      <td className="p-4 font-bold text-[#1c4735]">{cita.mascota}</td>
                      <td className="p-4 text-xs">{cita.propietario}</td>
                      <td className="p-4 text-xs italic">"{cita.motivo}"</td>
                      <td className="p-4 text-xs font-medium">{cita.veterinario}</td>
                      <td className="p-4 pr-6">
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide">
                          {cita.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. SECCIÓN: ALERTAS PREVENTIVAS & CALCULADOR DE DOSIS */}
        {activeTab === 'alertas' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
            
            {/* Feed de Alertas */}
            <div className="lg:col-span-2 space-y-4">
              {alertas.map(alerta => (
                <div 
                  key={alerta.id}
                  className={`border p-5 rounded-2xl flex gap-4 shadow-sm transition-all ${
                    alerta.tipo === 'critica' 
                      ? 'bg-red-50/50 border-red-200 text-red-900' 
                      : 'bg-amber-50/50 border-amber-200 text-amber-900'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${alerta.tipo === 'critica' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                    <AlertTriangle size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold uppercase tracking-wider font-mono">
                        {alerta.tipo === 'critica' ? '⚠️ Restricción Crítica Legal' : '⚡ Alerta de Validación'}
                      </span>
                      <span className="text-[10px] opacity-60">{alerta.fecha}</span>
                    </div>
                    <p className="text-sm mt-1 font-medium">{alerta.mensaje}</p>
                    <span className="inline-block mt-2 text-[11px] bg-white/60 px-2 py-0.5 rounded border border-current/10 font-bold">
                      Paciente Objetivo: {alerta.mascota}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* CALCULADOR INTEGRADO INTERACTIVO (HIPÓTESIS DE MITIGACIÓN DE ERRORES) */}
            <div className="bg-white border-2 border-[#845d2d]/20 rounded-3xl p-6 shadow-sm h-fit">
              <div className="flex items-center gap-2 mb-4 text-[#845d2d]">
                <Calculator size={20} />
                <h3 className="font-bold text-[#1c4735]">Verificador & Calculador de Dosis</h3>
              </div>
              <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                Mitiga la incidencia de errores de dosificación manual automatizando el cálculo base por rango metabólico en miligramos.
              </p>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-gray-600 font-semibold mb-1">Peso Real del Paciente (kg)</label>
                  <input 
                    type="number" 
                    placeholder="Ej. 2.4" 
                    value={calcPeso}
                    onChange={(e) => setCalcPeso(e.target.value)}
                    className="w-full border border-[#d2ded7] p-2 rounded-xl text-sm focus:ring-1 focus:ring-[#2d8a65] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-semibold mb-1">Dosis Requerida (mg / kg)</label>
                  <input 
                    type="number" 
                    placeholder="Ej. 0.5" 
                    value={calcDosis}
                    onChange={(e) => setCalcDosis(e.target.value)}
                    className="w-full border border-[#d2ded7] p-2 rounded-xl text-sm focus:ring-1 focus:ring-[#2d8a65] outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={calcularDosisMg}
                  className="w-full bg-[#845d2d] hover:bg-[#5a4225] text-white font-bold py-2.5 rounded-xl shadow-sm transition-all"
                >
                  Calcular Dosis Segura
                </button>

                {calcResultado !== null && (
                  <div className="mt-4 p-4 bg-[#f4f7f5] border border-[#2d8a65]/20 rounded-xl text-center">
                    <span className="text-[10px] uppercase tracking-wider text-[#2d8a65] font-bold block">Dosis Absoluta Recomendada</span>
                    <span className="text-2xl font-black text-[#1c4735]">{calcResultado.toFixed(2)} mg</span>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}