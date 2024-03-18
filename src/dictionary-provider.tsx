import { createContext, useRef, useState } from "react";
import { useDebouncedEffect } from "./use-debounced-effect";
import LocalStorageCache from "./local-storage-cache";

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
  cacheLimit?: number;
  cacheKey?: string;
};

export const DictionaryContext = createContext<DictionaryContextType | null>(null);

export const DictionaryProvider = ({
  children,
  initialWord,
  delay = 500,
  cacheLimit,
  cacheKey,
}: DictionaryProviderProps) => {
  const [word, setWord] = useState(initialWord ?? "");
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initPage, setInitPage] = useState(false);

  cacheKey = cacheKey ?? "dictionary-cache";
  cacheLimit = cacheLimit ?? 150;
  const cache = useRef(new LocalStorageCache({ key: cacheKey, limit: cacheLimit })).current;

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

        setLoading(true);
        try {
          const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`, {
            signal: controller.signal,
          });
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

  return <DictionaryContext.Provider value={value}>{children}</DictionaryContext.Provider>;
};
