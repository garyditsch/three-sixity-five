import { Outlet } from "@remix-run/react";
import { Header } from "~/components/Header";

export default function AuthLayout() {
    return (
        <>
            <Header />
            <div></div>
            <main className="bg-gray-200 p-4">
                <Outlet />
            </main>
        </>
    )
}