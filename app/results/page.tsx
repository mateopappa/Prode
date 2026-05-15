'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, Button, Badge } from '@/components/ui';
import type { ScoreResult } from '@/lib/types';

export default function ResultsPage() {
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState<ScoreResult[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchScores() {
      try {
        const res = await fetch('/api/scores');
        if (res.ok) {
          const data = await res.json();
          setScores(data.scores || []);
          setCorrectAnswer(data.correctAnswer || '');
        } else {
          setError('Resultados aún no disponibles');
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Error cargando resultados');
      } finally {
        setLoading(false);
      }
    }

    fetchScores();
    const interval = setInterval(fetchScores, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-3xl space-y-6">
        <div className="text-center space-y-2">
          <Link href="/">
            <h1 className="text-4xl font-bold text-white">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Prode Niagara
              </span>
            </h1>
          </Link>
        </div>

        {correctAnswer && (
          <Card className="p-8 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30">
            <div className="text-center space-y-3">
              <h2 className="text-2xl font-bold text-white">✓ Nombre ganador</h2>
              <p className="text-4xl font-bold text-green-300">{correctAnswer}</p>
            </div>
          </Card>
        )}

        {!loading && scores.length > 0 ? (
          <Card className="p-6">
            <h3 className="text-2xl font-bold text-white mb-6">🏆 Ranking</h3>
            <div className="space-y-3">
              {scores.map((score, index) => (
                <div
                  key={score.participantId}
                  className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-2xl">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                    </span>
                    <div>
                      <p className="font-semibold text-white flex items-center gap-2">
                        {score.emoji} {score.name}
                      </p>
                      <p className="text-xs text-white/50">
                        Respuestas: {score.scores.join(', ')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-400">{score.highestScore}</p>
                    <p className="text-xs text-white/50">pts</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ) : loading ? (
          <Card className="p-8 text-center">
            <p className="text-white/70">Cargando resultados...</p>
          </Card>
        ) : error ? (
          <Card className="p-8 text-center">
            <p className="text-white/70">{error}</p>
          </Card>
        ) : null}

        <Card className="p-6 bg-white/5">
          <h3 className="font-semibold text-white mb-3">📊 Cómo se calculan los puntos</h3>
          <ul className="text-white/70 text-sm space-y-2">
            <li>✓ <strong>100 puntos:</strong> Respuesta exacta</li>
            <li>✓ <strong>50-99 puntos:</strong> Muy similar (mismas palabras clave)</li>
            <li>✓ <strong>1-49 puntos:</strong> Parcialmente similar</li>
            <li>✓ <strong>0 puntos:</strong> Muy diferente</li>
            <li className="pt-2">Se calcula el puntaje más alto de las 3 respuestas</li>
          </ul>
        </Card>

        <div className="flex gap-3 justify-center">
          <Link href="/" className="block">
            <Button variant="secondary">Volver</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
