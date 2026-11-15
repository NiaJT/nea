import type { IconType } from "react-icons";
import { LuScanSearch, LuFileUser, LuFileLock2 } from "react-icons/lu";
import { TbFiles } from "react-icons/tb";

export type AuthVariant = "login" | "forgot" | "reset";

interface AuthContent {
  titleLines: string[];
  description: string;
  cards: { title: string; icon: IconType }[];
}

const LOREM =
  "Lorem ipsum dolor sit amet consectetur. Montes gravida vitae nec leo et ut. Nisl sit.Lorem ipsum dolor sit amet consectetur. Montes gravida vitae nec leo et ut. Nisl sit.Lorem ipsum dolor sit amet consectetur. Montes gravida vitae nec leo et ut. Nisl sit.";

const securityCard = {
  title:
    "For security, password reset link expire after a limited time and can be only used once.",
  icon: LuScanSearch,
};

export const authContent: Record<AuthVariant, AuthContent> = {
  login: {
    titleLines: ["Project", "Management", "System (PMS)"],
    description: LOREM,
    cards: [
      { title: "Project & Package Tracking", icon: LuScanSearch },
      { title: "Safeguards & Compliance", icon: LuFileUser },
      { title: "Contracts & Finance", icon: LuFileLock2 },
      { title: "Multi-Organization Access", icon: TbFiles },
    ],
  },
  forgot: {
    titleLines: ["Account Recovery"],
    description: LOREM,
    cards: [securityCard],
  },
  reset: {
    titleLines: ["Set a New", "Password"],
    description: LOREM,
    cards: [securityCard],
  },
};
