import { Link } from "react-router";
import { FiArrowRight } from "react-icons/fi";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WorkItem {
  id: string;
  title: string;
  project: string;
  pkg: string;
  due: string;
  href: string;
}

const WORK_ITEMS: WorkItem[] = [
  {
    id: "1",
    title: "Review drawing revision D-04",
    project: "Koshi Corridor",
    pkg: "PKG-02",
    due: "26 Sep 2026",
    href: "/",
  },
  {
    id: "2",
    title: "Verify corrective action CAR-021",
    project: "Upper Tamakoshi",
    pkg: "PKG-01",
    due: "29 Sep 2026",
    href: "/",
  },
  {
    id: "3",
    title: "APBG guarantee expiring in 12 days",
    project: "Upper Tamakoshi",
    pkg: "PKG-01",
    due: "10 Oct 2026",
    href: "/",
  },
];

const PriorityWorkQueue = () => {
  return (
    <Card className="rounded-[12px] border-[#E1E9F1] bg-white shadow-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 pt-2">
        <CardTitle className="text-base font-bold text-[#17283C]">
          Priority work queue
        </CardTitle>
        <Badge className="rounded-full border-0 bg-[#FCE9E9] px-2 py-1 text-xs font-normal text-[#AA3B42] shadow-none hover:bg-red-100">
          Time sensitive
        </Badge>
      </CardHeader>

      <CardContent className="px-6 pt-0">
        <ul className="divide-y divide-slate-100 border-t border-[#ECF1F5]">
          {WORK_ITEMS.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-4 py-3.5"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-[#17283C]">
                  {item.title}
                </p>
                <p className="mt-0.5 truncate text-[13px] text-[#728497]">
                  {item.project} · {item.pkg} · Due {item.due}
                </p>
              </div>
              <Link
                to={item.href}
                className="flex shrink-0 items-center gap-1 text-xs font-bold text-[#126BA3] hover:underline"
              >
                View
                <FiArrowRight className="size-3.5" />
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default PriorityWorkQueue;
