// Normalize Arabic text by removing diacritics (Harakat/Tashkeel)
export function normalizeArabic(text: string): string {
  if (!text) return "";
  return text.replace(/[\u0617-\u061A\u064B-\u0652\u06D6-\u06DC]/g, '').trim();
}

// Normalize Indonesian/Latin text for comparison
export function normalizeLatin(text: string): string {
  if (!text) return "";
  return text.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Calculate Levenshtein distance-based similarity (returns 0.0 to 1.0)
export function stringSimilarity(s1: string, s2: string): number {
  let longer = s1;
  let shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  const longerLength = longer.length;
  if (longerLength === 0) return 1.0;
  
  const costs = new Array();
  for (let i = 0; i <= longer.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= shorter.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else {
        if (j > 0) {
          let newValue = costs[j - 1];
          if (longer.charAt(i - 1) !== shorter.charAt(j - 1)) {
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          }
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0) costs[shorter.length] = lastValue;
  }
  return (longerLength - costs[shorter.length]) / longerLength;
}
