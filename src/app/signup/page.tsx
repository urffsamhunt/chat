import { createClient } from "../utils/supabase/server";
import { signup } from "../login/actions";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function SignupPage() {
  const h = await headers();
  const client = await createClient();
  const { data, error } = await client.auth.getUser();
  if (!error) {
    redirect("" + h.get('x-forwarded-proto') + "://" + h.get('host') + "/chat/home");
  }

  return (
    <div className="flex flex-col w-screen h-[calc(100vh-3rem)] gap-3 justify-center items-center">
      <div className="sm:w-[25%] w-[90%] card card-border card-lg bg-base-100">
        <div className="card-body">
          <h1 className="card-title">Sign Up</h1>
          <form className="flex flex-col gap-3">

            <input className="input" placeholder="E-mail" id="email" name="email" type="email" required />
            <input className="input" placeholder="Username" id="username" name="username" type="username" required />
            <input className="input" placeholder="Full Name" id="full_name" name="full_name" type="text" required />
            <input className="input" placeholder="Password" id="password" name="password" type="password" required />
            <div className="card-actions">
              <button className="btn-secondary btn" formAction={signup}>Sign up</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}