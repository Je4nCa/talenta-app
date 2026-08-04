import { jsPDF } from 'jspdf'
import { fechaHoyLocal } from '@/shared/lib/fecha'
import autoTable from 'jspdf-autotable'
import { CATEGORIAS_BIEN_ORDENADAS } from '../constants/bienes'
import { CATEGORIAS_DEUDA_ORDENADAS } from '../constants/deudas'
import { CATEGORIAS_RIE_ORDENADAS, DIAS_RIE } from '../constants/rie'
import { formatearMonto } from './formato'
import type { Deuda } from '../types/deuda'
import type { CeldaRIE } from '../types/rie'

const NEGRO: [number, number, number] = [31, 27, 23]
const TAN: [number, number, number] = [219, 198, 178]



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
  doc.text(`Fecha de elaboración: ${fechaHoyLocal()}`, 14, 48)

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

export function descargarPdfRIE({
  nombreUsuario,
  emailUsuario,
  moneda,
  celdas,
}: DatosPersona & { celdas: CeldaRIE[] }): void {
  // Cuadrícula de 31 días x 15 categorías — en vertical no cabe con letra
  // legible, por eso este PDF sale en horizontal (a diferencia de LD y LB).
  const doc = new jsPDF({ orientation: 'landscape' })
  const cursorY = encabezado(doc, 'Registro de Ingresos y Egresos (RIE)', nombreUsuario, emailUsuario)

  const montoPorCelda = new Map(celdas.map((c) => [`${c.dia}-${c.categoria}`, c.monto]))
  const obtener = (dia: number, categoria: string) => montoPorCelda.get(`${dia}-${categoria}`) ?? 0

  function filaTotales(etiqueta: string, desde: number, hasta: number) {
    return [
      etiqueta,
      ...CATEGORIAS_RIE_ORDENADAS.map(({ categoria }) => {
        let suma = 0
        for (let dia = desde; dia <= hasta; dia++) suma += obtener(dia, categoria)
        return formatearMontoPdf(suma, moneda)
      }),
    ]
  }

  const filas: (string | number)[][] = []
  for (let dia = 1; dia <= DIAS_RIE; dia++) {
    filas.push([
      dia,
      ...CATEGORIAS_RIE_ORDENADAS.map(({ categoria }) => formatearMontoPdf(obtener(dia, categoria), moneda)),
    ])
    if (dia === 15) filas.push(filaTotales('Sub Total', 1, 15))
  }
  filas.push(filaTotales('Sub Total', 16, DIAS_RIE))

  autoTable(doc, {
    startY: cursorY,
    head: [['Día', ...CATEGORIAS_RIE_ORDENADAS.map((c) => c.etiqueta)]],
    body: filas,
    foot: [filaTotales('Total del mes', 1, DIAS_RIE)],
    theme: 'grid',
    headStyles: { fillColor: NEGRO, textColor: 255, fontSize: 7 },
    footStyles: { fillColor: TAN, textColor: NEGRO, fontStyle: 'bold', fontSize: 7 },
    styles: { fontSize: 6.5, cellPadding: 1.2 },
    margin: { left: 8, right: 8 },
  })

  doc.save('registro-de-ingresos-y-egresos.pdf')
}
