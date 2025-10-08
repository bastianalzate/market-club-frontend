"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProfileContext } from "@/contexts/ProfileContext";
import { testBackendConnection } from "@/utils/testConnection";

export default function AuthDebug() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { profile, isLoading: isProfileLoading } = useProfileContext();
  const [token, setToken] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  const [backendStatus, setBackendStatus] = useState<string>('unknown');

  useEffect(() => {
    setToken(localStorage.getItem('auth_token'));
    setSessionId(localStorage.getItem('session_id'));
    
    // Capturar errores de la consola
    const originalError = console.error;
    console.error = (...args) => {
      setLastError(args.join(' '));
      originalError.apply(console, args);
    };
    
    return () => {
      console.error = originalError;
    };
  }, []);

  useEffect(() => {
    if (token) {
      testBackendConnection().then(isConnected => {
        setBackendStatus(isConnected ? 'connected' : 'disconnected');
      });
    }
  }, [token]);

  if (process.env.NODE_ENV !== 'development') {
    return null; // Solo mostrar en desarrollo
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg shadow-lg max-w-md text-xs z-50">
      <h3 className="font-bold mb-2">🐛 Auth Debug</h3>
      <div className="space-y-1">
        <div><strong>Auth Loading:</strong> {isLoading ? 'true' : 'false'}</div>
        <div><strong>Authenticated:</strong> {isAuthenticated ? 'true' : 'false'}</div>
        <div><strong>User:</strong> {user ? user.name : 'null'}</div>
        <div><strong>Profile Loading:</strong> {isProfileLoading ? 'true' : 'false'}</div>
        <div><strong>Profile:</strong> {profile ? profile.name : 'null'}</div>
        <div><strong>Token:</strong> {token ? `${token.substring(0, 20)}...` : 'null'}</div>
        <div><strong>Session ID:</strong> {sessionId ? `${sessionId.substring(0, 20)}...` : 'null'}</div>
        <div><strong>Backend:</strong> <span className={backendStatus === 'connected' ? 'text-green-400' : 'text-red-400'}>{backendStatus}</span></div>
        {lastError && (
          <div className="text-red-400"><strong>Last Error:</strong> {lastError}</div>
        )}
      </div>
    </div>
  );
}
