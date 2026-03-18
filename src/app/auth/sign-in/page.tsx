"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError("Please fill in all fields"); return; }
    setLoading(true); setError("");
    try {
      // Supabase auth — works once env vars are set
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { error: err } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
      if (err) throw err;
      router.push("/dashboard/menu"); router.refresh();
    } catch (err: unknown) {
      // Demo mode fallback
      if (form.email === "demo@foodash.com" && form.password === "demo1234") {
        router.push("/dashboard/menu"); return;
      }
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally { setLoading(false); }
  };

  const demoLogin = () => { setForm({ email: "demo@foodash.com", password: "demo1234" }); };

  return (
    <div>
      <h2 className="text-3xl font-bold text-dark-100 mb-1">Welcome back</h2>
      <p className="text-gray-500 mb-8 text-sm">Sign in to your FooDash account</p>

      {error && <div className="bg-red-50 text-red-600 text-sm rounded-xl p-3 mb-4 border border-red-100">{error}</div>}

      <form onSubmit={submit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
          <input type="email" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))}
            placeholder="you@example.com" className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
          <div className="relative">
            <input type={showPw?"text":"password"} value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))}
              placeholder="••••••••" className="input-field pr-12" />
            <button type="button" onClick={()=>setShowPw(!showPw)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary text-xs font-semibold">
              {showPw?"Hide":"Show"}
            </button>
          </div>
        </div>
        <button type="submit" disabled={loading}
          className="btn-primary w-full py-4 flex items-center justify-center gap-2">
          {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block"/> : "Sign In →"}
        </button>
      </form>

      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-gray-200"/>
        <span className="text-gray-400 text-sm">or</span>
        <div className="flex-1 h-px bg-gray-200"/>
      </div>

      <button onClick={demoLogin} className="btn-ghost w-full py-4">🚀 Fill Demo Credentials</button>

      <p className="text-center mt-8 text-gray-500 text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/auth/sign-up" className="text-primary font-bold hover:underline">Sign Up</Link>
      </p>
    </div>
  );
}
