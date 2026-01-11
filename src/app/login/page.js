"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleLogin} className="p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-2xl mb-4 font-bold">Login</h2>

        <input
          className="w-full border p-2 mb-3"
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full border p-2 mb-3"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-black text-white py-2">
          Login
        </button>
      </form>
    </div>
  );
}
