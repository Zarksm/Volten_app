"use client";

import Image from "next/image";
import React, { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      setEmail("");
      setPassword("");

      // Paksa reload ke server supaya middleware jalan
      if (res.ok) {
        window.location.assign("/"); // reload page → middleware jalan
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="w-full h-full flex items-center justify-center bg-[#00296c]">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-40 h-40">
            <Image
              src="/assets/images/logo.webp"
              alt="Logo"
              fill
              style={{ objectFit: "cover" }}
              sizes="100%"
            />
          </div>
          <h2 className="text-white font-bold text-2xl uppercase">
            Voltenindonesia
          </h2>
        </div>
      </div>

      <div className="flex items-center justify-center p-10">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6">Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-100 text-red-600 p-2 rounded">{error}</div>
            )}

            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-blue-900 text-white rounded-lg"
            >
              {loading ? "Loading..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
