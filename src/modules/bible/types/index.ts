export interface Versiculo {
  numero: number
  texto: string
}

export interface ResultadoBusqueda {
  referencia: string
  vistaPrevia: string
}

export interface VersiculoGuardado {
  id: string
  uid: string
  bibliaId: string
  libro: string
  capitulo: number
  versiculo: number
  texto: string
  creadoEn: string
}

export interface VersiculoSubrayado {
  id: string
  uid: string
  bibliaId: string
  libro: string
  capitulo: number
  versiculo: number
  creadoEn: string
}
