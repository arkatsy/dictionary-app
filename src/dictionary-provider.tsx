import { createContext, useState } from "react";
import { useDebouncedEffect } from "./use-debounced-effect";
import { cache } from "./lib";

type DictionaryContextType = {
  word: string;
  setWord: (word: string) => void;
  data: unknown;
  loading: boolean;
  error: string | null;
};

type DictionaryProviderProps = {
  children: React.ReactNode;
  initialWord?: string | null;
  delay?: number;
};

export const DictionaryContext = createContext<DictionaryContextType | null>(null);

export const DictionaryProvider = ({
  children,
  initialWord,
  delay = 500,
}: DictionaryProviderProps) => {
  const [word, setWord] = useState(initialWord ?? "");
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useDebouncedEffect(
    async () => {
      if (word) {
        const cached = cache.get(word);

        if (cached) {
          setData(cached);
          return;
        }
        const controller = new AbortController();

        try {
          setLoading(true);
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
      }
    },
    [word],
    delay,
  );

  const value = {
    word,
    setWord,
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
