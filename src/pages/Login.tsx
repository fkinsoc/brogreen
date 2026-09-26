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
import { Github, Layers, ArrowRight, ShieldCheck } from "lucide-react";
import { useTranslation } from "../lib/i18n";
import LanguageSelector from "../components/LanguageSelector";

export default function LoginPage() {
  const { t } = useTranslation();
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
      <div className="max-w-md w-full rounded-xs bg-[#141d17] border border-[#233127] p-6 sm:p-8 relative">
        {/* Top bar with language switcher */}
        <div className="flex justify-end mb-2">
          <LanguageSelector />
        </div>

        {/* Brand */}
        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded-xs bg-[#1f4230] border border-[#2b5941] flex items-center justify-center text-white mx-auto mb-3">
            <Layers className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Bro Foresee
          </h1>
          <p className="text-xs text-[#8c9c90] mt-1">
            {isLogin ? t('auth.signInTitle') : t('auth.requestAccessTitle')}
          </p>
        </div>

        {/* Public Farmer Portal Banner */}
        <div className="mb-5 p-3 rounded-xs bg-[#18261e] border border-[#264433] flex items-center justify-between text-xs">
          <div>
            <div className="font-semibold text-[#8ed4a7] flex items-center gap-1.5">
              <span>{t('auth.publicFarmerPortal')}</span>
            </div>
            <div className="text-[11px] text-[#9db2a4] mt-0.5">
              {t('auth.publicPortalDesc')}
            </div>
          </div>
          <Link
            to="/farmer-portal"
            className="px-2.5 py-1 text-[11px] font-semibold bg-[#2a4d39] hover:bg-[#345f47] text-white rounded-xs transition-colors whitespace-nowrap"
          >
            {t('auth.openPortal')}
          </Link>
        </div>

        {error && (
          <div className="bg-[#2c1d1a] border border-[#522923] text-[#e87f71] text-xs p-2.5 rounded-xs mb-4 text-center leading-relaxed">
            {error}
          </div>
        )}

        {!isLogin && (
          <div className="bg-[#1b261f] border border-[#2a3f32] text-[#b6d6bf] text-[11px] p-2.5 rounded-xs mb-4 flex items-start gap-2 leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-[#78c091] flex-shrink-0 mt-0.5" />
            <span>
              {t('auth.policyNotice')}
            </span>
          </div>
        )}

        <form onSubmit={handleEmailAuth} className="space-y-3.5">
          {!isLogin && (
            <div>
              <label className="block text-xs font-medium text-[#8c9c90] mb-1">
                {t('auth.fullName')}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ramesh Kulkarni"
                required={!isLogin}
                className="w-full bg-[#0d1410] border border-[#2a382e] rounded-xs px-3 py-2 text-xs text-white placeholder-[#607165] focus:outline-none focus:border-[#37634b]"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-[#8c9c90] mb-1">
              {t('auth.email')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@organization.com"
              required
              className="w-full bg-[#0d1410] border border-[#2a382e] rounded-xs px-3 py-2 text-xs text-white placeholder-[#607165] focus:outline-none focus:border-[#37634b]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#8c9c90] mb-1">
              {t('auth.password')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              className="w-full bg-[#0d1410] border border-[#2a382e] rounded-xs px-3 py-2 text-xs text-white placeholder-[#607165] focus:outline-none focus:border-[#37634b]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 rounded-xs bg-[#1f4230] hover:bg-[#163324] text-white text-xs font-semibold tracking-wide transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-1 cursor-pointer"
          >
            <span>{loading ? "..." : isLogin ? t('auth.signInBtn') : t('auth.requestAccountBtn')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#1c2720]" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-[#141d17] px-2 text-[#607165]">
              {t('auth.orContinueWith')}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleOAuth(new GoogleAuthProvider())}
            type="button"
            className="flex justify-center items-center py-2 border border-[#26352b] rounded-xs bg-[#0e1611] hover:bg-[#18241c] transition-colors cursor-pointer"
            title="Google"
          >
            <span className="text-xs font-medium text-[#cad6cd]">Google</span>
          </button>

          <button
            onClick={() => handleOAuth(new GithubAuthProvider())}
            type="button"
            className="flex justify-center items-center py-2 border border-[#26352b] rounded-xs bg-[#0e1611] hover:bg-[#18241c] transition-colors cursor-pointer"
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
            className="flex justify-center items-center py-2 border border-[#26352b] rounded-xs bg-[#0e1611] hover:bg-[#18241c] transition-colors cursor-pointer"
            title="Microsoft"
          >
            <span className="text-xs font-medium text-[#cad6cd]">Microsoft</span>
          </button>
        </div>

        <div className="mt-5 text-center space-y-2">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
            className="text-xs text-[#8c9c90] hover:text-white transition-colors cursor-pointer"
          >
            {isLogin
              ? t('auth.needAccount')
              : t('auth.haveAccount')}
          </button>

          <div className="text-[11px] text-[#58685e] pt-2 border-t border-[#1c2720]">
            <Link to="/legal" className="underline hover:text-white transition-colors font-medium">
              {t('nav.termsPrivacy')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
