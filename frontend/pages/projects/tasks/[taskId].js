import { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Cookies from 'js-cookie';

const Task = () => {
    const [assignedUser, setAssignedUser] = useState();
    const [assignedProject, setAssignedProject] = useState();
    const [editingField, setEditingField] = useState(null);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [task, setTask] = useState(null);

    const token = Cookies.get("token");
    const router = useRouter();
    const { taskId } = router.query;
    const currentUser = useSelector((state) => state.auth.user);

    useEffect(() => {
        const fetchTaskAndAssignedUser = async () => {
            try {
                const resTask = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!resTask.ok) throw new Error('Task not found');
                const data = await resTask.json();
                setTask(data);

                if (data) {
                    const resUser = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/user/${data.assignedTo}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    const userData = await resUser.json();
                    setAssignedUser(userData.user || null);

                    const resProject = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${data.project}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    const projectData = await resProject.json();
                    setAssignedProject(projectData || null);

                } else {
                    setAssignedUser(null);
                    setAssignedProject(null);
                }
            } catch (err) {
                setError(err.message);
            }
        };

        if (taskId && token) {
            fetchTaskAndAssignedUser();
        }
    }, [taskId, token]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                setProjects(Object.values(data));
            } catch (err) {
                console.error("Failed to fetch projects:", err.message);
            }
        };

        fetchProjects();
    });

    useEffect(() => {
        const fetchUsers = async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/users`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setUsers(data.users || []);
        };
        fetchUsers();
    }, []);

    const handleUpdate = async (field, value) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ [field]: value }),
            });

            if (!response.ok) throw new Error("Failed to update");

            const updated = await response.json();
            setTask(prev => ({ ...prev, [field]: updated[field] || value }));
        } catch (err) {
            console.error(err.message);
            alert("Update failed");
        } finally {
            setEditingField(null);
        }
    };

    const handleDelete = async () => {
        if (!currentUser || !["admin", "manager"].includes(currentUser?.role)) {
            alert("You do not have authorization to perform this operation.");
            return;
        }

        const confirmDelete = window.confirm("Are you sure you want to delete this task?");
        if (!confirmDelete) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error("Failed to delete the task");

            alert("Task deleted successfully");
            router.push("/dashboard"); // Adjust path as needed
        } catch (err) {
            console.error(err.message);
            alert("Failed to delete the task");
        }
    };


    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    if (!task) {
        return <div className="text-center">Loading...</div>;
    }

    return (
        <div className="max-w-5xl mx-auto p-6 bg-base-100 rounded-lg shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3">
                {/* Left Column */}
                <div className="space-y-4 md:col-span-2">
                    {editingField === "title" ? (
                        <input
                            type="text"
                            className="input input-bordered text-3xl font-semibold w-full"
                            value={task.title}
                            onChange={(e) => setTask(prev => ({ ...prev, title: e.target.value }))}
                            onBlur={() => handleUpdate("title", task.title)}
                            autoFocus
                        />
                    ) : (
                        <h2
                            className="text-3xl font-semibold cursor-pointer"
                            onClick={() => setEditingField("title")}
                        >
                            {task.title || "Untitled Task"}
                        </h2>
                    )}

                    {editingField === "description" ? (
                        <textarea
                            className="textarea textarea-bordered w-full"
                            value={task.description}
                            onChange={(e) => setTask(prev => ({ ...prev, description: e.target.value }))}
                            onBlur={() => handleUpdate("description", task.description)}
                            autoFocus
                        />
                    ) : (
                        <p
                            className="text-base-400 cursor-pointer"
                            onClick={() => setEditingField("description")}
                        >
                            {task.description || "No description available. Click to add one."}
                        </p>
                    )}
                </div>


                {/* Right Column */}
                <div className="space-y-4 md:col-span-1 bg-base-200 p-4 rounded-lg">
                    {/* Status */}
                    <div className="flex justify-between items-center">
                        <strong>Status:</strong>
                        {editingField === "status" ? (
                            <select
                                value={task.status}
                                onChange={e => handleUpdate("status", e.target.value)}
                                onBlur={() => setEditingField(null)}
                                className="select select-sm select-bordered w-36"
                                autoFocus
                            >
                                <option value="todo">To Do</option>
                                <option value="inprogress">In Progress</option>
                                <option value="review">Review</option>
                                <option value="done">Done</option>
                            </select>
                        ) : (
                            <span
                                className={`px-3 py-1 rounded-lg text-white cursor-pointer
                                ${task.status === 'todo' ? 'bg-blue-500' :
                                        task.status === 'inprogress' ? 'bg-yellow-500' :
                                            task.status === 'review' ? 'bg-orange-500' : 'bg-green-500'}`}
                                onClick={() => setEditingField("status")}
                            >
                                {task.status}
                            </span>
                        )}
                    </div>

                    {/* Priority */}
                    <div className="flex justify-between items-center">
                        <strong>Priority:</strong>
                        {editingField === "priority" ? (
                            <select
                                value={task.priority}
                                onChange={e => handleUpdate("priority", e.target.value)}
                                onBlur={() => setEditingField(null)}
                                className="select select-sm select-bordered w-36"
                                autoFocus
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        ) : (
                            <span
                                className={`px-1 py-1 rounded-lg font-bold cursor-pointer hover:text-shadow-lg
                                ${task.priority === 'high' ? 'text-red-600' :
                                        task.priority === 'medium' ? 'text-yellow-500' : 'text-green-600'}`}
                                onClick={() => setEditingField("priority")}
                            >
                                {task.priority}
                            </span>
                        )}
                    </div>

                    {/* Assigned To */}
                    <div className="flex justify-between items-center">
                        <strong>Assigned To:</strong>
                        {editingField === "assignedTo" ? (
                            <select
                                value={task.assignedTo?._id || ""}
                                onChange={e => handleUpdate("assignedTo", e.target.value)}
                                onBlur={() => setEditingField(null)}
                                className="select select-sm select-bordered w-36"
                                autoFocus
                            >
                                <option value="">Unassigned</option>
                                {users.map(user => (
                                    <option key={user._id} value={user._id}>{user.name}</option>
                                ))}
                            </select>
                        ) : (
                            <span
                                className="cursor-pointer hover:text-shadow-lg"
                                onClick={() => setEditingField("assignedTo")}
                            >
                                {assignedUser ? assignedUser.name : "Unassigned"}
                            </span>
                        )}
                    </div>

                    {/* Project */}
                    <div className="flex justify-between items-center">
                        <strong>Project:</strong>
                        {editingField === "project" ? (
                            <select
                                value={task.project || ""}
                                onChange={e => handleUpdate("project", e.target.value)}
                                onBlur={() => setEditingField(null)}
                                className="select select-sm select-bordered w-36"
                                autoFocus
                            >
                                <option value="">No project</option>
                                {projects.map(project => (
                                    <option key={project._id} value={project._id}>{project.name}</option>
                                ))}
                            </select>
                        ) : (
                            <span
                                className="cursor-pointer hover:text-shadow-lg"
                                onClick={() => setEditingField("project")}
                            >
                                {assignedProject ? assignedProject.name : "No project assigned"}
                            </span>
                        )}
                    </div>

                    {/* Created At */}
                    <div className="flex justify-between items-center">
                        <strong>Created At:</strong>
                        <span>{new Date(task.createdAt).toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex justify-center gap-4">
                <button
                    onClick={() => window.history.back()}
                    className="btn btn-soft btn-primary rounded-lg"
                >
                    Back to Dashboard
                </button>
                <button
                    onClick={handleDelete}
                    className={`btn btn-soft btn-error rounded-lg ${!["admin", "manager"].includes(currentUser?.role)
                        ? "cursor-not-allowed opacity-50"
                        : ""
                        }`}
                    title={
                        !["admin", "manager"].includes(currentUser?.role)
                            ? "You do not have authorization to perform this operation."
                            : "Delete"
                    }
                >
                    Delete Task
                </button>
            </div>
        </div>
    );


};

export default Task;
