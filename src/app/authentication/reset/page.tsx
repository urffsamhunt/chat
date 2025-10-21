import { send } from "process";
import { sendResetLink } from "../../login/actions";

export default function ResetPage() {
    return (
        <div className="w-screen flex justify-center items-center h-[calc(100vh-3rem)]">
            <div className="sm:w-[25%] w-[90%] card card-border card-lg bg-base-100">
                <div className="card-body">
                    <h1 className="card-title">Reset Password</h1>
                    <form className="flex flex-col gap-3">
                        <input
                            className="input"
                            placeholder="E-mail"
                            id="email"
                            name="email"
                            type="email"
                            required
                        />
                        <div className="card-actions">
                            <button className="btn-primary btn" type="submit" formAction={sendResetLink}>
                                Send Reset Link
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}