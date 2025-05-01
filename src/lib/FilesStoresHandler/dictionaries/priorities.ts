export type PrioritiesDictionary = {
  id: number | string;
  name: string;
  priority: number;
};

export type PrioritiesValues =
  | "LOW"
  | "LOW-MEDIUM"
  | "MEDIUM"
  | "MEDIUM-HIGH"
  | "HIGH"
  | "IMPORTANT"
  | "URGENT";

export const PRIORITIES_DICTIONARY: Record<number, PrioritiesDictionary> = {
  1: {
    id: 1,
    name: "LOW",
    priority: 1,
  },
  2: {
    id: 2,
    name: "LOW-MEDIUM",
    priority: 2,
  },
  3: {
    id: 3,
    name: "MEDIUM",
    priority: 3,
  },
  4: {
    id: 4,
    name: "MEDIUM-HIGH",
    priority: 4,
  },
  5: {
    id: 5,
    name: "HIGH",
    priority: 5,
  },
  6: {
    id: 6,
    name: "IMPORTANT",
    priority: 6,
  },
  7: {
    id: 7,
    name: "URGENT",
    priority: 7,
  },
};
