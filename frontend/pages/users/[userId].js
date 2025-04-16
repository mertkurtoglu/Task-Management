import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Cookies from "js-cookie";

const InputField = ({
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}) => (
  <input
    type={type}
    name={name}
    placeholder={placeholder}
    className="input input-bordered w-full"
    value={value}
    onChange={onChange}
    required={required}
  />
);

const SelectField = ({ name, value, onChange, options, required = false }) => (
  <select
    name={name}
    className="select select-bordered w-full"
    value={value}
    onChange={onChange}
    required={required}
  >
    <option value="" className="bg-base-200 text-black font-bold" disabled>
      Select Role
    </option>
    {options.map((option, index) => (
      <option key={index} value={option}>
        {option}
      </option>
    ))}
  </select>
);

export default function EditUser() {
  const router = useRouter();
  const { userId } = router.query;

  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", role: "" });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const token = Cookies.get("token");

  const roles = ["admin", "manager", "developer"];

  useEffect(() => {
    if (userId) {
      fetchUserData(userId);
    }
  }, [userId]);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchUserData = async (id) => {
    try {
      const res = await fetch(`${API_URL}/auth/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setFormData({
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
        });
      } else {
        setMessage("User not found.");
      }
      setLoading(false);
    } catch (error) {
      setMessage("Failed to fetch user data.");
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/auth/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("User updated successfully!");
        setTimeout(() => router.push("/users"), 2000);
      } else {
        setMessage(data.message || "Failed to update user");
      }
    } catch (error) {
      setMessage("Failed to update user");
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-base-200 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Edit User</h2>
      {message && <div className="alert alert-info mb-4">{message}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <InputField
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          type="email"
          required
        />
        <SelectField
          name="role"
          value={formData.role}
          onChange={handleChange}
          options={roles}
          required
        />
        <div className="flex gap-2 mt-4">
          <Link href="/users" className="btn btn-error flex-1">
            Back
          </Link>
          <button type="submit" className="btn btn-primary flex-1">
            Update User
          </button>
        </div>
      </form>
    </div>
  );
}
