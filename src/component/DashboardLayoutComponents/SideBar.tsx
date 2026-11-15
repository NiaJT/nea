import React, { useMemo, useState } from "react";
import { useLocation, Link } from "react-router";
import { MdOutlineDashboard } from "react-icons/md";
import {
  FiFolder,
  FiFileText,
  // FiShield,
  // FiTool,
  // FiDollarSign,
  // FiCalendar,
  // FiBox,
  // FiList,
  // FiBarChart2,
  // FiBell,
  FiUsers,
  FiKey,
  FiBriefcase,
  // FiGitBranch,
  // FiSliders,
  // FiActivity,
  // FiSettings,
  // FiLock,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { useMe } from "@/action/useAuth";
import { getInitials } from "@/utils/user";

interface NavItemData {
  name: string;
  icon?: React.ReactNode;
  path: string;
  alsoActiveFor?: string[];
  adminOnly?: boolean;
}

interface NavGroupData {
  name: string;
  icon: React.ReactNode;
  children: NavItemData[];
}

type NavEntry = NavItemData | NavGroupData;

const isGroup = (entry: NavEntry): entry is NavGroupData => "children" in entry;

const mainNav: NavEntry[] = [
  { name: "Dashboard", icon: <MdOutlineDashboard size={18} />, path: "/" },
  {
    name: "Project",
    icon: <FiFolder size={18} />,
    children: [
      { name: "Project", path: "/projects", alsoActiveFor: ["/packages"] },
      { name: "Package Type", path: "/package-type", adminOnly: true },
    ],
  },
  {
    name: "Document",
    icon: <FiFileText size={18} />,
    children: [
      { name: "Documents", path: "/documents" },
      { name: "Document Tracking", path: "/documents-tracking" },

      { name: "Document Type", path: "/document-type", adminOnly: true },
      {
        name: "Document Category",
        path: "/document-category",
        adminOnly: true,
      },
    ],
  },
  // { name: "Safeguards", icon: <FiShield size={18} />, path: "/safeguards" },
  // { name: "Construction", icon: <FiTool size={18} />, path: "/construction" },
  // {
  //   name: "Contracts & Finance",
  //   icon: <FiDollarSign size={18} />,
  //   path: "/contracts",
  // },
  // { name: "Meeting", icon: <FiCalendar size={18} />, path: "/meeting" },
  // { name: "Resources", icon: <FiBox size={18} />, path: "/resources" },
  // { name: "Master List", icon: <FiList size={18} />, path: "/master-list" },
  // { name: "Reports", icon: <FiBarChart2 size={18} />, path: "/reports" },
  // {
  //   name: "Notifications",
  //   icon: <FiBell size={18} />,
  //   path: "/notifications",
  // },
];

const adminNav: NavItemData[] = [
  { name: "Users", icon: <FiUsers size={18} />, path: "/users" },
  { name: "Roles & Permissions", icon: <FiKey size={18} />, path: "/roles" },
  {
    name: "Organization",
    icon: <FiBriefcase size={18} />,
    path: "/organizations",
  },
  // { name: "Workflows", icon: <FiGitBranch size={18} />, path: "/workflows" },
  // {
  //   name: "Notification Rules",
  //   icon: <FiSliders size={18} />,
  //   path: "/notification-rules",
  // },
  // { name: "Audit Logs", icon: <FiActivity size={18} />, path: "/audit-logs" },
  // {
  //   name: "System Setting",
  //   icon: <FiSettings size={18} />,
  //   path: "/system-settings",
  // },
  // {
  //   name: "Change Password",
  //   icon: <FiLock size={18} />,
  //   path: "/change-Password",
  // },
];

const matchesPath = (currentPath: string, itemPath: string) =>
  itemPath === "/"
    ? currentPath === "/"
    : currentPath === itemPath || currentPath.startsWith(`${itemPath}/`);

const isItemActive = (currentPath: string, item: NavItemData) =>
  matchesPath(currentPath, item.path) ||
  (item.alsoActiveFor ?? []).some((p) => matchesPath(currentPath, p));

const Sidebar: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { data: user, isLoading } = useMe();
  const roleLabel = user?.roles?.join(", ");

  const [toggled, setToggled] = useState<Record<string, boolean>>({});

  const isGroupOpen = (group: NavGroupData) =>
    toggled[group.name] ??
    group.children.some((child) => isItemActive(currentPath, child));

  const toggleGroup = (group: NavGroupData) =>
    setToggled((prev) => ({ ...prev, [group.name]: !isGroupOpen(group) }));

  const isAdminUser =
    !!user &&
    (user.roles?.includes("SYSTEM_ADMIN") || user.organization?.type === "NEA");

  const visibleMainNav = useMemo(
    () =>
      mainNav.map((entry) =>
        isGroup(entry)
          ? {
              ...entry,
              children: entry.children.filter(
                (c) => !c.adminOnly || isAdminUser,
              ),
            }
          : entry,
      ),
    [isAdminUser],
  );

  return (
    <aside className="w-65 h-screen bg-[#0E2E4A] text-cyan-50 flex flex-col font-sans text-sm shrink-0">
      {/* Logo Section - Fixed at top */}
      <div className="flex h-16 items-center gap-3 border-b border-white/20 px-5 shrink-0">
        <div className="w-8 h-8 bg-[#D9D9D9] text-slate-900 rounded-full flex items-center justify-center text-xs">
          NEA
        </div>
        <div className="text-white font-semibold text-base tracking-wide">
          PMS
        </div>
      </div>

      {/* Scrollable Navigation Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar mt-6">
        {/* Main Navigation Section */}
        <div className="flex flex-col px-3 gap-1">
          {visibleMainNav.map((entry) =>
            isGroup(entry) ? (
              <NavGroup
                key={entry.name}
                group={entry}
                isOpen={isGroupOpen(entry)}
                onToggle={() => toggleGroup(entry)}
                currentPath={currentPath}
              />
            ) : (
              <NavItem
                key={entry.path}
                item={entry}
                isActive={isItemActive(currentPath, entry)}
              />
            ),
          )}
        </div>

        {/* Administration Header Section */}
        {isAdminUser && (
          <>
            <div className="px-6 pt-6 pb-2 text-[16px] font-normal leading-7 tracking-normal text-cyan-700">
              ADMINISTRATION
            </div>
            <div className="flex flex-col px-3 gap-1 pb-4">
              {adminNav.map((item) => (
                <NavItem
                  key={item.path}
                  item={item}
                  isActive={isItemActive(currentPath, item)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* User Profile Footer Section - Fixed at bottom */}
      <div className="p-4 shrink-0">
        <div className="flex items-center gap-3 p-2.5 rounded-[8px] border border-white/10 bg-cyan-800">
          {isLoading ? (
            <>
              <div className="w-9 h-9 shrink-0 rounded-full bg-cyan-700 animate-pulse" />
              <div className="flex flex-1 flex-col gap-2">
                <div className="h-3 w-24 rounded bg-cyan-700 animate-pulse" />
                <div className="h-3 w-16 rounded bg-cyan-700 animate-pulse" />
              </div>
            </>
          ) : (
            <>
              <div className="w-9 h-9 shrink-0 rounded-full bg-black flex items-center justify-center text-xs font-medium text-white">
                {getInitials(user?.fullName)}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span
                  className="text-cyan-50 text-[13px] truncate"
                  title={user?.email}
                >
                  {user?.fullName ?? "Unknown user"}
                </span>
                <span
                  className="text-cyan-600 text-[13px] truncate"
                  title={roleLabel}
                >
                  {roleLabel || "No role assigned"}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1E3A5F;
          border-radius: 5px;
        }
      `,
        }}
      />
    </aside>
  );
};

// Collapsible group with up/down chevron
interface NavGroupProps {
  group: NavGroupData;
  isOpen: boolean;
  onToggle: () => void;
  currentPath: string;
}

const NavGroup: React.FC<NavGroupProps> = ({
  group,
  isOpen,
  onToggle,
  currentPath,
}) => {
  const hasActiveChild = group.children.some((child) =>
    isItemActive(currentPath, child),
  );

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className={`group flex w-full items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-left
          ${
            hasActiveChild
              ? "bg-white/10 text-white"
              : "hover:bg-white/5 hover:text-white"
          }
        `}
      >
        <div
          className={`flex items-center justify-center shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-1 ${
            hasActiveChild
              ? "text-white"
              : "text-[#B0C4DE] group-hover:text-white"
          }`}
        >
          {group.icon}
        </div>

        <span className="truncate transition-transform duration-200 ease-out group-hover:translate-x-1">
          {group.name}
        </span>

        {isOpen ? (
          <FiChevronUp size={16} className="ml-auto shrink-0" />
        ) : (
          <FiChevronDown size={16} className="ml-auto shrink-0" />
        )}
      </button>

      {isOpen && (
        <div className="ml-6 flex flex-col gap-1 pl-3">
          {group.children.map((child) => (
            <NavItem
              key={child.path}
              item={child}
              isActive={isItemActive(currentPath, child)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Reusable Navigation Item Component
interface NavItemProps {
  item: NavItemData;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ item, isActive }) => {
  return (
    <Link
      to={item.path}
      className={`group flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors relative
        ${
          isActive
            ? "bg-linear-to-r from-[#155E75] to-[#155E75] text-white"
            : "hover:bg-white/5 hover:text-white"
        }
      `}
    >
      {item.icon && (
        <div
          className={`flex items-center justify-center shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-1 ${
            isActive ? "text-white" : "text-[#B0C4DE] group-hover:text-white"
          }`}
        >
          {item.icon}
        </div>
      )}

      <span className="truncate transition-transform duration-200 ease-out group-hover:translate-x-1">
        {item.name}
      </span>

      {isActive && (
        <HiOutlineArrowNarrowRight size={18} className="ml-auto text-white" />
      )}
    </Link>
  );
};

export default Sidebar;
