import { lessons1to3 } from "./seed/lessons-01-03";
import { lessons4to6 } from "./seed/lessons-04-06";
import { lessons7to9 } from "./seed/lessons-07-09";
import { lessons10to12 } from "./seed/lessons-10-12";
import { lessons13to15 } from "./seed/lessons-13-15";
import { lessons16to17 } from "./seed/lessons-16-17";

export type LessonSeed = {
  title: string;
  slug: string;
  description: string;
  instrument: "GUITAR" | "GENERAL";
  order: number;
  topics: {
    title: string;
    slug: string;
    description: string;
    blocks: string[];
  }[];
};

const allLessons: LessonSeed[] = [
  ...lessons1to3,
  ...lessons4to6,
  ...lessons7to9,
  ...lessons10to12,
  ...lessons13to15,
  ...lessons16to17,
];

export default allLessons;
