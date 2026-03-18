"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const STATS = [
  { icon:"📦", label:"Orders", value:"24" },
  { icon:"❤️", label:"Favorites", value:"8" },
  { icon:"⭐", label:"Reviews", value:"12" },
  { icon:"🎁", label:"Points", value:"840" },
];

const MENU_SECTIONS = [
  { title:"Account", items:[
    { icon:"👤", label:"Personal Info", desc:"Name, email, phone" },
    { icon:"📍", label:"Saved Addresses", desc:"3 addresses saved" },
    { icon:"🔐", label:"Security", desc:"Password, 2FA" },
  ]},
  { title:"Preferences", items:[
    { icon:"🔔", label:"Notifications", desc:"Push, email alerts" },
    { icon:"🥗", label:"Dietary Preferences", desc:"Vegan, gluten-free..." },
    { icon:"💳", label:"Payment Methods", desc:"2 cards saved" },
  ]},
  { title:"Support", items:[
    { icon:"💬", label:"Help Center", desc:"FAQs & guides" },
    { icon:"📞", label:"Contact Us", desc:"Chat or call" },
    { icon:"📄", label:"Terms & Privacy", desc:"Legal info" },
  ]},
];

export default function ProfilePage() {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name:"Alex Johnson", email:"alex@foodash.com", phone:"+880 1700 000123", address:"123 Main St, Narayanganj"
  });

  const handleSave = () => { setSaved(true); setEditing(false); setTimeout(()=>setSaved(false),3000); };

  const handleSignOut = async () => {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/sign-in");
  };

  return (
    <div className="min-h-full p-5 lg:p-10 max-w-2xl mx-auto pb-28">
      {/* Success toast */}
      {saved && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-2xl shadow-lg text-sm font-semibold">
          ✓ Profile updated!
        </div>
      )}

      {/* Profile hero */}
      <div className="bg-hero-gradient rounded-4xl p-6 mb-6 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-36 h-36 bg-primary/20 rounded-full blur-2xl"/>
        <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-amber-400/20 rounded-full blur-2xl"/>
        <div className="relative z-10 flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 bg-primary/30 rounded-3xl flex items-center justify-center text-5xl border-2 border-primary/40">👤</div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary rounded-xl flex items-center justify-center text-sm shadow-primary">📷</button>
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-white text-xl">{form.name}</h2>
            <p className="text-white/60 text-sm mt-0.5">{form.email}</p>
            <span className="inline-flex items-center gap-1 mt-2 bg-amber-400/20 text-amber-400 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-400/30">
              🥇 Gold Member
            </span>
          </div>
          <button onClick={()=>setEditing(!editing)}
            className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors text-lg">
            ✏️
          </button>
        </div>
      </div>

      {/* Edit form */}
      {editing && (
        <div className="bg-white rounded-3xl p-5 shadow-card mb-6 space-y-4">
          <h3 className="font-bold text-dark-100">Edit Profile</h3>
          {[
            {key:"name",label:"Full Name",type:"text",ph:"Your name"},
            {key:"email",label:"Email",type:"email",ph:"you@example.com"},
            {key:"phone",label:"Phone",type:"tel",ph:"+880..."},
            {key:"address",label:"Address",type:"text",ph:"Your address"},
          ].map(({key,label,type,ph})=>(
            <div key={key}>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
              <input type={type} value={form[key as keyof typeof form]}
                onChange={e=>setForm(p=>({...p,[key]:e.target.value}))}
                placeholder={ph} className="input-field py-3 text-sm" />
            </div>
          ))}
          <div className="flex gap-3 pt-1">
            <button onClick={handleSave} className="btn-primary flex-1 py-3">Save Changes</button>
            <button onClick={()=>setEditing(false)} className="btn-ghost flex-1 py-3">Cancel</button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {STATS.map(({icon,label,value})=>(
          <div key={label} className="bg-white rounded-2xl p-3 shadow-card text-center">
            <div className="text-2xl mb-1">{icon}</div>
            <div className="font-bold text-dark-100 text-lg leading-tight">{value}</div>
            <div className="text-gray-400 text-[10px] mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Loyalty card */}
      <div className="bg-primary-gradient rounded-3xl p-5 mb-6 shadow-primary">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white/70 text-xs font-semibold uppercase tracking-wider">Loyalty Points</p>
            <p className="text-white font-bold text-3xl">840 pts</p>
          </div>
          <span className="text-5xl">🏆</span>
        </div>
        <div className="bg-white/20 rounded-full h-2 mb-2">
          <div className="bg-white rounded-full h-2 transition-all duration-700" style={{width:"84%"}}/>
        </div>
        <div className="flex justify-between text-white/70 text-xs">
          <span>840 / 1000 to Platinum</span>
          <span>160 pts away</span>
        </div>
      </div>

      {/* Menu sections */}
      {MENU_SECTIONS.map(section=>(
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

      {/* Sign out */}
      <button onClick={handleSignOut}
        className="w-full flex items-center justify-center gap-2 py-4 bg-red-50 text-red-500 rounded-2xl font-semibold hover:bg-red-100 transition-colors border border-red-100 mb-4">
        🚪 Sign Out
      </button>

      <p className="text-center text-xs text-gray-400">FooDash v1.0.0 • Made with ❤️ in Bangladesh</p>
    </div>
  );
}
