/**
 * Calcula la similitud entre dos strings usando Levenshtein distance
 * Retorna un valor 0-100 donde 100 es exacto
 */
export function calculateSimilarity(str1: string, str2: string): number {
  // Implementación compuesta: combina Jaro-Winkler, Dice (bigrams) y Levenshtein
  // Pesos: JW 0.5, Dice 0.3, Levenshtein 0.2
  const a = normalize(str1);
  const b = normalize(str2);

  if (a === b) return 100;
  if (!a || !b) return 0;

  const lev = levenshteinPercent(a, b); // 0-100
  const jw = jaroWinklerPercent(a, b); // 0-100
  const dice = diceBigramsPercent(a, b); // 0-100

  const composite = jw * 0.5 + dice * 0.3 + lev * 0.2;
  return composite; // NO redondear, devolver float
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

function levenshteinPercent(a: string, b: string): number {
  if (a === b) return 100;
  if (!a || !b) return 0;
  const d = levenshteinDistance(a, b);
  const max = Math.max(a.length, b.length);
  return Math.max(0, 100 - (d / max) * 100);
}

function jaroWinklerPercent(s1: string, s2: string): number {
  const a = s1;
  const b = s2;
  if (a === b) return 100;
  if (!a.length || !b.length) return 0;
  const matchDistance = Math.floor(Math.max(a.length, b.length) / 2) - 1;
  let matches = 0;
  const aMatches = Array(a.length).fill(false);
  const bMatches = Array(b.length).fill(false);
  for (let i = 0; i < a.length; i++) {
    const start = Math.max(0, i - matchDistance);
    const end = Math.min(b.length - 1, i + matchDistance);
    for (let j = start; j <= end; j++) {
      if (bMatches[j]) continue;
      if (a[i] !== b[j]) continue;
      aMatches[i] = bMatches[j] = true;
      matches++;
      break;
    }
  }
  if (matches === 0) return 0;
  let t = 0;
  let k = 0;
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

function diceBigramsPercent(s1: string, s2: string): number {
  const a = s1;
  const b = s2;
  if (a === b) return 100;
  if (a.length < 2 || b.length < 2) return a === b ? 100 : 0;
  const bigrams = (s: string) => {
    const arr: string[] = [];
    for (let i = 0; i < s.length - 1; i++) arr.push(s.slice(i, i + 2));
    return arr;
  };
  const A = bigrams(a);
  const B = bigrams(b);
  const map = new Map<string, number>();
  for (const x of A) map.set(x, (map.get(x) || 0) + 1);
  let intersect = 0;
  for (const y of B) {
    const c = map.get(y) || 0;
    if (c > 0) {
      intersect++;
      map.set(y, c - 1);
    }
  }
  const dice = (2 * intersect) / (A.length + B.length);
  return dice * 100;
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
