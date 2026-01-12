"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const router = useRouter();

  async function submitHandler(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("image", image);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      alert("Registration successful");
      router.push("/login");
    } else {
      alert(data.message || "Something went wrong");
    }
  }

  return (
    <form
      onSubmit={submitHandler}
      className="max-w-md mx-auto mt-20 p-6 shadow rounded-xl bg-white dark:bg-zinc-900"
      encType="multipart/form-data"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Create Account</h2>

      <input
        className="w-full mb-3 p-2 border rounded"
        placeholder="Name"
        required
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="w-full mb-3 p-2 border rounded"
        placeholder="Email"
        type="email"
        required
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="w-full mb-3 p-2 border rounded"
        type="password"
        placeholder="Password"
        required
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        className="w-full mb-3 p-2 border rounded"
        type="file"
        accept="image/*"
        required
        onChange={(e) => setImage(e.target.files[0])}
      />

      <button className="w-full bg-green-600 hover:bg-green-700 text-white p-2 rounded">
        Create Account
      </button>

      <p className="mt-4 text-sm text-center">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-600 hover:underline">
          Login
        </Link>
      </p>
    </form>
  );
}
