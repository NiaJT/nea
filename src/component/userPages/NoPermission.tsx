import { FiLock } from "react-icons/fi";

interface NoPermissionProps {
  message?: string;
}

const NoPermission = ({
  message = "You don't have permission to view this data.",
}: NoPermissionProps) => (
  <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white px-6 py-10 text-center">
    <div className="flex size-12 items-center justify-center rounded-full bg-slate-100">
      <FiLock className="size-5 text-slate-500" />
    </div>
    <p className="text-base font-semibold text-slate-900">Access denied</p>
    <p className="text-sm text-[#6E8295]">{message}</p>
  </div>
);

export default NoPermission;
