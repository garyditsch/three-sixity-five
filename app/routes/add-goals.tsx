import type { MetaFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "365" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {


  return (
    <main className="max-w-full h-full flex relative overflow-y-hidden bg-slate-100">
      <div className="bg-yellow-500 w-full">
        <Form>
            <ul>
            <li><input type="text" name="title" placeholder="Goal"></input></li>
            <li><input type="text" name="days" placeholder="Days"></input></li>
            </ul>
            <button type="submit">Submit</button>
        </Form>
      </div>
  </main>
  );
}