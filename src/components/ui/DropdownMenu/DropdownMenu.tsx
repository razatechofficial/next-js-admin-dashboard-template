"use client";

import * as React from "react";
import { cn } from "@/utils/tw";
import { gsap } from "gsap";

// Types
interface DropdownMenuContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
}

const DropdownMenuContext = React.createContext<DropdownMenuContextType | null>(
  null
);

const useDropdownMenu = () => {
  const context = React.useContext(DropdownMenuContext);
  if (!context) {
    throw new Error("useDropdownMenu must be used within a DropdownMenu");
  }
  return context;
};

// Main DropdownMenu Component (following Radix UI patterns)
interface DropdownMenuProps {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  dir?: Direction;
  modal?: boolean;
}

function DropdownMenu({
  children,
  open,
  defaultOpen = false,
  onOpenChange,
  dir = "ltr",
  modal = true, // eslint-disable-line @typescript-eslint/no-unused-vars
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  // Use controlled or uncontrolled state
  const isControlled = open !== undefined;
  const currentOpen = isControlled ? open : isOpen;

  const handleSetIsOpen = React.useCallback(
    (open: boolean) => {
      if (!isControlled) {
        setIsOpen(open);
      }
      onOpenChange?.(open);
    },
    [isControlled, onOpenChange]
  );

  // Optimized click outside and escape key handlers with passive listeners
  React.useEffect(() => {
    if (!currentOpen) return;

    // Memoized handler to prevent recreation on every render
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      // Use early returns for better performance
      if (!contentRef.current || !triggerRef.current) return;
      if (
        contentRef.current.contains(target) ||
        triggerRef.current.contains(target)
      )
        return;

      handleSetIsOpen(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleSetIsOpen(false);
      }
    };

    // Use capture phase for better performance and reliability
    document.addEventListener("mousedown", handleClickOutside, true);
    document.addEventListener("keydown", handleEscape, { passive: false });

    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [currentOpen, handleSetIsOpen, contentRef, triggerRef]);

  // Memoize context value to prevent unnecessary re-renders (React 19 optimization)
  const contextValue = React.useMemo(
    () => ({
      isOpen: currentOpen,
      setIsOpen: handleSetIsOpen,
      triggerRef,
      contentRef,
    }),
    [currentOpen, handleSetIsOpen, triggerRef, contentRef]
  );

  return (
    <DropdownMenuContext.Provider value={contextValue}>
      <div className="relative block" dir={dir}>
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
}

// DropdownMenuTrigger Component (following Radix UI patterns)
interface DropdownMenuTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const DropdownMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  DropdownMenuTriggerProps
>(({ className, children, asChild = false, onClick, ...props }, ref) => {
  const { isOpen, setIsOpen, triggerRef } = useDropdownMenu();

  // Combine forwarded ref with internal ref
  const combinedRef = React.useCallback(
    (node: HTMLButtonElement | null) => {
      triggerRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [ref, triggerRef]
  );

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setIsOpen(!isOpen);
      onClick?.(event);
    },
    [isOpen, setIsOpen, onClick]
  );

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      ref: combinedRef,
      onClick: handleClick,
      "aria-expanded": isOpen,
      "aria-haspopup": "menu",
    } as React.HTMLAttributes<HTMLElement> & {
      ref: (node: HTMLButtonElement | null) => void;
      onClick: (event: React.MouseEvent<HTMLElement>) => void;
      "aria-expanded": boolean;
      "aria-haspopup": string;
    });
  }

  return (
    <button
      ref={combinedRef}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-white dark:ring-offset-gray-800",
        className
      )}
      onClick={handleClick}
      aria-expanded={isOpen}
      aria-haspopup="menu"
      {...props}
    >
      {children}
    </button>
  );
});

DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

// Types for positioning and direction (following Radix UI patterns)
type Side = "top" | "right" | "bottom" | "left";
type Align = "start" | "center" | "end";
type Variant = "default" | "destructive";
type Direction = "ltr" | "rtl";

