import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Pencil, Trash2 } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "@/store/projectsSlice";
import LoadingScreen from "@/pages/components/Loading";
import Cookies from "js-cookie";

const statuses = ["To Do", "In Progress", "Review", "Done"];

export default function Projects({ initialProjects }) {
    const router = useRouter();
    const { projectId } = router.query;

    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.auth.user);

    const [tasks, setTasks] = useState(initialProjects);
    const [project, setProject] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState("");

    useEffect(() => {
        if (!projectId) return;
        fetchProjectData();
    }, [projectId]);

    const fetchProjectData = async () => {
        setIsLoading(true);
        try {
            const token = Cookies.get("token");

            const [tasksRes, projectRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/tasks`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ]);

            if (!tasksRes.ok || !projectRes.ok) throw new Error("Fetch failed");

            const [tasksData, projectData] = await Promise.all([
                tasksRes.json(),
                projectRes.json(),
            ]);

            setTasks(tasksData || []);
            setProject(projectData || null);
        } catch (err) {
            console.error("Error fetching data:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this project?")) return;
        try {
            const token = Cookies.get("token");
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            dispatch(fetchProjects());
            router.push("/");
        } catch (err) {
            console.error("Delete error:", err);
        }
    };

    const handleEditToggle = () => {
        setEditedTitle(project.name);
        setIsEditing(true);
    };

    const handleSaveTitle = async () => {
        if (!editedTitle.trim()) return alert("Title cannot be empty");
        try {
            const token = Cookies.get("token");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name: editedTitle }),
            });

            if (!res.ok) throw new Error("Update failed");

            setProject((prev) => ({ ...prev, name: editedTitle }));
            setIsEditing(false);
        } catch (err) {
            console.error("Update error:", err);
        }
    };

    const onDragEnd = async ({ destination, source, draggableId }) => {
        if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) return;

        const newStatus = destination.droppableId;

        setTasks((prev) =>
            prev.map((task) =>
                String(task.id) === draggableId ? { ...task, status: newStatus } : task
            )
        );

        try {
            const token = Cookies.get("token");
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${draggableId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    const ProjectTitle = () => (
        <div className="flex items-center gap-2">
            {isEditing ? (
                <>
                    <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className="input input-bordered text-xl"
                    />
                    <button onClick={handleSaveTitle} className="btn btn-sm btn-success">Save</button>
                    <button onClick={() => setIsEditing(false)} className="btn btn-sm btn-ghost">Cancel</button>
                </>
            ) : (
                <a className={`btn btn-ghost text-xl ${currentUser?.role !== "admin" ? "cursor-not-allowed" : ""}`} >{project?.name}</a>
            )}
        </div>
    );

    const DropdownMenu = () => (
        <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-square btn-ghost">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="inline-block h-5 w-5 stroke-current">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01" />
                </svg>
            </label>
            <ul tabIndex={0} className="menu dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box mt-3">
                <li
                    className={`hover:text-blue-500 ${currentUser?.role !== "admin" ? "opacity-50" : ""}`}
                    onClick={currentUser?.role === "admin" ? handleEditToggle : undefined}
                >
                    <a className={`${currentUser?.role !== "admin" ? "cursor-not-allowed opacity-50" : ""}`}><Pencil className={"h-4 mr-2"} />Update</a>
                </li>
                <li
                    className={`hover:text-red-500 ${currentUser?.role !== "admin" ? "opacity-50" : ""}`}
                    onClick={currentUser?.role === "admin" ? handleDelete : undefined}
                >
                    <a className={`${currentUser?.role !== "admin" ? "cursor-not-allowed opacity-50" : ""}`}><Trash2 className="h-4 mr-2" />Delete</a>
                </li>
            </ul>
        </div>
    );

    const TaskCard = ({ task, index }) => (
        <Draggable key={String(task.id)} draggableId={String(task.id)} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`card bg-base-100 p-3 shadow mb-3 transition-all ${snapshot.isDragging ? "opacity-50 scale-95 cursor-grab" : "cursor-pointer"}`}
                    onClick={() => router.push(`tasks/${task.id}`)}
                >
                    <h3 className="font-medium text-sm">{task.title}</h3>
                </div>
            )}
        </Draggable>
    );

    const StatusColumn = ({ status }) => {
        const formatted = status.toLowerCase().replace(/\s+/g, "");
        const filteredTasks = tasks.filter((task) => task.status === formatted);
        return (
            <Droppable droppableId={formatted} key={formatted}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`bg-base-200 rounded-box p-4 min-h-[300px] transition-all ${snapshot.isDraggingOver ? "bg-base-300" : ""}`}
                    >
                        <h2 className="text-lg font-bold mb-4">{status}</h2>
                        {filteredTasks.map((task, index) => (
                            <TaskCard key={task.id} task={task} index={index} />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        );
    };

    if (isLoading) return <LoadingScreen />;

    return (
        <div>
            <div className="navbar shadow-sm">
                <div className="flex-1"><ProjectTitle /></div>
                <div className="flex-none"><DropdownMenu /></div>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
                    {statuses.map((status) => (
                        <StatusColumn key={status} status={status} />
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
}
