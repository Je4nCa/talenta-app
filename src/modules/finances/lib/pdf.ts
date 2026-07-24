import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { CATEGORIAS_BIEN_ORDENADAS } from '../constants/bienes'
import { CATEGORIAS_DEUDA_ORDENADAS } from '../constants/deudas'
import { formatearMonto } from './formato'
import type { Deuda } from '../types/deuda'

const NEGRO: [number, number, number] = [31, 27, 23]
const TAN: [number, number, number] = [219, 198, 178]

function fechaHoy(): string {
  return new Date().toISOString().slice(0, 10)
}

/**
 * Las fuentes estándar de jsPDF (helvetica) solo soportan WinAnsiEncoding
 * (cp1252), que no incluye el símbolo del colón costarricense ₡ (U+20A1) —
 * sale en blanco/corrupto en el PDF aunque se vea bien en la UI del navegador
 * (que sí soporta Unicode completo). Se reemplaza por ¢ (cent sign, U+00A2,
 * sí incluido en WinAnsi), la aproximación histórica que se usaba para el
 * colón antes de que existiera el símbolo Unicode dedicado.
 */
function formatearMontoPdf(monto: number, moneda: string): string {
  return formatearMonto(monto, moneda).replace('₡', '¢')
}

function encabezado(doc: jsPDF, titulo: string, nombreUsuario: string, emailUsuario: string): number {
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.setTextColor(...NEGRO)
  doc.text('TALENTA', 14, 18)

  doc.setFontSize(12)
  doc.text(titulo, 14, 26)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text(`Nombre: ${nombreUsuario}`, 14, 36)
  doc.text(`Correo: ${emailUsuario}`, 14, 42)
  doc.text(`Fecha de elaboración: ${fechaHoy()}`, 14, 48)

  return 56
}

interface DatosPersona {
  nombreUsuario: string
  emailUsuario: string
  moneda: string
}

export function descargarPdfDeudas({
  nombreUsuario,
  emailUsuario,
  moneda,
  deudas,
}: DatosPersona & { deudas: Deuda[] }): void {
  const doc = new jsPDF()
  let cursorY = encabezado(doc, 'Listado de Deudas (LD)', nombreUsuario, emailUsuario)
  let totalGeneral = 0

  for (const { tipo, etiqueta } of CATEGORIAS_DEUDA_ORDENADAS) {
    const deudasCategoria = deudas.filter((d) => d.tipo === tipo)
    if (deudasCategoria.length === 0) continue

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(...NEGRO)
    doc.text(etiqueta, 14, cursorY)
    cursorY += 4

    let subtotal = 0
    const filas = deudasCategoria.map((d) => {
      subtotal += d.saldoActual
      return [
        d.nombre,
        formatearMontoPdf(d.saldoActual, moneda),
        d.cuotaMensual !== undefined ? formatearMontoPdf(d.cuotaMensual, moneda) : '—',
        d.tasaInteres !== undefined ? `${d.tasaInteres}%` : '—',
        d.fechaLiquidacion ?? '—',
      ]
    })
    totalGeneral += subtotal

    autoTable(doc, {
      startY: cursorY,
      head: [['Acreedor', 'Saldo', 'Pago mensual', 'Tasa interés', 'Fecha liquidación']],
      body: filas,
      foot: [['Total', formatearMontoPdf(subtotal, moneda), '', '', '']],
      theme: 'grid',
      headStyles: { fillColor: NEGRO, textColor: 255, fontSize: 9 },
      footStyles: { fillColor: TAN, textColor: NEGRO, fontStyle: 'bold', fontSize: 9 },
      styles: { fontSize: 9, cellPadding: 2 },
      margin: { left: 14, right: 14 },
    })

    cursorY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10
  }

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(...NEGRO)
  doc.text(`Total de Deudas: ${formatearMontoPdf(totalGeneral, moneda)}`, 14, cursorY)

  doc.save('listado-de-deudas.pdf')
}

export function descargarPdfBienes({
  nombreUsuario,
  emailUsuario,
  moneda,
  valorPorCategoria,
}: DatosPersona & { valorPorCategoria: Record<string, number> }): void {
  const doc = new jsPDF()
  const cursorY = encabezado(doc, 'Listado de Bienes (LB)', nombreUsuario, emailUsuario)

  const filas = CATEGORIAS_BIEN_ORDENADAS.map(({ categoria, etiqueta }) => [
    etiqueta,
    formatearMontoPdf(valorPorCategoria[categoria] ?? 0, moneda),
  ])
  const total = CATEGORIAS_BIEN_ORDENADAS.reduce(
    (acc, { categoria }) => acc + (valorPorCategoria[categoria] ?? 0),
    0,
  )

  autoTable(doc, {
    startY: cursorY,
    head: [['Descripción de Bienes', 'Valor Actual (Venta)']],
    body: filas,
    foot: [['Total de Bienes', formatearMontoPdf(total, moneda)]],
    theme: 'grid',
    headStyles: { fillColor: NEGRO, textColor: 255, fontSize: 9 },
    footStyles: { fillColor: TAN, textColor: NEGRO, fontStyle: 'bold', fontSize: 10 },
    styles: { fontSize: 9, cellPadding: 3 },
    margin: { left: 14, right: 14 },
  })

  doc.save('listado-de-bienes.pdf')
}
