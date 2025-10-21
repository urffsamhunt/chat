'use client';

import { useEffect } from "react";
import { updatePassword } from "../../login/actions";
import { createClient } from "@/app/utils/supabase/client";

export default function UpdatePasswordPage() {
    const supabase = createClient();
    useEffect(() => {
        supabase.auth.onAuthStateChange(async (event, session) => {
            console.log("Auth state changed:", event, session);
            if (event == "PASSWORD_RECOVERY") {
                const newPassword = prompt("What would you like your new password to be?");
                if (newPassword !== null) {
                    const { data, error } = await supabase.auth.updateUser({ password: newPassword });
                    if (data) alert("Password updated successfully!");
                    if (error) alert("There was an error updating your password.");
                } else {
                    alert("Password update cancelled.");
                }
            }
        })
    }, [])
    return (
        <div className="h-[calc(100vh-3rem)] w-screen flex justify-center items-center">
            <div className="sm:w-[25%] w-[90%] card card-border card-lg bg-base-100">
                <div className="card-body">
                    <h1 className="card-title">Update Password</h1>
                    <form className="flex flex-col gap-3">
                        <input
                            className="input"
                            placeholder="New Password"
                            id="password"
                            name="password"
                            type="password"
                            required
                        />
                        <div className="card-actions">
                            <button className="btn-primary btn" type="submit" formAction={updatePassword}>
                                Update Password
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}