"use client";

import { useState, useEffect } from "react";

interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  address?: string;
  avatar_url?: string;
  loyalty_points: number;
}

const DEFAULT_PROFILE: Profile = {
  id: "demo",
  full_name: "Alex Johnson",
  email: "demo@foodash.com",
  phone: "+880 1700 000123",
  address: "123 Main St, Narayanganj",
  loyalty_points: 840,
};

export function useProfile() {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await window.fetch("/api/profile");
        if (!res.ok) throw new Error();
        const json = await res.json();
        if (json.data) setProfile(json.data);
      } catch {
        // Use default demo profile
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const updateProfile = async (updates: Partial<Omit<Profile, "id" | "email" | "loyalty_points">>) => {
    setSaving(true);
    try {
      const res = await window.fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const json = await res.json();
      if (res.ok && json.data) {
        setProfile((p) => ({ ...p, ...json.data }));
        return true;
      }
      // Demo mode: update locally
      setProfile((p) => ({ ...p, ...updates }));
      return true;
    } catch {
      setProfile((p) => ({ ...p, ...updates }));
      return true;
    } finally {
      setSaving(false);
    }
  };

  return { profile, loading, saving, updateProfile };
}
