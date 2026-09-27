export const origins = [
  {
    index: "01",
    country: "Etiopia",
    place: "Yirgacheffe, Kochere",
    process: "Lavato",
    altitude: "1.980 m",
    notes: "Gelsomino · Bergamotto · Albicocca",
  },
  {
    index: "02",
    country: "Colombia",
    place: "Huila, Acevedo",
    process: "Honey",
    altitude: "1.720 m",
    notes: "Panela · Mela rossa · Cacao",
  },
  {
    index: "03",
    country: "Guatemala",
    place: "Antigua, San Miguel",
    process: "Lavato",
    altitude: "1.560 m",
    notes: "Cioccolato · Arancia · Mandorla",
  },
] as const;

export const plantPhotos = [
  {
    src: "/media/plants/leaves.jpg",
    webp: "/media/plants/leaves.webp",
    avif: "/media/plants/leaves.avif",
    width: 1000,
    height: 1500,
    alt: "Pianta di caffè con foglie lucide e ciliegie ancora verdi",
    caption: "Ciliegie ancora verdi sulla pianta.",
  },
  {
    src: "/media/plants/branch.jpg",
    webp: "/media/plants/branch.webp",
    avif: "/media/plants/branch.avif",
    width: 1000,
    height: 667,
    alt: "Ramo di caffè con ciliegie che iniziano a maturare",
    caption: "Il ramo, tra luce e ombra.",
  },
  {
    src: "/media/plants/cherries.jpg",
    webp: "/media/plants/cherries.webp",
    avif: "/media/plants/cherries.avif",
    width: 1000,
    height: 1500,
    alt: "Ciliegie di caffè mature, rosse e gialle, sul ramo",
    caption: "Ciliegie mature, pronte per il raccolto.",
  },
] as const;

export const roastSteps = [
  {
    index: "01",
    title: "Verde",
    body: "Il caffè arriva ancora verde, intero e compatto. Controlliamo il lotto, eliminiamo eventuali difetti e prepariamo la quantità necessaria per la tostatura.",
  },
  {
    index: "02",
    title: "Tostatura",
    body: "Il calore aumenta gradualmente e modifica il chicco, sviluppandone aromi e struttura. Interrompiamo la tostatura quando raggiungiamo il profilo scelto per quell’origine.",
  },
  {
    index: "03",
    title: "Riposo",
    body: "Dopo la tostatura il caffè ha bisogno di tempo. Lo lasciamo riposare per circa 48 ore, permettendo ai gas di fuoriuscire e agli aromi di stabilizzarsi prima della spedizione.",
  },
  {
    index: "04",
    title: "Estrazione",
    body: "Filtro o espresso, l’obiettivo non cambia: ottenere una tazza equilibrata e leggibile. La preparazione completa il lavoro iniziato durante la selezione e la tostatura.",
  },
] as const;

export const coffees = [
  {
    name: "Guatemala Antigua",
    measure: "Quotidiano",
    line: "Un caffè equilibrato e versatile, pensato per accompagnare ogni giorno.",
    price: "14 €",
    weight: "250 g",
    image: "/media/roast/pack-scura.webp",
    alt: "Sacco Orma, tostatura scura",
    notes: "Cioccolato · Arancia · Mandorla",
    roast: "Scura",
    process: "Lavato",
  },
  {
    name: "Colombia Huila",
    measure: "Tavola",
    line: "Più dolce e morbido, con una struttura pulita e note di frutta e cacao.",
    price: "18 €",
    weight: "250 g",
    image: "/media/roast/pack-media.webp",
    alt: "Sacco Orma, tostatura media",
    notes: "Panela · Mela rossa · Cacao",
    roast: "Media",
    process: "Honey",
  },
  {
    name: "Etiopia Yirgacheffe",
    measure: "Raro",
    line: "Un piccolo lotto selezionato per il suo profilo aromatico e la particolare espressività in tazza.",
    price: "46 €",
    weight: "250 g",
    image: "/media/roast/pack-chiara.webp",
    alt: "Sacco Orma, tostatura chiara",
    notes: "Gelsomino · Bergamotto · Albicocca",
    roast: "Chiara",
    process: "Lavato",
  },
] as const;

export const capsules = [
  {
    name: "Guatemala Antigua",
    measure: "Quotidiano",
    line: "Lo stesso caffè di ogni giorno, pronto per la macchina a capsule.",
    price: "8 €",
    weight: "10 capsule",
    image: "/media/capsules/capsule-scura.jpg",
    alt: "Capsula Orma, tostatura scura",
    notes: "Cioccolato · Arancia · Mandorla",
    roast: "Scura",
    format: "Alluminio",
  },
  {
    name: "Colombia Huila",
    measure: "Tavola",
    line: "Più dolce e morbido, con la stessa struttura della selezione in grani.",
    price: "11 €",
    weight: "10 capsule",
    image: "/media/capsules/capsule-media.jpg",
    alt: "Capsula Orma, tostatura media",
    notes: "Panela · Mela rossa · Cacao",
    roast: "Media",
    format: "Alluminio",
  },
  {
    name: "Etiopia Yirgacheffe",
    measure: "Raro",
    line: "Il piccolo lotto, in capsula. Lo stesso profilo, una tazza alla volta.",
    price: "18 €",
    weight: "10 capsule",
    image: "/media/capsules/capsule-chiara.jpg",
    alt: "Capsula Orma, tostatura chiara",
    notes: "Gelsomino · Bergamotto · Albicocca",
    roast: "Chiara",
    format: "Alluminio",
  },
] as const;

export const cupSequence = [
  { index: "01", name: "Verde" },
  { index: "02", name: "Forno" },
  { index: "03", name: "Riposo" },
  { index: "04", name: "Tazza" },
] as const;
