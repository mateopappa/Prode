'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, Button, Input, Textarea } from '@/components/ui';
import { EmojiPicker } from '@/components/emoji-picker';
import { generateId } from '@/lib/utils';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    name: '',
    emoji: '🎯',
    answers: ['', '', ''],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (formData.answers.some(a => !a.trim())) {
      newErrors.answers = 'Las 3 respuestas son requeridas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/participants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          emoji: formData.emoji,
          answers: formData.answers.map(a => a.trim()),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem('registrationId', data.id);
        router.push('/confirm');
      } else {
        setErrors({ submit: 'Error al registrarse' });
      }
    } catch (error) {
      console.error('Error:', error);
      setErrors({ submit: 'Error de conexión' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link href="/">
            <h1 className="text-4xl font-bold text-white mb-2">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Prode Niagara
              </span>
            </h1>
          </Link>
          <p className="text-white/60">Paso {step} de 2</p>
        </div>

        {/* Formulario */}
        <Card className="p-8 space-y-6">
          {step === 1 ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-white">Tus datos</h2>
                <p className="text-white/60">Completa tu información</p>
              </div>

              <Input
                label="Nombre"
                placeholder="Tu nombre"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                error={errors.name}
                maxLength={30}
              />

              <div className="space-y-3">
                <label className="block text-sm font-medium text-white/90">
                  Emoji (opcional)
                </label>
                <EmojiPicker
                  value={formData.emoji}
                  onChange={(emoji) =>
                    setFormData({ ...formData, emoji })
                  }
                />
              </div>

              {errors.submit && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-300 text-sm">
                  {errors.submit}
                </div>
              )}

              <Button
                onClick={() => setStep(2)}
                className="w-full"
                size="lg"
              >
                Continuar
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-white">Cómo se calcula el puntaje</h3>
                <p className="text-white/60">Usamos una métrica compuesta que combina tres medidas: Jaro–Winkler (50%), Dice bigrams (30%) y Levenshtein porcentual (20%). El resultado es un número entre 0 y 100 (no se redondea).</p>
              </div>

              <ExamplesTable />

              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-white">Tus predicciones</h2>
                <p className="text-white/60">Propone 3 nombres en orden de prioridad</p>
              </div>

              {[0, 1, 2].map((index) => (
                <div key={index} className="space-y-2">
                  <label className="block text-sm font-medium text-white/90">
                    Opción {index + 1}
                  </label>
                  <Textarea
                    placeholder={`Ej: ${
                      index === 0
                        ? 'Niagara 4x4'
                        : index === 1
                        ? 'Niagara XL'
                        : 'Niagara Max'
                    }`}
                    value={formData.answers[index]}
                    onChange={(e) => {
                      const newAnswers = [...formData.answers];
                      newAnswers[index] = e.target.value;
                      setFormData({ ...formData, answers: newAnswers as any });
                    }}
                    maxLength={100}
                  />
                </div>
              ))}

              {errors.answers && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-300 text-sm">
                  {errors.answers}
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={() => setStep(1)}
                  variant="secondary"
                  className="flex-1"
                >
                  Atrás
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1"
                  size="lg"
                >
                  {loading ? 'Guardando...' : 'Confirmar'}
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Nota */}
        <div className="mt-6 text-center text-white/50 text-xs">
          <p>🔒 Tus datos no serán compartidos fuera de esta app</p>
        </div>
      </div>
    </main>
  );
}

function normalize(s: string) {
  return s
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9]/g, '');
}

function levenshteinDistance(a: string, b: string) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

function levenshteinPercent(a: string, b: string) {
  if (a === b) return 100;
  if (!a || !b) return 0;
  const d = levenshteinDistance(a, b);
  const max = Math.max(a.length, b.length);
  return Math.max(0, 100 - (d / max) * 100);
}

function jaroWinklerPercent(s1: string, s2: string) {
  const a = s1, b = s2;
  if (a === b) return 100;
  if (!a.length || !b.length) return 0;
  const matchDist = Math.floor(Math.max(a.length, b.length) / 2) - 1;
  let matches = 0;
  const aMatches = Array(a.length).fill(false);
  const bMatches = Array(b.length).fill(false);
  for (let i = 0; i < a.length; i++) {
    const start = Math.max(0, i - matchDist);
    const end = Math.min(b.length - 1, i + matchDist);
    for (let j = start; j <= end; j++) {
      if (bMatches[j]) continue;
      if (a[i] !== b[j]) continue;
      aMatches[i] = bMatches[j] = true;
      matches++;
      break;
    }
  }
  if (matches === 0) return 0;
  let t = 0; let k = 0;
  for (let i = 0; i < a.length; i++) {
    if (!aMatches[i]) continue;
    while (!bMatches[k]) k++;
    if (a[i] !== b[k]) t++;
    k++;
  }
  t = t / 2;
  const m = matches;
  const jaro = (m / a.length + m / b.length + (m - t) / m) / 3;
  let prefix = 0;
  for (let i = 0; i < Math.min(4, Math.min(a.length, b.length)); i++) {
    if (a[i] === b[i]) prefix++; else break;
  }
  const p = 0.1;
  const jw = jaro + prefix * p * (1 - jaro);
  return jw * 100;
}

function diceBigramsPercent(s1: string, s2: string) {
  const a = s1, b = s2;
  if (a === b) return 100;
  if (a.length < 2 || b.length < 2) return a === b ? 100 : 0;
  const bigrams = (s: string) => {
    const out: string[] = [];
    for (let i = 0; i < s.length - 1; i++) out.push(s.slice(i, i + 2));
    return out;
  };
  const A = bigrams(a), B = bigrams(b);
  const map = new Map<string, number>();
  for (const x of A) map.set(x, (map.get(x) || 0) + 1);
  let intersect = 0;
  for (const y of B) {
    const c = map.get(y) || 0;
    if (c > 0) { intersect++; map.set(y, c - 1); }
  }
  const dice = (2 * intersect) / (A.length + B.length);
  return dice * 100;
}

function compositePercent(aRaw: string, bRaw: string) {
  const a = normalize(aRaw);
  const b = normalize(bRaw);
  if (a === b) return 100;
  if (!a || !b) return 0;
  const lev = levenshteinPercent(a, b);
  const jw = jaroWinklerPercent(a, b);
  const dice = diceBigramsPercent(a, b);
  return jw * 0.5 + dice * 0.3 + lev * 0.2; // no rounding
}

function ExamplesTable() {
  const examples: Record<string, string[]> = {
    Clio: ['Clio','Cilio','Cl'],
    Megane: ['Megane','Megan','Emegan'],
    Kangoo: ['Nakango','Kango','Knagog'],
    Kardian: ['KKKKKK','Cardian','srnaki'],
    Alaskan: ['Alaskan','Alaskaan','saknan']
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
      <h4 className="text-white font-medium mb-2">Ejemplos (puntaje compuesto, sin redondear)</h4>
      <div className="grid gap-3">
        {Object.entries(examples).map(([model, guesses]) => (
          <div key={model} className="text-sm text-white/80">
            <div className="font-semibold text-white">{model}</div>
            {guesses.map(g => (
              <div key={g} className="flex justify-between">
                <div className="text-white/70">{g}</div>
                <div className="font-mono">{String(compositePercent(model, g))}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
