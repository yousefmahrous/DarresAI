"use client";

import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import { User as UserIcon, Mail, Trophy, Flame, Key, Loader2, Copy, CheckCircle2, Link as LinkIcon, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Profile() {
  const { user } = useAuth();
  const isParent = user?.role === "parent";

  // Student States
  const [profile, setProfile] = useState({ name: "", email: "", streak: 0, points: 0 });
  const [linkCode, setLinkCode] = useState("");
  const [copied, setCopied] = useState(false);

  // Parent States
  const [inputCode, setInputCode] = useState("");
  const [linkError, setLinkError] = useState("");
  const [linkSuccess, setLinkSuccess] = useState("");
  const [linking, setLinking] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        if (isParent) {
          // بيانات ولي الأمر بتيجي من الـ AuthContext مباشرة، فمش محتاجين API إضافي للبروفايل
          setLoading(false);
        } else {
          // لو طالب، بنجيب الإحصائيات وكود الربط بتاعه
          const headers = { Authorization: `Bearer ${token}` };
          const [profileRes, codeRes] = await Promise.all([
            fetch("http://localhost:8000/api/student/profile", { headers }),
            fetch("http://localhost:8000/api/student/get-code", { headers })
          ]);

          if (profileRes.ok) setProfile(await profileRes.json());
          if (codeRes.ok) setLinkCode((await codeRes.json()).link_code);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user, isParent]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(linkCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // دالة ربط الطالب (لولي الأمر فقط)
  const handleLinkStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLinking(true);
    setLinkError("");
    setLinkSuccess("");

    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch("http://localhost:8000/api/parent/link-student", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ link_code: inputCode })
      });

      if (res.ok) {
        setLinkSuccess("Student linked successfully! You can now check their Progress.");
        setInputCode("");
      } else {
        const errorData = await res.json();
        setLinkError(errorData.detail || "Invalid code. Please try again.");
      }
    } catch (error) {
      setLinkError("Something went wrong. Check your connection.");
    } finally {
      setLinking(false);
    }
  };

  if (!user) return null; // حماية لحد ما اليوزر يحمل

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />

      <main className="flex-1 p-10">
        <div className="mb-10">
          <p className="text-sm font-medium text-blue-500">Account Settings</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight">My Profile</h1>
        </div>

        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="animate-spin text-blue-500" size={40} />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            
            {/* الكارت الأساسي لبيانات اليوزر (مشترك للطالب وولي الأمر) */}
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
              <div className="flex items-center gap-6">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-600">
                  <UserIcon size={40} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">{user.name || (isParent ? "Parent" : "Student")}</h2>
                  <p className="flex items-center gap-2 mt-2 text-zinc-400">
                    <Mail size={16} /> {user.email}
                  </p>
                </div>
              </div>

              {!isParent && (
                <div className="mt-10 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
                    <div className="flex items-center gap-3 text-yellow-500">
                      <Flame size={24} />
                      <span className="font-medium">Study Streak</span>
                    </div>
                    <p className="mt-3 text-3xl font-bold">{profile.streak} Days</p>
                  </div>
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
                    <div className="flex items-center gap-3 text-blue-400">
                      <Trophy size={24} />
                      <span className="font-medium">AI Points</span>
                    </div>
                    <p className="mt-3 text-3xl font-bold">{profile.points}</p>
                  </div>
                </div>
              )}
            </div>

            {/* الكارت التاني بيتغير حسب الـ Role */}
            {isParent ? (
              // فورم ربط الطالب الخاصة بولي الأمر
              <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
                <div className="flex items-center gap-4">
                  <div className="rounded-2xl bg-blue-600/15 p-4">
                    <LinkIcon size={28} className="text-blue-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Link Your Student</h2>
                    <p className="text-zinc-400">Enter the code to track their progress.</p>
                  </div>
                </div>

                <form onSubmit={handleLinkStudent} className="mt-8">
                  <input
                    type="text"
                    placeholder="e.g. A1B2C3"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                    maxLength={6}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-4 font-mono text-xl tracking-widest text-center text-white outline-none focus:border-blue-500"
                    required
                  />
                  {linkError && (
                    <p className="mt-3 flex items-center gap-2 text-sm text-red-400">
                      <AlertCircle size={16} /> {linkError}
                    </p>
                  )}
                  {linkSuccess && (
                    <p className="mt-3 flex items-center gap-2 text-sm text-green-400">
                      <CheckCircle2 size={16} /> {linkSuccess}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={linking || inputCode.length < 6}
                    className="mt-6 w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 p-4 font-bold text-white transition hover:bg-blue-700 disabled:opacity-50"
                  >
                    {linking ? <Loader2 className="animate-spin" /> : "Connect Account"}
                  </button>
                </form>
              </div>
            ) : (
              // كود الطالب الخاص به
              <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
                <div className="flex items-center gap-4">
                  <div className="rounded-2xl bg-indigo-600/15 p-4">
                    <Key size={28} className="text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Parent Link Code</h2>
                    <p className="text-zinc-400">Share this with your parent to track your progress.</p>
                  </div>
                </div>

                <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950 p-6 text-center">
                  <p className="text-sm text-zinc-500 mb-3">Your Unique Code</p>
                  <div className="flex items-center justify-center gap-4">
                    <span className="text-4xl font-mono font-bold tracking-widest text-white">
                      {linkCode || "------"}
                    </span>
                    <button 
                      onClick={copyToClipboard}
                      className="rounded-xl bg-zinc-800 p-3 hover:bg-zinc-700 transition"
                    >
                      {copied ? <CheckCircle2 className="text-green-500" /> : <Copy className="text-zinc-400" />}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}