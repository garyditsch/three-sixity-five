import type { MetaFunction } from "@remix-run/node";
import localforage from "localforage";
import { useEffect } from 'react';

export const meta: MetaFunction = () => {
  return [
    { title: "Success!" },
    { name: "description", content: "Successful Day" },
  ];
};

export default function Index() {
  useEffect(() => {
    localforage.clear().then(() => {
      console.log('Database is now empty.');
    }).catch((err) => {
      console.log('localforage error', err);
    });
  }, []);

  return (
      <div className="text-center font-bold text-xl">You have been successful today!</div>
  );
}