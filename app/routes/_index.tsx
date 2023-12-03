import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "365" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <main className="max-w-full h-full flex relative overflow-y-hidden">
      {/* <!-- Container --> */}
      <div className="h-full w-full m-4 flex flex-wrap items-start justify-start rounded-tl grid-flow-col auto-cols-max gap-4 overflow-y-scroll">
        {/* <!-- Container --> */}
        <div className="w-96 h-60 rounded-lg flex-shrink-0 flex-grow bg-gray-400">
          One, Two, Three
        </div>
        <div className="w-96 h-60 rounded-lg flex-shrink-0 flex-grow bg-gray-400"></div>
        <div className="w-96 h-60 rounded-lg flex-shrink-0 flex-grow bg-gray-400"></div>
        <div className="w-96 h-60 rounded-lg flex-shrink-0 flex-grow bg-gray-400"></div>
        <div className="w-96 h-60 rounded-lg flex-shrink-0 flex-grow bg-gray-400"></div>
        <div className="w-96 h-60 rounded-lg flex-shrink-0 flex-grow bg-gray-400"></div>
        <div className="w-96 h-60 rounded-lg flex-shrink-0 flex-grow bg-gray-400"></div>
        <div className="w-96 h-60 rounded-lg flex-shrink-0 flex-grow bg-gray-400"></div>
        <div className="w-96 h-60 rounded-lg flex-shrink-0 flex-grow bg-gray-400"></div>
    </div>
  </main>
  );
}
