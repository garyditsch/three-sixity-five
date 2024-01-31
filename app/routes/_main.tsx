import { Outlet, useOutletContext } from "@remix-run/react";
import { Header } from "~/components/Header";
import { Nav } from "~/components/Nav";

export default function MainLayout() {
    let user = useOutletContext()
    let id = user?.id || undefined
    return (
        <>
            <Header id={id} />
            <Nav />
            <main className="grid justify-items-center bg-gray-200 px-4">
                <div className="max-w-[400px] min-w-[350px]">
                    <Outlet />
                </div>
            </main>
        </>
    )
}