interface InfoBlockProps {
  label: string;
  value: string;
  className?: string;
  valueClassName?: string;
}

export const InfoBlock = ({
  label,
  value,
  className = "",
  valueClassName = "text-[#17283C]",
}: InfoBlockProps) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    <span className="text-[11px] leading-[13px] tracking-[0.0644531px] text-[#77899A]">
      {label}
    </span>
    <span
      className={`text-[13px] font-bold leading-[16px] tracking-[-0.0761719px] ${valueClassName}`}
    >
      {value}
    </span>
  </div>
);
