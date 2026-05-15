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