// DropdownMenuContent Component (following Radix UI patterns)
interface DropdownMenuContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  side?: Side;
  align?: Align;
  sideOffset?: number;
  alignOffset?: number;
  forceMount?: boolean;
}

interface Position {
  top: number;
  left: number;
}

const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  DropdownMenuContentProps
>(
  (
    {
      className,
      side = "bottom",
      align = "center",
      sideOffset = 4,
      alignOffset = 0,
      forceMount = false,
      children,
      ...props
    },
    ref
  ) => {
    const { isOpen, contentRef, triggerRef } = useDropdownMenu();
    const [position, setPosition] = React.useState<Position>({
      top: 0,
      left: 0,
    });
    const [isPositioned, setIsPositioned] = React.useState<boolean>(false);
    const [actualSide, setActualSide] = React.useState<Side>(side);
    const animationRef = React.useRef<gsap.core.Tween | null>(null);

    // Combine forwarded ref with internal ref
    const combinedRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        contentRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref, contentRef]
    );

    // Memoized position calculator to prevent unnecessary recalculations (React 19 optimization)
    const calculateOptimalPosition = React.useMemo(
      () =>
        (
          triggerElement: HTMLElement,
          contentElement: HTMLElement | null
        ): { side: Side; top: number; left: number } => {
          const triggerRect = triggerElement.getBoundingClientRect();
          const viewportWidth = window.innerWidth;
          const viewportHeight = window.innerHeight;

          // Use actual dimensions if available, otherwise estimate
          const contentWidth = contentElement?.offsetWidth || 200;
          const contentHeight = contentElement?.offsetHeight || 100;

          // Calculate available space on each side
          const space = {
            top: triggerRect.top - contentHeight - sideOffset,
            bottom: triggerRect.bottom + sideOffset,
            left: triggerRect.left - contentWidth - sideOffset,
            right: triggerRect.right + sideOffset,
          };

          // Check which sides have enough space
          const fits = {
            top: space.top >= 8,
            bottom: space.bottom + contentHeight <= viewportHeight - 8,
            left: space.left >= 8,
            right: space.right + contentWidth <= viewportWidth - 8,
          };

          // Determine best side
          let calculatedSide = side;
          let baseTop = 0;
          let baseLeft = 0;

          // Try preferred side first, then fallback to best available
          if (side === "bottom" && fits.bottom) {
            calculatedSide = "bottom";
            baseTop = space.bottom;
          } else if (side === "top" && fits.top) {
            calculatedSide = "top";
            baseTop = space.top;
          } else if (side === "right" && fits.right) {
            calculatedSide = "right";
            baseLeft = space.right;
          } else if (side === "left" && fits.left) {
            calculatedSide = "left";
            baseLeft = space.left;
          } else if (fits.bottom) {
            calculatedSide = "bottom";
            baseTop = space.bottom;
          } else if (fits.top) {
            calculatedSide = "top";
            baseTop = space.top;
          } else if (fits.right) {
            calculatedSide = "right";
            baseLeft = space.right;
          } else if (fits.left) {
            calculatedSide = "left";
            baseLeft = space.left;
          } else {
            // Fallback to bottom
            calculatedSide = "bottom";
            baseTop = space.bottom;
          }

          let top = baseTop;
          let left = baseLeft;

          // Apply alignment
          if (calculatedSide === "bottom" || calculatedSide === "top") {
            switch (align) {
              case "start":
                left = triggerRect.left + alignOffset;
                break;
              case "center":
                left =
                  triggerRect.left +
                  triggerRect.width / 2 -
                  contentWidth / 2 +
                  alignOffset;
                break;
              case "end":
                left = triggerRect.right - contentWidth + alignOffset;
                break;
            }
          } else {
            switch (align) {
              case "start":
                top = triggerRect.top + alignOffset;
                break;
              case "center":
                top =
                  triggerRect.top +
                  triggerRect.height / 2 -
                  contentHeight / 2 +
                  alignOffset;
                break;
              case "end":
                top = triggerRect.bottom - contentHeight + alignOffset;
                break;
            }
          }

          // Constrain to viewport with padding
          left = Math.max(8, Math.min(left, viewportWidth - contentWidth - 8));
          top = Math.max(8, Math.min(top, viewportHeight - contentHeight - 8));

          return { side: calculatedSide, top, left };
        },
      [side, align, sideOffset, alignOffset]
    );

    // Unified position calculation and animation effect
    React.useEffect(() => {
      if (!isOpen) {
        // Cleanup animation on close
        if (animationRef.current) {
          animationRef.current.kill();
          animationRef.current = null;
        }
        setIsPositioned(false);
        return;
      }

      if (!triggerRef.current) return;

      // Single RAF for position calculation
      const rafId = requestAnimationFrame(() => {
        const triggerElement = triggerRef.current;
        const contentElement = contentRef.current;
        if (!triggerElement) return;

        const {
          side: calculatedSide,
          top,
          left,
        } = calculateOptimalPosition(triggerElement, contentElement);

        setActualSide(calculatedSide);
        setPosition({ top, left });

        // Smooth animation with GSAP after position is set
        if (contentElement && !isPositioned) {
          // Initial state: invisible and slightly offset
          gsap.set(contentElement, {
            opacity: 0,
            y:
              calculatedSide === "top"
                ? 4
                : calculatedSide === "bottom"
                ? -4
                : 0,
            x:
              calculatedSide === "left"
                ? 4
                : calculatedSide === "right"
                ? -4
                : 0,
          });

          // Animate to visible state
          animationRef.current = gsap.to(contentElement, {
            opacity: 1,
            y: 0,
            x: 0,
            duration: 0.15,
            ease: "power2.out",
            onComplete: () => {
              setIsPositioned(true);
            },
          });
        } else if (contentElement && isPositioned) {
          // Update position smoothly if already visible
          gsap.to(contentElement, {
            duration: 0.1,
            ease: "power1.out",
          });
        } else {
          setIsPositioned(true);
        }
      });

      return () => {
        cancelAnimationFrame(rafId);
      };
    }, [
      isOpen,
      triggerRef,
      contentRef,
      calculateOptimalPosition,
      isPositioned,
    ]);

    // Cleanup animation on unmount
    React.useEffect(() => {
      return () => {
        if (animationRef.current) {
          animationRef.current.kill();
        }
      };
    }, []);

    if (!isOpen && !forceMount) return null;

    return (
      <div
        ref={combinedRef}
        className={cn(
          "fixed z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 p-1 text-gray-900 dark:text-gray-100 shadow-md",
          className
        )}
        style={{
          top: position.top,
          left: position.left,
          // CSS optimization: prevent layout thrashing and improve rendering
          willChange: isOpen ? "opacity, transform" : "auto",
          contain: "layout style paint",
          contentVisibility: isOpen ? "visible" : "hidden",
          opacity: isPositioned ? 1 : 0,
          display: !isOpen && forceMount ? "none" : undefined,
        }}
        data-state={isOpen ? "open" : "closed"}
        data-side={actualSide}
        {...props}
      >
        {children}
      </div>
    );
  }
);

