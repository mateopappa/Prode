'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, Button } from '@/components/ui';

export default function Home() {
  const [participantCount, setParticipantCount] = useState(0);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await globalThis.fetch('/api/participants');
        const data = await res.json();
        setParticipantCount(data.count || 0);

        const stateRes = await globalThis.fetch('/api/reveal', {
          headers: {
            'Accept': 'application/json',
          },
        });
        if (stateRes.ok) {
          const stateData = await stateRes.json();
          setRevealed(stateData.revealed || false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen px-4 py-6 md:py-10">
      <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <section className="space-y-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-xs uppercase tracking-[0.28em] text-white/75 renault-glass">
              <span className="h-2 w-2 rounded-full bg-[#EFDF00] shadow-[0_0_18px_rgba(239,223,0,0.8)]" />
              Prode interno RGP
            </div>

            <h1 className="max-w-3xl text-5xl font-black leading-[0.92] tracking-tight text-white md:text-7xl">
              <span className="block bg-gradient-to-r from-white via-[#D9D9D6] to-[#EFDF00] bg-clip-text text-transparent">
                Prode Niagara - RGP
              </span>
            </h1>

            <p className="max-w-2xl text-base leading-7 text-white/74 md:text-lg">
              ¿Cuál será el nombre de la nueva camioneta? Jugá con 3 propuestas, mirá quién más participa y el lunes vemos quién estuvo más cerca.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-white/70">
            <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1 renault-glass">Puntuación 0-100</span>
          </div>

          <Card className="renault-glass space-y-6 p-6 md:p-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="text-sm uppercase tracking-[0.22em] text-white/45">Participantes registrados</div>
                <div className="mt-2 text-5xl font-black text-[#EFDF00] drop-shadow-[0_0_18px_rgba(239,223,0,0.35)]">{participantCount}</div>
              </div>
              <div className="rounded-2xl border border-white/12 bg-black/25 px-4 py-3 text-right">
                <div className="text-xs uppercase tracking-[0.2em] text-white/45">Estado</div>
                <div className={`mt-1 text-sm font-semibold ${revealed ? 'text-[#EFDF00]' : 'text-white/80'}`}>
                  {revealed ? 'Resultados listos' : 'Abierta todo el tiempo'}
                </div>
              </div>
            </div>

            {revealed && (
              <div className="rounded-2xl border border-[#EFDF00]/30 bg-[#EFDF00]/10 p-4 text-[#FFF9B0]">
                <p className="font-semibold">✓ ¡Resultados disponibles!</p>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              {revealed ? (
                <Link href="/results" className="block">
                  <Button className="w-full" size="lg">
                    Ver Ranking
                  </Button>
                </Link>
              ) : (
                <Link href="/register" className="block">
                  <Button className="w-full" size="lg">
                    Registrarse Ahora
                  </Button>
                </Link>
              )}

              <div className="rounded-2xl border border-white/12 bg-black/20 px-4 py-3 text-sm text-white/70">
                <div className="font-semibold text-white">Puntuación</div>
                <div className="mt-1">100 exacto, 0 a 99 por cercanía. El mayor puntaje gana.</div>
              </div>
            </div>
          </Card>
        </section>

        <section className="space-y-6">
          <Card className="renault-glass p-6 md:p-7">
            <div className="space-y-5">
              <div>
                <h3 className="text-sm uppercase tracking-[0.22em] text-white/45">Aviso</h3>
                <p className="mt-2 text-sm leading-6 text-white/78">
                  Página no oficial de RGP. Sin vínculo, patrocinio ni aprobación de la empresa.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-[10px] uppercase tracking-[0.28em] text-white/40">Cómo funciona</div>
                  <p className="mt-2 text-sm leading-6 text-white/72">
                    Registrás tu nombre, un emoji opcional y 3 apuestas ordenadas. Entre todos pueden ver quién ya participó.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-[10px] uppercase tracking-[0.28em] text-white/40">El lunes</div>
                  <p className="mt-2 text-sm leading-6 text-white/72">
                    Revelamos el nombre real y mostramos el ranking en la misma app. La mejor aproximación se lleva 100.
                  </p>
                </div>
              </div>

              
            </div>
          </Card>

          <div className="rounded-2xl border border-white/10 bg-black/25 p-4 text-center text-xs text-white/50 renault-glass">
            <p>🔒 Por favor, no compartir con otras áreas • Evento interno RGP</p>
          </div>
        </section>
      </div>
    </main>
  );
}
