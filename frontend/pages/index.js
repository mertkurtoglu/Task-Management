import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

export default function Home() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState({});
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) {
            setLoading(false);
            return;
        }

        const fetchProjects = async () => {
            try {
                const res = await fetch("http://localhost:5000/projects", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    throw new Error("Failed to fetch projects");
                }

                const data = await res.json();
                setProjects(data);

                const userPromises = data.map(async (project) => {
                    if (project.createdBy) {
                        const userRes = await fetch(`http://localhost:5000/auth/user/${project.createdBy}`, {
                            headers: { Authorization: `Bearer ${token}` },
                        });
                        if (userRes.ok) {
                            const userData = await userRes.json();
                            return { [project.createdBy]: userData };
                        }
                    }
                    return null;
                });

                const userResponses = await Promise.all(userPromises);
                const usersData = userResponses.reduce((acc, user) => {
                    if (user) {
                        acc = { ...acc, ...user };
                    }
                    return acc;
                }, {});
                setUsers(usersData);

            } catch (error) {
                console.error("Error fetching projects:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Projects</h1>
            {projects.length === 0 ? (
                <div className="text-center text-base-500 text-lg mt-20">
                    🚧 No project has been created yet.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map(({ _id, name, description, createdBy }) => (
                        <div
                            key={_id}
                            // className="bg-base-100 rounded-2xl shadow-md hover:shadow-xl transition-shadow shadow-gray-400 p-6 border border-base-200"
                            className="bg-base-100 rounded-2xl ring-2 ring-base-300 p-6 border border-base-200"
                        >
                            <h2 className="text-xl font-semibold text-base-800 mb-2">
                                {name}
                            </h2>
                            <p className="text-base-600 mb-4">
                                {description || "No description provided."}
                            </p>
                            <p className="text-sm text-base-500 mb-4">
                                👤 <span className="font-medium">Created By:</span>{" "}
                                {users[createdBy]?.user.name || "Unknown"}
                            </p>
                            <div className="flex justify-end">
                                <button
                                    className="btn btn-sm btn-soft btn-primary"
                                    onClick={() => router.push(`/projects/${_id}`)}
                                >
                                    Open Project
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
