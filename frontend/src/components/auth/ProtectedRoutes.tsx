import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Cpu } from 'lucide-react';

export const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-65px)] flex items-center justify-center bg-[#07140F]">
        <div className="flex flex-col items-center space-y-3">
          <Cpu className="w-8 h-8 text-emerald-400 animate-spin" />
          <span className="text-xs text-slate-400 font-mono">VERIFYING AUTHENTICATION SESSION...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export const RequireAdmin: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-65px)] flex items-center justify-center bg-[#07140F]">
        <Cpu className="w-8 h-8 text-emerald-400 animate-spin" />
      </div>
    );
  }

  if (!user || (user.role.toLowerCase() !== 'admin' && user.role.toLowerCase() !== 'vendor')) {
    return <Navigate to="/catalog" replace />;
  }

  return <>{children}</>;
};

export const RequireVendor: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-65px)] flex items-center justify-center bg-[#07140F]">
        <Cpu className="w-8 h-8 text-emerald-400 animate-spin" />
      </div>
    );
  }

  if (!user || (user.role.toLowerCase() !== 'vendor' && user.role.toLowerCase() !== 'admin')) {
    return <Navigate to="/catalog" replace />;
  }

  return <>{children}</>;
};
