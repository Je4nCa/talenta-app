import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { VERSION_TERMINOS } from '../constants/legal'

interface Seccion {
  titulo: string
  parrafos: string[]
}

const SECCIONES: Seccion[] = [
  {
    titulo: 'I. Identificación de las partes',
    parrafos: [
      'Art. 1. El presente instrumento es suscrito, por una parte, por el Ministerio de Mayordomía Financiera, representado por Carlos Arias y Alicia Arias (en adelante, el "Ministerio"), en su calidad de operadores de la plataforma digital denominada TALENTA; por otra parte, por Montevo Studio, representado por Jean Carlo Villamonte Murillo (en adelante, el "Operador Técnico"), en calidad de desarrollador y administrador técnico de la plataforma; y, por una tercera parte, por el Usuario, persona física que, mediante aceptación electrónica, adhiere al presente instrumento como condición previa e indispensable para acceder a la Aplicación.',
      'Art. 2. El Ministerio actúa como responsable del tratamiento de los datos personales de conformidad con la Ley N.° 8968 de la República de Costa Rica. El Operador Técnico actúa como encargado del tratamiento, bajo instrucciones documentadas del Ministerio y sin facultad para tratar los datos con fines propios.',
    ],
  },
  {
    titulo: 'II. Definiciones',
    parrafos: [
      'Aplicación: la plataforma digital TALENTA, disponible en versiones Android, iOS y web, que constituye el objeto del presente instrumento.',
      'Usuario: persona física cuyo correo electrónico ha sido previamente autorizado por el Ministerio para acceder a la Aplicación como participante del curso de mayordomía financiera.',
      'Datos personales: toda información que identifique o haga identificable, directa o indirectamente, a una persona física, conforme al artículo 3 de la Ley N.° 8968.',
      'Datos financieros: presupuestos, registros de ingresos, egresos, categorías de gastos y cualquier otro dato económico ingresado voluntariamente por el Usuario en la Aplicación. Tienen carácter estrictamente personal.',
      'Contenido del curso: material educativo de propiedad exclusiva del Ministerio, incluyendo lecciones, manuales, metodología y recursos audiovisuales.',
      'Cifrado: proceso técnico mediante el cual los datos se transforman en un formato ilegible para terceros no autorizados, utilizando algoritmos criptográficos de estándar industrial.',
      'Período de prueba: los treinta (30) días calendario de acceso gratuito que inician desde la fecha de graduación del Usuario en el curso.',
    ],
  },
  {
    titulo: 'III. Términos y condiciones de uso',
    parrafos: [
      '3.1 Acceso y registro',
      'Art. 3. El acceso a la Aplicación es de carácter restringido y exclusivo. Únicamente podrán crear una cuenta aquellas personas cuya dirección de correo electrónico haya sido inscrita y autorizada por el Ministerio para participar en el curso. El sistema rechazará automáticamente cualquier intento de registro con un correo no autorizado. El Ministerio se reserva el derecho de revocar una autorización en cualquier momento y sin expresión de causa.',
      'Art. 4. Cada cuenta de usuario es personal, intransferible e indelegable. El Usuario es el único responsable de mantener la confidencialidad de sus credenciales de acceso. Cualquier uso no autorizado de la cuenta deberá notificarse al Ministerio de forma inmediata. El Usuario asumirá responsabilidad plena por las acciones realizadas desde su cuenta, salvo que demuestre acceso no autorizado por terceros.',
      'Art. 5. Al registrarse, el Usuario declara tener al menos dieciocho (18) años de edad. La Aplicación no está dirigida a menores de edad. Si el Ministerio determina que un Usuario es menor de edad, procederá a la cancelación inmediata de la cuenta y la eliminación de los datos asociados, sin previo aviso.',
      '3.2 Modelo de acceso y suscripción',
      'Art. 6. El uso de la Aplicación durante las ocho (8) semanas de duración del curso es gratuito para todos los Usuarios inscritos y autorizados. Al completar satisfactoriamente el curso, el Usuario accede a un período de prueba gratuito de treinta (30) días calendario, contados desde la fecha de graduación registrada en el sistema.',
      'Art. 7. Vencido el período de prueba, el acceso continuado a la Aplicación requiere la contratación de una suscripción de pago activa. El Ministerio ofrece las siguientes modalidades: Mensual, USD 2.99/mes; Trimestral, USD 7.99/trimestre (equivalente USD 2.66/mes, 11% de ahorro); Anual, USD 27.99/año (equivalente USD 2.33/mes, 22% de ahorro).',
      'Art. 8. Los pagos son procesados por TiloPay, procesador de pagos costarricense, mediante tarjeta de débito/crédito o SINPE Móvil. Las comisiones de procesamiento aplicables son de 4.25% + USD 0.35 por transacción con tarjeta, y 2% + USD 0.35 por transacción SINPE Móvil; estas comisiones son asumidas por el Ministerio y no se trasladan al Usuario. El Ministerio se reserva el derecho de modificar los precios con un aviso mínimo de treinta (30) días. Los precios vigentes son los publicados en la Aplicación al momento de la contratación.',
      'Art. 9. Las suscripciones se renuevan automáticamente al vencimiento del período contratado, con cargo a la misma forma de pago registrada, salvo que el Usuario cancele la suscripción con al menos cuarenta y ocho (48) horas de anticipación a la fecha de renovación. No procederá reembolso por el período ya iniciado.',
      'Art. 10. La falta de pago oportuno dará lugar a la suspensión del acceso a las funcionalidades de la Aplicación hasta que se regularice la situación, sin perjuicio de la conservación de los datos del Usuario conforme a lo establecido en el Capítulo X del presente instrumento.',
      '3.3 Uso permitido y prohibido',
      'Art. 11. El Usuario se compromete a utilizar la Aplicación exclusivamente para los fines para los que fue diseñada: gestión personal de finanzas, seguimiento del curso de mayordomía financiera y uso del módulo bíblico. Queda expresamente prohibido: (a) compartir las credenciales de acceso con terceros; (b) intentar vulnerar, eludir o comprometer los mecanismos de seguridad de la Aplicación; (c) utilizar la Aplicación con fines comerciales propios o de terceros no autorizados; (d) reproducir, distribuir o divulgar el contenido del curso por cualquier medio; (e) realizar ingeniería inversa sobre el software de la Aplicación; (f) introducir código malicioso, virus o cualquier elemento que pueda dañar la plataforma o a otros usuarios.',
    ],
  },
  {
    titulo: 'IV. Política de privacidad y tratamiento de datos personales',
    parrafos: [
      '4.1 Datos recopilados',
      'Art. 12. La Aplicación recopila las siguientes categorías de datos, con la finalidad indicada en cada caso: (a) Datos de identificación: nombre completo y correo electrónico, para la creación y gestión de la cuenta; (b) Datos de autenticación: contraseña almacenada mediante hash criptográfico irreversible —no accesible en texto plano por ninguna persona—; (c) Datos de preferencias: idioma, versión bíblica seleccionada y preferencias de notificación; (d) Datos de progreso educativo: lecciones completadas, fechas de completado, descarga del manual y resultados de los cuestionarios de diagnóstico y valoración final; (e) Datos financieros personales: presupuesto, ingresos, egresos y categorías de gastos, ingresados de forma voluntaria y exclusiva por el Usuario; (f) Datos de suscripción: modalidad contratada, fechas de inicio y renovación, estado de pago; (g) Token de notificaciones push: identificador técnico del dispositivo para el envío de notificaciones, sin asociación a datos de identidad adicionales.',
      'Art. 13. La Aplicación no recopila datos de ubicación geográfica, no accede a la cámara ni al micrófono del dispositivo, no accede a los contactos del teléfono, no realiza seguimiento del comportamiento del Usuario fuera de la Aplicación, y no utiliza los datos para perfilamiento comercial, publicidad segmentada ni venta de datos a terceros bajo ninguna circunstancia.',
      '4.2 Finalidad del tratamiento',
      'Art. 14. Los datos personales recopilados son tratados exclusivamente para: (a) verificar la autorización de acceso del Usuario y gestionar su cuenta; (b) personalizar la experiencia dentro de la Aplicación; (c) permitir que el Ministerio realice seguimiento académico y pastoral del progreso de los estudiantes durante el curso, con fines educativos y de acompañamiento; (d) procesar los pagos de suscripción a través de TiloPay; (e) enviar notificaciones push con el versículo diario y recordatorios de lecciones, cuando el Usuario no haya desactivado dicha función; (f) generar métricas estadísticas anónimas y agregadas para mejorar la Aplicación. Ningún dato se utilizará para una finalidad distinta a las aquí enumeradas sin consentimiento expreso del Usuario.',
    ],
  },
  {
    titulo: 'V. Protección y cifrado de la información financiera',
    parrafos: [
      'Art. 15. Los datos financieros del Usuario —presupuesto, ingresos, egresos y categorías de gastos— son de carácter estrictamente personal y reservado. Estos datos están almacenados en la base de datos de la Aplicación (Google Cloud Firestore) bajo las siguientes garantías técnicas: (i) los datos financieros son accesibles únicamente por el Usuario propietario de la cuenta, restricción implementada a nivel de reglas de seguridad de Firestore y no dependiente de políticas internas; (ii) la transmisión de datos financieros se realiza cifrada mediante protocolo TLS 1.2 o superior en todo momento; (iii) los datos en reposo se almacenan con cifrado AES-256 gestionado por Google Cloud, conforme a sus certificaciones ISO 27001 y SOC 2 Type II; (iv) los campos con datos financieros sensibles cuentan con cifrado adicional a nivel de aplicación antes de ser escritos en la base de datos.',
      'Art. 16. Los datos financieros no son compartidos, exportados, analizados ni cedidos a ninguna persona, entidad o sistema externo, salvo instrucción expresa y por escrito del propio Usuario. La herramienta financiera de la Aplicación tiene carácter exclusivamente educativo y de apoyo personal; no constituye asesoría financiera, contable ni legal de ningún tipo.',
    ],
  },
  {
    titulo: 'VI. Acuerdo de confidencialidad del contenido del curso',
    parrafos: [
      'Art. 17. El contenido del curso de sanidad financiera disponible en la Aplicación —incluyendo lecciones, manuales, metodología, materiales audiovisuales y cualquier otro recurso educativo— constituye propiedad intelectual exclusiva del Ministerio y está protegido por la Ley N.° 6683 de Derechos de Autor y Derechos Conexos de la República de Costa Rica.',
      'Art. 18. El Usuario asume las siguientes obligaciones de confidencialidad, con carácter indefinido y sin limitación geográfica: (a) no reproducir, publicar, distribuir, vender, ceder ni poner a disposición de terceros el contenido del curso por ningún medio, digital o físico, sin autorización escrita y expresa del Ministerio; (b) no utilizar el contenido del curso con fines comerciales propios ni ajenos; (c) no facilitar a terceros el acceso a su cuenta de usuario ni a las credenciales de acceso a la Aplicación; (d) utilizar el material exclusivamente para el proceso personal de sanidad financiera en el marco del curso al que fue debidamente inscrito.',
      'Art. 19. El incumplimiento de las obligaciones establecidas en el artículo anterior habilitará al Ministerio para: (a) cancelar inmediatamente la cuenta del Usuario sin derecho a reembolso; (b) iniciar las acciones civiles y penales que correspondan conforme a la legislación costarricense vigente, incluyendo el reclamo de daños y perjuicios.',
    ],
  },
  {
    titulo: 'VII. Transferencias internacionales de datos',
    parrafos: [
      'Art. 20. Para la operación de la Aplicación, los datos del Usuario son procesados por los siguientes proveedores tecnológicos ubicados fuera del territorio costarricense: Google LLC (Firebase) — infraestructura, auth, base de datos, notificaciones — recibe perfil, progreso del curso y datos financieros cifrados, bajo garantías ISO 27001, SOC 2 y GDPR. TiloPay S.A. — procesamiento de pagos — recibe nombre, correo, monto y fecha de transacción, bajo garantía PCI DSS como operador costarricense. bible-api.com — consulta de versículos bíblicos — no recibe ningún dato personal (peticiones anónimas por versión e idioma).',
      'Art. 21. El Ministerio garantiza que los proveedores indicados operan bajo estándares de protección de datos reconocidos internacionalmente y que los datos solo son tratados para las finalidades específicas descritas en el presente instrumento. No se realizarán transferencias a otros destinatarios sin consentimiento explícito del Usuario o requerimiento de autoridad competente.',
    ],
  },
  {
    titulo: 'VIII. Seguridad de la información',
    parrafos: [
      'Art. 22. El Operador Técnico implementa las siguientes medidas técnicas y organizativas para la protección de los datos: (a) cifrado en tránsito mediante TLS 1.2+ en todas las comunicaciones; (b) cifrado en reposo AES-256 en Google Cloud Firestore; (c) cifrado adicional a nivel de aplicación para datos financieros, conforme al artículo 15; (d) contraseñas almacenadas únicamente como hash criptográfico irreversible (bcrypt); (e) reglas de seguridad de Firestore que garantizan el aislamiento de datos por UID; (f) control de acceso basado en roles, con auditoría de actividad en el panel de administración; (g) copias de seguridad automáticas gestionadas por Google Firebase con retención de siete (7) días; (h) revisión periódica de dependencias de seguridad del código fuente.',
      'Art. 23. En caso de una brecha de seguridad que comprometa datos personales, el Ministerio notificará a los Usuarios afectados dentro de un plazo máximo de setenta y dos (72) horas desde el momento en que tenga conocimiento del incidente, conforme al principio de notificación proactiva establecido por la Agencia de Protección de Datos de los Habitantes (PRODHAB) de Costa Rica.',
    ],
  },
  {
    titulo: 'IX. Derechos ARCO del Usuario',
    parrafos: [
      'Art. 24. De conformidad con el Capítulo IV de la Ley N.° 8968 y su Reglamento, el Usuario tiene derecho a: Acceso —obtener confirmación de si sus datos son tratados y recibir copia de los mismos—; Rectificación —corregir datos inexactos o incompletos—; Cancelación —solicitar la eliminación de sus datos cuando ya no sean necesarios para los fines del tratamiento—; y Oposición —oponerse al tratamiento de sus datos para finalidades específicas, en particular el envío de notificaciones—. Adicionalmente, el Usuario tiene derecho a la portabilidad de sus datos financieros en formato CSV y a la limitación del tratamiento mientras se resuelve una reclamación.',
      'Art. 25. Para ejercer cualquiera de estos derechos, el Usuario debe enviar solicitud escrita al correo montevostudio@outlook.com, indicando el derecho que desea ejercer, describiendo el dato afectado y adjuntando copia de un documento de identidad vigente que acredite su identidad. El Ministerio resolverá la solicitud en un plazo máximo de diez (10) días hábiles contados desde su recepción. En caso de que la solicitud sea improcedente, se informará al Usuario con indicación de los motivos.',
      'Art. 26. Sin perjuicio de lo anterior, el Usuario podrá presentar una reclamación ante la Agencia de Protección de Datos de los Habitantes (PRODHAB), órgano adscrito al Ministerio de Justicia y Paz de Costa Rica, si considera que el tratamiento de sus datos no se ajusta a la legislación vigente.',
    ],
  },
  {
    titulo: 'X. Conservación y eliminación de datos',
    parrafos: [
      'Art. 27. Los datos de perfil y datos financieros del Usuario se conservan durante el tiempo en que la cuenta permanezca activa. Al solicitarse la eliminación de la cuenta, dichos datos serán suprimidos de forma definitiva e irreversible dentro de los treinta (30) días calendario siguientes a la solicitud, sin posibilidad de recuperación posterior. Los registros de transacciones de pago se conservarán durante un período de cinco (5) años contados desde la fecha de la transacción, conforme a las obligaciones fiscales y contables establecidas por el ordenamiento costarricense. Los datos de progreso del curso podrán conservarse de forma anónima con fines estadísticos del Ministerio.',
    ],
  },
  {
    titulo: 'XI. Limitación de responsabilidad',
    parrafos: [
      'Art. 28. La Aplicación se provee en su estado actual. El Ministerio y el Operador Técnico no garantizan disponibilidad ininterrumpida del servicio, dado que pueden producirse interrupciones por mantenimiento, actualizaciones o causas de fuerza mayor. El Ministerio no será responsable por pérdidas o daños derivados de: (a) uso incorrecto o inadecuado de la Aplicación por parte del Usuario; (b) interrupciones de servicio provocadas por terceros proveedores (Google Firebase, TiloPay); (c) decisiones financieras tomadas con base en la información registrada en la Aplicación, que tiene carácter exclusivamente educativo.',
    ],
  },
  {
    titulo: 'XII. Propiedad intelectual',
    parrafos: [
      'Art. 29. El código fuente de la Aplicación, su diseño, arquitectura, interfaces y funcionalidades son propiedad de Montevo Studio, salvo el contenido educativo del curso, que es propiedad exclusiva del Ministerio. La marca TALENTA, su logotipo y materiales de identidad visual son propiedad del Ministerio. Ninguna disposición del presente instrumento confiere al Usuario derechos de propiedad intelectual sobre ninguno de los elementos anteriores.',
    ],
  },
  {
    titulo: 'XIII. Suspensión y cancelación de cuenta',
    parrafos: [
      'Art. 30. El Ministerio podrá suspender o cancelar la cuenta de un Usuario de forma inmediata y sin previo aviso cuando: (a) se detecte incumplimiento de los Términos y Condiciones establecidos en el presente instrumento; (b) se verifique compartición no autorizada de credenciales; (c) se produzca falta de pago de la suscripción por más de siete (7) días calendario tras la fecha de vencimiento; (d) el Usuario solicite expresamente la cancelación de su cuenta; (e) el Ministerio determine discrecionalmente que el acceso no es adecuado para los fines del curso. La cancelación por incumplimiento no generará derecho a reembolso de ningún monto ya pagado.',
    ],
  },
  {
    titulo: 'XIV. Modificaciones al instrumento',
    parrafos: [
      'Art. 31. El Ministerio se reserva el derecho de actualizar el presente instrumento cuando sea necesario para reflejar cambios en la Aplicación, en las prácticas de tratamiento de datos o en la legislación aplicable. Las modificaciones que alteren derechos esenciales del Usuario serán notificadas con un mínimo de quince (15) días calendario de anticipación mediante aviso dentro de la Aplicación y/o correo electrónico. El uso continuado de la Aplicación tras el vencimiento del plazo de notificación implicará la aceptación de los términos modificados. Cada versión del instrumento queda identificada con número de versión y fecha de entrada en vigor; las versiones anteriores son sustituidas íntegramente por la versión vigente.',
    ],
  },
  {
    titulo: 'XV. Legislación aplicable y resolución de controversias',
    parrafos: [
      'Art. 32. El presente instrumento se rige íntegramente por la legislación de la República de Costa Rica, en particular por: la Ley N.° 8968 (Protección de la Persona frente al Tratamiento de sus Datos Personales) y su Reglamento; la Ley N.° 6683 (Derechos de Autor y Derechos Conexos); la Ley N.° 9048 (Delitos Informáticos y Conexos); la Ley N.° 7472 (Promoción de la Competencia y Defensa Efectiva del Consumidor) en lo que resulte aplicable; y la Ley N.° 5476 (Código de Familia) en materia de menores de edad.',
      'Art. 33. Cualquier controversia derivada del presente instrumento que no pueda resolverse de forma amistosa entre las partes dentro de un plazo de treinta (30) días desde la notificación del conflicto, será sometida a los tribunales ordinarios de justicia del primer circuito judicial de San José, con renuncia expresa a cualquier otro fuero que pudiera corresponder.',
    ],
  },
  {
    titulo: 'XVI. Aceptación y firma',
    parrafos: [
      'Art. 34. Al marcar la casilla de aceptación habilitada en la Aplicación durante el proceso de registro, el Usuario: (a) declara haber leído y comprendido íntegramente el presente instrumento; (b) manifiesta su acuerdo libre, informado e inequívoco con todos los términos y condiciones aquí establecidos; (c) acepta quedar vinculado jurídicamente por sus disposiciones. Este acto de aceptación electrónica tiene plena validez y eficacia jurídica conforme a la Ley N.° 8454 de Certificados, Firmas Digitales y Documentos Electrónicos de Costa Rica y queda registrado en el sistema con indicación de fecha, hora exacta (UTC) y versión del documento aceptado.',
      'Contacto del responsable del tratamiento: Ministerio de Mayordomía Financiera — Carlos y Alicia Arias.',
      'Contacto del operador técnico: Montevo Studio — Jean Carlo Villamonte Murillo.',
      'Correo: montevostudio@outlook.com · WhatsApp: +506 6333 1383.',
      'Horario de atención: lunes a viernes, 8:00 a.m. – 5:00 p.m., hora de Costa Rica (UTC-6).',
    ],
  },
]

