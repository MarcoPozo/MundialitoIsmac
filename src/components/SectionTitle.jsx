export default function SectionTitle({
  children,
  icon = null,
  right = null,
  as: Tag = "h2",
  className = "",
}) {
  return (
    <div className={`mb-3 flex items-end justify-between ${className}`}>
      <Tag className="flex items-center gap-2 text-xl sm:text-2xl font-bold">
        {icon && <span className="text-emerald-600">{icon}</span>}
        <span>{children}</span>
      </Tag>
      {right}
    </div>
  );
}
