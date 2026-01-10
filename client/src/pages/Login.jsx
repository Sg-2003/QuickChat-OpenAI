import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'

const Login = () => {
    const [state, setState] = useState("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { navigate } = useAppContext();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const endpoint = state === "login" ? "/api/user/login" : "/api/user/register";
        const payload = state === "login" ? { email, password } : { name, email, password };

        try {
            const response = await fetch(`http://localhost:3000${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (data.sucess) {
                localStorage.setItem('token', data.token);
                navigate('/');
            } else {
                setError(data.message);
            }
        } catch {
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white">
            <p className="text-2xl font-medium m-auto">
                <span className="text-purple-700">User</span> {state === "login" ? "Login" : "Sign Up"}
            </p>
            {state === "register" && (
                <div className="w-full">
                    <p>Name</p>
                    <input onChange={(e) => setName(e.target.value)} value={name} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-purple-700" type="text" required />
                </div>
            )}
            <div className="w-full ">
                <p>Email</p>
                <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-purple-700" type="email" required />
            </div>
            <div className="w-full ">
                <p>Password</p>
                <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-purple-700" type="password" required />
            </div>
            {state === "register" ? (
                <p>
                    Already have account? <span onClick={() => setState("login")} className="text-purple-700 cursor-pointer">click here</span>
                </p>
            ) : (
                <p>
                    Create an account? <span onClick={() => setState("register")} className="text-purple-700 cursor-pointer">click here</span>
                </p>
            )}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type='submit' disabled={loading} className="bg-purple-700 hover:bg-purple-800 transition-all text-white w-full py-2 rounded-md cursor-pointer disabled:opacity-50">
                {loading ? "Loading..." : (state === "register" ? "Create Account" : "Login")}
            </button>
        </form>
    )
}

export default Login