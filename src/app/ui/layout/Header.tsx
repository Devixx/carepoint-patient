"use client";

import React from "react";
import { Bell, Search, User, Menu, Heart } from "lucide-react";
import Button from "../primitives/Button";
import { useAuth } from "../../contexts/AuthContext";
import clsx from "clsx";

interface HeaderProps {
  onMenuClick?: () => void;
  title?: string;
  showSearch?: boolean;
  className?: string;
}

export default function Header({
  onMenuClick,
  title = "Patient Portal",
  showSearch = true,
  className,
}: HeaderProps) {
  const { patient, logout } = useAuth();

  return (
    <header
      className={clsx(
        "bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between",
        className
      )}
    >
      <div className="flex items-center space-x-4">
        {onMenuClick && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-blue-600" />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900">CarePoint</h1>
              <p className="text-xs text-gray-500">{title}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {showSearch && (
          <div className="hidden md:block relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        )}

        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
        </Button>

        <div className="flex items-center space-x-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-gray-900">
              {patient?.firstName} {patient?.lastName}
            </p>
            <p className="text-xs text-gray-500">Patient</p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="flex items-center space-x-2"
          >
            <User className="h-5 w-5" />
            <span className="hidden sm:inline">Profile</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
