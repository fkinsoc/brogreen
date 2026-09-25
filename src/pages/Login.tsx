import React, { useState } from "react";
import { auth, db } from "../lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  OAuthProvider,
} from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { Github, Layers, ArrowRight, ShieldCheck, Compass } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSuccessfulAuth = async (user: any) => {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    const isBootstrappedAdmin = user.email === "klassic.ig@gmail.com";

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        email: user.email || "",
        role: isBootstrappedAdmin ? "admin" : "user",
        status: isBootstrappedAdmin ? "approved" : "pending",
        name: name || user.displayName || user.email?.split("@")[0] || "User",
        createdAt: new Date().toISOString(),
      });
    }
    navigate("/");
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isLogin) {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        await handleSuccessfulAuth(credential.user);
      } else {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        await handleSuccessfulAuth(credential.user);
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed. Check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: any) => {
    setError("");
    setLoading(true);
    try {
      const credential = await signInWithPopup(auth, provider);
      await handleSuccessfulAuth(credential.user);
    } catch (err: any) {
      setError(err.message || "OAuth login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1410] text-[#eff3ef] flex items-center justify-center p-4 font-sans selection:bg-[#2e543e]">
      <div className="max-w-md w-full rounded-xl bg-[#141d17] border border-[#233127] p-6 sm:p-8 shadow-xl">
        {/* Brand */}
        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded-lg bg-[#1f4230] border border-[#2b5941] flex items-center justify-center text-white mx-auto mb-3 shadow-xs">
            <Layers className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Bro Foresee
          </h1>
          <p className="text-xs text-[#8c9c90] mt-1">
            {isLogin ? "Sign in to access Land Acquisition Intelligence" : "Request operational system access"}
          </p>
        </div>

        {/* Public Farmer Portal Banner */}
        <div className="mb-5 p-3 rounded-lg bg-[#18261e] border border-[#264433] flex items-center justify-between text-xs">
          <div>
            <div className="font-semibold text-[#8ed4a7] flex items-center gap-1.5">
              <span>🌾 Landowner & Farmer Portal</span>
            </div>
            <div className="text-[11px] text-[#9db2a4] mt-0.5">
              Search survey records & compensation status
            </div>
          </div>
          <Link
            to="/farmer-portal"
            className="px-2.5 py-1 text-[11px] font-semibold bg-[#2a4d39] hover:bg-[#345f47] text-white rounded transition-colors whitespace-nowrap"
          >
            Open Portal →
          </Link>
        </div>

        {error && (
          <div className="bg-[#2c1d1a] border border-[#522923] text-[#e87f71] text-xs p-2.5 rounded-md mb-4 text-center leading-relaxed">
            {error}
          </div>
        )}

        {!isLogin && (
          <div className="bg-[#1b261f] border border-[#2a3f32] text-[#b6d6bf] text-[11px] p-2.5 rounded-md mb-4 flex items-start gap-2 leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-[#78c091] flex-shrink-0 mt-0.5" />
            <span>
              <strong>Access Policy Notice:</strong> To ensure government land records compliance, all new registrations require administrator authorization before full operational access is unlocked.
            </span>
          </div>
        )}

        <form onSubmit={handleEmailAuth} className="space-y-3.5">
          {!isLogin && (
            <div>
              <label className="block text-xs font-medium text-[#8c9c90] mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ramesh Kulkarni"
                required={!isLogin}
                className="w-full bg-[#0d1410] border border-[#2a382e] rounded-md px-3 py-2 text-xs text-white placeholder-[#607165] focus:outline-none focus:border-[#37634b] focus:ring-1 focus:ring-[#37634b]"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-[#8c9c90] mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@organization.com"
              required
              className="w-full bg-[#0d1410] border border-[#2a382e] rounded-md px-3 py-2 text-xs text-white placeholder-[#607165] focus:outline-none focus:border-[#37634b] focus:ring-1 focus:ring-[#37634b]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#8c9c90] mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              className="w-full bg-[#0d1410] border border-[#2a382e] rounded-md px-3 py-2 text-xs text-white placeholder-[#607165] focus:outline-none focus:border-[#37634b] focus:ring-1 focus:ring-[#37634b]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 rounded-md bg-[#1f4230] hover:bg-[#163324] text-white text-xs font-semibold tracking-wide transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-1 cursor-pointer shadow-xs"
          >
            <span>{loading ? "Processing..." : isLogin ? "Sign In" : "Request Account"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#1c2720]" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-[#141d17] px-2 text-[#607165]">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleOAuth(new GoogleAuthProvider())}
            type="button"
            className="flex justify-center items-center py-2 border border-[#26352b] rounded-md bg-[#0e1611] hover:bg-[#18241c] transition-colors"
            title="Google"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          </button>

          <button
            onClick={() => handleOAuth(new GithubAuthProvider())}
            type="button"
            className="flex justify-center items-center py-2 border border-[#26352b] rounded-md bg-[#0e1611] hover:bg-[#18241c] transition-colors"
            title="GitHub"
          >
            <Github className="w-4 h-4 text-[#dce4de]" />
          </button>

          <button
            onClick={() => {
              const msProvider = new OAuthProvider("microsoft.com");
              handleOAuth(msProvider);
            }}
            type="button"
            className="flex justify-center items-center py-2 border border-[#26352b] rounded-md bg-[#0e1611] hover:bg-[#18241c] transition-colors"
            title="Microsoft"
          >
            <svg className="w-4 h-4" viewBox="0 0 21 21" fill="none">
              <rect x="1" y="1" width="9" height="9" fill="#F25022" />
              <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
              <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
              <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
            </svg>
          </button>
        </div>

        <div className="mt-5 text-center space-y-2">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
            className="text-xs text-[#8c9c90] hover:text-white transition-colors"
          >
            {isLogin
              ? "Need an account? Request access"
              : "Already have an account? Sign in"}
          </button>

          <div className="text-[11px] text-[#58685e] pt-2 border-t border-[#1c2720]">
            <Link to="/legal" className="underline hover:text-white transition-colors">
              Terms & Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
