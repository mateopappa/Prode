'use client';

import React from 'react';
import { Badge } from './ui';

interface ParticipantListProps {
  participants: Array<{
    id: string;
    name: string;
    emoji: string;
    answers?: [string, string, string];
    timestamp: number;
  }>;
  revealed: boolean;
}

export function ParticipantList({ participants, revealed }: ParticipantListProps) {
  return (
    <div className="space-y-2">
      {participants.length === 0 ? (
        <p className="text-white/50 text-sm">No hay participantes aún</p>
      ) : (
        participants.map((p) => (
          <div
            key={p.id}
            className="flex flex-col gap-2 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{p.emoji}</span>
              <span className="text-white/80 text-sm font-medium">{p.name}</span>
              {revealed && <Badge className="ml-auto text-xs">✓ Participó</Badge>}
            </div>

            {!revealed && p.answers && (
              <div className="grid grid-cols-3 gap-2">
                {p.answers.map((answer, index) => (
                  <div
                    key={`${p.id}-${index}`}
                    className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/40"
                  >
                    <div className="mb-1 text-[10px] uppercase tracking-[0.2em] text-white/25">
                      Opción {index + 1}
                    </div>
                    <div className="select-none blur-[4px] whitespace-nowrap overflow-hidden text-ellipsis">
                      {answer}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