DropdownMenuContent.displayName = "DropdownMenuContent";

// DropdownMenuItem Component (following Radix UI patterns)
interface DropdownMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  inset?: boolean;
  variant?: Variant;
  disabled?: boolean;
}

const DropdownMenuItem = React.memo(
  React.forwardRef<HTMLDivElement, DropdownMenuItemProps>(
    (
      {
        className,
        inset = false,
        variant = "default",
        disabled = false,
        children,
        onClick,
        ...props
      },
      ref
    ) => {
      const { setIsOpen } = useDropdownMenu();

      const handleClick = React.useCallback(
        (event: React.MouseEvent<HTMLDivElement>) => {
          if (disabled) return;
          onClick?.(event);
          setIsOpen(false);
        },
        [disabled, onClick, setIsOpen]
      );

      return (
        <div
          ref={ref}
          className={cn(
            "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none",
            "text-gray-900 dark:text-gray-100",
            "hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100",
            "focus:bg-gray-100 focus:text-gray-900 dark:focus:bg-gray-800 dark:focus:text-gray-100",
            // CSS optimization for hover performance
            "will-change-auto",
            variant === "destructive" &&
              "text-red-600 dark:text-red-400 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20 dark:hover:text-red-400 focus:bg-red-50 focus:text-red-700 dark:focus:bg-red-900/20 dark:focus:text-red-400",
            inset && "pl-8",
            disabled && "pointer-events-none opacity-50",
            className
          )}
          onClick={handleClick}
          data-disabled={disabled}
          data-variant={variant}
          data-inset={inset}
          tabIndex={disabled ? -1 : 0}
          role="menuitem"
          {...props}
        >
          {children}
        </div>
      );
    }
  )
);

