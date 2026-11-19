import {
  Baby,
  Bike,
  BookOpen,
  Briefcase,
  Car,
  Dumbbell,
  HeartPulse,
  Home,
  Leaf,
  PawPrint,
  ShoppingCart,
  Sparkles,
  Tag,
  Utensils
} from "lucide-react";

export const CATEGORY_ICONS = [
  "Home",
  "HeartPulse",
  "Utensils",
  "Dumbbell",
  "Briefcase",
  "BookOpen",
  "ShoppingCart",
  "Car",
  "Leaf",
  "PawPrint",
  "Baby",
  "Bike",
  "Sparkles",
  "Tag"
] as const;

const map = { Home, HeartPulse, Utensils, Dumbbell, Briefcase, BookOpen, ShoppingCart, Car, Leaf, PawPrint, Baby, Bike, Sparkles, Tag };

export function CategoryIcon({ name, size = 17 }: { name: string; size?: number }) {
  const Icon = map[name as keyof typeof map] || Tag;
  return <Icon size={size} strokeWidth={1.8} />;
}
