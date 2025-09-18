"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  MdChevronLeft,
  MdMenu,
  MdPerson,
  MdSettings,
  MdCreditCard,
  MdLogout,
  MdAutoAwesome,
  MdVerified,
  MdNotifications,
  MdAdd,
  MdUnfoldMore,
  MdDashboard,
  MdPeople,
  MdWork,
  MdPersonAdd,
  MdTrendingUp,
  MdCalendarToday,
  MdCheckBox,
  MdMessage,
  MdCalculate,
  MdInventory,
  MdConfirmationNumber,
  MdShoppingCart,
  MdStore,
  MdBarChart,
  MdPsychology,
  MdAccountTree,
  MdHelp,
} from "react-icons/md";

// Type definition for icon components
type IconComponent = React.ComponentType<{ className?: string }>;

// Sample data - same as the original
const data = {
  user: {
    name: "Admin",
    email: "admin@averox.com",
    avatar: "/avatars/shadcn.jpg",
  },
  company: {
    name: "Averox",
    logo: "/assets/images/logo.png",
    slogan: "Your Business, Our Solution",
  },
  teams: [
    {
      name: "Admin Averox",
      logo: MdDashboard,
      plan: "Enterprise",
    },
    {
      name: "User Averox.",
      logo: MdPeople,
      plan: "Startup",
    },
  ],
  sidebarSections: [
    {
      heading: "Core",
      items: [
        {
          name: "Dashboard",
          url: "/",
          icon: "LayoutDashboard",
        },
        {
          name: "Contacts",
          url: "/contacts",
          icon: "Users",
        },
        {
          name: "Accounts",
          url: "/accounts",
          icon: "Briefcase",
        },
        {
          name: "Leads",
          url: "/leads",
          icon: "UserPlus",
        },
        {
          name: "Opportunities",
          url: "/opportunities",
          icon: "TrendingUp",
        },
        {
          name: "Calendar",
          url: "/calendar",
          icon: "Calendar",
        },
        {
          name: "Tasks",
          url: "/tasks",
          icon: "CheckSquare",
        },
      ],
    },
    {
      heading: "Communication",
      items: [
        {
          name: "Communication Center",
          url: "/communications",
          icon: "MessageSquare",
        },
      ],
    },
    {
      heading: "Business",
      items: [
        {
          name: "Accounting",
          url: "/accounting",
          icon: "Calculator",
        },
        {
          name: "Inventory",
          url: "/inventory",
          icon: "PackageOpen",
        },
        {
          name: "Support Tickets",
          url: "/support-tickets",
          icon: "TicketCheck",
        },
        {
          name: "Ecommerce",
          url: "/ecommerce",
          icon: "ShoppingCart",
        },
        {
          name: "Ecommerce Store",
          url: "/ecommerce-store",
          icon: "Store",
        },
      ],
    },
    {
      heading: "Analytics & Automation",
      items: [
        {
          name: "Reports",
          url: "/reports",
          icon: "BarChart2",
        },
        {
          name: "Intelligence",
          url: "/intelligence",
          icon: "BrainCircuit",
        },
        {
          name: "Workflows",
          url: "/workflows",
          icon: "Workflow",
        },
      ],
    },
    {
      heading: "Help & Support",
      items: [
        {
          name: "Subscriptions",
          url: "/subscriptions",
          icon: "CreditCard",
        },
        {
          name: "Training",
          url: "/training-help",
          icon: "HelpCircle",
        },
      ],
    },
    {
      heading: "System",
      items: [
        {
          name: "Settings",
          url: "/settings",
          icon: "Settings",
        },
      ],
    },
  ],
};

