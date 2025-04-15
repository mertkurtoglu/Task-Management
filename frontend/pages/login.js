import { useState } from "react"
import { useDispatch } from "react-redux"
import { loginSuccess } from "@/store/authSlice"
import { useRouter } from "next/router"
import Cookies from "js-cookie"

export default function LoginPage() {
    const dispatch = useDispatch()
    const router = useRouter()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.message || "Login failed.")
                return
            }

            localStorage.setItem("token", data.token)

            Cookies.set("token", data.token, { expires: 1 }) // 1 day
            Cookies.set("name", data.user.name, { expires: 1 })

            dispatch(loginSuccess({ user: data.user, token: data.token }))

            router.push("/")

        } catch (err) {
            setError("Server error.")
        }
    }

    return (
        <div className="min-h-screen w-screen flex items-center justify-center bg-base-200">
            <form onSubmit={handleSubmit} className="bg-base-100 p-10 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded mb-4"
                    required
                />
                <input
                    type="password"
                    placeholder="Şifre"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded mb-6"
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
                >
                    Login
                </button>
            </form>
        </div>
    )
}
