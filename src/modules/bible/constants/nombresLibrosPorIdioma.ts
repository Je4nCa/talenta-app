import { LIBROS_BIBLIA } from './libros'

/**
 * Nombres de los 66 libros en cada idioma de Biblia disponible, en el mismo
 * orden que LIBROS_BIBLIA (índice 0 = Génesis/orden 1, ... índice 65 =
 * Apocalipsis/orden 66). La clave es el mismo string `idioma` usado en
 * BIBLIAS_DISPONIBLES (constants/biblias.ts).
 *
 * Confianza alta (idiomas ampliamente estandarizados y verificados):
 * Español, Inglés, Francés, Italiano, Portugués, Neerlandés, Ruso, Árabe.
 *
 * Confianza media/baja (mejor esfuerzo, recomendable verificar con un
 * hablante nativo o fuente teológica antes de confiar en producción):
 * Griego, Hebreo, Finlandés, Esperanto — sobre todo los nombres del Nuevo
 * Testamento en hebreo (no hay convención única) y esperanto.
 */
export const NOMBRES_LIBROS_POR_IDIOMA: Record<string, string[]> = {
  Español: LIBROS_BIBLIA.map((l) => l.nombre),

  Inglés: LIBROS_BIBLIA.map((l) => l.referencia),

  Francés: [
    'Genèse', 'Exode', 'Lévitique', 'Nombres', 'Deutéronome', 'Josué', 'Juges', 'Ruth',
    '1 Samuel', '2 Samuel', '1 Rois', '2 Rois', '1 Chroniques', '2 Chroniques', 'Esdras',
    'Néhémie', 'Esther', 'Job', 'Psaumes', 'Proverbes', 'Ecclésiaste', 'Cantique des Cantiques',
    'Ésaïe', 'Jérémie', 'Lamentations', 'Ézéchiel', 'Daniel', 'Osée', 'Joël', 'Amos', 'Abdias',
    'Jonas', 'Michée', 'Nahum', 'Habacuc', 'Sophonie', 'Aggée', 'Zacharie', 'Malachie',
    'Matthieu', 'Marc', 'Luc', 'Jean', 'Actes', 'Romains', '1 Corinthiens', '2 Corinthiens',
    'Galates', 'Éphésiens', 'Philippiens', 'Colossiens', '1 Thessaloniciens',
    '2 Thessaloniciens', '1 Timothée', '2 Timothée', 'Tite', 'Philémon', 'Hébreux', 'Jacques',
    '1 Pierre', '2 Pierre', '1 Jean', '2 Jean', '3 Jean', 'Jude', 'Apocalypse',
  ],

  Italiano: [
    'Genesi', 'Esodo', 'Levitico', 'Numeri', 'Deuteronomio', 'Giosuè', 'Giudici', 'Rut',
    '1 Samuele', '2 Samuele', '1 Re', '2 Re', '1 Cronache', '2 Cronache', 'Esdra', 'Neemia',
    'Ester', 'Giobbe', 'Salmi', 'Proverbi', 'Ecclesiaste', 'Cantico dei Cantici', 'Isaia',
    'Geremia', 'Lamentazioni', 'Ezechiele', 'Daniele', 'Osea', 'Gioele', 'Amos', 'Abdia',
    'Giona', 'Michea', 'Naum', 'Abacuc', 'Sofonia', 'Aggeo', 'Zaccaria', 'Malachia', 'Matteo',
    'Marco', 'Luca', 'Giovanni', 'Atti', 'Romani', '1 Corinzi', '2 Corinzi', 'Galati',
    'Efesini', 'Filippesi', 'Colossesi', '1 Tessalonicesi', '2 Tessalonicesi', '1 Timoteo',
    '2 Timoteo', 'Tito', 'Filemone', 'Ebrei', 'Giacomo', '1 Pietro', '2 Pietro', '1 Giovanni',
    '2 Giovanni', '3 Giovanni', 'Giuda', 'Apocalisse',
  ],

  Portugués: [
    'Gênesis', 'Êxodo', 'Levítico', 'Números', 'Deuteronômio', 'Josué', 'Juízes', 'Rute',
    '1 Samuel', '2 Samuel', '1 Reis', '2 Reis', '1 Crônicas', '2 Crônicas', 'Esdras',
    'Neemias', 'Ester', 'Jó', 'Salmos', 'Provérbios', 'Eclesiastes', 'Cantares', 'Isaías',
    'Jeremias', 'Lamentações', 'Ezequiel', 'Daniel', 'Oséias', 'Joel', 'Amós', 'Obadias',
    'Jonas', 'Miquéias', 'Naum', 'Habacuque', 'Sofonias', 'Ageu', 'Zacarias', 'Malaquias',
    'Mateus', 'Marcos', 'Lucas', 'João', 'Atos', 'Romanos', '1 Coríntios', '2 Coríntios',
    'Gálatas', 'Efésios', 'Filipenses', 'Colossenses', '1 Tessalonicenses',
    '2 Tessalonicenses', '1 Timóteo', '2 Timóteo', 'Tito', 'Filemom', 'Hebreus', 'Tiago',
    '1 Pedro', '2 Pedro', '1 João', '2 João', '3 João', 'Judas', 'Apocalipse',
  ],

  Neerlandés: [
    'Genesis', 'Exodus', 'Leviticus', 'Numeri', 'Deuteronomium', 'Jozua', 'Richteren', 'Ruth',
    '1 Samuël', '2 Samuël', '1 Koningen', '2 Koningen', '1 Kronieken', '2 Kronieken', 'Ezra',
    'Nehemia', 'Esther', 'Job', 'Psalmen', 'Spreuken', 'Prediker', 'Hooglied', 'Jesaja',
    'Jeremia', 'Klaagliederen', 'Ezechiël', 'Daniël', 'Hosea', 'Joël', 'Amos', 'Obadja',
    'Jona', 'Micha', 'Nahum', 'Habakuk', 'Sefanja', 'Haggaï', 'Zacharia', 'Maleachi',
    'Mattheüs', 'Markus', 'Lukas', 'Johannes', 'Handelingen', 'Romeinen', '1 Korinthiërs',
    '2 Korinthiërs', 'Galaten', 'Efeziërs', 'Filippenzen', 'Kolossenzen',
    '1 Thessalonicenzen', '2 Thessalonicenzen', '1 Timotheüs', '2 Timotheüs', 'Titus',
    'Filemon', 'Hebreeën', 'Jakobus', '1 Petrus', '2 Petrus', '1 Johannes', '2 Johannes',
    '3 Johannes', 'Judas', 'Openbaring',
  ],

  Ruso: [
    'Бытие', 'Исход', 'Левит', 'Числа', 'Второзаконие', 'Иисус Навин', 'Судьи', 'Руфь',
    '1-я Царств', '2-я Царств', '3-я Царств', '4-я Царств', '1-я Паралипоменон',
    '2-я Паралипоменон', 'Ездра', 'Неемия', 'Есфирь', 'Иов', 'Псалтирь', 'Притчи',
    'Екклесиаст', 'Песнь Песней', 'Исаия', 'Иеремия', 'Плач Иеремии', 'Иезекииль', 'Даниил',
    'Осия', 'Иоиль', 'Амос', 'Авдий', 'Иона', 'Михей', 'Наум', 'Аввакум', 'Софония', 'Аггей',
    'Захария', 'Малахия', 'От Матфея', 'От Марка', 'От Луки', 'От Иоанна', 'Деяния',
    'К Римлянам', '1-е Коринфянам', '2-е Коринфянам', 'К Галатам', 'К Ефесянам',
    'К Филиппийцам', 'К Колоссянам', '1-е Фессалоникийцам', '2-е Фессалоникийцам',
    '1-е Тимофею', '2-е Тимофею', 'К Титу', 'К Филимону', 'К Евреям', 'Иакова', '1-е Петра',
    '2-е Петра', '1-е Иоанна', '2-е Иоанна', '3-е Иоанна', 'Иуды', 'Откровение',
  ],

  Árabe: [
    'التكوين', 'الخروج', 'اللاويين', 'العدد', 'التثنية', 'يشوع', 'القضاة', 'راعوث',
    'صموئيل الأول', 'صموئيل الثاني', 'الملوك الأول', 'الملوك الثاني', 'أخبار الأيام الأول',
    'أخبار الأيام الثاني', 'عزرا', 'نحميا', 'أستير', 'أيوب', 'المزامير', 'الأمثال', 'الجامعة',
    'نشيد الأنشاد', 'إشعياء', 'إرميا', 'مراثي إرميا', 'حزقيال', 'دانيال', 'هوشع', 'يوئيل',
    'عاموس', 'عوبديا', 'يونان', 'ميخا', 'ناحوم', 'حبقوق', 'صفنيا', 'حجي', 'زكريا', 'ملاخي',
    'متى', 'مرقس', 'لوقا', 'يوحنا', 'أعمال الرسل', 'رومية', 'كورنثوس الأولى',
    'كورنثوس الثانية', 'غلاطية', 'أفسس', 'فيلبي', 'كولوسي', 'تسالونيكي الأولى',
    'تسالونيكي الثانية', 'تيموثاوس الأولى', 'تيموثاوس الثانية', 'تيطس', 'فليمون',
    'العبرانيين', 'يعقوب', 'بطرس الأولى', 'بطرس الثانية', 'يوحنا الأولى', 'يوحنا الثانية',
    'يوحنا الثالثة', 'يهوذا', 'رؤيا يوحنا',
  ],

  // Confianza media: nombres del AT del Septuaginta son estándar; los del NT
  // siguen la convención litúrgica griega moderna más común.
  Griego: [
    'Γένεσις', 'Έξοδος', 'Λευιτικόν', 'Αριθμοί', 'Δευτερονόμιον', 'Ιησούς του Ναυή', 'Κριταί',
    'Ρουθ', 'Α΄ Σαμουήλ', 'Β΄ Σαμουήλ', 'Α΄ Βασιλέων', 'Β΄ Βασιλέων', 'Α΄ Παραλειπομένων',
    'Β΄ Παραλειπομένων', 'Έσδρας', 'Νεεμίας', 'Εσθήρ', 'Ιώβ', 'Ψαλμοί', 'Παροιμίαι',
    'Εκκλησιαστής', 'Άσμα Ασμάτων', 'Ησαΐας', 'Ιερεμίας', 'Θρήνοι', 'Ιεζεκιήλ', 'Δανιήλ',
    'Ωσηέ', 'Ιωήλ', 'Αμώς', 'Αβδιού', 'Ιωνάς', 'Μιχαίας', 'Ναούμ', 'Αββακούμ', 'Σοφονίας',
    'Αγγαίος', 'Ζαχαρίας', 'Μαλαχίας', 'Κατά Ματθαίον', 'Κατά Μάρκον', 'Κατά Λουκάν',
    'Κατά Ιωάννην', 'Πράξεις', 'Προς Ρωμαίους', 'Α΄ Προς Κορινθίους', 'Β΄ Προς Κορινθίους',
    'Προς Γαλάτας', 'Προς Εφεσίους', 'Προς Φιλιππησίους', 'Προς Κολοσσαείς',
    'Α΄ Προς Θεσσαλονικείς', 'Β΄ Προς Θεσσαλονικείς', 'Α΄ Προς Τιμόθεον', 'Β΄ Προς Τιμόθεον',
    'Προς Τίτον', 'Προς Φιλήμονα', 'Προς Εβραίους', 'Ιακώβου', 'Α΄ Πέτρου', 'Β΄ Πέτρου',
    'Α΄ Ιωάννου', 'Β΄ Ιωάννου', 'Γ΄ Ιωάννου', 'Ιούδα', 'Αποκάλυψις',
  ],

  // Confianza alta en el Antiguo Testamento (nombres hebreos tradicionales del Tanaj).
  // Confianza media en el Nuevo Testamento: convención de traducciones mesiánicas
  // al hebreo, no hay una única forma "oficial".
  Hebreo: [
    'בְּרֵאשִׁית', 'שְׁמוֹת', 'וַיִּקְרָא', 'בְּמִדְבַּר', 'דְּבָרִים', 'יְהוֹשֻׁעַ', 'שׁוֹפְטִים', 'רוּת',
    'שְׁמוּאֵל א׳', 'שְׁמוּאֵל ב׳', 'מְלָכִים א׳', 'מְלָכִים ב׳', 'דִּבְרֵי הַיָּמִים א׳',
    'דִּבְרֵי הַיָּמִים ב׳', 'עֶזְרָא', 'נְחֶמְיָה', 'אֶסְתֵּר', 'אִיּוֹב', 'תְּהִלִּים', 'מִשְׁלֵי',
    'קֹהֶלֶת', 'שִׁיר הַשִּׁירִים', 'יְשַׁעְיָהוּ', 'יִרְמְיָהוּ', 'אֵיכָה', 'יְחֶזְקֵאל', 'דָּנִיֵּאל',
    'הוֹשֵׁעַ', 'יוֹאֵל', 'עָמוֹס', 'עֹבַדְיָה', 'יוֹנָה', 'מִיכָה', 'נַחוּם', 'חֲבַקּוּק', 'צְפַנְיָה',
    'חַגַּי', 'זְכַרְיָה', 'מַלְאָכִי', 'מַתִּתְיָהוּ', 'מַרְקוֹס', 'לוּקָס', 'יוֹחָנָן',
    'מַעֲשֵׂי הַשְּׁלִיחִים', 'אֶל־הָרוֹמִים', 'אֶל־הַקּוֹרִנְתִּים א׳', 'אֶל־הַקּוֹרִנְתִּים ב׳',
    'אֶל־הַגָּלָטִים', 'אֶל־הָאֶפֶסִים', 'אֶל־הַפִּילִיפִּים', 'אֶל־הַקּוֹלוֹסִים',
    'אֶל־הַתַּסָּלוֹנִיקִים א׳', 'אֶל־הַתַּסָּלוֹנִיקִים ב׳', 'אֶל־טִימוֹתִיאוֹס א׳',
    'אֶל־טִימוֹתִיאוֹס ב׳', 'אֶל־טִיטוֹס', 'אֶל־פִּילֵימוֹן', 'אֶל־הָעִבְרִים', 'יַעֲקֹב',
    'פֶּטְרוֹס א׳', 'פֶּטְרוֹס ב׳', 'יוֹחָנָן א׳', 'יוֹחָנָן ב׳', 'יוֹחָנָן ג׳', 'יְהוּדָה',
    'הַהִתְגַּלּוּת',
  ],

  // Confianza media: formas cortas de uso común, puede variar por editorial.
  Finlandés: [
    '1. Mooseksen kirja', '2. Mooseksen kirja', '3. Mooseksen kirja', '4. Mooseksen kirja',
    '5. Mooseksen kirja', 'Joosua', 'Tuomarien kirja', 'Ruut', '1. Samuelin kirja',
    '2. Samuelin kirja', '1. Kuninkaiden kirja', '2. Kuninkaiden kirja', '1. Aikakirja',
    '2. Aikakirja', 'Esra', 'Nehemia', 'Ester', 'Job', 'Psalmit', 'Sananlaskut', 'Saarnaaja',
    'Laulujen laulu', 'Jesaja', 'Jeremia', 'Valitusvirret', 'Hesekiel', 'Daniel', 'Hoosea',
    'Jooel', 'Aamos', 'Obadja', 'Joona', 'Miika', 'Nahum', 'Habakuk', 'Sefanja', 'Haggai',
    'Sakarja', 'Malakia', 'Matteus', 'Markus', 'Luukas', 'Johannes', 'Apostolien teot',
    'Roomalaiskirje', '1. Korinttilaiskirje', '2. Korinttilaiskirje', 'Galatalaiskirje',
    'Efesolaiskirje', 'Filippiläiskirje', 'Kolossalaiskirje', '1. Tessalonikalaiskirje',
    '2. Tessalonikalaiskirje', '1. Timoteuskirje', '2. Timoteuskirje', 'Tituksen kirje',
    'Filemonin kirje', 'Heprealaiskirje', 'Jaakobin kirje', '1. Pietarin kirje',
    '2. Pietarin kirje', '1. Johanneksen kirje', '2. Johanneksen kirje',
    '3. Johanneksen kirje', 'Juudaan kirje', 'Ilmestyskirja',
  ],

  // Confianza baja: el esperanto no tiene una única convención asentada para
  // todos los libros; se recomienda revisión por un hablante nativo.
  Esperanto: [
    'Genezo', 'Eliro', 'Levidoj', 'Nombroj', 'Readmono', 'Josuo', 'Juĝistoj', 'Rut',
    '1 Samuel', '2 Samuel', '1 Reĝoj', '2 Reĝoj', '1 Kroniko', '2 Kroniko', 'Ezra', 'Neĥemja',
    'Ester', 'Ijob', 'Psalmaro', 'Sentencoj', 'Predikanto', 'Alta Kanto', 'Jesaja', 'Jeremia',
    'Plorkanto', 'Jeĥezkel', 'Daniel', 'Hoŝea', 'Joel', 'Amos', 'Obadja', 'Jona', 'Miĥa',
    'Naĥum', 'Ĥabakuk', 'Cefanja', 'Ĥagaj', 'Zeĥarja', 'Malaĥi', 'Mateo', 'Marko', 'Luko',
    'Johano', 'Agoj', 'Romanoj', '1 Korintanoj', '2 Korintanoj', 'Galatoj', 'Efesanoj',
    'Filipianoj', 'Koloseanoj', '1 Tesalonikanoj', '2 Tesalonikanoj', '1 Timoteo',
    '2 Timoteo', 'Tito', 'Filemon', 'Hebreoj', 'Jakobo', '1 Petro', '2 Petro', '1 Johano',
    '2 Johano', '3 Johano', 'Judas', 'Apokalipso',
  ],
}

