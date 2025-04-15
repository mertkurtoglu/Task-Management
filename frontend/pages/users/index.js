import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { Pencil, Trash2 } from "lucide-react";
import Cookies from "js-cookie";

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = Cookies.get("token");
    const router = useRouter();
    const currentUser = useSelector((state) => state.auth.user);

    useEffect(() => {
        const fetchUsers = async () => {
            if (!token) return;
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/users`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error("Failed to fetch users");

                const data = await res.json();
                setUsers(data.users);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleEdit = (id) => {
        if (!currentUser || currentUser.role !== "admin") {
            alert("You do not have authorization to perform this operation.");
            return;
        }
        router.push(`/users/${id}`);
    };

    const handleDelete = async (id) => {
        if (!currentUser || currentUser.role !== "admin") {
            alert("You do not have authorization to perform this operation.");
            return;
        }

        const confirmDelete = window.confirm("Are you sure you want to delete this user?");
        if (!confirmDelete) return;

        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/user/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setUsers(users.filter((user) => user._id !== id));
        } catch (err) {
            console.error("Delete error:", err);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">All Users</h1>
            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                    <thead>
                        <tr className="bg-base-200 text-base-900 font-bold">
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Created At</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <div
                                        className={`badge badge-outline ${user.role === "admin"
                                            ? "badge-error"
                                            : user.role === "manager"
                                                ? "badge-warning"
                                                : "badge-info"
                                            }`}
                                    >
                                        {user.role}
                                    </div>
                                </td>
                                <td>{new Date(user.createdAt).toLocaleString()}</td>
                                <td className="flex gap-2">
                                    <button
                                        className={`btn btn-sm btn-ghost text-blue-500 ${currentUser?.role !== "admin"
                                            ? "cursor-not-allowed opacity-50"
                                            : ""
                                            }`}
                                        onClick={() => handleEdit(user._id)}
                                        title={
                                            currentUser?.role !== "admin"
                                                ? "You do not have authorization to perform this operation."
                                                : "Edit"
                                        }
                                    >
                                        <Pencil size={18} />
                                    </button>

                                    <button
                                        className={`btn btn-sm btn-ghost text-red-500 ${currentUser?.role !== "admin"
                                            ? "cursor-not-allowed opacity-50"
                                            : ""
                                            }`}
                                        onClick={() => handleDelete(user._id)}
                                        title={
                                            currentUser?.role !== "admin"
                                                ? "You do not have authorization to perform this operation."
                                                : "Delete"
                                        }
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
