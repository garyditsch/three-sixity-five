import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { readUserSession } from "~/utils/auth";

import { Outlet, useLoaderData } from "@remix-run/react";
import { Header } from "~/components/Header";
import { Nav } from "~/components/Nav";

import type { HeaderContext } from "~/utils/types";

export async function loader({request}: LoaderFunctionArgs) {
    let user = await readUserSession(request)
    if(!user){
        console.log('no user in main layout')
        throw redirect('/login')
    }
    return {
        user
  }
}

export default function MainLayout() {
    const user = useLoaderData() as HeaderContext;
    console.log('user in main layout', user);
    return (
        <>
            <Header user={user} />
            <Nav />
            <main className="grid justify-items-center bg-gray-200 px-4">
                <div className="max-w-[400px] min-w-[350px]">
                    <Outlet context={user} />
                </div>
            </main>
        </>
    )
}