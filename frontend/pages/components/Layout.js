import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects } from '@/store/projectsSlice';
import ThemeToggle from '@/pages/components/ThemeToggle';
import Cookies from 'js-cookie';
import Link from 'next/link';

export default function Layout({ children }) {
    const dispatch = useDispatch();
    const projects = useSelector((state) => state.projects.items);
    const [initials, setInitials] = useState("");
    const [user, setUser] = useState("");

    useEffect(() => {
        const token = Cookies.get("token");
        const userName = Cookies.get("name");
        setUser(userName);
        if (userName) {
            const initials = userName.split(" ").map((word) => word[0]?.toUpperCase()).join("");
            setInitials(initials);
        }

        if (token) {
            dispatch(fetchProjects());
        }
    }, [dispatch]);

    const router = useRouter();

    const handleLogout = () => {
        Cookies.remove("token");
        Cookies.remove("name");
        router.push("/login");
    };

    return (
        <div className="flex min-h-screen bg-base-100 text-base-content">
            {/* Sidebar */}
            <div className="w-64 bg-base-200 shadow-md flex flex-col p-4">
                <div className="mt-auto flex items-center justify-between">
                    <Link className="btn btn-ghost text-xl" href={"/"}>
                        Dashboard
                    </Link>
                    <ThemeToggle />
                </div>

                <ul className="menu flex-1">
                    <li><Link href={"/createProject"}>Create Project</Link></li>
                    <li><Link href={"/createTask"}>Create Task</Link></li>
                    <li>
                        <details>
                            <summary>Projects</summary>
                            <ul className="p-2">
                                {projects.map(({ _id, name }) => (
                                    <li key={_id}>
                                        <Link href={`/projects/${_id}`}>{name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </details>
                    </li>
                    <li><Link href={"/users"}>Users</Link></li>
                </ul>

                <div className="mt-auto">
                    <div className="dropdown dropdown-top">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="avatar avatar-placeholder">
                                <div className="bg-neutral text-neutral-content w-8 rounded-full">
                                    <span className="text-xs">{initials}</span>
                                </div>
                            </div>
                        </div>
                        <span className="px-2">{user}</span>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mb-3 w-52 p-2 shadow">
                            <li><a onClick={handleLogout} className="cursor-pointer">Logout</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-6 flex-1 bg-base-100 text-base-content">
                {children}
            </div>
        </div>
    );

}
