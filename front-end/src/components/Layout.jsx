import {
  Activity,
  Building2,
  Calendar,
  ChevronDown,
  DollarSign,
  FileSearch,
  LayoutDashboard,
  Layers3,
  LogIn,
  LogOut,
  Menu,
  PieChart,
  Presentation,
  Settings,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";


const menuItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["admin", "operador"] },
  { path: "/entrada", label: "Entradas y Salidas", icon: LogIn, roles: ["admin", "operador"] },
  { path: "/reservas", label: "Reservas", icon: Calendar, roles: ["admin", "operador"] },
  {
    path: "/reportes",
    label: "Reportes y Consultas",
    icon: Presentation,
    roles: ["admin", "operador"],
    children: [
      { path: "/reportes/operativos", label: "Operativos", icon: Activity },
      { path: "/reportes/reservas", label: "Reservas", icon: Calendar },
      { path: "/reportes/ocupacion", label: "Ocupacion", icon: PieChart },
      { path: "/reportes/financieros", label: "Financieros", icon: DollarSign },
      { path: "/reportes/consultas", label: "Consultas", icon: FileSearch }
    ]
  },
  {
    path: "/configuracion",
    label: "Configuracion",
    icon: Settings,
    roles: ["admin"],
    children: [
      { path: "/configuracion/empresa", label: "Informacion de la empresa", icon: Building2 },
      { path: "/configuracion/tarifas", label: "Tarifas", icon: DollarSign },
      { path: "/configuracion/espacios", label: "Espacios", icon: Layers3 }
    ]
  },
  { path: "/usuarios", label: "Usuarios", icon: Users, roles: ["admin"] },
];

export const Layout = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(true);
  const [reportesOpen, setReportesOpen] = useState(true);
  const location = useLocation();

  const userRole = (user?.rol || user?.role || "").toLowerCase();
  const filteredMenuItems = useMemo(
    () => menuItems.filter((item) => item.roles.includes(userRole)),
    [userRole]
  );

  const MenuContent = ({ closeOnNavigate = false }) => (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/15 p-5">
        <div className="flex items-center gap-2">
          <img src="/icon.png" alt="SmartPark" className="h-10 w-10 text-white" />
          <div>
            <h1 className="text-sm font-semibold tracking-wide">SmartPark</h1>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          const hasChildren = Array.isArray(item.children) && item.children.length > 0;
          const isConfigSectionActive = hasChildren
            ? item.children.some((child) => location.pathname === child.path)
            : false;

          if (hasChildren) {
            const isReportesSection = item.path === "/reportes";
            const isOpen = isReportesSection ? reportesOpen : configOpen;
            const toggleSection = isReportesSection
              ? () => setReportesOpen((prev) => !prev)
              : () => setConfigOpen((prev) => !prev);

            return (
              <div key={item.path} className="space-y-1">
                <button
                  type="button"
                  onClick={toggleSection}
                  className={`app-sidebar-item flex w-full items-center gap-3 ${
                    isConfigSectionActive ? "app-sidebar-item-active" : "app-sidebar-item-idle"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="flex-1 text-left">{item.label}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>

                {isOpen && (
                  <div className="ml-4 space-y-1 border-l border-white/20 pl-3">
                    {item.children.map((child) => {
                      const ChildIcon = child.icon;
                      return (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          onClick={() => {
                            if (closeOnNavigate) {
                              setMobileMenuOpen(false);
                            }
                          }}
                          className={({ isActive }) =>
                            `app-sidebar-subitem flex items-center gap-2 ${
                              isActive
                                ? "app-sidebar-subitem-active"
                                : "app-sidebar-subitem-idle"
                            }`
                          }
                        >
                          <ChildIcon className="h-4 w-4" />
                          <span>{child.label}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => {
                if (closeOnNavigate) {
                  setMobileMenuOpen(false);
                }
              }}
              className={({ isActive }) =>
                `app-sidebar-item flex items-center gap-3 ${isActive ? "app-sidebar-item-active" : "app-sidebar-item-idle"
                }`
              }
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-white/15 p-4">
        <div className="mb-3 px-1">
          <p className="text-sm font-medium text-slate-100">{user?.nombre || "Usuario"}</p>
          <p className="text-xs capitalize text-slate-300">{userRole || "sin rol"}</p>
        </div>

        <Button variant="outline" className="w-full border-white/30 bg-white/10 text-slate-100 hover:bg-white/20 hover:text-white" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar Sesion
        </Button>
      </div>
    </div>
  );

  return (
    <div className="app-shell flex min-h-screen">
      <aside className="app-sidebar hidden w-64 md:flex md:flex-col">
        <MenuContent />
      </aside>

      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon" className="fixed left-4 top-4 z-40">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="app-sidebar w-64 p-0">
          <MenuContent closeOnNavigate />
        </SheetContent>
      </Sheet>

      <main className="flex-1 overflow-auto">
        <div className="p-3 pt-16 md:p-6 md:pt-6">
          <div className="app-content-wrap">
          <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};
