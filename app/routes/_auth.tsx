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
        </>
    )
}