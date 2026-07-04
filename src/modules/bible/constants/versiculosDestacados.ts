export interface VersiculoDestacado {
  referencia: string
  tema: 'finanzas' | 'motivacion' | 'superacion personal'
}

/**
 * Curada a mano: versículos relacionados con finanzas, motivación y
 * superación personal, para el versículo del día en el Hub.
 */
export const VERSICULOS_DESTACADOS: VersiculoDestacado[] = [
  { referencia: 'Philippians 4:13', tema: 'motivacion' },
  { referencia: 'Joshua 1:9', tema: 'motivacion' },
  { referencia: 'Jeremiah 29:11', tema: 'motivacion' },
  { referencia: 'Isaiah 41:10', tema: 'motivacion' },
  { referencia: 'Proverbs 3:5-6', tema: 'motivacion' },
  { referencia: 'Romans 8:28', tema: 'motivacion' },
  { referencia: '2 Timothy 1:7', tema: 'motivacion' },
  { referencia: 'Psalms 46:1', tema: 'motivacion' },
  { referencia: 'Isaiah 40:31', tema: 'motivacion' },
  { referencia: 'Proverbs 3:9-10', tema: 'finanzas' },
  { referencia: 'Proverbs 21:5', tema: 'finanzas' },
  { referencia: 'Proverbs 22:7', tema: 'finanzas' },
  { referencia: 'Malachi 3:10', tema: 'finanzas' },
  { referencia: 'Luke 16:10', tema: 'finanzas' },
  { referencia: '2 Corinthians 9:6', tema: 'finanzas' },
  { referencia: 'Proverbs 13:11', tema: 'finanzas' },
  { referencia: '1 Timothy 6:10', tema: 'finanzas' },
  { referencia: 'Proverbs 16:3', tema: 'superacion personal' },
  { referencia: 'Galatians 6:9', tema: 'superacion personal' },
  { referencia: 'James 1:2-4', tema: 'superacion personal' },
  { referencia: 'Proverbs 27:17', tema: 'superacion personal' },
  { referencia: 'Ecclesiastes 3:1', tema: 'superacion personal' },
  { referencia: 'Colossians 3:23', tema: 'superacion personal' },
  { referencia: 'Proverbs 15:22', tema: 'superacion personal' },
]
