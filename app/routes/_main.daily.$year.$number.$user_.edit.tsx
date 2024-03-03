import type { MetaFunction, LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ClientLoaderFunctionArgs } from "@remix-run/react";
import { useParams, useLoaderData, Form  } from "@remix-run/react";
import { createSupabaseServerClient } from "~/utils/supabase.server";
import { getMonthDayYear, getMonthDayYearTime, getDayOfYear } from "~/utils/date-helper";
import { groupedByCategory } from "~/utils/data-parsers";
import { behaviorDataQuery, goalDataQuery, noteDataQuery } from "~/queries/behaviors-filtered";
import { SubmitButton } from "~/components/SubmitButton";
import { readUserSession } from "~/utils/auth";
import localforage from "localforage";
import { Note } from "~/components/Note";
import CryptoJs from 'crypto-js';


export const meta: MetaFunction = () => {
  return [
    { title: "Edit" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader({request}: LoaderFunctionArgs) {
  const magicnotekey =  process.env.MAGICNOTEKEY
  let user = await readUserSession(request);
  const { behaviorData, error } = await behaviorDataQuery(request);
  const { goalData, goalError } = await goalDataQuery(request);
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
    error: error,
    goalData: goalData,
    goalError: goalError,
    noteData: decryptedNotes,
    noteError: noteError
  });
}

export async function clientLoader({ serverLoader }: ClientLoaderFunctionArgs) {
  const behaviorCached = await localforage.getItem('behaviorData');
  const goalCached = await localforage.getItem('goalData');
  const userCached = await localforage.getItem('user');
  const noteCached = await localforage.getItem('noteData');
  if (behaviorCached && goalCached) {
    return { 
      behaviorData: behaviorCached, 
      goalData: goalCached,
      noteData: noteCached,
      user: userCached
    }
  }

  const serverData = await serverLoader();
  localforage.setItem('behaviorData', serverData.behaviorData);
  localforage.setItem('goalData', serverData.goalData);
  localforage.setItem('noteData', serverData.noteData);
  localforage.setItem('user', serverData.user);
  console.log('note data from server on edit daily', serverData.noteData)
  return {
    behaviorData: serverData.behaviorData,
    goalData: serverData.goalData,
    noteData: serverData.noteData,
    user: serverData.user
  };
}

clientLoader.hydrate = true;

// the action here has to take in the activity date so it can log it on the correct day (unlike the daily logger)
export async function action({ request, params }: ActionFunctionArgs){
  const magicnotekey =  process.env.MAGICNOTEKEY
  let user = await readUserSession(request);
  const user_id = user.id
  const { supabase, headers } = await createSupabaseServerClient({request})

  const today = getMonthDayYearTime(Number(params.number), Number(params.year))
  const formData = await request.formData();

  switch (formData.get("intent")) {
    case 'ADD-BEHAVIOR':
      const selected_goal = formData.get("goal")
      const { behaviorError } = await supabase
        .from('behaviors')
        .insert({ user_id: user_id, goal_id: selected_goal, activity_date: today})
      
      if(behaviorError){
        return json({error: behaviorError.message }, { headers, status: 401})
      }

      return redirect(`/successful-update`, { headers });

    case 'ADD-NOTE':
      const note = formData.get("note")

      // need the note to be encrypted here with key
      const Encrypt = (note:string | null) => {
        return CryptoJs.AES.encrypt(note, magicnotekey).toString();
      }

      if (typeof note === 'string' || note === null) {
        const encrypted_note = Encrypt(note) 

        const { noteError } = await supabase
        .from('notes')
        .insert({ user_id: user_id, activity_date: today, note: encrypted_note})
      
        if(noteError){
          return json({error: noteError.message }, { headers, status: 401})
        }

        return redirect(`/successful-update`, { headers });
      } else {
        return null;
      }

    default:
      return null;
  }
}

export default function DailyEdit() {
  const { behaviorData, error, goalData, goalError, noteData, noteError } = useLoaderData<typeof loader>();
  console.log('ERROR', error)
  console.log('ERROR MSG', goalError)
  console.log('Note Error', noteError)
  let params = useParams()

  const selectedDay = getMonthDayYear(Number(params.number), Number(params.year)).toString().split(' ').slice(0, 4).join(' ')

  const todaysBehaviors = behaviorData?.filter((day) => {
    const day_of_year = getDayOfYear(new Date(day.activity_date))
    if(String(day_of_year) === params.number){
        return day
    }
    return null;
  })

  const todaysNotes = noteData?.filter((day) => {
    const day_of_year = getDayOfYear(new Date(day.activity_date))
    if(String(day_of_year) === params.number){
        return day
    }
    return null;
  })

  const grouped = groupedByCategory(todaysBehaviors)
  
  const goalOptions = goalData?.map((goal) => {
    return <option key={goal.id} value={goal.id}>{goal.goal}</option>
  })

  return (
    <div className="grid-flow-col auto-cols-auto gap-4 overflow-y-hidden">
      <div className="mt-4 text-2xl text-gray-800 border-b-2 border-gray-800">{selectedDay}</div>
        {Object.keys(grouped).map((key) => (
            <div key={key} className="py-2">
                <div className="text-2xl font-semibold text-gray-800">{key}</div>
                <ul className="text-left text-lg text-gray-800 border-blue-200 divide-y divide-blue-200">
                    {grouped[key].map((behavior: any) => (
                        <li key={behavior.id}>
                        {behavior.goals.goal}  <span className="text-xs">( {behavior.goals.value} )</span>
                    </li>  
                    ))}
                </ul>
            </div>
        ))}
        <Note note={todaysNotes}/>
        <div className="mt-4 bg-white py-8 px-6 rounded-lg shadow">
          <Form method="post">
            <input type="hidden" name="intent" value="ADD-BEHAVIOR" />
            <label htmlFor="goal" className="mb-2 block text-sm font-medium text-gray-800">Log a new behavior for this day</label>
            <div className="mt-1">
              <select id="goal" name="goal" className="w-full border-gray-400 rounded-lg shadow-sm">
                {goalOptions}
              </select>
            </div>
            <SubmitButton label={"Add Behavior"} width={"w-full" }/>
          </Form>
        </div>
        <div className="mt-4 bg-white py-8 px-6 rounded-lg shadow">
          <Form method="post">
            <input type="hidden" name="intent" value="ADD-NOTE" />
            <label htmlFor="note" className="mb-2 block text-sm font-medium text-gray-800">Add a note</label>
            <textarea id="note" name="note" className="w-full min-h-[250px] border-gray-400 rounded-lg shadow-sm" />
            <SubmitButton label={"Add Note"} width={"w-full" }/>
          </Form>
        </div>
    </div>
  );
}