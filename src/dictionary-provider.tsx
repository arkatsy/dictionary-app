import { createContext, useState } from "react";
import { useDebouncedEffect } from "./use-debounced-effect";
import { cache } from "./lib";

type DictionaryContextType = {
  word: string;
  setWord: (word: string) => void;
  initPage: boolean;
  data: unknown;
  loading: boolean;
  error: string | null;
};

type DictionaryProviderProps = {
  children: React.ReactNode;
  initialWord?: string | null;
  delay?: number;
};

export const DictionaryContext = createContext<DictionaryContextType | null>(
  null,
);

export const DictionaryProvider = ({
  children,
  initialWord,
  delay = 500,
}: DictionaryProviderProps) => {
  const [word, setWord] = useState(initialWord ?? "");
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initPage, setInitPage] = useState(false);

  useDebouncedEffect(
    async () => {
      if (word) {
        setInitPage(false);
        const cached = cache.get(word);

        if (cached) {
          setLoading(false);
          setData(cached);
          return;
        }
        const controller = new AbortController();

        try {
          const res = await fetch(
            `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
            { signal: controller.signal },
          );
          const data = (await res.json())[0];

          if (data) {
            cache.push(word, data);
            setData(data);
          } else {
            setError("No data found");
          }
        } catch (error) {
          setError("Something went wrong");
        } finally {
          setLoading(false);
        }

        return () => controller.abort();
      } else {
        setLoading(false);
        setInitPage(true);
      }
    },
    [word],
    delay,
  );

  const value = {
    word,
    setWord,
    initPage,
    data,
    loading,
    error,
  };

  return (
    <DictionaryContext.Provider value={value}>
      {children}
    </DictionaryContext.Provider>
  );
};
