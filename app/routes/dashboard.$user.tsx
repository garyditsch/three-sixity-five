import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { useParams } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "365" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader({
  params,
}: LoaderFunctionArgs) {
  return params.user
}


const year: object[] = [];
const noDays = 365;

for(let i = 0; i < noDays; i++){
  year.push({
    "number": i,
    "future": false,
    "complete": true,
  })
}

export default function Dashboard() {
  const params = useParams()

  return (
    <main className="max-w-full h-full flex relative overflow-y-hidden">
      {/* <!-- Container --> */}
      <div className="h-100 w-full m-4 flex flex-wrap items-start justify-start rounded-tl grid-flow-col auto-cols-auto gap-4 overflow-y-scroll bg-slate-200">
        {/* <!-- Container --> */}
        <div className="w-full h-1/6 rounded-lg flex items-center justify-center flex-shrink-0 flex-grow bg-gray-400">
          {params.user}
        </div>
        <div className="w-full h-1/6 rounded-lg flex items-center justify-center flex-shrink-0 flex-grow bg-gray-400">
          One, Two, Three
        </div>
        <div className="w-full h-100 rounded-lg grid grid-cols-7 justify-items-center gap-4"> 
          {year.map((day: any) => {
            return <div className={`w-10 h-10 flex items-center justify-center 
              ${day.future ? 'bg-gray-200' : !day.future && day.complete ? 'bg-green-300' : 'bg-red-300'}`} key={day.number}>{day.number + 1}
            </div>
          })}
        </div>
    </div>
  </main>
  );
}