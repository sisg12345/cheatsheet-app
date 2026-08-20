export type ItemStatus = "normal" | "info" | "warning" | "danger";

export interface SourceLink {
  label: string;
  url: string;
}

export interface CheatSheetItem {
  id: string;
  label: string;
  syntax?: string;
  description: string;
  note?: string;
  keywords?: string[];
  status?: ItemStatus;
}

export interface CheatSheetSection {
  id: string;
  title: string;
  description?: string;
  items: CheatSheetItem[];
}

export interface CheatSheet {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  eyebrow: string;
  accent: string;
  keywords: string[];
  sections: CheatSheetSection[];
  sources: SourceLink[];
  updatedAt: string;
}

export interface CheatSheetSummary {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  eyebrow: string;
  accent: string;
  keywords: string[];
  sectionCount: number;
  itemCount: number;
}
