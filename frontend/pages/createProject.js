import { useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { fetchProjects } from "@/store/projectsSlice";
import { useSelector } from "react-redux";

const InputField = ({ id, label, value, onChange, placeholder }) => (
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

const TextareaField = ({ id, label, value, onChange, placeholder }) => (
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

export default function CreateProject() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const currentUser = useSelector((state) => state.auth.user);

  const router = useRouter();
  const dispatch = useDispatch();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Project name is required.");
      return;
    }

    const token = Cookies.get("token");
    if (!token) {
      setError("User is not logged in.");
      return;
    }
    const currentUserId = currentUser.id;

    try {
      const response = await fetch(`${API_URL}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description, currentUserId }),
      });

      if (!response.ok) {
        throw new Error("An error occurred while creating the project.");
      }

      const newProject = await response.json();
      dispatch(fetchProjects());
      router.push(`/projects/${newProject._id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Project</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          id="name"
          label="Proje Adı"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Project Name"
        />

        <TextareaField
          id="description"
          label="Açıklama"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Project Description"
        />

        <button
          type="submit"
          className={`btn btn-soft btn-primary w-full ${
            !["admin", "manager"].includes(currentUser?.role)
              ? "cursor-not-allowed opacity-50"
              : ""
          }`}
          title={
            !["admin", "manager"].includes(currentUser?.role)
              ? "You do not have authorization to perform this operation."
              : ""
          }
          onClick={() => {
            if (
              !currentUser ||
              !["admin", "manager"].includes(currentUser?.role)
            ) {
              alert("You do not have authorization to perform this operation.");
              return;
            }
          }}
        >
          Create Project
        </button>
      </form>
    </div>
  );
}
