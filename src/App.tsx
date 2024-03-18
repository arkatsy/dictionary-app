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
      <div className="mx-5 flex w-full max-w-4xl flex-col gap-10 py-14">{children}</div>
    </div>
  );
}
