import { Outlet } from "@remix-run/react";
import { Header } from "~/components/Header";
import { Nav } from "~/components/Nav";

export default function AuthLayout() {
    return (
        <>
            <Header />
            <main className="bg-blue-200 p-4">
                <Outlet />
            </main>
            <Nav />
        </>
    )
}