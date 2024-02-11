import { json, redirect } from "@remix-run/node";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData, useLocation } from "@remix-run/react";
import { goalDataQuery } from "~/queries/behaviors-filtered";


export async function action({ request, params }: ActionFunctionArgs){
    const formData = await request.formData();
    const goal_id = formData.get("goal_id")
    const fromURL = formData.get("from")
    if(goal_id && fromURL){
        return redirect(`${fromURL}?goalId=${goal_id}`);
    }   
    return null;
  }

export async function loader({request}: LoaderFunctionArgs) {
    // let user = await readUserSession(request)
    const { goalData, errorMsg } = await goalDataQuery(request);
  
    return json({ 
      goalData: goalData,
      errorMsg: errorMsg,
    })
  }

export default function CalendarGoalFilters() {   
    const location = useLocation();
    console.log('LOCATION', location)
    const redirectURL = location.state?.from;
    console.log('REDIRECT URL', redirectURL)


    const { goalData, errorMsg } = useLoaderData<typeof loader>();
    console.log('ERROR MSG', errorMsg)

    // create goal options
    const goalOptions = goalData?.map((goal) => {
        return <option key={goal.id} value={goal.id}>{goal.goal}</option>
    }) || null;

    return (
        // <!--Modal-->
        <div className="fixed w-full h-full top-0 left-0 flex items-center justify-center">
        <div className="absolute w-full h-full bg-gray-800 opacity-95"></div>

        <div className="fixed max-w-[400px] min-w-[400px] h-2/3 z-50 overflow-y-auto bg-white rounded-lg">
            
            <div className="absolute top-0 right-0 cursor-pointer flex flex-col items-center mt-4 mr-4 text-black text-sm z-50">
            <svg className="fill-current text-black" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
            </svg>
            </div>

            {/* <!-- Add margin if you want to see grey behind the modal--> */}
            <div className="container mx-auto h-auto text-left m-20 p-4">
            
            {/* <!--Title--> */}
            <div className="flex justify-between items-center pb-2">
                <p className="text-2xl font-bold text-gray-800">Filter by a specific goal.</p>
            </div>

            {/* <!--Body--> */}
                <Form method="post" className="grid">
                    <select id="goal_id" name="goal_id" className="w-full } border-gray-400 rounded-lg shadow-sm mb-4">
                        {goalOptions}
                    </select>   
                    <input type="hidden" name="from" value={redirectURL} />             
                
                {/* <!--Footer--> */}
                <div className="flex justify-end pt-2">
                    <button type="submit" className="w-full p-2 bg-gray-800 text-white text-center rounded-md">
                        Filter
                    </button>
                </div>
                </Form>
            </div>
        </div>
        </div>
    )
}