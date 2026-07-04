export interface BibliaDisponible {
  id: string
  titulo: string
  idioma: string
}

export const BIBLIAS_DISPONIBLES: BibliaDisponible[] = [
  { id: 'RVR60', titulo: 'Reina Valera Revisada (1960)', idioma: 'Español' },
  { id: 'RVA', titulo: 'Reina-Valera Actualizada', idioma: 'Español' },
  { id: 'ASV', titulo: 'American Standard Version', idioma: 'Inglés' },
  { id: 'ARVANDYKE', titulo: 'Arabic Bible (Smith & Van Dyke)', idioma: 'Árabe' },
  { id: 'KJV', titulo: 'Authorized Version', idioma: 'Inglés' },
  { id: 'LSG', titulo: 'La Bible Louis Segond 1910', idioma: 'Francés' },
  { id: 'BYZ', titulo: 'Byzantine/Majority Textform Greek New Testament', idioma: 'Griego' },
  { id: 'DARBY', titulo: '1890 Darby Bible', idioma: 'Inglés' },
  { id: 'Elzevir', titulo: 'Elzevir Textus Receptus (1624) con morfología', idioma: 'Griego' },
  { id: 'ITDIODATI1649', titulo: 'Giovanni Diodati Bibbia', idioma: 'Italiano' },
  { id: 'EMPHBBL', titulo: 'The Emphasized Bible', idioma: 'Inglés' },
  { id: 'KJV1900', titulo: 'King James Version', idioma: 'Inglés' },
  { id: 'KJVAPOC', titulo: 'The King James Version Apocrypha', idioma: 'Inglés' },
  { id: 'LEB', titulo: 'The Lexham English Bible', idioma: 'Inglés' },
  { id: 'SCRMORPH', titulo: 'The New Testament in Greek (Scrivener 1881)', idioma: 'Griego' },
  { id: 'FI-RAAMATTU', titulo: 'Raamattu (1933, 1938)', idioma: 'Finlandés' },
  { id: 'bb-sbb-rusbt', titulo: 'Russian Synodal Bible Translation', idioma: 'Ruso' },
  { id: 'eo-zamenbib', titulo: 'La Sankta Biblio', idioma: 'Esperanto' },
  { id: 'TR1881', titulo: "Scrivener's Textus Receptus (1881)", idioma: 'Griego' },
  { id: 'TR1894MR', titulo: "Scrivener's Textus Receptus (1894) con morfología", idioma: 'Griego' },
  { id: 'SVV', titulo: 'Statenvertaling', idioma: 'Neerlandés' },
  { id: 'STEPHENS', titulo: "Stephen's Textus Receptus (1550)", idioma: 'Griego' },
  { id: 'TANAKH', titulo: 'Tanakh, The Holy Scriptures', idioma: 'Hebreo' },
  { id: 'wbtc-ptbrnt', titulo: 'Versão Fácil De Ler', idioma: 'Portugués' },
  { id: 'WH1881MR', titulo: 'Westcott and Hort Greek New Testament (1881) con morfología', idioma: 'Griego' },
  { id: 'YLT', titulo: "Young's Literal Translation", idioma: 'Inglés' },
]

/** Versión por defecto: en español, mientras TALENTA solo soporta interfaz en español. */
export const BIBLIA_POR_DEFECTO = 'RVR60'
