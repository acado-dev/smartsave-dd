import { Sun, Moon, Sparkles, MousePointerClick, Trash2, RefreshCw, CheckSquare } from "lucide-react";
import f1d from "@/assets/newfeaturehht/feature1_dark.jpg";
import f1l from "@/assets/newfeaturehht/feature1_light.jpg";
import f2d from "@/assets/newfeaturehht/feature2_dark.jpg";
import f2l from "@/assets/newfeaturehht/feature2_light.jpg";
import f3d from "@/assets/newfeaturehht/feature3_dark.jpg";
import f3l from "@/assets/newfeaturehht/feature3_light.jpg";
import f4d from "@/assets/newfeaturehht/feature4_dark.jpg";
import f4l from "@/assets/newfeaturehht/feature4_light.jpg";
import f5d from "@/assets/newfeaturehht/feature5_dark.jpg";
import f5l from "@/assets/newfeaturehht/feature5_light.jpg";

export type Slide = {
  kicker: string;
  title: string;
  summary: string;
  bullets: { icon: any; text: string }[];
  dark: string;
  light: string;
};

export const slides: Slide[] = [
  {
    kicker: "Feature 01 · Theming",
    title: "Login Screen with Light & Dark Mode",
    summary:
      "Operators can now choose the theme that works best for their store environment — bright aisles or dim back-rooms — right from the login screen.",
    bullets: [
      { icon: Sun, text: "New Light Mode for well-lit retail floors and daytime shifts" },
      { icon: Moon, text: "Refined Dark Mode for back-of-store and low-light use" },
      { icon: Sparkles, text: "Consistent ITHINA COMMAND branding across both themes" },
    ],
    dark: f1d,
    light: f1l,
  },
  {
    kicker: "Feature 02 · Dashboard",
    title: "Interactive Dashboard with Live ESL KPIs",
    summary:
      "The handheld now opens to a dashboard surfacing the three numbers operators care about most — and every tile is clickable to drill into the underlying list.",
    bullets: [
      { icon: MousePointerClick, text: "Click Online / Offline / Low-Battery tiles to drill in" },
      { icon: Sparkles, text: "Real-time counts in both Dark and Light modes" },
      { icon: CheckSquare, text: "Direct path from KPI to bulk action — fewer taps" },
    ],
    dark: f2d,
    light: f2l,
  },
  {
    kicker: "Feature 03 · Offline ESLs",
    title: "Offline ESLs Listing with Inline Actions",
    summary:
      "Each offline label can be refreshed or deleted in place — no more navigating away to perform a single corrective action.",
    bullets: [
      { icon: RefreshCw, text: "Inline Refresh attempts re-connection instantly" },
      { icon: Trash2, text: "Inline Delete removes stale or decommissioned labels" },
      { icon: Sparkles, text: "Available in both Dark and Light themes" },
    ],
    dark: f3d,
    light: f3l,
  },
  {
    kicker: "Feature 04 · Bulk Operations",
    title: "Multi-Select with Bulk Refresh & Bulk Delete",
    summary:
      "Operators can now select many offline displays at once and run a single bulk action — eliminating the tedious one-by-one process called out by the customer.",
    bullets: [
      { icon: CheckSquare, text: "Multi-select checkboxes on the Offline Displays list" },
      { icon: RefreshCw, text: "Bulk Refresh re-syncs every selected label in one tap" },
      { icon: Trash2, text: "Bulk Delete clears decommissioned labels in seconds" },
    ],
    dark: f4d,
    light: f4l,
  },
  {
    kicker: "Feature 05 · Reference",
    title: "ESL Operations — Assign & Multi-Assign",
    summary:
      "Reference screens showing the refined Assign and Multi-Assign workflows, including queued items and success / error filtering.",
    bullets: [
      { icon: Sparkles, text: "Scan-and-queue flow for product to display assignment" },
      { icon: CheckSquare, text: "Multi-Assign with All / Success / Error result filters" },
      { icon: RefreshCw, text: "Consistent operations toolbar across actions" },
    ],
    dark: f5d,
    light: f5l,
  },
];
