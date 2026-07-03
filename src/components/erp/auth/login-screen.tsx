"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Fingerprint,
  Mail,
  Lock,
  ArrowRight,
  Smartphone,
  Building2,
  Wifi,
  WifiOff,
  Loader2,
  CheckCircle2,
  KeyRound,
  TrendingUp,
  Package,
  Users,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useERPStore, type UserRole } from "@/stores/erp-store";
import { useTranslation } from "@/lib/use-translation";
import { cn } from "@/lib/utils";

type AuthStep = "credentials" | "biometric" | "twofactor" | "scanning";

export function LoginScreen() {
  const { t } = useTranslation();
  const login = useERPStore((s) => s.login);

  const [step, setStep] = useState<AuthStep>("credentials");
  const [email, setEmail] = useState("abebe.b@hisaberp.et");
  const [password, setPassword] = useState("••••••••");
  const [role, setRole] = useState<UserRole>("admin");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [biometricProgress, setBiometricProgress] = useState(0);
  const [isOnline, setIsOnline] = useState(true);

  const completeLogin = () => {
    const roleNames: Record<UserRole, { name: string; email: string }> = {
      admin: { name: "Abebe Bekele", email: "abebe.b@hisaberp.et" },
      manager: { name: "Sara Tadesse", email: "sara.t@hisaberp.et" },
      staff: { name: "Hanna Mengistu", email: "hanna.m@hisaberp.et" },
    };
    const info = roleNames[role];
    login({
      id: "U-001",
      name: info.name,
      email: info.email,
      role,
      avatar: info.name.split(" ").map((n) => n[0]).join(""),
      twoFactorEnabled: true,
    });
  };

  useEffect(() => {
    if (step === "scanning") {
      const interval = setInterval(() => {
        setBiometricProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            completeLogin();
            return 100;
          }
          return prev + 4;
        });
      }, 60);
      return () => clearInterval(interval);
    }
  }, [step]);

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("twofactor");
  };

  const handleTwoFactorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (twoFactorCode.length === 6) {
      completeLogin();
    }
  };

  const handleBiometricLogin = () => {
    setStep("scanning");
    setBiometricProgress(0);
  };

  const useDemoAccount = () => {
    completeLogin();
  };

  return (
    <div className="min-h-screen flex bg-[#0F171E] text-white">
      {/* Left side — Cinematic Prime Video-style hero */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#0F171E]">
        {/* Gradient overlays */}
        <div className="absolute inset-0" style={{
          background: `
            radial-gradient(ellipse at 20% 30%, rgba(0, 168, 225, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgba(43, 213, 245, 0.1) 0%, transparent 50%),
            linear-gradient(180deg, #0F171E 0%, #1A2433 100%)
          `,
        }} />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `
            linear-gradient(#00A8E1 1px, transparent 1px),
            linear-gradient(90deg, #00A8E1 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }} />

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl flex items-center justify-center text-[#0F171E] font-black text-2xl relative" style={{
              background: "linear-gradient(135deg, #00A8E1 0%, #2BD5F5 100%)",
              boxShadow: "0 4px 24px rgba(0, 168, 225, 0.4)",
            }}>
              H
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Hisab<span className="text-[#2BD5F5]">ERP</span>
              </h1>
              <p className="text-xs text-white/60 mt-0.5">{t.tagline}</p>
            </div>
          </div>

          {/* Hero content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00A8E1]/10 border border-[#00A8E1]/30">
              <span className="h-1.5 w-1.5 rounded-full bg-[#2BD5F5]" style={{ boxShadow: "0 0 8px #2BD5F5" }} />
              <span className="text-xs font-semibold text-[#2BD5F5] uppercase tracking-wider">ERCA Compliant</span>
            </div>
            <h2 className="text-5xl xl:text-6xl font-bold leading-[1.05] tracking-tight">
              Run your<br />
              <span style={{
                background: "linear-gradient(135deg, #00A8E1 0%, #2BD5F5 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                Ethiopian business
              </span><br />
              with confidence.
            </h2>
            <p className="text-lg text-white/70 leading-relaxed max-w-md">
              Unified finance, inventory, HR, sales & compliance — built for ETB, Amharic + English, and local tax regulations.
            </p>

            {/* Module icons */}
            <div className="grid grid-cols-2 gap-3 max-w-md">
              {[
                { icon: <TrendingUp className="h-4 w-4" />, label: "Finance" },
                { icon: <Package className="h-4 w-4" />, label: "Inventory" },
                { icon: <Users className="h-4 w-4" />, label: "HR & Payroll" },
                { icon: <ShoppingCart className="h-4 w-4" />, label: "Sales & CRM" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/5 backdrop-blur-sm"
                >
                  <span className="text-[#2BD5F5]">{item.icon}</span>
                  <span className="text-sm font-medium text-white/80">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trust badges */}
          <div className="flex items-center gap-6 text-sm text-white/50">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>256-bit Encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>ISO 27001</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span>Local Data Residency</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side — Auth form */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12 bg-[#0F171E] relative">
        {/* Mobile background gradient */}
        <div className="absolute inset-0 lg:hidden" style={{
          background: `
            radial-gradient(ellipse at 50% 0%, rgba(0, 168, 225, 0.15) 0%, transparent 60%),
            #0F171E
          `,
        }} />

        <div className="w-full max-w-md relative z-10">
          {/* Mobile branding */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="h-12 w-12 rounded-xl flex items-center justify-center text-[#0F171E] font-black text-2xl" style={{
              background: "linear-gradient(135deg, #00A8E1 0%, #2BD5F5 100%)",
              boxShadow: "0 4px 24px rgba(0, 168, 225, 0.4)",
            }}>
              H
            </div>
            <div>
              <h1 className="text-xl font-bold">
                Hisab<span className="text-[#2BD5F5]">ERP</span>
              </h1>
              <p className="text-xs text-white/60">{t.tagline}</p>
            </div>
          </div>

          {/* Online/offline indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors",
                isOnline
                  ? "bg-[#00A8E1]/10 text-[#2BD5F5] border border-[#00A8E1]/30"
                  : "bg-white/5 text-white/40 border border-white/10"
              )}
            >
              {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
              {isOnline ? t.login.onlineStatus : t.login.offlineMode}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Credentials */}
            {step === "credentials" && (
              <motion.div
                key="credentials"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <div className="mb-8 text-center sm:text-left">
                  <h2 className="text-3xl font-bold">{t.login.title}</h2>
                  <p className="text-sm text-white/50 mt-2">{t.login.subtitle}</p>
                </div>

                <form onSubmit={handleCredentialsSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white/70 text-xs uppercase tracking-wider">{t.login.email}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                      <Input
                        id="email"
                        type="email"
                        placeholder={t.login.emailPlaceholder}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-white/[0.03] border-white/10 text-white placeholder:text-white/30 focus-visible:border-[#00A8E1] focus-visible:ring-[#00A8E1]/20 h-12"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-white/70 text-xs uppercase tracking-wider">{t.login.password}</Label>
                      <button type="button" className="text-xs text-[#2BD5F5] hover:text-[#00A8E1] transition-colors">
                        {t.login.forgotPassword}
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                      <Input
                        id="password"
                        type="password"
                        placeholder={t.login.passwordPlaceholder}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 bg-white/[0.03] border-white/10 text-white placeholder:text-white/30 focus-visible:border-[#00A8E1] focus-visible:ring-[#00A8E1]/20 h-12"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white/70 text-xs uppercase tracking-wider">{t.login.selectRole}</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["admin", "manager", "staff"] as UserRole[]).map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setRole(r)}
                          className={cn(
                            "px-3 py-2.5 rounded-lg text-sm font-medium border transition-all",
                            role === r
                              ? "border-[#00A8E1] bg-[#00A8E1]/10 text-[#2BD5F5]"
                              : "border-white/10 bg-white/[0.02] text-white/50 hover:border-white/20 hover:text-white/80"
                          )}
                        >
                          {t.login[r]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <label className="flex items-center gap-2 text-sm text-white/50 cursor-pointer">
                    <input type="checkbox" className="rounded border-white/20 bg-white/5" defaultChecked />
                    {t.login.rememberMe}
                  </label>

                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-semibold text-[#0F171E]"
                    style={{
                      background: "linear-gradient(135deg, #00A8E1 0%, #2BD5F5 100%)",
                      boxShadow: "0 4px 20px rgba(0, 168, 225, 0.4)",
                    }}
                    size="lg"
                  >
                    {t.login.signIn}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-[#0F171E] px-2 text-white/40">OR</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full h-12 bg-white/[0.03] border-white/10 text-white hover:bg-white/[0.05] hover:border-[#00A8E1]/40"
                    size="lg"
                    onClick={handleBiometricLogin}
                  >
                    <Fingerprint className="mr-2 h-5 w-5 text-[#2BD5F5]" />
                    {t.login.biometric}
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full text-sm text-white/50 hover:text-[#2BD5F5] hover:bg-transparent"
                    onClick={useDemoAccount}
                  >
                    {t.login.demoAccount}
                  </Button>
                </div>

                <p className="mt-6 text-xs text-center text-white/30">
                  {t.login.secureNote}
                </p>
              </motion.div>
            )}

            {/* Step 2: Biometric Scanning */}
            {(step === "biometric" || step === "scanning") && (
              <motion.div
                key="biometric"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="text-center"
              >
                <h2 className="text-3xl font-bold mb-2">{t.login.biometric}</h2>
                <p className="text-sm text-white/50 mb-8">{t.login.scanBiometric}</p>

                <div className="relative mx-auto w-40 h-40 mb-8">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 144 144">
                    <circle cx="72" cy="72" r="64" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
                    <circle
                      cx="72"
                      cy="72"
                      r="64"
                      fill="none"
                      stroke="#00A8E1"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 64}`}
                      strokeDashoffset={`${2 * Math.PI * 64 * (1 - biometricProgress / 100)}`}
                      className="transition-all duration-100"
                      style={{ filter: "drop-shadow(0 0 8px rgba(0, 168, 225, 0.6))" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    {biometricProgress < 100 ? (
                      <Fingerprint className="h-16 w-16 text-[#2BD5F5]" style={{ filter: "drop-shadow(0 0 12px rgba(0, 168, 225, 0.6))" }} />
                    ) : (
                      <CheckCircle2 className="h-16 w-16 text-[#2BD5F5]" />
                    )}
                  </div>
                </div>

                <p className="text-sm font-medium">
                  {biometricProgress < 100 ? t.login.scanning : "Verified!"}
                </p>
                <p className="text-xs text-white/50 mt-1">{biometricProgress}%</p>

                <Button
                  variant="ghost"
                  className="mt-6 text-white/50 hover:text-white"
                  onClick={() => setStep("credentials")}
                  disabled={step === "scanning" && biometricProgress < 100}
                >
                  {t.common.cancel}
                </Button>
              </motion.div>
            )}

            {/* Step 3: 2FA */}
            {step === "twofactor" && (
              <motion.div
                key="twofactor"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <div className="text-center mb-8">
                  <div className="mx-auto w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{
                    background: "rgba(0, 168, 225, 0.1)",
                    border: "1px solid rgba(0, 168, 225, 0.3)",
                  }}>
                    <Smartphone className="h-7 w-7 text-[#2BD5F5]" />
                  </div>
                  <h2 className="text-3xl font-bold">{t.login.twoFactor}</h2>
                  <p className="text-sm text-white/50 mt-2">
                    Enter the 6-digit code from your authenticator app
                  </p>
                </div>

                <form onSubmit={handleTwoFactorSubmit} className="space-y-6">
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={twoFactorCode}
                      onChange={(value) => setTwoFactorCode(value)}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} className="bg-white/[0.03] border-white/10 text-white" />
                        <InputOTPSlot index={1} className="bg-white/[0.03] border-white/10 text-white" />
                        <InputOTPSlot index={2} className="bg-white/[0.03] border-white/10 text-white" />
                        <InputOTPSlot index={3} className="bg-white/[0.03] border-white/10 text-white" />
                        <InputOTPSlot index={4} className="bg-white/[0.03] border-white/10 text-white" />
                        <InputOTPSlot index={5} className="bg-white/[0.03] border-white/10 text-white" />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-semibold text-[#0F171E]"
                    style={{
                      background: "linear-gradient(135deg, #00A8E1 0%, #2BD5F5 100%)",
                      boxShadow: "0 4px 20px rgba(0, 168, 225, 0.4)",
                    }}
                    size="lg"
                    disabled={twoFactorCode.length !== 6}
                  >
                    {twoFactorCode.length !== 6 ? (
                      <>
                        <KeyRound className="mr-2 h-4 w-4" />
                        {t.login.twoFactorPlaceholder}
                      </>
                    ) : (
                      <>
                        {t.login.verifyTwoFactor}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>

                  <div className="text-center space-y-2">
                    <button type="button" className="text-xs text-[#2BD5F5] hover:text-[#00A8E1]">
                      Resend code
                    </button>
                    <div>
                      <button
                        type="button"
                        className="text-xs text-white/40 hover:text-white/60"
                        onClick={() => setStep("credentials")}
                      >
                        ← Back to login
                      </button>
                    </div>
                  </div>
                </form>

                <div className="mt-6 p-3 rounded-lg bg-[#00A8E1]/5 border border-[#00A8E1]/20">
                  <p className="text-xs text-white/50 text-center">
                    💡 Demo: Enter any 6 digits to continue
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
