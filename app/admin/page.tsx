'use client';

import React, { useState, useEffect } from 'react';
import { Card, Button, Input } from '@/components/ui';
import Link from 'next/link';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const pwd = sessionStorage.getItem('adminPassword');
    if (pwd) {
      setPassword(pwd);
      setIsAuthenticated(true);
      await fetchState(pwd);
    }
  };

  const fetchState = async (pwd: string) => {
    try {
      const res = await fetch(`/api/reveal?password=${encodeURIComponent(pwd)}`);
      if (res.ok) {
        const data = await res.json();
        setRevealed(data.revealed);
        setCorrectAnswer(data.correctAnswer || '');
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length > 0) {
      sessionStorage.setItem('adminPassword', password);
      setIsAuthenticated(true);
      setError('');
      fetchState(password);
    } else {
      setError('Contraseña requerida');
    }
  };

  const handleReveal = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/reveal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password,
          answer: correctAnswer,
        }),
      });

      if (res.ok) {
        setRevealed(true);
        setMessage('✓ Respuesta revelada! Los resultados están disponibles.');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setError('Error al revelar la respuesta');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (confirm('¿Estás seguro? Esto eliminará todos los registros.')) {
      setLoading(true);
      try {
        const res = await fetch('/api/reset', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password }),
        });

        if (res.ok) {
          setRevealed(false);
          setCorrectAnswer('');
          setMessage('✓ App reseteada');
          setTimeout(() => setMessage(''), 3000);
        } else {
          setError('Error al resetear');
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Error de conexión');
      } finally {
        setLoading(false);
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <Link href="/">
              <h1 className="text-4xl font-bold text-white">
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Admin
                </span>
              </h1>
            </Link>
          </div>

          <Card className="p-8">
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                label="Contraseña"
                type="password"
                placeholder="Ingresa la contraseña"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                error={error}
              />
              <Button type="submit" className="w-full" size="lg">
                Acceder
              </Button>
            </form>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center">
          <Link href="/">
            <h1 className="text-4xl font-bold text-white">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Admin Panel
              </span>
            </h1>
          </Link>
        </div>

        {message && (
          <Card className="p-4 bg-green-500/20 border-green-500/30">
            <p className="text-green-200 text-center">{message}</p>
          </Card>
        )}

        {error && (
          <Card className="p-4 bg-red-500/20 border-red-500/30">
            <p className="text-red-200 text-center">{error}</p>
          </Card>
        )}

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Estado actual</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
              <span className="text-white/70">Reveladó:</span>
              <span className={`font-semibold ${revealed ? 'text-green-400' : 'text-white/50'}`}>
                {revealed ? 'SÍ' : 'NO'}
              </span>
            </div>
            {revealed && (
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <span className="text-white/70">Respuesta:</span>
                <span className="font-semibold text-blue-400">{correctAnswer}</span>
              </div>
            )}
          </div>
        </Card>

        {!revealed && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Revelar respuesta</h2>
            <form onSubmit={handleReveal} className="space-y-4">
              <Input
                label="Nombre correcto de la camioneta"
                placeholder="Ej: Niagara 4x4"
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
              />
              <Button type="submit" disabled={loading} className="w-full" size="lg">
                {loading ? 'Revelando...' : 'Revelar Respuesta'}
              </Button>
            </form>
          </Card>
        )}

        <Card className="p-6 bg-red-500/10 border-red-500/20">
          <h2 className="text-xl font-semibold text-white mb-4">⚠️ Acciones peligrosas</h2>
          <Button
            onClick={handleReset}
            disabled={loading}
            variant="secondary"
            className="w-full bg-red-500/20 hover:bg-red-500/30 border-red-500/50"
          >
            Resetear todo
          </Button>
        </Card>

        <div className="flex gap-3">
          <Link href="/" className="block flex-1">
            <Button variant="secondary" className="w-full">
              Volver
            </Button>
          </Link>
          <Button
            onClick={() => {
              sessionStorage.removeItem('adminPassword');
              setIsAuthenticated(false);
              setPassword('');
            }}
            variant="ghost"
            className="flex-1"
          >
            Logout
          </Button>
        </div>
      </div>
    </main>
  );
}
