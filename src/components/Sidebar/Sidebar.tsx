"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import {
  MdDashboard,
  MdPeople,
  MdPersonAdd,
  MdBusiness,
  MdTrendingUp,
  MdCalendarToday,
  MdCheckBox,
  MdMessage,
  MdCalculate,
  MdInventory,
  MdSupport,
  MdShoppingCart,
  MdStore,
  MdBarChart,
  MdChevronLeft,
  MdChevronRight,
  MdMenu,
  MdPerson,
  MdSettings,
  MdCreditCard,
  MdLogout as MdLogoutIcon,
  MdAutoAwesome,
  MdVerified,
  MdNotifications,
  MdAdd,
  MdExpandMore,
  MdEdit,
  MdFlashOn,
  MdHelpOutline,
  MdLock,
} from "react-icons/md";
import { HiUpload, HiDocumentText } from "react-icons/hi";
import { FaBrain, FaProjectDiagram } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/DropdownMenu/DropdownMenu";

// TypeScript Type Definitions
type IconComponent = React.ComponentType<{ className?: string }>;

// User and Company Types
interface User {
  name: string;
  email: string;
  avatar: string;
}

interface Company {
  name: string;
  logo: string;
  slogan?: string;
}

// Team Types
interface Team {
  name: string;
  logo: IconComponent;
  plan: string;
}

// Navigation Item Types
interface SubItem {
  name: string;
  url: string;
  icon: string;
}

interface NavItem {
  name: string;
  url: string;
  icon: string;
  subItems?: SubItem[];
}

// Sidebar Section Types
interface SidebarSection {
  heading: string;
  showHeading: boolean;
  items: NavItem[];
}

// Main Data Structure Type
interface SidebarData {
  user: User;
  company: Company;
  teams: Team[];
  topFixedItems: NavItem[];
  sidebarSections: SidebarSection[];
  bottomFixedItems: NavItem[];
}

// Component Prop Types
interface SidebarProviderProps {
  children: React.ReactNode;
}

interface NavExpansionProviderProps {
  children: React.ReactNode;
}

interface SidebarProps {
  showTeamSwitcherDropdown?: boolean;
}

interface SidebarContentProps {
  showTeamSwitcherDropdown?: boolean;
}

interface TeamSwitcherProps {
  forceExpanded?: boolean;
  showDropdown?: boolean;
}

interface FixedNavItemsProps {
  items: NavItem[];
  forceExpanded?: boolean;
  showHeading?: boolean;
  heading?: string;
}

interface NavItemProps {
  item: NavItem;
  shouldShowExpanded: boolean;
  getIconComponent: (iconName: string) => IconComponent;
}

interface NavSectionProps {
  heading: string;
  items: NavItem[];
  forceExpanded?: boolean;
  showHeading?: boolean;
}

interface NavUserProps {
  forceExpanded?: boolean;
}

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  show: boolean;
}

