import { lessons1to3 } from "./seed/lessons-01-03";
import { lessons4to6 } from "./seed/lessons-04-06";
import { lessons7to9 } from "./seed/lessons-07-09";
import { lessons10to12 } from "./seed/lessons-10-12";
import { lessons13to15 } from "./seed/lessons-13-15";
import { lessons16to17 } from "./seed/lessons-16-17";
import { lesson18 } from "./seed/lessons-18";
import { lesson19 } from "./seed/lessons-19";
import { lesson20 } from "./seed/lessons-20";
import { lesson21 } from "./seed/lessons-21";
import { lesson22 } from "./seed/lessons-22";
import { lesson23 } from "./seed/lessons-23";
import { lesson24 } from "./seed/lessons-24";
import { lesson25 } from "./seed/lessons-25";
import { lesson26 } from "./seed/lessons-26";
import { lesson27 } from "./seed/lessons-27";
import { lesson28 } from "./seed/lessons-28";
import { lesson29 } from "./seed/lessons-29";
import { lesson30 } from "./seed/lessons-30";
import { lesson31 } from "./seed/lessons-31";
import { lesson32 } from "./seed/lessons-32";
import { lesson33 } from "./seed/lessons-33";
import { lesson34 } from "./seed/lessons-34";
import { lesson35 } from "./seed/lessons-35";
import { lesson36 } from "./seed/lessons-36";
import { lesson37 } from "./seed/lessons-37";
import { lesson38 } from "./seed/lessons-38";
import { lesson39 } from "./seed/lessons-39";
import { lesson40 } from "./seed/lessons-40";
import { lesson41 } from "./seed/lessons-41";
import { lesson42 } from "./seed/lessons-42";
import { lesson43 } from "./seed/lessons-43";
import { lesson44 } from "./seed/lessons-44";
import { lesson45 } from "./seed/lessons-45";
import { lesson46 } from "./seed/lessons-46";
import { lesson47 } from "./seed/lessons-47";
import { lesson48 } from "./seed/lessons-48";
import { lesson49 } from "./seed/lessons-49";
import { lesson50 } from "./seed/lessons-50";
import { lesson51 } from "./seed/lessons-51";
import { lesson52 } from "./seed/lessons-52";
import { lesson53 } from "./seed/lessons-53";
import { lesson54 } from "./seed/lessons-54";
import { lesson55 } from "./seed/lessons-55";
import { lesson56 } from "./seed/lessons-56";
import { lesson57 } from "./seed/lessons-57";
import { lesson58 } from "./seed/lessons-58";
import { lesson59 } from "./seed/lessons-59";
import { lesson60 } from "./seed/lessons-60";
import { lesson61 } from "./seed/lessons-61";
import { lesson62 } from "./seed/lessons-62";
import { lesson63 } from "./seed/lessons-63";
import { lesson64 } from "./seed/lessons-64";
import { lesson65 } from "./seed/lessons-65";
import { lesson66 } from "./seed/lessons-66";
import { lesson67 } from "./seed/lessons-67";
import { lesson68 } from "./seed/lessons-68";
import { lesson69 } from "./seed/lessons-69";
import { lesson70 } from "./seed/lessons-70";
import { lesson71 } from "./seed/lessons-71";
import { lesson72 } from "./seed/lessons-72";
import { lesson73 } from "./seed/lessons-73";
import { lesson74 } from "./seed/lessons-74";
import { lesson75 } from "./seed/lessons-75";
import { lesson76 } from "./seed/lessons-76";
import { lesson77 } from "./seed/lessons-77";
import { lesson78 } from "./seed/lessons-78";
import { lesson79 } from "./seed/lessons-79";
import { lesson80 } from "./seed/lessons-80";
import { lesson81 } from "./seed/lessons-81";
import { lesson82 } from "./seed/lessons-82";
import { lesson83 } from "./seed/lessons-83";
import { lesson84 } from "./seed/lessons-84";
import { lesson85 } from "./seed/lessons-85";
import { lesson86 } from "./seed/lessons-86";
import { lesson87 } from "./seed/lessons-87";
import { lesson88 } from "./seed/lessons-88";
import { lesson89 } from "./seed/lessons-89";
import { lesson90 } from "./seed/lessons-90";
import { lesson91 } from "./seed/lessons-91";
import { lesson92 } from "./seed/lessons-92";
import { lesson93 } from "./seed/lessons-93";
import { lesson94 } from "./seed/lessons-94";
import { lesson95 } from "./seed/lessons-95";
import { lesson96 } from "./seed/lessons-96";
import { lesson97 } from "./seed/lessons-97";
import { lesson98 } from "./seed/lessons-98";
import { lesson99 } from "./seed/lessons-99";
import { lesson100 } from "./seed/lessons-100";
import { lesson101 } from "./seed/lessons-101";
import { lesson102 } from "./seed/lessons-102";

