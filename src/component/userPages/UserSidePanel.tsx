import { FiPlus } from "react-icons/fi";
import { Badge } from "@/components/ui/badge";
import LightButton from "@/component/common/LightButton";
import { ORG_STYLES, type Org } from "../tableColumns/userColumns";
import { cn } from "@/lib/utils";
import type { IUser } from "@/type/user.type";
import { getInitials } from "@/utils/user";

interface UserSidePanelProps {
  user: IUser;
  active: boolean;
  showProfile?: boolean;
  onResendActivation: () => void;
  onResetPassword: () => void;
  onDeactivate: () => void;
}

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-lg border border-gray-200 bg-white p-6">
    {children}
  </div>
);

const InfoRow = ({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) => (
  <div className="flex items-center justify-between gap-4 text-xs">
    <span className="text-gray-400">{label}</span>
    <span className={cn("text-right text-gray-400", valueClassName)}>
      {value}
    </span>
  </div>
);

const actionClass =
  "h-10 justify-start gap-3 rounded-lg border-gray-300 px-3 text-gray-700 hover:bg-gray-50 hover:text-gray-700";

const UserSidePanel = ({
  user,
  active,
  showProfile = true,
  onResendActivation,
  onResetPassword,
  onDeactivate,
}: UserSidePanelProps) => {
  return (
    <aside className="flex flex-col gap-6">
      {/* Profile */}
      {showProfile && (
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 shrink-0 rounded-full bg-black flex items-center justify-center text-xs font-medium text-white">
              {getInitials(user?.fullName)}
            </div>
            <div>
              <p className="text-sm font-medium text-black">{user.fullName}</p>
              <p className="text-sm text-gray-500">{user.username ?? "-"}</p>
            </div>
          </div>

          <div className="mt-3 flex gap-3">
            {user.organizationName && (
              <Badge
                variant="secondary"
                className={`rounded-full px-3 py-1 text-xs font-normal ${
                  ORG_STYLES[user.organizationName as Org] ??
                  "border-gray-100 bg-gray-50 text-gray-700"
                }`}
              >
                {user.organizationName}
              </Badge>
            )}
            <Badge
              className={`rounded-full px-3 py-1 text-xs font-normal shadow-none ${
                active
                  ? "bg-green-100 text-green-700 hover:bg-green-100"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-100"
              }`}
            >
              {active ? "Active" : "Inactive"}
            </Badge>
          </div>

          <div className="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4">
            <InfoRow label="Created On" value={"-"} />
            <InfoRow label="Created By" value={"-"} />
          </div>
        </Card>
      )}

      <Card>
        <h3 className="text-lg font-semibold text-black">Account Actions</h3>
        <div className="mt-6 flex flex-col gap-3">
          <LightButton
            icon={FiPlus}
            className={actionClass}
            onClick={onResendActivation}
          >
            Resend Activation
          </LightButton>
          <LightButton
            icon={FiPlus}
            className={actionClass}
            onClick={onResetPassword}
          >
            Reset Password
          </LightButton>
          <LightButton
            icon={FiPlus}
            className="h-10 justify-start gap-3 rounded-lg border-[#F69194] px-3 text-[#AD241F] hover:bg-red-50 hover:text-red-800"
            onClick={onDeactivate}
          >
            {active ? "Deactivate Account" : "Activate Account"}
          </LightButton>
        </div>
      </Card>

      {/* Audit info */}
      <Card>
        <h3 className="text-lg font-semibold text-black">Audit Info</h3>
        <div className="mt-6 flex flex-col gap-2.5">
          <InfoRow label="Created On" value={"-"} valueClassName="text-black" />
          <InfoRow label="Created By" value={"-"} valueClassName="text-black" />
          <InfoRow
            label="Last Modified"
            value={"-"}
            valueClassName="text-black"
          />
          <InfoRow
            label="Modified By"
            value={"-"}
            valueClassName="text-black"
          />
          <InfoRow
            label="Last Login"
            value={user.lastLogin ?? "Never"}
            valueClassName="text-black"
          />
        </div>
      </Card>
    </aside>
  );
};

export default UserSidePanel;
