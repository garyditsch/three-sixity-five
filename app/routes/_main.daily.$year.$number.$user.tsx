import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ClientLoaderFunctionArgs } from "@remix-run/react";
import { useLoaderData, useParams } from "@remix-run/react";
import { getCountsByGoal, groupedByCategory } from "~/utils/data-parsers";
import { getMonthDayYear, getDayOfYear } from "~/utils/date-helper";
import { behaviorDataQuery, noteDataQuery } from "~/queries/behaviors-filtered";
import localforage from "localforage";
import { LinkButton } from "~/components/LinkButton";
import { Note } from "~/components/Note";
import { readUserSession } from "~/utils/auth";
import CryptoJs from 'crypto-js';

export const meta: MetaFunction = () => {
  return [
    { title: "Daily Log" },
    { name: "description", content: "A look at your daily behavior log" },
  ];
};

export async function loader({request}: LoaderFunctionArgs) {
  const magicnotekey =  process.env.MAGICNOTEKEY
  let user = await readUserSession(request);
  const { behaviorData, error } = await behaviorDataQuery(request);
  const { noteData, noteError } = await noteDataQuery(request);

  // Need to decrpyt the notes data here
  const Decrypt = (note: string) => {
    return CryptoJs.AES.decrypt(note, magicnotekey).toString(CryptoJs.enc.Utf8);
  }

  const decryptedNotes = noteData?.map((note) => {
    const decrypted_note = Decrypt(note.note)
    return {
      ...note,
      note: decrypted_note
    }
  })

  return json({ 
    user: user,
    behaviorData: behaviorData,
    noteData: decryptedNotes,
    noteError: noteError,
    error: error
  });
}

export async function clientLoader({ serverLoader }: ClientLoaderFunctionArgs) {
  const behaviorCached = await localforage.getItem('behaviorData');
  const noteCached = await localforage.getItem('noteData');
  const userCached = await localforage.getItem('user');
  if (behaviorCached && noteCached) {
    return { 
      behaviorData: behaviorCached, 
      noteData: noteCached,
      user: userCached
    }
  }

  const serverData = await serverLoader();
  localforage.setItem('behaviorData', serverData.behaviorData);
  localforage.setItem('noteData', serverData.noteData);
  localforage.setItem('user', serverData.user);
  return {
    behaviorData: serverData.behaviorData,
    noteData: serverData.noteData,
    user: serverData.user
  };
}

export default function DailyView() {
  const params = useParams();
  const { behaviorData, error, noteData, noteError } = useLoaderData<typeof loader>();
  console.log('ERROR', error)
  console.log('NOTE ERROR', noteError)

  const behaviorCounts =  getCountsByGoal(behaviorData)
  const selectedDay = getMonthDayYear(Number(params.number), Number(params.year)).toString().split(' ').slice(0, 4).join(' ')

  const todaysBehaviors = behaviorData?.filter((day) => {
    const day_of_year = getDayOfYear(new Date(day.activity_date))
    if(String(day_of_year) === params.number){
        return day
    }
    return null;
  })
  const grouped = groupedByCategory(todaysBehaviors)
  console.log('GROUPED', grouped)

  const todaysNotes = noteData?.filter((day) => {
    const day_of_year = getDayOfYear(new Date(day.activity_date))
    if(String(day_of_year) === params.number){
        return day
    }
    return null;
  })

  // get year
  const year = new Date().getFullYear();

  return (
    <div className="grid-flow-col auto-cols-auto gap-4 overflow-y-hidden">
        <div className="mt-4 text-2xl text-gray-800 border-b-2 border-gray-800">{selectedDay}</div>
        {Object.keys(grouped).map((key) => (
          <div key={key} className="py-2">
            <div className="text-2xl font-semibold text-gray-800">{key}</div>
            <ul className="text-left text-lg text-gray-800 border-blue-200 divide-y divide-blue-200">
              {grouped[key].map((behavior: any) => (
                <li key={behavior.id}>
                  {behavior.goals.goal}  <span className="text-xs">(  {behaviorCounts[behavior.goals.goal]} of {behavior.goals.value} )</span>
                </li>  
              ))}
            </ul>
          </div>
        ))}
        <Note note={todaysNotes}/>
        <LinkButton label={'Add Behavior'} width={'w-2/4'} to={`/daily/${year}/${params.number}/${params.user}/edit`} />
    </div>
  );
}