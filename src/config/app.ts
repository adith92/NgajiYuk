import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BookA,
  BookHeart,
  Gamepad2,
  Home,
  MoonStar,
  ShieldCheck,
  Star,
  Trophy,
} from "lucide-react";
import type { MenuTone } from "@/components/MenuCard";

export interface FamilyProfile {
  uid: string;
  name: string;
  avatar: string;
  label: string;
  cardClass: string;
  avatarClass: string;
}

export interface AppNavigationItem {
  label: string;
  icon: LucideIcon;
  href: string;
}

export interface LearningModuleConfig {
  id: "hijaiyah" | "doa" | "sholat" | "kuis" | "gamezone" | "progress";
  title: string;
  description: string;
  eyebrow: string;
  href: string;
  icon: LucideIcon;
  tone: MenuTone;
}

export const FAMILY_PROFILES: readonly FamilyProfile[] = [
  {
    uid: "abeel-uid",
    name: "Abeel",
    avatar: "👦",
    label: "Sobat Hijaiyah",
    cardClass: "border-sky-200 bg-sky-50 hover:border-sky-400",
    avatarClass: "from-sky-300 to-blue-500",
  },
  {
    uid: "emily-uid",
    name: "Emily",
    avatar: "👧",
    label: "Sobat Doa",
    cardClass: "border-pink-200 bg-pink-50 hover:border-pink-400",
    avatarClass: "from-pink-300 to-rose-500",
  },
  {
    uid: "emier-uid",
    name: "Emier",
    avatar: "👶",
    label: "Sobat Kuis",
    cardClass: "border-emerald-200 bg-emerald-50 hover:border-emerald-400",
    avatarClass: "from-emerald-300 to-teal-500",
  },
  {
    uid: "bunda-uma-uid",
    name: "Bunda Uma",
    avatar: "🧕",
    label: "Pembimbing",
    cardClass: "border-violet-200 bg-violet-50 hover:border-violet-400",
    avatarClass: "from-violet-300 to-purple-600",
  },
] as const;

export const PRIMARY_NAVIGATION: readonly AppNavigationItem[] = [
  { label: "Beranda", icon: Home, href: "/dashboard" },
  { label: "Belajar", icon: BookHeart, href: "/hijaiyah" },
  { label: "Favorit", icon: Star, href: "/doa" },
  { label: "Kuis", icon: Trophy, href: "/kuis" },
  { label: "Game", icon: Gamepad2, href: "/gamezone" },
  { label: "Progress", icon: BarChart3, href: "/progress" },
] as const;

export const LEARNING_MODULES: readonly LearningModuleConfig[] = [
  {
    id: "hijaiyah",
    title: "Hijaiyah",
    description: "Belajar huruf Arab, dengarkan audio, dan tandai progresmu.",
    eyebrow: "Belajar huruf Arab",
    href: "/hijaiyah",
    icon: BookA,
    tone: "green",
  },
  {
    id: "doa",
    title: "Doa Harian",
    description: "Dengarkan, ucapkan, dan hafalkan doa untuk kegiatan sehari-hari.",
    eyebrow: "Doa sehari-hari",
    href: "/doa",
    icon: MoonStar,
    tone: "pink",
  },
  {
    id: "sholat",
    title: "Bacaan Sholat",
    description: "Pelajari urutan bacaan sholat lengkap dengan latin dan arti.",
    eyebrow: "Niat & bacaan",
    href: "/sholat",
    icon: ShieldCheck,
    tone: "blue",
  },
  {
    id: "kuis",
    title: "Kuis Hijaiyah",
    description: "Uji pemahaman, raih skor tinggi, dan dapatkan waktu bermain.",
    eyebrow: "Uji pemahaman",
    href: "/kuis",
    icon: Trophy,
    tone: "yellow",
  },
  {
    id: "gamezone",
    title: "Game Zone",
    description: "Gunakan reward dari kuis untuk bermain sambil melatih fokus.",
    eyebrow: "Reward belajar",
    href: "/gamezone",
    icon: Gamepad2,
    tone: "purple",
  },
  {
    id: "progress",
    title: "Progress & Poin",
    description: "Lihat pencapaian setiap modul dan perkembangan belajar.",
    eyebrow: "Lihat perkembangan",
    href: "/progress",
    icon: BarChart3,
    tone: "cyan",
  },
] as const;
