import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react"

import { validate } from "./validate";
// import { creatAccount } from "./queries";

export const meta = () => {
    return [{title: "360 Signup"}];
};

export async function action({ request }: ActionFunctionArgs) {
    let formData = await request.formData();
    let email = String(formData.get("email"));
    let password = String(formData.get("password"));
    let errors = await validate(email, password)
    
    if(errors){
        return { errors };
    }

    // let user = await creatAccount(email, password);
    
    // return redirect("/", {
    //     headers: {
    //         "Set-Cookie": await authCookie.serialize(user.id),
    //     }
    // });
    return false;
}

export default function Signup() {
    let actionData = useActionData<typeof action>();
    let emailError = actionData?.errors?.email;
    let passwordError = actionData?.errors?.password;

    return (
        <main className="max-w-full h-full flex relative overflow-y-hidden">
            <div className="flex min-h-full flex-1 flex-col mt-20 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <h2
                      id="signup-header"
                      className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"
                    >
                        Sign Up
                    </h2>
                </div>
                <div className="sm:mx-auto sm:w-full sm:max-w-[480px]">
                    <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
                        <Form method="POST" className="space-y-6">
                            <div>
                                <label 
                                    htmlFor="email"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Email Address{" "}
                                    {emailError && (<span className="text-red-500">{emailError}</span>)}
                                </label>
                                <input 
                                    autoFocus 
                                    id="email" 
                                    name="email" 
                                    type="email" 
                                    autoComplete="email"
                                    required
                                    className="form-input block w-full rounded-md border-0 py-2 px-2 text-gray-900 shadow-sm ring-1 ring-inset
                                    ring-gray-300 placeholder:text-gray-400 
                                    focus:ring-2 focus:ring-inset focus:ring-brand-blue
                                    sm:text-sm sm:leading-6"
                                />
                                <label 
                                    htmlFor="password"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Password{" "}
                                    {passwordError && (<span className="text-red-500">{passwordError}</span>)}
                                </label>
                                <input 
                                    autoFocus 
                                    id="password" 
                                    name="password" 
                                    type="password" 
                                    autoComplete="password"
                                    required
                                    className="form-input block w-full rounded-md border-0 py-2 px-2 text-gray-900 shadow-sm ring-1 ring-inset
                                    ring-gray-300 placeholder:text-gray-400 
                                    focus:ring-2 focus:ring-inset focus:ring-brand-blue
                                    sm:text-sm sm:leading-6"
                                />
                                <button type="submit">Submit</button>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </main>
    )
}