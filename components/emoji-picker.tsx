'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface EmojiPickerProps {
  value: string;
  onChange: (emoji: string) => void;
}

const EMOJIS = [
  '🎯',
  '🚗',
  '🏎️',
  '🛞',
  '⚡',
  '🔥',
  '💨',
  '🌟',
  '👑',
  '🎪',
  '🎨',
  '💪',
  '🤖',
  '🦾',
  '🚀',
  '💎',
];

export function EmojiPicker({ value, onChange }: EmojiPickerProps) {
  return (
    <div className="grid grid-cols-8 gap-2">
      {EMOJIS.map((emoji) => (
        <button
          key={emoji}
          onClick={() => onChange(emoji)}
          className={cn(
            'text-2xl p-2 rounded-lg transition-all duration-200',
            'hover:bg-white/20 active:scale-90',
            value === emoji && 'bg-white/30 ring-2 ring-blue-400'
          )}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}
