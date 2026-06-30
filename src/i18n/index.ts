export type LanguageCode = "en" | "it" | "pl" | "ta" | "ko" | "he" | "fi" | "ar" | "nl" | "de";

export interface LangMeta {
  code: LanguageCode;
  name: string;
  nativeName: string;
  dir: "ltr" | "rtl";
  flag: string;
}

export const LANGUAGES: LangMeta[] = [
  { code: "en", name: "English", nativeName: "English", dir: "ltr", flag: "🇬🇧" },
  { code: "it", name: "Italian", nativeName: "Italiano", dir: "ltr", flag: "🇮🇹" },
  { code: "pl", name: "Polish", nativeName: "Polski", dir: "ltr", flag: "🇵🇱" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", dir: "ltr", flag: "🇮🇳" },
  { code: "ko", name: "Korean", nativeName: "한국어", dir: "ltr", flag: "🇰🇷" },
  { code: "he", name: "Hebrew", nativeName: "עברית", dir: "rtl", flag: "🇮🇱" },
  { code: "fi", name: "Finnish", nativeName: "Suomi", dir: "ltr", flag: "🇫🇮" },
  { code: "ar", name: "Arabic", nativeName: "العربية", dir: "rtl", flag: "🇸🇦" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands", dir: "ltr", flag: "🇳🇱" },
  { code: "de", name: "German", nativeName: "Deutsch", dir: "ltr", flag: "🇩🇪" },
];

export const DEFAULT_LANG: LanguageCode = "en";

export const ui = {
  en: {
    siteTitle: "What Generative AI",
    tagline: "The GenAI Playbook for Business Leaders",
    navDocs: "Playbook",
    navBlog: "Blog",
    navAbout: "Author",
    search: "Search the playbook",
    searchPlaceholder: "Search chapters…",
    onThisPage: "On this page",
    readTime: "min read",
    lastUpdated: "Last updated",
    author: "Author",
    published: "Published",
    backToTop: "Back to top",
    previous: "Previous",
    next: "Next",
    language: "Language",
    footerLicense: "Apache 2.0 Licensed",
    footerSource: "Source",
    startReading: "Start reading",
    viewAllChapters: "View all chapters",
    chapters: "Chapters",
    topics: "Topics",
    citationSummary: "AI-friendly summary",
  },
  it: {
    siteTitle: "Cosa è la AI Generativa",
    tagline: "Il Playbook GenAI per Leader Aziendali",
    navDocs: "Playbook", navBlog: "Blog", navAbout: "Autore",
    search: "Cerca nel playbook", searchPlaceholder: "Cerca capitoli…",
    onThisPage: "In questa pagina", readTime: "min di lettura",
    lastUpdated: "Ultimo aggiornamento", author: "Autore", published: "Pubblicato",
    backToTop: "Torna su", previous: "Precedente", next: "Successivo",
    language: "Lingua", footerLicense: "Licenza Apache 2.0", footerSource: "Sorgente",
    startReading: "Inizia a leggere", viewAllChapters: "Vedi tutti i capitoli",
    chapters: "Capitoli", topics: "Argomenti", citationSummary: "Riassunto per AI",
  },
  pl: {
    siteTitle: "Czym jest Generatywna AI",
    tagline: "Playbook GenAI dla Liderów Biznesu",
    navDocs: "Playbook", navBlog: "Blog", navAbout: "Autor",
    search: "Szukaj w playbooku", searchPlaceholder: "Szukaj rozdziałów…",
    onThisPage: "Na tej stronie", readTime: "min czytania",
    lastUpdated: "Ostatnia aktualizacja", author: "Autor", published: "Opublikowano",
    backToTop: "Do góry", previous: "Poprzedni", next: "Następny",
    language: "Język", footerLicense: "Licencja Apache 2.0", footerSource: "Źródło",
    startReading: "Zacznij czytać", viewAllChapters: "Zobacz wszystkie rozdziały",
    chapters: "Rozdziały", topics: "Tematy", citationSummary: "Podsumowanie dla AI",
  },
  ta: {
    siteTitle: "ஜெனரேட்டிவ் AI என்றால் என்ன",
    tagline: "வணிகத் தலைவர்களுக்கான GenAI பிளேபுக்",
    navDocs: "பிளேபுக்", navBlog: "வலைப்பதிவு", navAbout: "ஆசிரியர்",
    search: "பிளேபுக்கில் தேடு", searchPlaceholder: "அத்தியாயங்களைத் தேடு…",
    onThisPage: "இந்தப் பக்கத்தில்", readTime: "நிமிட வாசிப்பு",
    lastUpdated: "கடைசி புதுப்பிப்பு", author: "ஆசிரியர்", published: "வெளியிடப்பட்டது",
    backToTop: "மேலே செல்", previous: "முந்தைய", next: "அடுத்த",
    language: "மொழி", footerLicense: "Apache 2.0 உரிமம்", footerSource: "மூலம்",
    startReading: "படிக்கத் தொடங்கு", viewAllChapters: "அனைத்து அத்தியாயங்களையும் காண்க",
    chapters: "அத்தியாயங்கள்", topics: "தலைப்புகள்", citationSummary: "AI-க்கான சுருக்கம்",
  },
  ko: {
    siteTitle: "생성형 AI란",
    tagline: "비즈니스 리더를 위한 GenAI 플레이북",
    navDocs: "플레이북", navBlog: "블로그", navAbout: "저자",
    search: "플레이북 검색", searchPlaceholder: "챕터 검색…",
    onThisPage: "이 페이지에서", readTime: "분 읽기",
    lastUpdated: "최근 업데이트", author: "저자", published: "게시일",
    backToTop: "맨 위로", previous: "이전", next: "다음",
    language: "언어", footerLicense: "Apache 2.0 라이선스", footerSource: "소스",
    startReading: "읽기 시작", viewAllChapters: "모든 챕터 보기",
    chapters: "챕터", topics: "주제", citationSummary: "AI 친화적 요약",
  },
  he: {
    siteTitle: "מהי AI גנרטיבית",
    tagline: "מדריך GenAI למנהלים",
    navDocs: "מדריך", navBlog: "בלוג", navAbout: "מחבר",
    search: "חיפוש במדריך", searchPlaceholder: "חיפוש פרקים…",
    onThisPage: "בעמוד זה", readTime: "דקות קריאה",
    lastUpdated: "עודכן לאחרונה", author: "מחבר", published: "פורסם",
    backToTop: "חזרה למעלה", previous: "הקודם", next: "הבא",
    language: "שפה", footerLicense: "רישיון Apache 2.0", footerSource: "מקור",
    startReading: "התחל לקרוא", viewAllChapters: "כל הפרקים",
    chapters: "פרקים", topics: "נושאים", citationSummary: "סיכום ל-AI",
  },
  fi: {
    siteTitle: "Mikä on Generatiivinen AI",
    tagline: "GenAI-ohjekirja Liiketoiminnan Päättäjille",
    navDocs: "Ohjekirja", navBlog: "Blogi", navAbout: "Kirjoittaja",
    search: "Hae ohjekirjasta", searchPlaceholder: "Hae lukuja…",
    onThisPage: "Tällä sivulla", readTime: "min lukuaika",
    lastUpdated: "Päivitetty", author: "Kirjoittaja", published: "Julkaistu",
    backToTop: "Ylös", previous: "Edellinen", next: "Seuraava",
    language: "Kieli", footerLicense: "Apache 2.0 -lisenssi", footerSource: "Lähde",
    startReading: "Aloita lukeminen", viewAllChapters: "Kaikki luvut",
    chapters: "Luvut", topics: "Aiheet", citationSummary: "AI-yhteenveto",
  },
  ar: {
    siteTitle: "ما هو الذكاء الاصطناعي التوليدي",
    tagline: "كتيب الذكاء الاصطناعي التوليدي لقادة الأعمال",
    navDocs: "الكتيب", navBlog: "المدونة", navAbout: "المؤلف",
    search: "ابحث في الكتيب", searchPlaceholder: "ابحث في الفصول…",
    onThisPage: "في هذه الصفحة", readTime: "دقيقة قراءة",
    lastUpdated: "آخر تحديث", author: "المؤلف", published: "نُشر",
    backToTop: "إلى الأعلى", previous: "السابق", next: "التالي",
    language: "اللغة", footerLicense: "رخصة Apache 2.0", footerSource: "المصدر",
    startReading: "ابدأ القراءة", viewAllChapters: "كل الفصول",
    chapters: "الفصول", topics: "المواضيع", citationSummary: "ملخص للذكاء الاصطناعي",
  },
  nl: {
    siteTitle: "Wat is Generatieve AI",
    tagline: "Het GenAI Playbook voor Zakelijke Leiders",
    navDocs: "Playbook", navBlog: "Blog", navAbout: "Auteur",
    search: "Zoek in het playbook", searchPlaceholder: "Zoek hoofdstukken…",
    onThisPage: "Op deze pagina", readTime: "min lezen",
    lastUpdated: "Laatst bijgewerkt", author: "Auteur", published: "Gepubliceerd",
    backToTop: "Naar boven", previous: "Vorige", next: "Volgende",
    language: "Taal", footerLicense: "Apache 2.0 Licentie", footerSource: "Broncode",
    startReading: "Begin met lezen", viewAllChapters: "Alle hoofdstukken",
    chapters: "Hoofdstukken", topics: "Onderwerpen", citationSummary: "AI-vriendelijke samenvatting",
  },
  de: {
    siteTitle: "Was ist Generative KI",
    tagline: "Das GenAI Playbook für Geschäftsführer",
    navDocs: "Playbook", navBlog: "Blog", navAbout: "Autor",
    search: "Im Playbook suchen", searchPlaceholder: "Kapitel suchen…",
    onThisPage: "Auf dieser Seite", readTime: "Min. Lesezeit",
    lastUpdated: "Zuletzt aktualisiert", author: "Autor", published: "Veröffentlicht",
    backToTop: "Nach oben", previous: "Zurück", next: "Weiter",
    language: "Sprache", footerLicense: "Apache 2.0 Lizenz", footerSource: "Quellcode",
    startReading: "Jetzt lesen", viewAllChapters: "Alle Kapitel",
    chapters: "Kapitel", topics: "Themen", citationSummary: "AI-freundliche Zusammenfassung",
  },
} as const;

export function getLang(code: string): LangMeta {
  return LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0];
}

export function isRtl(code: string): boolean {
  return getLang(code).dir === "rtl";
}

export function localizedPath(code: string, path = ""): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return code === DEFAULT_LANG ? p : `/${code}${p}`;
}

export function t(code: string, key: keyof (typeof ui)[typeof DEFAULT_LANG]): string {
  const dict = (ui as Record<string, Record<string, string>>)[code] ?? ui.en;
  return dict[key] ?? (ui.en as Record<string, string>)[key] ?? String(key);
}