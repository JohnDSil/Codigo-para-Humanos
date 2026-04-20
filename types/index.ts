// types/index.ts

export type Level = "nino" | "junior" | "senior";
export type Mode = "explicar" | "depurar";

export interface ExplainRequest {
  code: string;
  level: Level;
  language?: string;
  mode?: Mode;
}

export interface ExplanationResult {
  simple: string;
  tecnico: string;
  mejoras: string[];
  lenguajeDetectado: string;
}

export interface SnippetHistoryItem {
  id: string;
  code: string;
  language: string;
  level: Level;
  mode: Mode;
  result: ExplanationResult;
  creadoEn: string;
}

export const LEVEL_LABELS: Record<Level, string> = {
  nino: "Niño 🍼",
  junior: "Junior 🧑‍💻",
  senior: "Senior ⚡",
};

export const MODE_LABELS: Record<Mode, string> = {
  explicar: "Explicar 💡",
  depurar: "Depurar 🐛",
};

export const SUPPORTED_LANGUAGES = [
  "auto",
  "python",
  "javascript",
  "typescript",
  "go",
  "rust",
  "java",
  "c",
  "cpp",
  "ruby",
  "php",
  "swift",
  "kotlin",
  "bash",
  "sql",
] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
