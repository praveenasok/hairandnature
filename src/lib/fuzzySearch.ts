/**
 * Advanced Fuzzy Logic Search Utility
 * Supports:
 * - Multi-token cross-field queries (e.g. "tape 18 blonde straight")
 * - Typo tolerance via Damerau-Levenshtein distance (e.g. "tpae" -> "tape", "straigt" -> "straight", "blond" -> "blonde")
 * - Subsequence and acronym matching (e.g. "gw" -> "Genius Wefts", "kt" -> "K-Tips")
 * - Length & symbol normalization (e.g. "18in", "18 inch", "18\"" -> "18\"")
 * - Relevance scoring & weighted field ranking
 */

export interface FuzzyField<T> {
  key: keyof T | ((item: T) => string);
  weight?: number; // Default 1.0
}

export interface FuzzySearchOptions<T> {
  fields: (keyof T | FuzzyField<T>)[];
  threshold?: number; // Minimum match score (0-100), default 35
  distanceThresholdRatio?: number; // Max edit distance ratio relative to query length, default 0.35
}

/**
 * Clean & normalize a string for fuzzy comparison
 */
export function normalizeString(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/["'״″]/g, '') // remove quote marks for inches (e.g. 18" -> 18)
    .replace(/[-\\/_]+/g, ' ') // treat hyphens and slashes as spaces
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Calculates Damerau-Levenshtein distance (handles insertions, deletions, substitutions, and adjacent transpositions)
 */
export function damerauLevenshteinDistance(a: string, b: string): number {
  const al = a.length;
  const bl = b.length;
  if (al === 0) return bl;
  if (bl === 0) return al;

  // Matrix
  const d: number[][] = [];
  for (let i = 0; i <= al; i++) {
    d[i] = [i];
  }
  for (let j = 0; j <= bl; j++) {
    d[0][j] = j;
  }

  for (let i = 1; i <= al; i++) {
    for (let j = 1; j <= bl; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(
        d[i - 1][j] + 1, // deletion
        d[i][j - 1] + 1, // insertion
        d[i - 1][j - 1] + cost // substitution
      );

      // Transposition
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }

  return d[al][bl];
}

/**
 * Checks if search token is a subsequence of target string (e.g. "gw" in "genius weft")
 */
function isSubsequence(pattern: string, text: string): boolean {
  let pi = 0;
  let ti = 0;
  while (pi < pattern.length && ti < text.length) {
    if (pattern[pi] === text[ti]) {
      pi++;
    }
    ti++;
  }
  return pi === pattern.length;
}

/**
 * Calculate single token fuzzy match score against a target string (0 - 100)
 */
export function scoreTokenMatch(queryToken: string, targetText: string): number {
  if (!queryToken || !targetText) return 0;
  
  const q = normalizeString(queryToken);
  const target = normalizeString(targetText);

  if (!q || !target) return 0;

  // 1. Exact match
  if (target === q) return 100;

  // 2. Exact prefix
  if (target.startsWith(q)) {
    return 90 + Math.min(10, (q.length / target.length) * 10);
  }

  // 3. Target words match
  const words = target.split(' ').filter(Boolean);
  for (const word of words) {
    if (word === q) return 95;
    if (word.startsWith(q)) {
      return 85 + Math.min(10, (q.length / word.length) * 10);
    }
  }

  // 4. Exact substring match anywhere in target
  if (target.includes(q)) {
    return 75 + Math.min(15, (q.length / target.length) * 15);
  }

  // 5. Acronym / First-letter match (e.g. "kt" for "K-Tips", "gw" for "Genius Weft")
  if (q.length >= 2 && q.length <= 4) {
    const acronym = words.map(w => w[0]).join('');
    if (acronym === q || acronym.startsWith(q)) {
      return 80;
    }
  }

  // 6. Typo tolerance / Levenshtein distance on words
  let bestWordScore = 0;
  const maxAllowedDist = q.length <= 3 ? 1 : q.length <= 6 ? 2 : 3;

  for (const word of words) {
    // Only compare if lengths are somewhat close
    if (Math.abs(word.length - q.length) <= maxAllowedDist) {
      const dist = damerauLevenshteinDistance(q, word);
      if (dist <= maxAllowedDist) {
        const similarity = 1 - (dist / Math.max(q.length, word.length));
        const score = 40 + Math.round(similarity * 45); // 40 - 85 range
        if (score > bestWordScore) {
          bestWordScore = score;
        }
      }
    }
  }

  if (bestWordScore > 0) {
    return bestWordScore;
  }

  // 7. Subsequence match (e.g. "gw" in "genius wefts", "tp" in "tape")
  // Only valid if target is concise enough relative to query to avoid accidental long-distance matches
  if (q.length >= 2 && target.length <= q.length * 3.5 && isSubsequence(q, target)) {
    const density = q.length / target.length;
    return Math.round(35 + density * 25);
  }

  return 0;
}

/**
 * Fuzzy search across multiple objects with field weighting and multi-token evaluation
 */
export function fuzzySearch<T>(
  items: T[],
  query: string,
  options: FuzzySearchOptions<T>
): { item: T; score: number }[] {
  const trimmed = query.trim();
  if (!trimmed) {
    return items.map(item => ({ item, score: 100 }));
  }

  // Extract query tokens (e.g. "tape", "18", "straight", "dark")
  const rawTokens = trimmed.split(/\s+/).filter(Boolean);
  const normalizedTokens = rawTokens.map(t => {
    // If token is like 18" or 18inch or 18in, keep both forms
    const cleaned = normalizeString(t);
    return { raw: t.toLowerCase(), cleaned };
  });

  const threshold = options.threshold ?? 35;

  const normalizedFields: { getter: (item: T) => string; weight: number }[] = options.fields.map(f => {
    if (typeof f === 'object' && f !== null && 'key' in f) {
      const fieldObj = f as FuzzyField<T>;
      const getter = typeof fieldObj.key === 'function' 
        ? fieldObj.key 
        : (item: T) => String(item[fieldObj.key as keyof T] ?? '');
      return { getter, weight: fieldObj.weight ?? 1.0 };
    } else {
      const key = f as keyof T;
      return { getter: (item: T) => String(item[key] ?? ''), weight: 1.0 };
    }
  });

  const results: { item: T; score: number }[] = [];

  for (const item of items) {
    // Extract field values
    const fieldValues = normalizedFields.map(nf => ({
      val: nf.getter(item),
      weight: nf.weight
    }));

    // Combined text of all fields for full-string fallback
    const combinedText = fieldValues.map(fv => fv.val).join(' ');

    let totalScore = 0;
    let allTokensMatched = true;

    for (const token of normalizedTokens) {
      let maxTokenScore = 0;

      for (const { val, weight } of fieldValues) {
        if (!val) continue;

        const score = scoreTokenMatch(token.cleaned, val);
        const weightedScore = score * weight;
        if (weightedScore > maxTokenScore) {
          maxTokenScore = weightedScore;
        }
      }

      // If no single field matched well enough, test if token is a direct substring of combined text
      if (maxTokenScore < threshold) {
        const normCombined = normalizeString(combinedText);
        if (normCombined.includes(token.cleaned)) {
          maxTokenScore = 65;
        }
      }

      // If token still failed to match anything above threshold, item is discarded
      if (maxTokenScore < threshold) {
        allTokensMatched = false;
        break;
      }

      totalScore += maxTokenScore;
    }

    if (allTokensMatched && normalizedTokens.length > 0) {
      // Average score across tokens
      const finalScore = totalScore / normalizedTokens.length;
      results.push({ item, score: finalScore });
    }
  }

  // Sort by highest score first (relevance)
  results.sort((a, b) => b.score - a.score);

  return results;
}
