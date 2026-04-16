export const ReportesPageShell = ({ title, subtitle, actions = null, children }) => {
  return (
    <section className="reportes-shell space-y-3">
      <header className="reportes-header space-y-1">
        <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
        {actions ? <div className="pt-1 flex flex-wrap gap-1.5">{actions}</div> : null}
      </header>
      {children}
    </section>
  );
};
