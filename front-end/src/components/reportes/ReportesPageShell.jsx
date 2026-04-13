export const ReportesPageShell = ({ title, subtitle, actions = null, children }) => {
  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
        {actions ? <div className="pt-1 flex flex-wrap gap-2">{actions}</div> : null}
      </header>
      {children}
    </section>
  );
};
