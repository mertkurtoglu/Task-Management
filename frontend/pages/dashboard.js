import { useSelector } from "react-redux"
import { useEffect } from "react"
import { useRouter } from "next/router"
import Cookies from "js-cookie"

export default function Dashboard({ projects }) {
    const auth = useSelector((state) => state.auth)
    const router = useRouter()

    useEffect(() => {
        if (!auth.token) {
            router.push("/login")
        }
    }, [auth, router])

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects?.map((project) => (
                    <div key={project._id} className="bg-white p-4 shadow rounded">
                        <h2 className="text-xl font-semibold">{project.title}</h2>
                        <p className="text-gray-600">{project.description}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

// SSR fonksiyonu burada export ediliyor
export async function getServerSideProps(context) {
    const { req } = context
    const token = req.cookies.token || null

    if (!token) {
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        }
    }

    const res = await fetch("http://localhost:5000/projects", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    const data = await res.json()
    console.log("data   : " + data.projects);

    return {
        props: {
            projects: data || [],
        },
    }
}
