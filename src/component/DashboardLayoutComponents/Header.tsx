import React, { useState, useRef, useEffect } from "react";
import { useLogout, useMe } from "@/action/useAuth";
import { getInitials } from "@/utils/user";
import { LuBellDot, LuChevronDown, LuLogOut } from "react-icons/lu";

const Header: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { mutate: logout, isPending } = useLogout();
  const { data: user, isLoading } = useMe();
  const roleLabel = user?.roles?.join(", ");

  const handleLogout = () => logout();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-6 shrink-0">
      {/* Breadcrumb slot (filled by PageBreadcrumb via portal) */}
      <div
        id="header-breadcrumb"
        className="min-w-0 flex-1 overflow-hidden pr-4"
      />

      {/* Right Side Container */}
      <div className="flex shrink-0 items-center gap-4">
        <button className="relative p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-full hover:bg-gray-100 cursor-pointer">
          <LuBellDot size={20} className="text-black" />
        </button>

        {/* Vertical Divider */}
        <div className="w-px h-8 bg-gray-400 mx-1"></div>

        {/* User Profile Dropdown */}
        <div className="relative cursor-pointer" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="flex items-center cursor-pointer gap-3 hover:bg-gray-50 p-1.5 rounded-lg transition-colors"
          >
            {/* Avatar */}
            {isLoading ? (
              <div className="w-9 h-9 shrink-0 rounded-full bg-gray-200 animate-pulse" />
            ) : (
              <div className="w-9 h-9 shrink-0 rounded-full bg-black flex items-center justify-center text-xs font-medium text-white">
                {getInitials(user?.fullName)}
              </div>
            )}

            {/* User Info */}
            <div className="hidden md:flex flex-col items-start">
              {isLoading ? (
                <>
                  <div className="h-3 w-24 rounded bg-gray-200 animate-pulse" />
                  <div className="mt-1.5 h-2.5 w-16 rounded bg-gray-200 animate-pulse" />
                </>
              ) : (
                <>
                  <span
                    className="max-w-40 truncate text-[13px] font-semibold text-gray-800 leading-tight"
                    title={user?.email}
                  >
                    {user?.fullName ?? "Unknown user"}
                  </span>
                  <span
                    className="max-w-40 truncate text-[11px] text-gray-500 leading-tight"
                    title={roleLabel}
                  >
                    {roleLabel || "No role assigned"}
                  </span>
                </>
              )}
            </div>

            <LuChevronDown
              size={16}
              className={`text-gray-400 ml-1 transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 cursor-pointer">
              <button
                onClick={handleLogout}
                disabled={isPending}
                className="w-full flex items-center gap-2 px-4 py-2 text-[14px] text-red-600 cursor-pointer hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LuLogOut size={16} className="cursor-pointer" />
                <span>{isPending ? "Logging out..." : "Logout"}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