export function ModalTerminos({ onCerrar }: { onCerrar: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-end justify-center bg-talenta-black/70 sm:items-center sm:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCerrar}
      >
        <motion.div
          className="flex h-[92dvh] w-full max-w-2xl flex-col rounded-t-3xl bg-talenta-white shadow-2xl sm:h-[85dvh] sm:rounded-3xl"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-talenta-tan/60 px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold text-talenta-black">
                Términos, Privacidad y Confidencialidad
              </h2>
              <p className="text-sm text-talenta-brown-mid">Versión {VERSION_TERMINOS} — TALENTA</p>
            </div>
            <button
              type="button"
              aria-label="Cerrar"
              onClick={onCerrar}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-talenta-brown-dark transition-colors hover:bg-talenta-tan/40"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            <div className="flex flex-col gap-6">
              {SECCIONES.map((seccion) => (
                <div key={seccion.titulo}>
                  <h3 className="mb-2 text-base font-semibold text-talenta-black">
                    {seccion.titulo}
                  </h3>
                  <div className="flex flex-col gap-2">
                    {seccion.parrafos.map((parrafo, i) => (
                      <p key={i} className="text-sm leading-relaxed text-talenta-brown-dark">
                        {parrafo}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-talenta-tan/60 px-6 py-4">
            <Button size="lg" className="w-full" onClick={onCerrar}>
              Entendido
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
