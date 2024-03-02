import { Link } from "@remix-run/react";

export const GoalFilterLink = (pathname) => {
  return (
    <div>
        Goals: 
        <Link to="/goalfilters" state={{ from: pathname.pathname, searching: pathname.search }} className={`w-1/4 shrink-0 mx-2 rounded-full text-xs font-bold py-1 px-2 bg-gray-500 text-white text-center`}>
            <button>Filter by Goal</button>
        </Link>
    </div>
  );
}