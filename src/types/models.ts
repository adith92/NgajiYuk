export interface IslamicContentItem {
  id: string;
  title: string;
  arabic: string;
  latin: string;
  translation: string;
  audioText: string;
  audioUrl?: string;
  needsReview?: boolean;
  category?: string;
}

export interface HijaiyahItem {
  id: string;
  name: string;
  arabic: string;
  color: string;
  audioUrl?: string;
  audioText: string;
}