interface SidebarContextType {
  isOpen: boolean;
  isMobile: boolean;
  isMobileOpen: boolean;
  setIsOpen: (open: boolean) => void;
  setIsMobileOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

interface NavExpansionContextType {
  expandedItem: string | null;
  setExpandedItem: (itemName: string | null) => void;
}

// Optimized Icon mapping object (memoized)
const IconMap: Record<string, IconComponent> = {
  // Navigation icons
  LayoutDashboard: MdDashboard,
  Users: MdPeople,
  UserPlus: MdPersonAdd,
  Briefcase: MdBusiness,
  TrendingUp: MdTrendingUp,
  Calendar: MdCalendarToday,
  CheckSquare: MdCheckBox,
  MessageSquare: MdMessage,
  Calculator: MdCalculate,
  PackageOpen: MdInventory,
  TicketCheck: MdSupport,
  ShoppingCart: MdShoppingCart,
  Store: MdStore,
  BarChart2: MdBarChart,
  BrainCircuit: FaBrain,
  Workflow: FaProjectDiagram,

  // Action icons
  Edit3: MdEdit,
  Zap: MdFlashOn,
  Upload: HiUpload,
  FileText: HiDocumentText,
  HelpCircle: MdHelpOutline,

  // System icons
  Settings: MdSettings,
  CreditCard: MdCreditCard,
  LogOut: MdLogoutIcon,
  User: MdPerson,
  Lock: MdLock,

  // UI icons
  ChevronLeft: MdChevronLeft,
  ChevronRight: MdChevronRight,
  ChevronDown: MdExpandMore,
  PanelLeft: MdMenu,
  Plus: MdAdd,
  Bell: MdNotifications,
  Sparkles: MdAutoAwesome,
  BadgeCheck: MdVerified,
  ChevronsUpDown: MdExpandMore,
};

// Memoized icon getter function
const getIconComponent = (iconName: string): IconComponent => {
  return IconMap[iconName] || MdHelpOutline;
};

// Optimized Tooltip Component with GSAP animation
const Tooltip = React.memo(
  ({ children, content, show }: TooltipProps): React.JSX.Element => {
    const [isVisible, setIsVisible] = React.useState(false);
    const [position, setPosition] = React.useState({ top: 0, left: 0 });
    const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
    const triggerRef = React.useRef<HTMLDivElement>(null);
    const tooltipRef = React.useRef<HTMLDivElement>(null);
    const animationRef = React.useRef<gsap.core.Tween | null>(null);

    const handleMouseEnter = React.useCallback(() => {
      if (!show || !content) return;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Calculate position relative to the trigger element
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setPosition({
          top: rect.top + rect.height / 2,
          left: rect.right + 8, // 8px gap from sidebar
        });
      }

      timeoutRef.current = setTimeout(() => {
        setIsVisible(true);
        // GSAP animation for smooth appearance
        if (tooltipRef.current) {
          gsap.fromTo(
            tooltipRef.current,
            { opacity: 0, x: -8 },
            {
              opacity: 1,
              x: 0,
              duration: 0.2,
              ease: "power2.out",
            }
          );
        }
      }, 300); // 300ms delay
    }, [show, content]);

    const handleMouseLeave = React.useCallback(() => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (animationRef.current) {
        animationRef.current.kill();
      }
      setIsVisible(false);
    }, []);

    React.useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        if (animationRef.current) {
          animationRef.current.kill();
        }
      };
    }, []);

    if (!show || !content) return <>{children}</>;

    return (
      <>
        <div
          ref={triggerRef}
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {children}
        </div>
        {isVisible && (
          <div
            ref={tooltipRef}
            className="fixed z-[9999] bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm px-2 py-1 rounded-md shadow-lg whitespace-nowrap pointer-events-none"
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
              transform: "translateY(-50%)",
              willChange: "opacity, transform",
              contain: "layout style paint",
            }}
          >
            {content}
            <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-slate-900 dark:border-r-slate-100" />
          </div>
        )}
      </>
    );
  }
);

