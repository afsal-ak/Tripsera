
 export function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground">{icon}</span>
      <p className="font-medium">{label}:</p>
      <p className="text-muted-foreground truncate">{value || "-"}</p>
    </div>
  );
}
