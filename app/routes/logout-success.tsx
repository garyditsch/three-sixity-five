import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Logout Success" },
    { name: "description", content: "You have been logged out" },
  ];
};

export default function Index() {


  return (
    <main className="max-w-full h-full flex relative overflow-y-hidden bg-slate-100">
      <div className="w-full text-center pt-4">Logout Successful</div>
  </main>
  );
}