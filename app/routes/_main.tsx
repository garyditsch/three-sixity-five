import { Outlet } from "@remix-run/react";
import { Header } from "~/components/Header";
import { Nav } from "~/components/Nav";

let id = '5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0'

export default function MainLayout() {
    return (
        <>
            <Header />
            <Nav />
            <main className="grid justify-items-center bg-gray-200 px-4">
                <div className="max-w-lg">
                    <Outlet context={id} />
                </div>
            </main>
        </>
    )
}