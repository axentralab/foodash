"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/hooks/useProfile";

const STATS = [
  {icon:"📦",label:"Orders",value:"24"},
  {icon:"❤️",label:"Favorites",value:"8"},
  {icon:"⭐",label:"Reviews",value:"12"},
  {icon:"🎁",label:"Points",key:"loyalty_points"},
];

const SECTIONS = [
  {title:"Account",items:[
    {icon:"👤",label:"Personal Info",desc:"Name, email, phone"},
    {icon:"📍",label:"Saved Addresses",desc:"3 addresses saved"},
    {icon:"🔐",label:"Security",desc:"Password, 2FA"},
  ]},
  {title:"Preferences",items:[
    {icon:"🔔",label:"Notifications",desc:"Push, email alerts"},
    {icon:"🥗",label:"Dietary Preferences",desc:"Vegan, gluten-free..."},
    {icon:"💳",label:"Payment Methods",desc:"2 cards saved"},
  ]},
  {title:"Support",items:[
    {icon:"💬",label:"Help Center",desc:"FAQs & guides"},
    {icon:"📞",label:"Contact Us",desc:"Chat or call"},
    {icon:"📄",label:"Terms & Privacy",desc:"Legal info"},
  ]},
];

export default function ProfilePage() {
  const router = useRouter();
  const { profile, loading, saving, updateProfile } = useProfile();
  const [editing, setEditing] = useState(false);
  const [toast, setToast] = useState("");
  const [form, setForm] = useState({ full_name:"", phone:"", address:"" });

  const startEdit = () => {
    setForm({ full_name: profile.full_name, phone: profile.phone??"", address: profile.address??"" });
    setEditing(true);
  };

  const handleSave = async () => {
    const ok = await updateProfile(form);
    if (ok) {
      setEditing(false);
      setToast("Profile updated successfully!");
      setTimeout(()=>setToast(""),3000);
    }
  };

  const handleSignOut = async () => {
    const { createClient } = await import("@/lib/supabase/client");
    await createClient().auth.signOut();
    router.push("/auth/sign-in");
  };

  if (loading) {
    return (
      <div className="p-5 lg:p-10 max-w-2xl mx-auto space-y-4 animate-pulse">
        <div className="bg-gray-300 rounded-4xl h-40"/>
        <div className="grid grid-cols-4 gap-3">{Array(4).fill(0).map((_,i)=><div key={i} className="bg-gray-200 rounded-2xl h-20"/>)}</div>
      </div>
    );
  }

  return (
    <div className="min-h-full p-5 lg:p-10 max-w-2xl mx-auto pb-28">
      {toast&&(
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-2xl shadow-lg text-sm font-semibold">
          ✓ {toast}
        </div>
      )}

      {/* Hero */}
      <div className="bg-hero-gradient rounded-4xl p-6 mb-6 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-36 h-36 bg-primary/20 rounded-full blur-2xl"/>
        <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-amber-400/20 rounded-full blur-2xl"/>
        <div className="relative z-10 flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 bg-primary/30 rounded-3xl flex items-center justify-center text-5xl border-2 border-primary/40">👤</div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary rounded-xl flex items-center justify-center text-sm shadow-primary">📷</button>
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-white text-xl">{profile.full_name}</h2>
            <p className="text-white/60 text-sm mt-0.5">{profile.email}</p>
            <span className="inline-flex items-center gap-1 mt-2 bg-amber-400/20 text-amber-400 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-400/30">
              🥇 Gold Member
            </span>
          </div>
          <button onClick={startEdit}
            className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors text-lg">✏️</button>
        </div>
      </div>

      {/* Edit form */}
      {editing&&(
        <div className="bg-white rounded-3xl p-5 shadow-card mb-6 space-y-4">
          <h3 className="font-bold text-dark-100">Edit Profile</h3>
          {[
            {key:"full_name",label:"Full Name",type:"text",ph:"Your name"},
            {key:"phone",label:"Phone",type:"tel",ph:"+880..."},
            {key:"address",label:"Address",type:"text",ph:"Your address"},
          ].map(({key,label,type,ph})=>(
            <div key={key}>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
              <input type={type} value={form[key as keyof typeof form]}
                onChange={e=>setForm(p=>({...p,[key]:e.target.value}))}
                placeholder={ph} className="input-field py-3 text-sm"/>
            </div>
          ))}
          <div className="flex gap-3 pt-1">
            <button onClick={handleSave} disabled={saving}
              className="btn-primary flex-1 py-3 flex items-center justify-center gap-2">
              {saving?<span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>:"Save Changes"}
            </button>
            <button onClick={()=>setEditing(false)} className="btn-ghost flex-1 py-3">Cancel</button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {STATS.map(({icon,label,value,key})=>(
          <div key={label} className="bg-white rounded-2xl p-3 shadow-card text-center">
            <div className="text-2xl mb-1">{icon}</div>
            <div className="font-bold text-dark-100 text-lg leading-tight">
              {key==="loyalty_points" ? profile.loyalty_points : value}
            </div>
            <div className="text-gray-400 text-[10px] mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Loyalty */}
      <div className="bg-primary-gradient rounded-3xl p-5 mb-6 shadow-primary">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white/70 text-xs font-semibold uppercase tracking-wider">Loyalty Points</p>
            <p className="text-white font-bold text-3xl">{profile.loyalty_points} pts</p>
          </div>
          <span className="text-5xl">🏆</span>
        </div>
        <div className="bg-white/20 rounded-full h-2 mb-2">
          <div className="bg-white rounded-full h-2 transition-all duration-700"
            style={{width:`${Math.min(100,(profile.loyalty_points/1000)*100)}%`}}/>
        </div>
        <div className="flex justify-between text-white/70 text-xs">
          <span>{profile.loyalty_points} / 1000 to Platinum</span>
          <span>{Math.max(0,1000-profile.loyalty_points)} pts away</span>
        </div>
      </div>

      {/* Menu sections */}
      {SECTIONS.map(section=>(
        <div key={section.title} className="mb-5">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">{section.title}</h3>
          <div className="bg-white rounded-3xl shadow-card overflow-hidden divide-y divide-gray-100">
            {section.items.map(({icon,label,desc})=>(
              <button key={label}
                className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors text-left group">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0">{icon}</div>
                <div className="flex-1">
                  <p className="font-semibold text-dark-100 text-sm">{label}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{desc}</p>
                </div>
                <span className="text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all">›</span>
              </button>
            ))}
          </div>
        </div>
      ))}

      <button onClick={handleSignOut}
        className="w-full flex items-center justify-center gap-2 py-4 bg-red-50 text-red-500 rounded-2xl font-semibold hover:bg-red-100 transition-colors border border-red-100 mb-4">
        🚪 Sign Out
      </button>
      <p className="text-center text-xs text-gray-400">FooDash v1.0.0 • Made with ❤️ in Bangladesh</p>
    </div>
  );
}
