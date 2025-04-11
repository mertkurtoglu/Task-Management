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
            const res = await fetch("http://localhost:5000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.message || "Giriş başarısız.")
                return
            }

            // 1️⃣ Token'ı localStorage'a kaydet
            localStorage.setItem("token", data.token)

            // 2️⃣ Token'ı cookie'ye yaz (SSR için önemli)
            Cookies.set("token", data.token, { expires: 1 }) // 1 gün geçerli

            // 3️⃣ Redux'a kullanıcıyı aktar
            dispatch(loginSuccess({ user: data.user, token: data.token }))

            router.push("/dashboard")

        } catch (err) {
            setError("Sunucu hatası.")
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Giriş Yap</h2>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                    required
                />
                <input
                    type="password"
                    placeholder="Şifre"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded mb-6"
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Giriş Yap
                </button>
            </form>
        </div>
    )
}
