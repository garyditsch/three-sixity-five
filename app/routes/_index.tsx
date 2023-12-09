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
      <div>
        Logger
      </div>
  </main>
  );
}