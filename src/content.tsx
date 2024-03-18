import { useDictionary } from "./use-dictionary";

export default function Content() {
  const { loading, error, data, initPage } = useDictionary();

  if (loading) return <div>Loading...</div>;

  if (error) return <div>Error: {error}</div>;

  if (initPage) return <div>Search for a word</div>;

  return <div>{JSON.stringify(data)}</div>;
}
