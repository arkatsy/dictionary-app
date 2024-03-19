import { Expand } from "@theme-toggles/react";
import "@theme-toggles/react/css/Expand.css";
import { useTheme } from "./use-theme";

export function Header() {
  return (
    <div className="flex justify-between">
      <a href="/">
        <Logo />
      </a>
      <ThemeToggle className="p-1 text-4xl text-yellow-400 dark:text-violet-500" />
    </div>
  );
}

export function Logo() {
  return (
    <div className="flex items-center gap-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1}
        stroke="currentColor"
        className="size-12 text-zinc-500 dark:text-zinc-200"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
        />
      </svg>
      <div className="hidden select-none text-3xl font-bold text-zinc-700 dark:text-zinc-200 sm:block">
        Dictionary
      </div>
    </div>
  );
}

function ThemeToggle(props: {
  toggle?: React.Dispatch<React.SetStateAction<boolean>>;
  toggled?: boolean;
  className?: string;
  duration?: number;
}) {
  const { theme, setTheme } = useTheme();

  const toggled = theme === "dark";
  const onToggle = () => setTheme(toggled ? "light" : "dark");

  return (
    /* @ts-ignore */
    <Expand {...props} placeholder="" duration={350} toggled={toggled} onToggle={onToggle} />
  );
}
