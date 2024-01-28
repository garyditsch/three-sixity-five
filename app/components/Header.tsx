import { Link } from "@remix-run/react";

let id = '5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0'

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

export function Header() {
    return (
        <div className="w-full h-full flex flex-col justify-between bg-red-200">
            <header className="h-16 w-full flex items-center relative justify-end px-5 space-x-10 bg-gray-800">
                <div className="flex flex-shrink-0 items-center space-x-4 text-white">
                    {id === '' ? <LogInHeader />
                    : <LogOutHeader />}
                </div>
            </header>
        </div>
    )
}