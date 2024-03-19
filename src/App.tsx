import { ThemeProvider } from "./theme-provider";
import { Header } from "./header";
import { DictionaryProvider } from "./dictionary-provider";
import Searchbar from "./search";
import Content from "./content";

const isDEV = import.meta.env.MODE === "development";

const cacheLimit = isDEV ? 2 : 200;
const cacheKey = isDEV ? "dictionary-cache-dev" : "dictionary-cache";

function getInitWordFromUrl() {
  const url = new URL(window.location.href);
  return url.searchParams.get("word");
}

// TODO: Move providers to main.tsx
export default function App() {
  const initWord = getInitWordFromUrl();

  return (
    <ThemeProvider>
      <DictionaryProvider initialWord={initWord} cacheLimit={cacheLimit} cacheKey={cacheKey} delay={450}>
        <Layout>
          <Header />
          <Searchbar />
          <Content />
        </Layout>
      </DictionaryProvider>
    </ThemeProvider>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center">
      <div className="relative mx-5 w-full max-w-4xl py-14">
        <div className="flex flex-col gap-10">{children}</div>
        <Credits />
      </div>
    </div>
  );
}

// TODO: Find a better place to show the credits.
function Credits() {
  return (
    <div className="absolute bottom-2 flex gap-3">
      <div className="flex gap-2">
        <p>Created by</p>
        <a
          href="https://github.com/arkatsy"
          target="_blank"
          rel="noreferrer"
          className="text-red-500 underline underline-offset-2 dark:text-red-400"
        >
          @arkatsy
        </a>
      </div>
      &#8226;
      <div className="flex gap-2">
        <p>API by</p>
        <a
          href="https://dictionaryapi.dev/"
          target="_blank"
          rel="noreferrer"
          className="text-violet-500 underline underline-offset-2"
        >
          dictionaryapi.dev
        </a>
      </div>
    </div>
  );
}
