"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Home, Person2Rounded, AdsClick, Campaign, AdminPanelSettings, Logout, Chat } from "@mui/icons-material";
import { logout } from "../login/actions";
import { createClient } from "../utils/supabase/client";
import { User } from "@supabase/supabase-js";

const navItems = [
    { name: "Chats", route: "/chat/home", icon: <Chat /> },
    { name: "Profile", route: "/chat/profile", icon: <Person2Rounded /> },
    { name: "Contacts", route: "/chat/contacts", icon: <AdsClick /> },
    { name: "Settings", route: "/chat/settings", icon: <Campaign /> }
];

export function GetUser() {
    const [user, setUser] = useState<any>({});
    const client = createClient();
    useEffect(() => {
        client.auth.getUser().then((response) => {
            const data = response.data.user;
            setUser(data?.user_metadata || "User");
        });
    }
        , [client]);
    return user;
}

export function SideBar() {
    const pathname = usePathname();
    const [showModal, setShowModal] = useState(false);
    const details = GetUser();

    return (
        <aside className="h-screen w-64 flex flex-col z-50 p-4 gap-4 bg-base-100 border-r-2 border-base-300">
            <div className="card card-xs bg-base-100 card-border border-base-300 shadow">
                <div className="card-body p-4 gap-2 items-center">
                    <div className="avatar mb-2">
                        {details.avatar_url ? (
                            <div className="flex justify-center mb-2">
                                <div className="w-12 h-12 rounded-full overflow-hidden border border-base-200">
                                   <img
                                            src={details.avatar_url}
                                               alt="Avatar"
                                               className="w-full h-full object-cover"
                                                />
                                        </div>

                            </div>
                        ):
                        (<span>{details.full_name ? details.full_name[0] : ""}</span>)
                        }
                    </div>
                    <h3 className="text-xl font-semibold">Welcome!</h3>
                    <p className="text-base-content/70 text-lg">{details.full_name ?? ""}</p>
                </div>
            </div>
            <ul className="menu menu-lg w-full bg-base-100 card card-border border-base-300 gap-2">
                {navItems.map(({ name, route, icon }) => {
                    const selected = pathname.includes(route);
                    return (
                        <li key={name}>
                            <Link
                                href={route}
                                className={`py-2 transition-colors duration-200 ${selected ? "menu-active text-primary-content shadow" : ""
                                    }`}
                            >
                                <span className="text-xl">{icon}</span>
                                <span className="font-medium">{name}</span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
            <div className="mt-auto">
                <button
                    className="btn btn-error btn-block btn-outline flex items-center gap-2"
                    onClick={() => setShowModal(true)}
                >
                    <Logout fontSize="small" />
                    Sign Out
                </button>
            </div>
            {/* Modal */}
            {showModal && (
                <dialog className="modal modal-open" open>
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Sign Out</h3>
                        <p className="py-4">Are you sure you want to sign out?</p>
                        <div className="modal-action">
                            <form className="space-x-2">
                                <button
                                    className="btn btn-outline"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-error"
                                    formAction={logout}
                                >
                                    Yes, Sign Out
                                </button>
                            </form>
                        </div>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button aria-label="Close" onClick={() => setShowModal(false)}>close</button>
                    </form>
                </dialog>
            )}
        </aside>
    );
}