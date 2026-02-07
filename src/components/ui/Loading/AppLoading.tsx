export default function AppLoading() {
  return (
    <div
      className="flex min-h-48 w-full flex-1 items-center justify-center overflow-hidden "
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="flex flex-col items-center gap-8">
        {/* Dual-ring loader */}
        <div className="relative flex items-center justify-center">
          <div
            className="absolute w-14 h-14 rounded-full border-2 border-slate-200 dark:border-slate-700"
            aria-hidden
          />
          <div
            className="absolute w-14 h-14 rounded-full border-2 border-transparent border-t-primary border-r-primary animate-spin"
            style={{ animationDuration: "0.9s" }}
            aria-hidden
          />
          <div
            className="absolute w-10 h-10 rounded-full border-2 border-transparent border-b-primary border-l-primary animate-spin"
            style={{ animationDuration: "0.6s", animationDirection: "reverse" }}
            aria-hidden
          />
          <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
        </div>

        {/* Label */}
        <div className="text-center space-y-1.5">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 tracking-wide">
            Loading
          </p>
          <div className="flex justify-center gap-1">
            <span
              className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <span
              className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <span
              className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
