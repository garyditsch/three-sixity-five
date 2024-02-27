import type { MetaFunction } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import localforage from "localforage";
import { useEffect } from 'react';

export const meta: MetaFunction = () => {
  return [
    { title: "Success!" },
    { name: "description", content: "Successful Day" },
  ];
};

export default function Index() {
  const navigate = useNavigate();
  useEffect(() => {
    localforage.clear().then(() => {
      console.log('IndexDB is now empty.');
    }).catch((err) => {
      console.log('localforage error', err);
    });
  }, []);

  return (
      <>
        <div className="text-center font-bold text-xl">You have been successful today!</div>
        <button className="bg-gray-800 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded" onClick={() => navigate(-1)}>Go back</button>
      </>
  );
}