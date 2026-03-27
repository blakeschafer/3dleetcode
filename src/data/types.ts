export interface Problem {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  pattern: string;
  url: string;
  summary: string;
  hints: string[];
  visualizerSlug?: string;
  listMembership: string[];
}

export interface ExternalLink {
  title: string;
  url: string;
  type: "video" | "article" | "course";
}

export interface StudyGuide {
  slug: string;
  title: string;
  category: string;
  icon: string;
  overview: string;
  whenToUse: string[];
  approach: string;
  codeTemplate: string;
  relatedProblems: number[];
  externalLinks: ExternalLink[];
}

export interface SolvedEntry {
  solvedAt: string;
  difficulty: "Easy" | "Medium" | "Hard";
  timeMinutes?: number;
  notes?: string;
}

export interface TrackerData {
  solvedProblems: Record<number, SolvedEntry>;
  dailyGoal: number;
}
