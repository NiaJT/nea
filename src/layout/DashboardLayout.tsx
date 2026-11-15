import { useMe } from "@/action/useAuth";
import Header from "@/component/DashboardLayoutComponents/Header";
import Sidebar from "@/component/DashboardLayoutComponents/SideBar";
import { cn } from "@/lib/utils";
import { Outlet } from "react-router";

const DashboardLayout: React.FC = () => {
  const { data: user } = useMe();
  const locked = Boolean(user?.mustChangePassword);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F4F6F8]">
      {/* Sidebar */}
      <div
        inert={locked}
        aria-disabled={locked}
        className={cn(
          "h-full shrink-0",
          locked && "pointer-events-none select-none opacity-60",
        )}
      >
        <Sidebar />
      </div>

      {/* Right side */}
      <div className="flex h-full flex-1 flex-col overflow-hidden">
        <div
          inert={locked}
          aria-disabled={locked}
          className={cn(
            "shrink-0",
            locked && "pointer-events-none select-none opacity-60",
          )}
        >
          <Header />
        </div>

        <main className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-[#F6F9FB] px-8 py-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