DropdownMenuItem.displayName = "DropdownMenuItem";

// DropdownMenuCheckboxItem Component (following Radix UI patterns)
interface DropdownMenuCheckboxItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
}

const DropdownMenuCheckboxItem = React.memo(
  React.forwardRef<HTMLDivElement, DropdownMenuCheckboxItemProps>(
    (
      {
        className,
        checked = false,
        onCheckedChange,
        disabled = false,
        children,
        ...props
      },
      ref
    ) => {
      useDropdownMenu(); // Get context but don't use setIsOpen

      const handleClick = React.useCallback(
        (event: React.MouseEvent<HTMLDivElement>) => {
          if (disabled) return;
          onCheckedChange?.(!checked);
          event.stopPropagation();
        },
        [disabled, onCheckedChange, checked]
      );

      return (
        <div
          ref={ref}
          className={cn(
            "relative flex cursor-default select-none items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none",
            "text-gray-900 dark:text-gray-100",
            "hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100",
            "focus:bg-gray-100 focus:text-gray-900 dark:focus:bg-gray-800 dark:focus:text-gray-100",
            disabled && "pointer-events-none opacity-50",
            className
          )}
          onClick={handleClick}
          data-disabled={disabled}
          tabIndex={disabled ? -1 : 0}
          role="menuitemcheckbox"
          aria-checked={checked}
          {...props}
        >
          <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
            {checked && (
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </span>
          {children}
        </div>
      );
    }
  )
);

DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem";

// DropdownMenuRadioItem Component (following Radix UI patterns)
interface DropdownMenuRadioItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  value: string;
  checked?: boolean;
  onSelect?: (value: string) => void;
  disabled?: boolean;
}

const DropdownMenuRadioItem = React.memo(
  React.forwardRef<HTMLDivElement, DropdownMenuRadioItemProps>(
    (
      {
        className,
        value,
        checked = false,
        onSelect,
        disabled = false,
        children,
        ...props
      },
      ref
    ) => {
      useDropdownMenu(); // Get context but don't use setIsOpen

      const handleClick = React.useCallback(
        (event: React.MouseEvent<HTMLDivElement>) => {
          if (disabled) return;
          onSelect?.(value);
          event.stopPropagation();
        },
        [disabled, onSelect, value]
      );

      return (
        <div
          ref={ref}
          className={cn(
            "relative flex cursor-default select-none items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none",
            "text-gray-900 dark:text-gray-100",
            "hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100",
            "focus:bg-gray-100 focus:text-gray-900 dark:focus:bg-gray-800 dark:focus:text-gray-100",
            disabled && "pointer-events-none opacity-50",
            className
          )}
          onClick={handleClick}
          data-disabled={disabled}
          tabIndex={disabled ? -1 : 0}
          role="menuitemradio"
          aria-checked={checked}
          {...props}
        >
          <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
            {checked && <div className="h-2 w-2 rounded-full bg-current" />}
          </span>
          {children}
        </div>
      );
    }
  )
);

DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem";

// DropdownMenuLabel Component (following Radix UI patterns)
interface DropdownMenuLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  inset?: boolean;
}

const DropdownMenuLabel = React.memo(
  React.forwardRef<HTMLDivElement, DropdownMenuLabelProps>(
    ({ className, inset = false, children, ...props }, ref) => {
      return (
        <div
          ref={ref}
          className={cn(
            "px-2 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300",
            inset && "pl-8",
            className
          )}
          {...props}
        >
          {children}
        </div>
      );
    }
  )
);

