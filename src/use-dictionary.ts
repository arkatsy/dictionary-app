import { useContext } from "react";
import { DictionaryContext } from "./dictionary-provider";

export const useDictionary = () => {
  const context = useContext(DictionaryContext);
  if (!context) {
    throw new Error("useDictionary must be used within a DictionaryProvider");
  }

  return context;
};
