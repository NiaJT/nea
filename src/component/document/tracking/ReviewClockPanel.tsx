interface ReviewClockPanelProps {
  dueDate: string;
  outcome?: string;
}

export const ReviewClockPanel = ({
  dueDate,
  outcome = "Awaiting qualifying review outcome",
}: ReviewClockPanelProps) => {
  return (
    <div className="rounded-xl border border-[#E1E9F1] bg-white p-[18px] shadow-[0px_2px_9px_rgba(21,58,97,0.03)]">
      <h3 className="text-sm font-bold leading-[17px] tracking-[-0.1504px] text-[#17283C]">
        Review clock
      </h3>
      <p className="mt-4 text-[16px] leading-[19px] tracking-[-0.3125px] text-[#6B7F91]">
        Initial review · 10 days
      </p>
      <p className="mt-2 text-[16px] leading-[19px] tracking-[-0.3125px] text-[#6B7F91]">
        Due {dueDate}
        <br />
        {outcome}
      </p>
    </div>
  );
};
