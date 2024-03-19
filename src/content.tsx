import { useRef, useState } from "react";
import { useDictionary } from "./use-dictionary";

// TODO: Add show more buttons for meanings
// TODO: Create a Link component
export default function Content() {
  const { loading, error, data, initPage } = useDictionary();
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  if (loading) return <div>Loading...</div>;

  // TODO: Differentiate between an API error and word not found error. (see dictionary-provider.tsx)
  if (error) return <div>{error}</div>;

  if (initPage)
    return (
      <div>
        <p className="text-xl">
          Search for any word to get its meaning, phonetics, synonyms, antonyms and examples.
        </p>
      </div>
    );

  // TODO: Provide choice for us / uk phonetics
  const audioSrc = data.phonetics.filter((item) => item.audio.length > 0)[0]?.audio;

  const meanings = data.meanings;

  const playPhonetic = () => {
    if (!audioRef.current) return;
    if (playing) {
      setPlaying(false);
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    } else {
      setPlaying(true);
      audioRef.current.play();
    }
  };

  return (
    <div className="flex flex-col gap-14">
      <div className="flex justify-between">
        <div className="flex flex-col gap-3">
          <h2 className="text-5xl font-bold">{data.word}</h2>
          {data.phonetic && <p className="text-xl text-violet-600 dark:text-violet-500">{data.phonetic}</p>}
        </div>
        {audioSrc && (
          <button
            onClick={playPhonetic}
            className="grid size-16 place-items-center rounded-full bg-violet-800"
          >
            {playing ? <PauseIcon /> : <PlayIcon />}
            <audio ref={audioRef} src={audioSrc} onEnded={() => setPlaying(false)}></audio>
          </button>
        )}
      </div>
      {meanings.map(({ partOfSpeech, definitions }, idx) => (
        <div key={idx} className="flex flex-col gap-6">
          <div className="flex items-center gap-6">
            <p className="text-xl font-bold">{partOfSpeech}</p>
            <Divider />
          </div>
          <div className="flex flex-col gap-5">
            <h3 className="cursor-default text-lg text-zinc-500">Meaning</h3>
            <ul className="flex flex-col gap-3">
              {definitions.map((item, idx) => (
                <li className="ml-10 list-disc marker:text-violet-700 dark:marker:text-violet-600" key={idx}>
                  {item.definition}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
      <div className="flex flex-col gap-4">
        <Divider />
        <div className="flex items-center gap-4">
          <p className="self-start text-violet-400 dark:text-violet-100">Source</p>
          <ul className="flex flex-wrap gap-2">
            {data.sourceUrls.map((source, idx) => (
              <li key={idx}>
                <a
                  href={source}
                  target="_blank"
                  rel="noreferrer"
                  className="flex gap-1 break-all text-violet-500 underline underline-offset-2"
                >
                  {source}
                  <BoxArrowIcon />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Divider() {
  return <div className="mt-1.5 w-full border-b border-violet-100 dark:border-zinc-800"></div>;
}

// TODO: Icon styles should be provided by their users.
function BoxArrowIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="relative top-1 size-4 text-violet-400 opacity-70 dark:text-violet-200"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
      />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="size-8 fill-current text-violet-800 dark:text-violet-300"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
      />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      strokeWidth={4}
      stroke="currentColor"
      className="size-8 fill-current text-violet-800 dark:text-violet-300"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
    </svg>
  );
}
