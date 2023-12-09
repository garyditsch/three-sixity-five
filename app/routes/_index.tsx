import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "365" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {


  return (
    <main className="max-w-full h-full flex relative overflow-y-hidden bg-slate-100">
      <div className="mt-2 w-full z-10">
        <div className="mt-8 pl-8 mx-auto text-left font-medium text-xl text-blue-500 hover:text-blue-700 hover:bg-blue-50">Log Today</div>
        <ul
            className="mt-8 mx-auto text-left font-medium text-lg leading-none border-blue-200 divide-y divide-blue-200">
            <li>
                <Link to="#" className="py-3.5 w-full flex items-center text-blue-500 hover:text-blue-700 hover:bg-blue-50">
                    <span className="ml-5 mr-2.5 w-1 h-7 bg-blue-500 rounded-r-md"></span>
                    Run
                </Link>
            </li>
            <li>
                <Link to="#" className="py-3.5 w-full flex items-center text-blue-500 hover:text-blue-700 hover:bg-blue-50">
                    <span className="ml-5 mr-2.5 w-1 h-7 bg-blue-500 rounded-r-md"></span>
                    Go
                </Link>
            </li>
            <li>
                <Link to="#" className="py-3.5 w-full flex items-center text-blue-500 hover:text-blue-700 hover:bg-blue-50">
                    <span className="ml-5 mr-2.5 w-1 h-7 bg-blue-500 rounded-r-md"></span>
                    <p>
                        Jest
                        <span className="font-normal text-gray-500 text-sm">(JavaScript)</span>
                    </p>
                </Link>
            </li>
            <li>
                <Link to="#" className="py-3.5 w-full flex items-center text-blue-500 hover:text-blue-700 hover:bg-blue-50">
                    <span className="ml-5 mr-2.5 w-1 h-7 bg-blue-500 rounded-r-md"></span>
                    <p>
                        JUnit
                        <span className="font-normal text-gray-500 text-sm">(Java)</span>
                    </p>
                </Link>
            </li>
            <li>
                <Link to="#" className="py-3.5 w-full flex items-center text-blue-500 hover:text-blue-700 hover:bg-blue-50">
                    <span className="ml-5 mr-2.5 w-1 h-7 bg-blue-500 rounded-r-md"></span>
                    <p>
                        minitest
                        <span className="font-normal text-gray-500 text-sm">(Ruby)</span>
                    </p>
                </Link>
            </li>
            <li>
                <Link to="#" className="py-3.5 w-full flex items-center text-blue-500 hover:text-blue-700 hover:bg-blue-50">
                    <span className="ml-5 mr-2.5 w-1 h-7 bg-blue-500 rounded-r-md"></span>
                    <p>
                        Mocha
                        <span className="font-normal text-gray-500 text-sm">(JavaScript)</span>
                    </p>
                </Link>
            </li>
        </ul>
    </div>
  </main>
  );
}