"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function submitHandler(e) {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (!res.error) router.push("/");
    else alert(res.error);
  }

  return (
    <form onSubmit={submitHandler} className="max-w-md mx-auto mt-20 p-6 shadow">
      <h2 className="text-2xl font-bold mb-4">Login</h2>

      <input
        className="w-full mb-3 p-2 border"
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="w-full mb-3 p-2 border"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="w-full bg-blue-600 text-white p-2">Login</button>

      <p className="mt-4 text-sm">
        New here?{" "}
        <Link href="/register" className="text-blue-600">
          Register
        </Link>
      </p>
    </form>
  );
}