export type LessonSeed = {
  title: string;
  slug: string;
  description: string;
  instrument: "GUITAR" | "BASS" | "DRUMS" | "GENERAL";
  level?: "beginner" | "intermediate" | "advanced";
  order: number;
  topics: {
    title: string;
    slug: string;
    description: string;
    blocks: string[];
  }[];
};

export const LESSON_LEVELS: Record<string, "beginner" | "intermediate" | "advanced"> = {
  // GENERAL theory — lessons 01-17
  "zvuk-i-notnaya-zapis": "beginner",
  "ritm-i-metr": "beginner",
  "intervaly": "beginner",
  "lady-i-gammy": "beginner",
  "tonalnost": "beginner",
  "akkordy-trezvuchiya": "beginner",
  "akkordy-septakkordy": "intermediate",
  "garmoniya-i-funkcii": "beginner",
  "garmonicheskij-analiz": "advanced",
  "melodiya": "beginner",
  "improvizaciya": "beginner",
  "forma-i-struktura": "beginner",
  "kontrapunkt-i-polifoniya": "advanced",
  "modalnaya-garmoniya": "intermediate",
  "dzhazovaya-garmoniya": "advanced",
  "transponirovanie-i-aranzhirovka": "intermediate",
  "akustika-i-nastrojka": "intermediate",
  // GUITAR — electric
  "elektrogitara-ustrojstvo-i-zvuk": "beginner",
  "effekty-i-pedali": "beginner",
  "tekhnika-pravoj-ruki": "beginner",
  "tekhnika-levoj-ruki": "beginner",
  "gitary-rasshirennogo-diapazona": "intermediate",
  "songrajtingv": "intermediate",
  "zvukozapis-i-prodakshn": "beginner",
  "stilistika-blyuz": "beginner",
  "stilistika-rok-i-metal": "intermediate",
  "stilistika-fank-r-and-b-pop": "intermediate",
  "razbor-pesen": "beginner",
  "poliritmiya-i-nechyotnye-razmery": "advanced",
  "razvitie-slukha": "beginner",
  "metodologiya-praktiki": "beginner",
  "chtenie-not-i-tabulatur": "beginner",
  "klassicheskaya-gitara": "intermediate",
  "flamenko": "intermediate",
  "dzhazovaya-gitara": "advanced",
  "kantri-i-alternativnyj-piking": "intermediate",
  "latinskaya-muzyka": "intermediate",
  "golosovdenie": "intermediate",
  "sovremennaya-i-neotonalnaya-garmoniya": "advanced",
  "obsluzhivanie-i-nastrojka-gitary": "beginner",
  "transkripciya-i-snyatie-na-slukh": "intermediate",
  "vystuplenie-i-scenicheskaya-praktika": "intermediate",
  "ustrojstvo-elektrogitary-uglyblyonno": "intermediate",
  "usiliteli-i-kabinety-uglyublyon": "intermediate",
  "effekty-peregruз": "beginner",
  "effekty-modulyatsiya-i-prostranstvo": "intermediate",
  "effekty-filtry-i-dinamika": "intermediate",
  "tsepochka-effektov-i-kommutatsiya": "intermediate",
  "multi-effekty-i-modelirovanie": "intermediate",
  "tekhnika-pravoj-ruki-elektro": "beginner",
  "tekhnika-levoj-ruki-elektro": "beginner",
  "flazholety-i-rasshirennye-tekhniki": "advanced",
  "elektrogitara-v-stile-blyuz": "beginner",
  "elektrogitara-v-stile-rok-i-metal": "intermediate",
  "elektrogitara-v-stile-fank-i-r-and-b": "intermediate",
  "gitary-rasshirennogo-diapazona-uglyublyon": "advanced",
  "slajd-gitara": "intermediate",
  // STUDIO / RECORDING / SOUND
  "akustika-pomeshchenij": "intermediate",
  "mikrofony": "beginner",
  "tekhniki-mikrofonirovaniya": "intermediate",
  "audiointerfejs-i-preamp": "beginner",
  "monitory-i-naushniki": "beginner",
  "miksherniy-pult-i-marshrutizaciya": "intermediate",
  "sistema-zvukousilenia-pa": "beginner",
  "di-boksy-i-kommutaciya": "intermediate",
  "monitoring-na-scene": "intermediate",
  "midi-i-sintezatory": "intermediate",
  "domashnyaya-studiya-uglublyonno": "intermediate",
  "daw-cifrovaya-rabochaya-stanciya": "beginner",
  "zapis-gitary-v-studii": "intermediate",
  "zapis-vokala-i-instrumentov": "intermediate",
  "redaktirovanie-audio": "beginner",
  "ekvalizaciya": "intermediate",
  "kompressiya": "intermediate",
  "reverb-i-diley-v-mikse": "intermediate",
  "svedenie-mixing": "intermediate",
  "mastering": "intermediate",
  "publikaciya-i-distribuciya": "beginner",
  // BASS
  "ustrojstvo-bas-gitary": "beginner",
  "tehnika-pravoj-ruki-na-basu": "beginner",
  "tehnika-levoj-ruki-na-basu": "beginner",
  "ritm-i-gruv-na-basu": "beginner",
  "postroenie-basovyh-linij": "intermediate",
  "slep-bas": "intermediate",
  "bas-i-garmoniya": "intermediate",
  "rol-basa-v-ansemble": "beginner",
  "stili-na-bas-gitare": "intermediate",
  "rasshirennyj-diapazon-i-effekty-dlya-basa": "advanced",
  "velikie-bassisty": "beginner",
  // DRUMS
  "ustrojstvo-udarnoj-ustanovki": "beginner",
  "posadka-i-postanovka-za-barabanami": "beginner",
  "tehnika-ruk-za-barabanami": "beginner",
  "tekhnika-nog-za-barabanami": "beginner",
  "rudimenty": "beginner",
  "osnovnye-gruvy": "beginner",
  "filly-i-perekhody": "intermediate",
  "rabota-s-metronomom-i-klik-trekom": "beginner",
  "ritmicheskie-risunki-i-sinkopaciya": "intermediate",
  "nechyotnye-razmery-na-barabanah": "advanced",
  "stili-na-barabanah": "intermediate",
  "barabannaya-notaciya-i-chtenie": "intermediate",
  "zapis-i-elektronnye-barabany": "intermediate",
};

