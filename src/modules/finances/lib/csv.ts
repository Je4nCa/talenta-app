/**
 * Genera y descarga un archivo .csv — Excel lo abre de forma nativa
 * (doble clic o "Abrir con Excel"), sin necesidad de ninguna librería de
 * generación de .xlsx. Se antepone BOM (﻿) para que Excel detecte
 * UTF-8 correctamente y no dañe las tildes/eñes.
 */
export function descargarCSV(nombreArchivo: string, filas: (string | number)[][]): void {
  const contenido = filas
    .map((fila) =>
      fila
        .map((celda) => {
          const texto = String(celda)
          return /[",\n]/.test(texto) ? `"${texto.replace(/"/g, '""')}"` : texto
        })
        .join(','),
    )
    .join('\r\n')

  const blob = new Blob(['﻿' + contenido], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const enlace = document.createElement('a')
  enlace.href = url
  enlace.download = nombreArchivo.endsWith('.csv') ? nombreArchivo : `${nombreArchivo}.csv`
  document.body.appendChild(enlace)
  enlace.click()
  document.body.removeChild(enlace)
  URL.revokeObjectURL(url)
}