/** Palabra/abreviación para "capítulo" en cada idioma, usada en el selector. */
export const ETIQUETA_CAPITULO_POR_IDIOMA: Record<string, string> = {
  Español: 'Cap.',
  Inglés: 'Ch.',
  Francés: 'Ch.',
  Italiano: 'Cap.',
  Portugués: 'Cap.',
  Neerlandés: 'Hfdst.',
  Ruso: 'Гл.',
  Árabe: 'إصحاح',
  Griego: 'Κεφ.',
  Hebreo: 'פרק',
  Finlandés: 'Luku',
  Esperanto: 'Ĉap.',
}

/** Etiquetas de "Antiguo Testamento" / "Nuevo Testamento" por idioma. */
export const TESTAMENTOS_POR_IDIOMA: Record<string, { antiguo: string; nuevo: string }> = {
  Español: { antiguo: 'Antiguo Testamento', nuevo: 'Nuevo Testamento' },
  Inglés: { antiguo: 'Old Testament', nuevo: 'New Testament' },
  Francés: { antiguo: 'Ancien Testament', nuevo: 'Nouveau Testament' },
  Italiano: { antiguo: 'Antico Testamento', nuevo: 'Nuovo Testamento' },
  Portugués: { antiguo: 'Antigo Testamento', nuevo: 'Novo Testamento' },
  Neerlandés: { antiguo: 'Oude Testament', nuevo: 'Nieuwe Testament' },
  Ruso: { antiguo: 'Ветхий Завет', nuevo: 'Новый Завет' },
  Árabe: { antiguo: 'العهد القديم', nuevo: 'العهد الجديد' },
  Griego: { antiguo: 'Παλαιά Διαθήκη', nuevo: 'Καινή Διαθήκη' },
  Hebreo: { antiguo: 'תנ״ך', nuevo: 'הברית החדשה' },
  Finlandés: { antiguo: 'Vanha testamentti', nuevo: 'Uusi testamentti' },
  Esperanto: { antiguo: 'Malnova Testamento', nuevo: 'Nova Testamento' },
}