// Sample data - same as the original
const data: SidebarData = {
  user: {
    name: "Admin",
    email: "admin@averox.com",
    avatar: "/avatars/shadcn.jpg",
  },
  company: {
    name: "AVEROX",
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
  // Fixed top items (0-4 items)
  topFixedItems: [
    {
      name: "Compose",
      url: "/compose",
      icon: "Edit3",
    },
    {
      name: "New Contact",
      url: "/contacts/new",
      icon: "UserPlus",
    },
    {
      name: "Quick Add",
      url: "/quick-add",
      icon: "Zap",
    },
  ],
  // Scrollable middle content
  sidebarSections: [
    {
      heading: "Core",
      showHeading: true,
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
          subItems: [
            {
              name: "All Contacts",
              url: "/contacts/all",
              icon: "Users",
            },
            {
              name: "New Contact",
              url: "/contacts/new",
              icon: "UserPlus",
            },
            {
              name: "Import Contacts",
              url: "/contacts/import",
              icon: "Upload",
            },
          ],
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
      showHeading: false,
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
      showHeading: true,
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
      heading: "Administration",
      showHeading: true,
      items: [
        {
          name: "Users",
          url: "/users",
          icon: "Users",
        },
        {
          name: "Roles and Permissions",
          url: "/rbac/roles",
          icon: "Lock",
        },
      ],
    },
    {
      heading: "Analytics & Automation",
      showHeading: true,
      items: [
        {
          name: "Reports",
          url: "/reports",
          icon: "BarChart2",
          subItems: [
            {
              name: "Sales Reports",
              url: "/reports/sales",
              icon: "TrendingUp",
            },
            {
              name: "Contact Reports",
              url: "/reports/contacts",
              icon: "Users",
            },
            {
              name: "Custom Reports",
              url: "/reports/custom",
              icon: "FileText",
            },
          ],
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
      showHeading: true,
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
      showHeading: false,
      items: [
        {
          name: "Settings",
          url: "/settings",
          icon: "Settings",
        },
      ],
    },
  ],
  // Fixed bottom items (0-3 items)
  bottomFixedItems: [
    {
      name: "Logout",
      url: "/logout",
      icon: "LogOut",
    },
    {
      name: "Profile",
      url: "/profile",
      icon: "User",
    },
    {
      name: "Help & Support",
      url: "/help",
      icon: "HelpCircle",
    },
  ],
};

// Custom hook for mobile detection
function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = React.useState<boolean>(false);
  const [isHydrated, setIsHydrated] = React.useState(false);

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
function useSidebar(): SidebarContextType {
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
const SidebarContext = React.createContext<SidebarContextType | null>(null);

// Context for navigation items expansion state
const NavExpansionContext = React.createContext<NavExpansionContextType | null>(
  null
);

function SidebarProvider({
  children,
}: SidebarProviderProps): React.JSX.Element {
  const sidebar = useSidebar();

  // Memoize context value to prevent unnecessary re-renders (React 19 optimization)
  const contextValue = React.useMemo(
    () => sidebar,
    [
      sidebar.isOpen,
      sidebar.isMobile,
      sidebar.isMobileOpen,
      sidebar.setIsOpen,
      sidebar.setIsMobileOpen,
      sidebar.toggleSidebar,
    ]
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      {children}
    </SidebarContext.Provider>
  );
}

function NavExpansionProvider({
  children,
}: NavExpansionProviderProps): React.JSX.Element {
  const [expandedItem, setExpandedItem] = React.useState<string | null>(null);

  // Memoize context value to prevent unnecessary re-renders (React 19 optimization)
  const contextValue = React.useMemo(
    () => ({ expandedItem, setExpandedItem }),
    [expandedItem]
  );

  return (
    <NavExpansionContext.Provider value={contextValue}>
      {children}
    </NavExpansionContext.Provider>
  );
}

function useNavExpansion(): NavExpansionContextType {
  const context = React.useContext(NavExpansionContext);
  if (!context) {
    throw new Error(
      "useNavExpansion must be used within a NavExpansionProvider"
    );
  }
  return context;
}

function useSidebarContext(): SidebarContextType {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebarContext must be used within a SidebarProvider");
  }
  return context;
}

// Optimized Team Switcher Component
const TeamSwitcher = React.memo(
  ({
    forceExpanded = false,
    showDropdown = true,
  }: TeamSwitcherProps): React.JSX.Element | null => {
    const { isOpen } = useSidebarContext();
    const [activeTeam, setActiveTeam] = React.useState(data.teams[0]);
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    const shouldShowExpanded = forceExpanded || isOpen;

    const handleTeamChange = React.useCallback((team: Team) => {
      setActiveTeam(team);
      setIsDropdownOpen(false);
    }, []);

    if (!activeTeam) return null;

    // Simple logo and company name display (no dropdown)
    if (!showDropdown) {
      return (
        <Tooltip content={data.company.name} show={!shouldShowExpanded}>
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
                priority
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
        </Tooltip>
      );
    }

    // Interactive team switcher with dropdown
    return (
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <Tooltip content={activeTeam.name} show={!shouldShowExpanded}>
          <DropdownMenuTrigger
            className={`flex w-full items-center gap-3 rounded-lg p-1.5 text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
              !shouldShowExpanded ? "justify-center" : ""
            }`}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <activeTeam.logo className="h-4 w-4" />
            </div>
            {shouldShowExpanded && (
              <>
                <div className="flex-1 min-w-0">
                  <div className="truncate text-sm font-medium">
                    {activeTeam.name}
                  </div>
                  <div className="truncate text-xs text-slate-500">
                    {activeTeam.plan}
                  </div>
                </div>
                <MdExpandMore className="h-4 w-4 text-slate-500" />
              </>
            )}
          </DropdownMenuTrigger>
        </Tooltip>

        <DropdownMenuContent align="start" className="w-64 max-w-[90vw]">
          <DropdownMenuLabel className="text-xs font-medium text-slate-500">
            Teams
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {data.teams.map((team, index) => (
              <div
                key={team.name}
                onClick={() => handleTeamChange(team)}
                className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-sm transition-colors"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-md border">
                  <team.logo className="h-3.5 w-3.5" />
                </div>
                <span className="text-sm flex-1">{team.name}</span>
                <span className="text-xs text-slate-500">⌘{index + 1}</span>
              </div>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex items-center gap-2 p-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md border">
              <MdAdd className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium text-slate-500">Add team</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
);

// Optimized Fixed Nav Items Component
const FixedNavItems = React.memo(
  ({
    items,
    forceExpanded = false,
    showHeading = false,
    heading,
  }: FixedNavItemsProps): React.JSX.Element | null => {
    const pathname = usePathname();
    const { isOpen } = useSidebarContext();
    const shouldShowExpanded = forceExpanded || isOpen;

    if (!items || items.length === 0) return null;

    return (
      <div className="p-2">
        {shouldShowExpanded && showHeading && heading && (
          <div className="text-xs font-medium text-slate-500 mb-2 px-2">
            {heading}
          </div>
        )}
        <div className="space-y-1">
          {items.map((item) => {
            const Icon = getIconComponent(item.icon);
            const isActive = pathname === item.url;

            return (
              <Tooltip
                key={item.name}
                content={item.name}
                show={!shouldShowExpanded}
              >
                <Link
                  href={item.url}
                  className={`sidebar-item flex items-center gap-3 rounded-md px-2 py-2 text-sm ${
                    isActive
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
                  } ${!shouldShowExpanded ? "justify-center" : ""}`}
                  style={{ willChange: isActive ? "auto" : "background-color" }}
                >
                  <Icon className="h-4 w-4" />
                  {shouldShowExpanded && <span>{item.name}</span>}
                </Link>
              </Tooltip>
            );
          })}
        </div>
      </div>
    );
  }
);

// Optimized Nav Item Component with GSAP accordion animation
const NavItem = React.memo(
  ({
    item,
    shouldShowExpanded,
    getIconComponent: getIcon,
  }: NavItemProps): React.JSX.Element => {
    const pathname = usePathname();
    const { expandedItem, setExpandedItem } = useNavExpansion();
    const Icon = getIcon(item.icon);
    const isActive = pathname === item.url;
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isExpanded = expandedItem === item.name;
    const subItemsRef = React.useRef<HTMLDivElement>(null);

    // Check if any sub-item is active
    const isSubItemActive = React.useMemo(
      () =>
        hasSubItems &&
        item.subItems?.some((subItem: SubItem) => pathname === subItem.url),
      [hasSubItems, item.subItems, pathname]
    );

    const handleToggleSubItems = React.useCallback(
      (e: React.MouseEvent) => {
        if (hasSubItems && shouldShowExpanded) {
          e.preventDefault();
          // Accordion behavior: if clicking the same item, collapse it; otherwise expand this item
          setExpandedItem(isExpanded ? null : item.name);
        }
      },
      [hasSubItems, shouldShowExpanded, isExpanded, item.name, setExpandedItem]
    );

    // GSAP animation for smooth accordion
    React.useEffect(() => {
      if (!hasSubItems || !shouldShowExpanded || !subItemsRef.current) return;

      if (isExpanded) {
        gsap.to(subItemsRef.current, {
          height: "auto",
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      } else {
        gsap.to(subItemsRef.current, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
        });
      }
    }, [isExpanded, hasSubItems, shouldShowExpanded]);

    if (!hasSubItems) {
      // Regular item without sub-items
      return (
        <Tooltip key={item.name} content={item.name} show={!shouldShowExpanded}>
          <Link
            href={item.url}
            className={`sidebar-item flex items-center gap-3 rounded-md px-2 py-2 text-sm ${
              isActive
                ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
            } ${!shouldShowExpanded ? "justify-center" : ""}`}
            style={{ willChange: isActive ? "auto" : "background-color" }}
          >
            <Icon className="h-4 w-4" />
            {shouldShowExpanded && <span>{item.name}</span>}
          </Link>
        </Tooltip>
      );
    }

    // Item with sub-items
    return (
      <div>
        <Tooltip key={item.name} content={item.name} show={!shouldShowExpanded}>
          <Link
            href={item.url}
            onClick={handleToggleSubItems}
            className={`sidebar-item flex items-center gap-3 rounded-md px-2 py-2 text-sm ${
              isActive || isSubItemActive
                ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
            } ${!shouldShowExpanded ? "justify-center" : ""}`}
            style={{ willChange: isActive ? "auto" : "background-color" }}
          >
            <Icon className="h-4 w-4" />
            {shouldShowExpanded && (
              <>
                <span className="flex-1">{item.name}</span>
                {hasSubItems && (
                  <MdChevronRight
                    className={`h-4 w-4 transition-transform duration-300 ease-in-out ${
                      isExpanded ? "rotate-90" : "rotate-0"
                    }`}
                  />
                )}
              </>
            )}
          </Link>
        </Tooltip>

        {/* Sub-items with GSAP smooth animation */}
        {hasSubItems && shouldShowExpanded && (
          <div
            ref={subItemsRef}
            className="sidebar-sub-item overflow-hidden"
            style={{
              height: 0,
              opacity: 0,
              willChange: "height, opacity",
              contain: "layout style",
            }}
          >
            <div className="ml-6 mt-1 space-y-1 pb-1">
              {item.subItems?.map((subItem: SubItem, index: number) => {
                const SubIcon = getIcon(subItem.icon);
                const isSubActive = pathname === subItem.url;

                return (
                  <Link
                    key={subItem.name}
                    href={subItem.url}
                    className={`sidebar-sub-item flex items-center gap-3 rounded-md px-2 py-1.5 text-sm ${
                      isSubActive
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                        : "text-slate-500 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
                    }`}
                    style={{
                      transitionDelay: isExpanded ? `${index * 50}ms` : "0ms",
                      willChange: isSubActive ? "auto" : "background-color",
                    }}
                  >
                    <SubIcon className="h-3.5 w-3.5" />
                    <span>{subItem.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }
);

// Optimized Nav Section Component
const NavSection = React.memo(
  ({
    heading,
    items,
    forceExpanded = false,
    showHeading = true,
  }: NavSectionProps): React.JSX.Element => {
    const { isOpen } = useSidebarContext();
    const shouldShowExpanded = forceExpanded || isOpen;

    return (
      <div className="p-2">
        {shouldShowExpanded && showHeading && heading && (
          <div className="text-xs font-medium text-slate-500 mb-2 px-2">
            {heading}
          </div>
        )}
        <div className="space-y-1">
          {items.map((item) => (
            <NavItem
              key={item.name}
              item={item}
              shouldShowExpanded={shouldShowExpanded}
              getIconComponent={getIconComponent}
            />
          ))}
        </div>
      </div>
    );
  }
);

// Optimized Nav User Component
const NavUser = React.memo(
  ({ forceExpanded = false }: NavUserProps): React.JSX.Element => {
    const { isOpen } = useSidebarContext();
    const shouldShowExpanded = forceExpanded || isOpen;

    return (
      <DropdownMenu>
        <Tooltip content={data.user.name} show={!shouldShowExpanded}>
          <DropdownMenuTrigger
            className={`flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
              !shouldShowExpanded ? "justify-center" : ""
            }`}
          >
            <div className="h-8 w-8 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
              <MdPerson className="h-4 w-4 text-slate-700 dark:text-slate-100" />
            </div>
            {shouldShowExpanded && (
              <>
                <div className="flex-1 min-w-0">
                  <div className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                    {data.user.name}
                  </div>
                  <div className="truncate text-xs text-slate-500">
                    {data.user.email}
                  </div>
                </div>
                <MdExpandMore className="h-4 w-4 text-slate-500" />
              </>
            )}
          </DropdownMenuTrigger>
        </Tooltip>

        <DropdownMenuContent align="end" className="w-64 max-w-[90vw]">
          <DropdownMenuLabel className="flex items-center space-x-3 p-3">
            <div className="w-12 h-12 bg-slate-300 dark:bg-slate-500 text-slate-800 dark:text-slate-100 rounded-full flex items-center justify-center text-primary-foreground text-lg font-medium">
              {data.user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-slate-900 dark:text-slate-50">
                {data.user.name}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-300">
                {data.user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <MdAutoAwesome className="mr-2 h-4 w-4" />
              Upgrade to Pro
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <MdVerified className="mr-2 h-4 w-4" />
              Account
            </DropdownMenuItem>
            <DropdownMenuItem>
              <MdCreditCard className="mr-2 h-4 w-4" />
              Billing
            </DropdownMenuItem>
            <DropdownMenuItem>
              <MdNotifications className="mr-2 h-4 w-4" />
              Notifications
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive focus:text-destructive">
            <MdLogoutIcon className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
);

// Main Sidebar Component
function Sidebar({
  showTeamSwitcherDropdown = true,
}: SidebarProps = {}): React.JSX.Element {
  return (
    <NavExpansionProvider>
      <SidebarContent showTeamSwitcherDropdown={showTeamSwitcherDropdown} />
    </NavExpansionProvider>
  );
}

const SidebarContent = React.memo(
  ({
    showTeamSwitcherDropdown = true,
  }: SidebarContentProps = {}): React.JSX.Element => {
    const { isOpen, isMobile, isMobileOpen, setIsMobileOpen } =
      useSidebarContext();
    const overlayRef = React.useRef<HTMLDivElement>(null);
    const mobileSidebarRef = React.useRef<HTMLDivElement>(null);
    const desktopSidebarRef = React.useRef<HTMLDivElement>(null);
    const [isTransitioning, setIsTransitioning] = React.useState(false);

    // Optimize desktop sidebar transition with will-change management
    React.useLayoutEffect(() => {
      if (isMobile) return;

      setIsTransitioning(true);

      // Clear transition state after animation completes
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 150); // Match CSS transition duration

      return () => clearTimeout(timer);
    }, [isOpen, isMobile]);

    // GSAP animation for mobile overlay and sidebar
    React.useEffect(() => {
      if (!isMobile) return;

      if (isMobileOpen) {
        // Animate overlay
        if (overlayRef.current) {
          gsap.fromTo(
            overlayRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.2, ease: "power2.out" }
          );
        }
        // Animate sidebar
        if (mobileSidebarRef.current) {
          gsap.fromTo(
            mobileSidebarRef.current,
            { x: "-100%" },
            { x: "0%", duration: 0.3, ease: "power2.out" }
          );
        }
      } else {
        // Animate out
        if (overlayRef.current) {
          gsap.to(overlayRef.current, {
            opacity: 0,
            duration: 0.2,
            ease: "power2.in",
          });
        }
        if (mobileSidebarRef.current) {
          gsap.to(mobileSidebarRef.current, {
            x: "-100%",
            duration: 0.3,
            ease: "power2.in",
          });
        }
      }
    }, [isMobileOpen, isMobile]);

    const handleOverlayClick = React.useCallback(() => {
      setIsMobileOpen(false);
    }, [setIsMobileOpen]);

    if (isMobile) {
      return (
        <>
          {/* Mobile Overlay with GSAP animation */}
          {isMobileOpen && (
            <div
              ref={overlayRef}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={handleOverlayClick}
              style={{
                willChange: "opacity",
                contain: "layout style paint",
              }}
            />
          )}

          {/* Mobile Sidebar with GSAP animation */}
          <div
            ref={mobileSidebarRef}
            className="fixed inset-y-0 left-0 z-50 w-64 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 md:hidden"
            style={{
              transform: "translateX(-100%)",
              willChange: "transform",
              contain: "layout style paint",
            }}
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

              {/* Top Fixed Items */}
              <FixedNavItems
                items={data.topFixedItems}
                forceExpanded={true}
                showHeading={false}
              />

              {/* Separator */}
              {data.topFixedItems && data.topFixedItems.length > 0 && (
                <div className="border-t border-slate-200 dark:border-slate-800" />
              )}

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto">
                {data.sidebarSections.map((section, index) => (
                  <NavSection
                    key={index}
                    heading={section.heading}
                    items={section.items}
                    forceExpanded={true}
                    showHeading={section.showHeading}
                  />
                ))}
              </div>

              {/* Separator */}
              {data.bottomFixedItems && data.bottomFixedItems.length > 0 && (
                <div className="border-t border-slate-200 dark:border-slate-800" />
              )}

              {/* Bottom Fixed Items */}
              <FixedNavItems
                items={data.bottomFixedItems}
                forceExpanded={true}
                showHeading={false}
              />

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
        ref={desktopSidebarRef}
        data-state={isOpen ? "expanded" : "collapsed"}
        className="sidebar-desktop hidden md:block fixed left-0 top-0 h-screen bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-30"
        style={{
          willChange: isTransitioning ? "width" : "auto",
        }}
      >
        <div className="flex h-full flex-col w-full">
          {/* Header */}
          <div className="p-2 border-b border-slate-200 dark:border-slate-800">
            <TeamSwitcher showDropdown={showTeamSwitcherDropdown} />
          </div>

          {/* Top Fixed Items */}
          <FixedNavItems items={data.topFixedItems} showHeading={false} />

          {/* Separator */}
          {data.topFixedItems && data.topFixedItems.length > 0 && (
            <div className="border-t border-slate-200 dark:border-slate-800" />
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {data.sidebarSections.map((section, index) => (
              <NavSection
                key={index}
                heading={section.heading}
                items={section.items}
                showHeading={section.showHeading}
              />
            ))}
          </div>

          {/* Separator */}
          {data.bottomFixedItems && data.bottomFixedItems.length > 0 && (
            <div className="border-t border-slate-200 dark:border-slate-800" />
          )}

          {/* Bottom Fixed Items */}
          <FixedNavItems items={data.bottomFixedItems} showHeading={true} />

          {/* Footer */}
          <div className="p-2 border-t border-slate-200 dark:border-slate-800">
            <NavUser />
          </div>
        </div>
      </div>
    );
  }
);

// Optimized Sidebar Trigger Component
const SidebarTrigger = React.memo(() => {
  const { toggleSidebar } = useSidebarContext();

  const handleClick = React.useCallback(() => {
    toggleSidebar();
  }, [toggleSidebar]);

  return (
    <button
      onClick={handleClick}
      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
      style={{ willChange: "background-color" }}
    >
      <MdMenu className="h-4 w-4" />
      <span className="sr-only">Toggle Sidebar</span>
    </button>
  );
});

export { Sidebar, SidebarProvider, SidebarTrigger, useSidebarContext };
