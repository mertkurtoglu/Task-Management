import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

export default function CreateTask() {
  const [assignedTo, setAssignedTo] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [priority, setPriority] = useState("low");
  const [projectId, setProjectId] = useState("");
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("todo");
  const [title, setTitle] = useState("");

  const router = useRouter();
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) return;

    const fetchProjectsAndUsers = async () => {
      try {
        const [projectRes, userRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/users`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        const projectData = await projectRes.json();
        const userData = await userRes.json();

        setProjects(projectData);
        setUsers(userData.users || []);
      } catch (err) {
        setError("An error occurred while retrieving data.");
      }
    };

    fetchProjectsAndUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !title ||
      !description ||
      !projectId ||
      !status ||
      !assignedTo ||
      !priority
    ) {
      setError("All fields are mendatory!");
      return;
    }

    const token = Cookies.get("token");
    if (!token) {
      setError("User is not logged in.");
      return;
    }

    const taskData = {
      title,
      description,
      status,
      priority,
      assignedTo,
      project: projectId,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/tasks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(taskData),
        }
      );

      if (!response.ok) throw new Error("The task could not be created.");
      router.push(`/projects/${projectId}`);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Task</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          label="Title"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task Title"
        />

        <FormTextarea
          label="Description"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task Description"
        />

        <FormSelect
          label="Status"
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={[
            { value: "todo", label: "To Do" },
            { value: "inprogress", label: "In Progress" },
            { value: "review", label: "Review" },
            { value: "done", label: "Done" },
          ]}
        />

        <FormSelect
          label="Priority"
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          options={[
            { value: "low", label: "Low" },
            { value: "medium", label: "Medium" },
            { value: "high", label: "High" },
          ]}
        />

        <FormSelect
          label="Assigned To"
          id="assignedTo"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          options={[
            { value: "", label: "Unassigned" },
            ...users.map((user) => ({
              value: user._id,
              label: user.name,
            })),
          ]}
        />

        <FormSelect
          label="Project"
          id="projectId"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          options={projects.map((project) => ({
            value: project._id,
            label: project.name,
          }))}
        />

        <button type="submit" className="btn btn-soft btn-primary w-full">
          Create Task
        </button>
      </form>
    </div>
  );
}

function FormInput({ label, id, value, onChange, placeholder }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <input
        type="text"
        id={id}
        value={value}
        onChange={onChange}
        className="input input-bordered w-full"
        placeholder={placeholder}
      />
    </div>
  );
}

function FormTextarea({ label, id, value, onChange, placeholder }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        className="textarea textarea-bordered w-full"
        placeholder={placeholder}
      />
    </div>
  );
}

function FormSelect({ label, id, value, onChange, options }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="select select-bordered w-full"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
