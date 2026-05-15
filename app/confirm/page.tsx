'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, Button } from '@/components/ui';
import { ParticipantList } from '@/components/participant-list';

export default function ConfirmPage() {
  const [loading, setLoading] = useState(true);
  const [participants, setParticipants] = useState<any[]>([]);
  const [participantCount, setParticipantCount] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/participants');
        const data = await res.json();
        setParticipants(data.participants || []);
        setParticipantCount(data.count || 0);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      fetchData();
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/">
            <h1 className="text-4xl font-bold text-white">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Prode Niagara
              </span>
            </h1>
          </Link>
        </div>

        {/* Success Card */}
        <Card className="p-8 text-center space-y-6">
          <div className="space-y-4">
            <div className="text-6xl">✨</div>
            <h2 className="text-3xl font-bold text-white">¡Registrado!</h2>
            <p className="text-white/70 text-lg">
              Tu registro fue guardado exitosamente. Vuelve el lunes para ver los resultados.
            </p>
          </div>

          <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
            <p className="text-blue-200 text-sm">
              📊 <strong>{participantCount}</strong> participantes registrados
            </p>
          </div>

          <Link href="/" className="block">
            <Button className="w-full" size="lg">
              Volver al Inicio
            </Button>
          </Link>
        </Card>

        {/* Participantes */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Participantes {loading ? '(cargando...)' : `(${participantCount})`}
          </h3>
          <ParticipantList participants={participants} revealed={false} />
        </Card>

        {/* Info */}
        <div className="text-center text-white/50 text-xs space-y-1">
          <p>⏰ Resultados disponibles el lunes después de las 9 AM</p>
          <p>🔒 No compartir con otras áreas</p>
        </div>
      </div>
    </main>
  );
}
