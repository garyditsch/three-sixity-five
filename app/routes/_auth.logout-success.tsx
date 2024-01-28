import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Logout Success" },
    { name: "description", content: "You have been logged out" },
  ];
};

export default function Index() {


  return (
      <div className="text-center font-bold text-xl">Logout Successful</div>
  );
}