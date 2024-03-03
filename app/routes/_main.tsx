import { type LoaderFunctionArgs } from "@remix-run/node";
import { readUserSession } from "~/utils/auth";

import { Outlet, useLoaderData } from "@remix-run/react";
import { Header } from "~/components/Header";
import { Nav } from "~/components/Nav";

import type { HeaderContext } from "~/utils/types";

export async function loader({request}: LoaderFunctionArgs) {
    let user = await readUserSession(request)
    return {
        user
  }
}

export default function MainLayout() {
    const user = useLoaderData() as HeaderContext;
    return (
        <>
            <Header user={user} />
            <Nav user={user} />
            <main className="grid justify-items-center bg-gray-200 px-4">
                <div className="max-w-[400px] min-w-[350px]">
                    <Outlet context={user} />
                </div>
            </main>
            <footer className="grid w-full py-2 px-4 bg-gray-800 items-center justify-items-center text-white">
                Three Sixty Five, v. 1.0.0
            </footer>
        </>
    )
}