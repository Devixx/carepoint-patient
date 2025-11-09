"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  EnvelopeIcon,
  LockClosedIcon,
  HeartIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { Button } from "../components/ui/Button";
import { useAuth } from "../contexts/AuthContext";
import { ApiError } from "@/lib/api";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      toast.success("Welcome back!");
      router.push("/");
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-3 sm:p-4">
      <div className="max-w-md w-full bg-white rounded-xl sm:rounded-2xl shadow-xl p-5 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <HeartIcon className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">
            Welcome Back
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">Sign in to your CarePoint account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 lg:space-y-6">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">
              Email Address
            </label>
            <div className="relative">
              <EnvelopeIcon className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-slate-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">
              Password
            </label>
            <div className="relative">
              <LockClosedIcon className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base border border-slate-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <label className="flex items-center min-w-0">
              <input
                type="checkbox"
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 flex-shrink-0"
              />
              <span className="ml-1.5 sm:ml-2 text-xs sm:text-sm text-slate-600">Remember me</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 whitespace-nowrap"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full h-10 sm:h-11 lg:h-12 text-sm sm:text-base lg:text-lg"
          >
            Sign In
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300" />
            </div>
            <div className="relative flex justify-center text-xs sm:text-sm">
              <span className="px-2 bg-white text-slate-500">Or</span>
            </div>
          </div>

          <p className="text-center text-xs sm:text-sm text-slate-600">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign up
            </Link>
          </p>
        </form>

        {/* Demo Login */}
        <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-slate-200">
          <p className="text-[10px] sm:text-xs text-slate-500 text-center mb-2 sm:mb-3">
            Demo Account (for testing)
          </p>
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs sm:text-sm"
            onClick={() =>
              setFormData({
                email: "john.smith@example.com",
                password: "password123",
              })
            }
          >
            Fill Demo Credentials
          </Button>
        </div>
      </div>
    </div>
  );
}
