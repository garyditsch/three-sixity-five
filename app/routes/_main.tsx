import { Outlet } from "@remix-run/react";
import { Header } from "~/components/Header";
import { Nav } from "~/components/Nav";

let id = '5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0'

export default function MainLayout() {
    return (
        <>
            <Header />
            <Nav />
            <main className="bg-blue-200 p-4">
              <Outlet context={id} />
            </main>
        </>
    )
}