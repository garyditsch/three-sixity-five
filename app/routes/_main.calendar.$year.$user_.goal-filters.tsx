import { json, redirect } from "@remix-run/node";
import type { MetaFunction, LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData,  } from "@remix-run/react";
import { goalDataQuery } from "~/queries/behaviors-filtered";

export async function action({ request, params }: ActionFunctionArgs){
    console.log('PARAMS', params)
    const formData = await request.formData();
    const goalId = formData.get("goalId")
    console.log('GOAL ID', goalId)
    
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
        console.log(goal)
        return <option key={goal.id} value={goal.id}>{goal.goal}</option>
    }) || null;

    console.log('GOAL OPTIONS', goalOptions)
    return (
        <div className="w-full pt-2">
            <Form method="post" className="grid grid-cols-2" >
                <select id="goalId" name="goalId">
                {goalOptions}
                </select>
                <div className="grid justify-items-center">
                <button type="submit">Run</button>
                </div>
            </Form>  
        </div>
    )
}