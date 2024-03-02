import { Outlet, useOutletContext } from "@remix-run/react";
import { Header } from "~/components/Header";

export default function AuthLayout() {
    let user = useOutletContext()
    return (
        <>
            <Header id={user?.id || ''} />
            <div></div>
            <main className="bg-gray-200 p-4">
                <Outlet />
            </main>
            <footer className="grid w-full py-2 px-4 bg-gray-800 items-center justify-items-end text-white">
                v. 1.0.0
            </footer>
        </>
    )
}