const allLessons: LessonSeed[] = [
  ...lessons1to3,
  ...lessons4to6,
  ...lessons7to9,
  ...lessons10to12,
  ...lessons13to15,
  ...lessons16to17,
  ...lesson18,
  ...lesson19,
  ...lesson20,
  ...lesson21,
  ...lesson22,
  ...lesson23,
  ...lesson24,
  ...lesson25,
  ...lesson26,
  ...lesson27,
  ...lesson28,
  ...lesson29,
  ...lesson30,
  ...lesson31,
  ...lesson32,
  ...lesson33,
  ...lesson34,
  ...lesson35,
  ...lesson36,
  ...lesson37,
  ...lesson38,
  ...lesson39,
  ...lesson40,
  ...lesson41,
  ...lesson42,
  ...lesson43,
  ...lesson44,
  ...lesson45,
  ...lesson46,
  ...lesson47,
  ...lesson48,
  ...lesson49,
  ...lesson50,
  ...lesson51,
  ...lesson52,
  ...lesson53,
  ...lesson54,
  ...lesson55,
  ...lesson56,
  ...lesson57,
  ...lesson58,
  ...lesson59,
  ...lesson60,
  ...lesson61,
  ...lesson62,
  ...lesson63,
  ...lesson64,
  ...lesson65,
  ...lesson66,
  ...lesson67,
  ...lesson68,
  ...lesson69,
  ...lesson70,
  ...lesson71,
  ...lesson72,
  ...lesson73,
  ...lesson74,
  ...lesson75,
  ...lesson76,
  ...lesson77,
  ...lesson78,
  ...lesson79,
  ...lesson80,
  ...lesson81,
  ...lesson82,
  ...lesson83,
  ...lesson84,
  ...lesson85,
  ...lesson86,
  ...lesson87,
  ...lesson88,
  ...lesson89,
  ...lesson90,
  ...lesson91,
  ...lesson92,
  ...lesson93,
  ...lesson94,
  ...lesson95,
  ...lesson96,
  ...lesson97,
  ...lesson98,
  ...lesson99,
  ...lesson100,
  ...lesson101,
  ...lesson102,
];

export default allLessons;
