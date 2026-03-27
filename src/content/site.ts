export const siteConfig = {
  name: "Gyermekagykontroll",
  title: "Tihanyi Rita - Gyermekagykontroll oktató",
  description: "Gyermekagykontroll tanfolyamok általános iskolás korú gyerekeknek. 15+ év tapasztalat, Budapest és Balaton környéke. Jelentkezz most!",
  url: "https://gyermekagykontroll.hu",
  contact: {
    phone: "+36 30 620 7373",
    email: "info@gyermekagykontroll.hu",
    address: "8360 Keszthely, Ruszek u. 22.",
  },
  social: {
    youtube: "https://www.youtube.com/embed/goRfxnsRzr0",
  },
  bank: {
    name: "Raiffeisen Bank",
    account: "12083600-00042117-00100008",
    iban: "HU92 1208 3600 0004 2117 0010 0008",
    swift: "UBRTHUHB",
    holder: "Tihanyi Rita",
  },
  business: {
    name: "Tihanyi Rita e.v.",
    taxNumber: "74893009-1-40",
    registrationNumber: "51250351",
  },
} as const;

export const navigation = [
  { label: "Főoldal", href: "/" },
  { label: "Mi az agykontroll?", href: "/tanulas" },
  { label: "A tanfolyam", href: "/gyermekagykontroll-agykontroll-gyermekeknek" },
  { label: "Tematika", href: "/gyermekagykontroll-tematika" },
  { label: "Tantorta", href: "/tantorta" },
  { label: "Blog", href: "/blog" },
  { label: "Rólam", href: "/rolam" },
] as const;

export const footerLinks = [
  { label: "ÁSZF", href: "/aszf" },
  { label: "Adatvédelmi tájékoztató", href: "/adatvedelmi-tajekoztato" },
] as const;
