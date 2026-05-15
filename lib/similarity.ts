/**
 * Calcula la similitud entre dos strings usando Levenshtein distance
 * Retorna un valor 0-100 donde 100 es exacto
 */
export function calculateSimilarity(str1: string, str2: string): number {
  const a = normalize(str1);
  const b = normalize(str2);

  if (a === b) return 100;
  if (!a || !b) return 0;

  const distance = levenshteinDistance(a, b);
  const maxLength = Math.max(a.length, b.length);
  const similarity = Math.max(0, 100 - (distance / maxLength) * 100);

  return Math.round(similarity);
}

function normalize(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[áàäâ]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöô]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/[ñn]/g, 'n')
    .replace(/\s+/g, '') // Eliminar espacios
    .replace(/[^a-z0-9]/g, ''); // Eliminar caracteres especiales
}

function levenshteinDistance(s1: string, s2: string): number {
  const len1 = s1.length;
  const len2 = s2.length;
  const matrix: number[][] = [];

  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[len1][len2];
}

/**
 * Calcula scoring para cada respuesta del participante
 * Toma la respuesta más alta, sin importar el orden
 */
export function calculateParticipantScores(
  answers: [string, string, string],
  correctAnswer: string
): [number, number, number] {
  return [
    calculateSimilarity(answers[0], correctAnswer),
    calculateSimilarity(answers[1], correctAnswer),
    calculateSimilarity(answers[2], correctAnswer),
  ];
}
