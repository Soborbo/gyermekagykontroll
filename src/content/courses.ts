export interface CourseDate {
  date: string;
  location: string;
}

export interface Course {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  priceLabel: string;
  siblingDiscount: number;
  siblingDiscountLabel: string;
  repeatPrice?: number;
  repeatPriceLabel?: string;
  ageRange: string;
  duration: string;
  dates: CourseDate[];
  grades: string[];
}

export const courses: Course[] = [
  {
    id: "gyermekagykontroll",
    name: "Gyermekagykontroll tanfolyam",
    slug: "gyermekagykontroll",
    description: "Kétnapos tanfolyam, ahol gyermeked megtanulja az agykontroll alapjait: relaxáció, koncentráció, stresszkezelés, pozitív gondolkodás és még sok más.",
    price: 42000,
    priceLabel: "42 000 Ft / fő",
    siblingDiscount: 4000,
    siblingDiscountLabel: "4 000 Ft / fő",
    repeatPrice: 23000,
    repeatPriceLabel: "23 000 Ft / fő",
    ageRange: "Általános iskolás korú gyerekeknek",
    duration: "2 nap (hétvége)",
    dates: [
      { date: "2026. április 4-5.", location: "Budapest VI. kerület" },
      { date: "2026. május 16-17.", location: "Tapolca" },
      { date: "2026. június 27-28.", location: "Budapest VI. kerület" },
      { date: "2026. július 25-26.", location: "Budapest VI. kerület" },
      { date: "2026. augusztus 8-9.", location: "Keszthely" },
      { date: "2026. augusztus 29-30.", location: "Budapest VI. kerület" },
      { date: "2026. szeptember 19-20.", location: "Budapest VI. kerület" },
      { date: "2026. október 17-18.", location: "Budapest VI. kerület" },
      { date: "2026. november 7-8.", location: "Keszthely" },
    ],
    grades: [
      "1. osztályos", "2. osztályos", "3. osztályos", "4. osztályos",
      "5. osztályos", "6. osztályos", "7. osztályos", "8. osztályos",
      "9. osztályos", "10. osztályos", "11. osztályos", "12. osztályos",
    ],
  },
  {
    id: "tantorta",
    name: "Tantorta tréning",
    slug: "tantorta",
    description: "Tanulásmódszertani tréning felsősöknek: hatékony tanulási technikák, gondolattérkép, memóriatechnikák.",
    price: 19900,
    priceLabel: "19 900 Ft / fő",
    siblingDiscount: 1000,
    siblingDiscountLabel: "1 000 Ft / fő (testvér- vagy agykontrollkedvezmény)",
    ageRange: "10-18 év (felső tagozat és középiskola)",
    duration: "1 nap",
    dates: [
      { date: "2026. április 25.", location: "Zalaegerszeg" },
      { date: "2026. október 3.", location: "Keszthely" },
    ],
    grades: [
      "5. osztályos", "6. osztályos", "7. osztályos", "8. osztályos",
      "9. osztályos", "10. osztályos", "11. osztályos", "12. osztályos",
    ],
  },
];

export const benefits = [
  {
    icon: "book",
    title: "Jobb tanulás",
    text: "Jobban tanulnak, javul a memóriájuk, sikeresebbek lesznek az iskolában és így később az életben is.",
    color: "blue",
  },
  {
    icon: "shield",
    title: "Stresszkezelés",
    text: "Hatékony módszereket tanítok a stressz kezelésére, amellyel leküzdhetik a lámpalázat feleléskor.",
    color: "green",
  },
  {
    icon: "moon",
    title: "Könnyebb alvás",
    text: "Megtanulják, hogyan aludjanak el és keljenek fel könnyebben, akár ébresztőóra nélkül.",
    color: "indigo",
  },
  {
    icon: "cloud",
    title: "Rossz álmok kezelése",
    text: "Módszert kapnak, hogy kezelni tudják a rossz álmaikat, segítsék a minőségi alvásukat.",
    color: "purple",
  },
  {
    icon: "brain",
    title: "IQ fejlesztés",
    text: "Az IQ nem egy veleszületett tulajdonság - fejleszthető! Gyorsabb és jobb felfogóképességre tehetnek szert.",
    color: "amber",
  },
  {
    icon: "x-circle",
    title: "Rossz szokások",
    text: "Segít elhagyni a rossz szokásaikat (pl.: körömrágás, csámcsogás stb.).",
    color: "rose",
  },
  {
    icon: "target",
    title: "Jobb koncentráció",
    text: "Eszközt kapnak a figyelem-problémáik legyőzésére, jobban fognak tudni koncentrálni.",
    color: "teal",
  },
  {
    icon: "zap",
    title: "Gyors döntések",
    text: "Már ilyen fiatalon megtanulják, hogyan hozzanak gyors és jó döntéseket.",
    color: "orange",
  },
  {
    icon: "flag",
    title: "Célkitűzés",
    text: "Megtanulják a helyes célkitűzések fontosságát és eszközt, hogy el is érjék céljaikat.",
    color: "cyan",
  },
  {
    icon: "heart",
    title: "Fájdalomkezelés",
    text: "Megtanulják kezelni a fájdalmat, elállítani a vérzéseket.",
    color: "pink",
  },
  {
    icon: "plus-circle",
    title: "Öngyógyítás",
    text: "Hatékony módszert kapnak az öngyógyításra, megbetegedéseik kezelésére gyógyszerek nélkül.",
    color: "emerald",
  },
  {
    icon: "sun",
    title: "Pozitív gondolkodás",
    text: "Megértik, mi az és miért fontos a pozitív gondolkodás. Megtanulják letenni a negatív gondolatokat és építő, pozitív gondolatokra cserélni azokat.",
    color: "yellow",
  },
] as const;

export const discounts = [
  { id: "none", label: "Nem jogosult kedvezményre" },
  { id: "sibling", label: "Testvérkedvezmény" },
  { id: "repeat", label: "Ismétlőkedvezmény" },
  { id: "agykontroll", label: "Agykontrollkedvezmény (csak Tantorta)" },
] as const;