DropdownMenuLabel.displayName = "DropdownMenuLabel";

// DropdownMenuSeparator Component (following Radix UI patterns)
type DropdownMenuSeparatorProps = React.HTMLAttributes<HTMLDivElement>;

const DropdownMenuSeparator = React.memo(
  React.forwardRef<HTMLDivElement, DropdownMenuSeparatorProps>(
    ({ className, ...props }, ref) => {
      return (
        <div
          ref={ref}
          className={cn(
            "my-1 h-px bg-gray-200 dark:bg-gray-700 -mx-1",
            className
          )}
          role="separator"
          aria-orientation="horizontal"
          {...props}
        />
      );
    }
  )
);

DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

// DropdownMenuShortcut Component (following Radix UI patterns)
type DropdownMenuShortcutProps = React.HTMLAttributes<HTMLSpanElement>;

const DropdownMenuShortcut = React.memo(
  React.forwardRef<HTMLSpanElement, DropdownMenuShortcutProps>(
    ({ className, children, ...props }, ref) => {
      return (
        <span
          ref={ref}
          className={cn(
            "ml-auto text-xs tracking-widest text-gray-500 dark:text-gray-400",
            className
          )}
          {...props}
        >
          {children}
        </span>
      );
    }
  )
);

DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

// DropdownMenuGroup Component (following Radix UI patterns)
type DropdownMenuGroupProps = React.HTMLAttributes<HTMLDivElement>;

const DropdownMenuGroup = React.memo(
  React.forwardRef<HTMLDivElement, DropdownMenuGroupProps>(
    ({ className, children, ...props }, ref) => {
      return (
        <div ref={ref} className={cn("", className)} role="group" {...props}>
          {children}
        </div>
      );
    }
  )
);

DropdownMenuGroup.displayName = "DropdownMenuGroup";

// DropdownMenuSub Components (following Radix UI patterns)
interface DropdownMenuSubProps {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function DropdownMenuSub({ children }: DropdownMenuSubProps) {
  return <>{children}</>;
}

interface DropdownMenuSubTriggerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  inset?: boolean;
}

const DropdownMenuSubTrigger = React.memo(
  React.forwardRef<HTMLDivElement, DropdownMenuSubTriggerProps>(
    ({ className, inset = false, children, ...props }, ref) => {
      return (
        <div
          ref={ref}
          className={cn(
            "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
            "text-gray-900 dark:text-gray-100",
            "hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100",
            "focus:bg-gray-100 focus:text-gray-900 dark:focus:bg-gray-800 dark:focus:text-gray-100",
            inset && "pl-8",
            className
          )}
          {...props}
        >
          {children}
          <svg
            className="ml-auto h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      );
    }
  )
);

DropdownMenuSubTrigger.displayName = "DropdownMenuSubTrigger";

interface DropdownMenuSubContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  side?: Side;
  align?: Align;
  sideOffset?: number;
  alignOffset?: number;
  forceMount?: boolean;
}

const DropdownMenuSubContent = React.memo(
  React.forwardRef<HTMLDivElement, DropdownMenuSubContentProps>(
    (
      {
        className,
        side = "right", // eslint-disable-line @typescript-eslint/no-unused-vars
        align = "start", // eslint-disable-line @typescript-eslint/no-unused-vars
        sideOffset = 4, // eslint-disable-line @typescript-eslint/no-unused-vars
        alignOffset = 0, // eslint-disable-line @typescript-eslint/no-unused-vars
        forceMount = false, // eslint-disable-line @typescript-eslint/no-unused-vars
        children,
        ...props
      },
      ref
    ) => {
      return (
        <div
          ref={ref}
          className={cn(
            "z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 p-1 text-gray-900 dark:text-gray-100 shadow-lg",
            className
          )}
          style={{
            // CSS optimization for submenu
            willChange: "opacity, transform",
            contain: "layout style paint",
          }}
          {...props}
        >
          {children}
        </div>
      );
    }
  )
);

DropdownMenuSubContent.displayName = "DropdownMenuSubContent";

// Export all components
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};
