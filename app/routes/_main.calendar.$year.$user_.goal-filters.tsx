import { json, redirect } from "@remix-run/node";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData,  } from "@remix-run/react";
import { goalDataQuery } from "~/queries/behaviors-filtered";

export async function action({ request, params }: ActionFunctionArgs){
    const formData = await request.formData();
    const goalId = formData.get("goalId")
    
    if(goalId){
        throw redirect(`/calendar/2024/${params.user}?goalId=${goalId}`);
    }   
    return null;
  }

export async function loader({request}: LoaderFunctionArgs) {
    const { goalData, errorMsg } = await goalDataQuery(request);
  
    return json({ 
      goalData: goalData,
      errorMsg: errorMsg,
    })
  }

export default function CalendarGoalFilters() {   

    const { goalData, errorMsg } = useLoaderData<typeof loader>();
    console.log('ERROR MSG', errorMsg)

    // create goal options
    const goalOptions = goalData?.map((goal) => {
        return <option key={goal.id} value={goal.id}>{goal.goal}</option>
    }) || null;

    return (
        <div className="w-full pt-2">
            <Form method="post" className="grid" >
                <label htmlFor="goal" className="my-2 block text-lg font-medium text-gray-800">Filter by a specific goal.</label>
                <select id="goalId" name="goalId" className="w-full border-gray-400 rounded-lg shadow-sm mb-4">
                {goalOptions}
                </select>
                <div>
                    <button className="w-full p-2 bg-gray-800 text-white text-center rounded-md" type="submit">Filter</button>
                </div>
            </Form>  
        </div>
    )
}