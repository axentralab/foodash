"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name:"", email:"", password:"" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name||!form.email||!form.password){setError("Please fill in all fields");return;}
    if (form.password.length<6){setError("Password must be at least 6 characters");return;}
    setLoading(true); setError("");
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { error: err } = await supabase.auth.signUp({
        email: form.email, password: form.password,
        options: { data: { full_name: form.name } },
      });
      if (err) throw err;
      router.push("/dashboard/menu"); router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Sign up failed");
    } finally { setLoading(false); }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-dark-100 mb-1">Create account</h2>
      <p className="text-gray-500 mb-8 text-sm">Join FooDash and order your favorites</p>

      {error && <div className="bg-red-50 text-red-600 text-sm rounded-xl p-3 mb-4 border border-red-100">{error}</div>}

      <form onSubmit={submit} className="space-y-5">
        {[
          { key:"name", label:"Full Name", type:"text", placeholder:"Your full name" },
          { key:"email", label:"Email", type:"email", placeholder:"you@example.com" },
          { key:"password", label:"Password", type:"password", placeholder:"Min. 6 characters" },
        ].map(({key,label,type,placeholder})=>(
          <div key={key}>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
            <input type={type} value={form[key as keyof typeof form]}
              onChange={e=>setForm(p=>({...p,[key]:e.target.value}))}
              placeholder={placeholder} className="input-field" />
          </div>
        ))}
        <p className="text-xs text-gray-400">
          By signing up, you agree to our{" "}
          <Link href="#" className="text-primary">Terms of Service</Link> and{" "}
          <Link href="#" className="text-primary">Privacy Policy</Link>.
        </p>
        <button type="submit" disabled={loading}
          className="btn-primary w-full py-4 flex items-center justify-center gap-2">
          {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block"/> : "Create Account →"}
        </button>
      </form>

      <p className="text-center mt-8 text-gray-500 text-sm">
        Already have an account?{" "}
        <Link href="/auth/sign-in" className="text-primary font-bold hover:underline">Sign In</Link>
      </p>
    </div>
  );
}