// Custom hook for mobile detection
function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false);
  const [isHydrated, setIsHydrated] = React.useState(false);

  // React.useEffect(() => {
  //   const mql = window.matchMedia(`(max-width: 767px)`);
  //   const onChange = () => {
  //     setIsMobile(window.innerWidth < 768);
  //   };
  //   mql.addEventListener("change", onChange);
  //   setIsMobile(window.innerWidth < 768);
  //   return () => mql.removeEventListener("change", onChange);
  // }, []);

  React.useEffect(() => {
    // Mark as hydrated on client side
    setIsHydrated(true);

    const mql = window.matchMedia(`(max-width: 767px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < 768);
    };
    mql.addEventListener("change", onChange);
    // Set initial value immediately
    setIsMobile(window.innerWidth < 768);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  // During SSR and initial hydration, assume desktop to prevent layout shift
  return isHydrated ? isMobile : false;
}

// Custom hook for sidebar state
function useSidebar() {
  const [isOpen, setIsOpen] = React.useState(true);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const isMobile = useIsMobile();

  const toggleSidebar = React.useCallback(() => {
    if (isMobile) {
      setIsMobileOpen((open) => !open);
    } else {
      setIsOpen((open) => !open);
    }
  }, [isMobile]);

  // Adds a keyboard shortcut to toggle the sidebar (Cmd/Ctrl + B).
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "b" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  return {
    isOpen,
    setIsOpen,
    isMobileOpen,
    setIsMobileOpen,
    isMobile,
    toggleSidebar,
  };
}

// Context for sidebar state
const SidebarContext = React.createContext<ReturnType<
  typeof useSidebar
> | null>(null);

function SidebarProvider({ children }: { children: React.ReactNode }) {
  const sidebar = useSidebar();
  return (
    <SidebarContext.Provider value={sidebar}>
      {children}
    </SidebarContext.Provider>
  );
}

function useSidebarContext() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebarContext must be used within a SidebarProvider");
  }
  return context;
}

// Team Switcher Component
function TeamSwitcher({
  forceExpanded = false,
  showDropdown = true,
}: {
  forceExpanded?: boolean;
  showDropdown?: boolean;
}) {
  const { isMobile, isOpen } = useSidebarContext();
  const [activeTeam, setActiveTeam] = React.useState(data.teams[0]);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const shouldShowExpanded = forceExpanded || isOpen;

  if (!activeTeam) return null;

  // Simple logo and company name display (no dropdown)
  if (!showDropdown) {
    return (
      <div
        className={`flex w-full items-center gap-3  ${
          !shouldShowExpanded ? "justify-center" : ""
        }`}
      >
        <div className="flex h-12 w-12 items-center justify-center bg-transaparent">
          <Image
            src={data.company.logo}
            alt={data.company.name}
            width={48}
            height={48}
            className="h-12 w-12 object-contain"
          />
        </div>
        {shouldShowExpanded && (
          <div className="flex-1 min-w-0">
            <div className="truncate text-sm text-slate-900 dark:text-slate-100 font-bold">
              {data.company.name}
            </div>
            {data.company.slogan && (
              <div className="truncate text-xs text-slate-500 dark:text-slate-200">
                {data.company.slogan}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Interactive team switcher with dropdown
  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={`flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
          !shouldShowExpanded ? "justify-center" : ""
        }`}
        title={!shouldShowExpanded ? activeTeam.name : undefined}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
          <activeTeam.logo className="h-4 w-4" />
        </div>
        {shouldShowExpanded && (
          <>
            <div className="flex-1 min-w-0">
              <div className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                {activeTeam.name}
              </div>
              <div className="truncate text-xs text-slate-500 dark:text-slate-200">
                {activeTeam.plan}
              </div>
            </div>
            <MdUnfoldMore className="h-4 w-4 text-slate-500" />
          </>
        )}
      </button>

      {isDropdownOpen && shouldShowExpanded && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50">
          <div className="p-2">
            <div className="text-xs font-medium text-slate-500 mb-2">Teams</div>
            {data.teams.map((team, index) => (
              <button
                key={team.name}
                onClick={() => {
                  setActiveTeam(team);
                  setIsDropdownOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-md border">
                  <team.logo className="h-3.5 w-3.5" />
                </div>
                <span className="text-sm">{team.name}</span>
                <span className="ml-auto text-xs text-slate-500">
                  ⌘{index + 1}
                </span>
              </button>
            ))}
            <div className="border-t border-slate-200 dark:border-slate-700 my-2" />
            <button className="flex w-full items-center gap-2 rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <div className="flex h-6 w-6 items-center justify-center rounded-md border">
                <MdAdd className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium text-slate-500">
                Add team
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Nav Section Component
function NavSection({
  heading,
  items,
  forceExpanded = false,
}: {
  heading: string;
  items: Array<{ name: string; url: string; icon: string }>;
  forceExpanded?: boolean;
}) {
  const pathname = usePathname();
  const { isOpen } = useSidebarContext();
  const shouldShowExpanded = forceExpanded || isOpen;

  const getIconComponent = (iconName: string): IconComponent => {
    const iconMap: Record<string, IconComponent> = {
      LayoutDashboard: MdDashboard,
      Users: MdPeople,
      Briefcase: MdWork,
      UserPlus: MdPersonAdd,
      TrendingUp: MdTrendingUp,
      Calendar: MdCalendarToday,
      CheckSquare: MdCheckBox,
      MessageSquare: MdMessage,
      Calculator: MdCalculate,
      PackageOpen: MdInventory,
      TicketCheck: MdConfirmationNumber,
      ShoppingCart: MdShoppingCart,
      Store: MdStore,
      BarChart2: MdBarChart,
      BrainCircuit: MdPsychology,
      Workflow: MdAccountTree,
      CreditCard: MdCreditCard,
      HelpCircle: MdHelp,
      Settings: MdSettings,
    };

    return iconMap[iconName] || MdHelp;
  };

  return (
    <div className="p-2">
      {shouldShowExpanded && (
        <div className="text-xs font-medium text-slate-500 mb-2 px-2">
          {heading}
        </div>
      )}
      <div className="space-y-1">
        {items.map((item) => {
          const Icon = getIconComponent(item.icon);
          const isActive = pathname === item.url;

          return (
            <Link
              key={item.name}
              href={item.url}
              className={`flex items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
              } ${!shouldShowExpanded ? "justify-center" : ""}`}
              title={!shouldShowExpanded ? item.name : undefined}
            >
              <Icon className="h-4 w-4" />
              {shouldShowExpanded && <span>{item.name}</span>}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// Nav User Component
function NavUser({ forceExpanded = false }: { forceExpanded?: boolean }) {
  const { isMobile, isOpen } = useSidebarContext();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const shouldShowExpanded = forceExpanded || isOpen;

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={`flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
          !shouldShowExpanded ? "justify-center" : ""
        }`}
        title={!shouldShowExpanded ? data.user.name : undefined}
      >
        <div className="h-8 w-8 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
          <MdPerson className="h-4 w-4" />
        </div>
        {shouldShowExpanded && (
          <>
            <div className="flex-1 min-w-0">
              <div className="truncate text-sm font-medium">
                {data.user.name}
              </div>
              <div className="truncate text-xs text-slate-500">
                {data.user.email}
              </div>
            </div>
            <MdUnfoldMore className="h-4 w-4 text-slate-500" />
          </>
        )}
      </button>

      {isDropdownOpen && shouldShowExpanded && (
        <div className="absolute bottom-full left-0 right-0 mb-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50">
          <div className="p-2">
            <div className="flex items-center gap-2 px-1 py-1.5">
              <div className="h-8 w-8 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                <MdPerson className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="truncate text-sm font-medium">
                  {data.user.name}
                </div>
                <div className="truncate text-xs text-slate-500">
                  {data.user.email}
                </div>
              </div>
            </div>
            <div className="border-t border-slate-200 dark:border-slate-700 my-2" />

            <button className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <MdAutoAwesome className="h-4 w-4" />
              Upgrade to Pro
            </button>

            <div className="border-t border-slate-200 dark:border-slate-700 my-2" />

            <button className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <MdVerified className="h-4 w-4" />
              Account
            </button>
            <button className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <MdCreditCard className="h-4 w-4" />
              Billing
            </button>
            <button className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <MdNotifications className="h-4 w-4" />
              Notifications
            </button>

            <div className="border-t border-slate-200 dark:border-slate-700 my-2" />

            <button className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <MdLogout className="h-4 w-4" />
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Main Sidebar Component
function Sidebar({
  showTeamSwitcherDropdown = true,
}: {
  showTeamSwitcherDropdown?: boolean;
} = {}) {
  const { isOpen, isMobile, isMobileOpen, setIsMobileOpen } =
    useSidebarContext();

  if (isMobile) {
    return (
      <>
        {/* Mobile Overlay */}
        {isMobileOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-200 ease-in-out md:hidden ${
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col">
            {/* Header - Fixed */}
            <div className="p-2 min-h-16 max-h-16 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <TeamSwitcher
                    forceExpanded={true}
                    showDropdown={showTeamSwitcherDropdown}
                  />
                </div>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
                >
                  <MdChevronLeft className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto">
              {data.sidebarSections.map((section, index) => (
                <NavSection
                  key={index}
                  heading={section.heading}
                  items={section.items}
                  forceExpanded={true}
                />
              ))}
            </div>

            {/* Footer - Fixed */}
            <div className="p-2 border-t border-slate-200 dark:border-slate-800">
              <NavUser forceExpanded={true} />
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div
      className={`hidden md:block fixed left-0 top-0 h-screen bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-200 ease-in-out z-30 ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="p-2 border-b border-slate-200 dark:border-slate-800">
          <TeamSwitcher showDropdown={showTeamSwitcherDropdown} />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {data.sidebarSections.map((section, index) => (
            <NavSection
              key={index}
              heading={section.heading}
              items={section.items}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="p-2 border-t border-slate-200 dark:border-slate-800">
          <NavUser />
        </div>
      </div>
    </div>
  );
}

// Sidebar Trigger Component
function SidebarTrigger() {
  const { toggleSidebar } = useSidebarContext();

  return (
    <button
      onClick={toggleSidebar}
      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
    >
      <MdMenu className="h-4 w-4" />
      <span className="sr-only">Toggle Sidebar</span>
    </button>
  );
}

export { Sidebar, SidebarProvider, SidebarTrigger, useSidebarContext };
