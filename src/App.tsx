import { ThemeProvider } from "./theme-provider";
import { Header } from "./header";
import { DictionaryProvider } from "./dictionary-provider";
import Searchbar from "./search";
import { useDictionary } from "./use-dictionary";

export default function App() {
  const url = new URL(window.location.href);
  const word = url.searchParams.get("word");

  return (
    <ThemeProvider>
      <DictionaryProvider initialWord={word}>
        <Layout>
          <Header />
          <Searchbar />
          <Content />
        </Layout>
      </DictionaryProvider>
    </ThemeProvider>
  );
}

function Content() {
  const { loading, error, data, initPage } = useDictionary();

  if (loading) return <div>Loading...</div>;

  if (error) return <div>Error: {error}</div>;

  if (initPage) return <div>Search for a word</div>;

  return <div>{JSON.stringify(data)}</div>;
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center">
      <div className="mx-5 flex w-full max-w-4xl flex-col gap-10 py-14">
        {children}
      </div>
    </div>
  );
}
