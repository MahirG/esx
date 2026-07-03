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
  const [email, setEmail] = useState("abebe.b@addiserp.et");
  const [password, setPassword] = useState("••••••••");
  const [role, setRole] = useState<UserRole>("admin");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [biometricProgress, setBiometricProgress] = useState(0);
  const [isOnline, setIsOnline] = useState(true);

  const completeLogin = () => {
    const roleNames: Record<UserRole, { name: string; email: string }> = {
      admin: { name: "Abebe Bekele", email: "abebe.b@addiserp.et" },
      manager: { name: "Sara Tadesse", email: "sara.t@addiserp.et" },
      staff: { name: "Hanna Mengistu", email: "hanna.m@addiserp.et" },
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
    <div className="min-h-screen flex flex-col lg:flex-row bg-background ethiopian-pattern">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-emerald relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L37 23H60L42 37L48 60L30 46L12 60L18 37L0 23H23Z' fill='white' opacity='0.3'/%3E%3C/svg%3E")`,
        }} />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{t.brand}</h1>
              <p className="text-sm text-white/80">{t.tagline}</p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl xl:text-5xl font-bold leading-tight">
              Run your Ethiopian business with confidence.
            </h2>
            <p className="text-lg text-white/80 leading-relaxed">
              Unified finance, inventory, HR, sales & compliance — built for ETB,
              Amharic + English, and local tax regulations.
            </p>
            <div className="grid grid-cols-2 gap-3 max-w-md">
              {[
                { label: "Dashen Bank", icon: "🏦" },
                { label: "Telebirr", icon: "📱" },
                { label: "ERCA Compliant", icon: "✓" },
                { label: "Offline Mode", icon: "📶" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10"
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm text-white/70">
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

      {/* Right side - Auth form */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile branding */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="h-12 w-12 rounded-2xl gradient-emerald flex items-center justify-center text-white">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">{t.brand}</h1>
              <p className="text-xs text-muted-foreground">{t.tagline}</p>
            </div>
          </div>

          {/* Online/offline indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium",
                isOnline
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground"
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
                <div className="mb-6 text-center sm:text-left">
                  <h2 className="text-2xl font-bold text-foreground">{t.login.title}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{t.login.subtitle}</p>
                </div>

                <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t.login.email}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder={t.login.emailPlaceholder}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">{t.login.password}</Label>
                      <button type="button" className="text-xs text-primary hover:underline">
                        {t.login.forgotPassword}
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder={t.login.passwordPlaceholder}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>{t.login.selectRole}</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["admin", "manager", "staff"] as UserRole[]).map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setRole(r)}
                          className={cn(
                            "px-3 py-2 rounded-lg text-sm font-medium border transition-all",
                            role === r
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border bg-card text-muted-foreground hover:border-primary/40"
                          )}
                        >
                          {t.login[r]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                    <input type="checkbox" className="rounded border-border" defaultChecked />
                    {t.login.rememberMe}
                  </label>

                  <Button type="submit" className="w-full gradient-emerald text-white hover:opacity-90" size="lg">
                    {t.login.signIn}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-background px-2 text-muted-foreground">OR</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    size="lg"
                    onClick={handleBiometricLogin}
                  >
                    <Fingerprint className="mr-2 h-5 w-5 text-primary" />
                    {t.login.biometric}
                  </Button>
                  <Button variant="ghost" className="w-full text-sm" onClick={useDemoAccount}>
                    {t.login.demoAccount}
                  </Button>
                </div>

                <p className="mt-6 text-xs text-center text-muted-foreground">
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
                <h2 className="text-2xl font-bold text-foreground mb-2">{t.login.biometric}</h2>
                <p className="text-sm text-muted-foreground mb-8">{t.login.scanBiometric}</p>

                <div className="relative mx-auto w-40 h-40 mb-8">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 144 144">
                    <circle
                      cx="72"
                      cy="72"
                      r="64"
                      fill="none"
                      stroke="oklch(0.90 0.015 85)"
                      strokeWidth="6"
                    />
                    <circle
                      cx="72"
                      cy="72"
                      r="64"
                      fill="none"
                      stroke="oklch(0.52 0.14 162)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 64}`}
                      strokeDashoffset={`${2 * Math.PI * 64 * (1 - biometricProgress / 100)}`}
                      className="transition-all duration-100"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    {biometricProgress < 100 ? (
                      <Fingerprint className="h-16 w-16 text-primary" />
                    ) : (
                      <CheckCircle2 className="h-16 w-16 text-primary" />
                    )}
                  </div>
                </div>

                <p className="text-sm font-medium text-foreground">
                  {biometricProgress < 100 ? t.login.scanning : "Verified!"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{biometricProgress}%</p>

                <Button
                  variant="ghost"
                  className="mt-6"
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
                  <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <Smartphone className="h-7 w-7 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">{t.login.twoFactor}</h2>
                  <p className="text-sm text-muted-foreground mt-1">
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
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>

                  <Button
                    type="submit"
                    className="w-full gradient-emerald text-white hover:opacity-90"
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
                    <button type="button" className="text-xs text-primary hover:underline">
                      Resend code
                    </button>
                    <div>
                      <button
                        type="button"
                        className="text-xs text-muted-foreground hover:text-foreground"
                        onClick={() => setStep("credentials")}
                      >
                        ← Back to login
                      </button>
                    </div>
                  </div>
                </form>

                <Card className="mt-6 bg-muted/30 border-border/60">
                  <CardContent className="p-3 text-xs text-muted-foreground text-center">
                    💡 Demo: Enter any 6 digits to continue
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
