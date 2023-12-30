import { type LinksFunction, type LoaderFunctionArgs } from "@remix-run/node";
import { createBrowserClient } from "@supabase/ssr";
import { readUserSession } from "./utils/auth";
import { createSupabaseServerClient } from "./utils/supabase.server";

import {
  Link,
  Links,
  LiveReload,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import stylesheet from "~/tailwind.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

// const getUserProfile = async (request: Request) => {
//   const { supabase } = await createSupabaseServerClient({request});
//   const { data, error } = await supabase.from('profiles').select()
//   console.log(error)
//   console.log(data)
//   const userName = data ? data[0].username : null;
//   if(userName){
//     return userName;
//   } else {
//     return '';
//   }
// }

export async function loader({request}: LoaderFunctionArgs) {
  let user = await readUserSession(request)
  // let username = await getUserProfile(request)
  console.log(user)
  // console.log(username)
  return {
    user
  }
}

const LogInHeader = () => {
  return (
    <Link to="/login">Login</Link>
  )
}

const LogOutHeader = () => {
   return (<>
      <form method="post" action="/logout" >
        <button className="text-gray-200">Logout</button>
      </form>
                
      <div className="flex flex-col items-end ">
        <div className="text-md font-medium "></div>
      </div>
      <div className="h-10 w-10 rounded-full cursor-pointer bg-gray-200 border-2 border-blue-400"></div>
      </>
   )
}

export default function App() {

  const { user }  = useLoaderData()
  // console.log(user)
  // console.log(username)

  // let profilename = (username === undefined ? '' : username);
  
  // get user id
  const getUserId = (user) => {
    if(user === undefined){
      return ''
    } else {
      return user.id
    }
  }
  let id = getUserId(user)
  console.log(id)

  // let id = 'c2bd5d0b-0fdd-40d9-bbaa-2a5bc3de7048'
  
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="h-screen w-full bg-white relative flex overflow-hidden">
          <aside className="h-full w-16 pt-16 flex flex-col space-y-10 items-center justify-start relative bg-gray-800 text-white">
            {/* <!-- Goals --> */}
            <div className="h-10 w-10 flex items-center justify-center rounded-lg cursor-pointer hover:text-gray-800 hover:bg-white  hover:duration-300 hover:ease-linear focus:bg-white">
              <NavLink
                to="/"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
              </NavLink>
            </div>

            {/* <!-- Dashboard --> */}
            <div className="h-10 w-10 flex items-center justify-center rounded-lg cursor-pointer hover:text-gray-800 hover:bg-white  hover:duration-300 hover:ease-linear focus:bg-white">
              <NavLink
                to={`/dashboard/${id}`}
              >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </NavLink>
            </div>
          </aside>
          <div className="w-full h-full flex flex-col justify-between">
            <header className="h-16 w-full flex items-center relative justify-end px-5 space-x-10 bg-gray-800">
              <div className="flex flex-shrink-0 items-center space-x-4 text-white">
                  {id === '' ? <LogInHeader />
                  : <LogOutHeader />}
              </div>
            </header>
            <Outlet />
          </div>
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
