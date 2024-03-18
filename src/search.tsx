import { twMerge } from "tailwind-merge";
import { useDictionary } from "./use-dictionary";
import { useRef } from "react";

export default function Searchbar() {
  const inputRef = useRef<HTMLInputElement>(null);
  const onSearchIconClick = () => inputRef.current?.focus();
  const { word, setWord } = useDictionary();

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const word = e.target.value;
    setWord(word);
    if (word.length === 0) {
      window.history.replaceState({}, "", new URL(window.location.href).origin);
      return;
    }

    const params = new URLSearchParams(window.location.search);
    params.set("word", word);

    window.history.replaceState({}, "", `search?${params}`);
  };

  return (
    <div className="group relative">
      <input
        ref={inputRef}
        type="text"
        value={word}
        onChange={onChange}
        placeholder="Search for a word..."
        className="w-full rounded-xl bg-violet-100 px-4 py-4 pr-14 text-lg font-semibold text-zinc-800 
          placeholder:font-normal focus:outline focus:outline-2 focus:outline-violet-600 dark:bg-zinc-800 dark:text-zinc-200"
      />
      <div
        className="absolute right-4 top-0 grid h-full place-items-center"
        onClick={onSearchIconClick}
      >
        <SearchIcon className="text-violet-300 group-focus-within:text-violet-500 dark:text-zinc-600" />
      </div>
    </div>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={twMerge("size-7", className)}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
      />
    </svg>
  );
}
