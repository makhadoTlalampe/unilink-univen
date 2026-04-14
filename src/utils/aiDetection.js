/**
 * aiDetection.js
 *
 * Heuristic-based AI-generated content detection utility.
 * Analyses pasted text for patterns commonly associated with AI writing
 * (e.g. ChatGPT, GPT-4, Bard, Claude) versus typical human writing.
 *
 * NOTE: These are statistical heuristics, NOT a trained classifier.
 * Results carry inherent uncertainty and should be treated as indicative
 * rather than definitive. No offline utility can replicate the accuracy
 * of large-scale commercial detectors such as Turnitin or GPTZero.
 */

// ---------------------------------------------------------------------------
// Helper utilities
// ---------------------------------------------------------------------------

/** Tokenise text into sentences (simple regex split). */
function getSentences(text) {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/** Tokenise text into words (lower-cased, letters only). */
function getWords(text) {
  return text.toLowerCase().match(/\b[a-z']+\b/g) || [];
}

/** Clamp a value to [0, 1]. */
function clamp(value) {
  return Math.max(0, Math.min(1, value));
}

// ---------------------------------------------------------------------------
// Individual heuristic checks
// ---------------------------------------------------------------------------

/**
 * 1. TRANSITION PHRASE DENSITY
 * AI models over-use formal connective phrases.
 */
const AI_TRANSITION_PHRASES = [
  'in general',
  'in summary',
  'in conclusion',
  'furthermore',
  'moreover',
  'additionally',
  'it is important to note',
  'it is worth noting',
  'it should be noted',
  'on the other hand',
  'it is well known',
  'as mentioned',
  'needless to say',
  'in other words',
  'to summarize',
  'in essence',
  'overall',
  'firstly',
  'secondly',
  'thirdly',
  'lastly',
  'as a result',
  'due to the fact',
  'in light of',
  'it can be argued',
  'it is clear that',
  'it is evident that',
  'generally speaking',
  'by and large',
];

function checkTransitionDensity(text) {
  const lower = text.toLowerCase();
  const words = getWords(text);
  const wordCount = words.length || 1;

  const matched = [];
  AI_TRANSITION_PHRASES.forEach((phrase) => {
    if (lower.includes(phrase)) matched.push(phrase);
  });

  // Normalise: one occurrence per 50 words is typical for AI output
  const density = matched.length / (wordCount / 50);
  const score = clamp(density / 2); // 2+ per 50 words → score ≈ 1

  return {
    id: 'transition_density',
    label: 'AI Transition Phrase Density',
    score,
    detail: matched.length > 0
      ? `Found ${matched.length} AI-typical phrase(s): "${matched.join('", "')}"`
      : 'No prominent AI transition phrases detected.',
    weight: 0.20,
  };
}

/**
 * 2. SENTENCE LENGTH UNIFORMITY
 * AI produces sentences of more uniform length; human writing is burstier.
 */
function checkSentenceLengthUniformity(text) {
  const sentences = getSentences(text);
  if (sentences.length < 2) {
    return {
      id: 'sentence_uniformity',
      label: 'Sentence Length Uniformity',
      score: 0.5,
      detail: 'Too few sentences to measure uniformity.',
      weight: 0.15,
    };
  }

  const lengths = sentences.map((s) => getWords(s).length);
  const mean = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const variance =
    lengths.reduce((sum, l) => sum + Math.pow(l - mean, 2), 0) / lengths.length;
  const cv = mean > 0 ? Math.sqrt(variance) / mean : 0; // Coefficient of variation

  // Low CV (< 0.25) → very uniform → AI-like; high CV (> 0.6) → human-like
  const score = clamp(1 - cv / 0.6);

  return {
    id: 'sentence_uniformity',
    label: 'Sentence Length Uniformity',
    score,
    detail: `Mean sentence length: ${mean.toFixed(1)} words, CV: ${(cv * 100).toFixed(0)}%. ${
      cv < 0.25
        ? 'Highly uniform — typical of AI.'
        : cv < 0.45
        ? 'Moderately uniform.'
        : 'Variable — more consistent with human writing.'
    }`,
    weight: 0.15,
  };
}

/**
 * 3. VOCABULARY DIVERSITY (Type-Token Ratio)
 * AI can repeat the same vocabulary in polished but redundant ways.
 * A very high TTR can also indicate AI-generated formal prose.
 */
function checkVocabularyDiversity(text) {
  const words = getWords(text);
  if (words.length < 10) {
    return {
      id: 'vocabulary_diversity',
      label: 'Vocabulary Diversity (TTR)',
      score: 0.5,
      detail: 'Text too short for reliable TTR measurement.',
      weight: 0.10,
    };
  }

  const uniqueWords = new Set(words);
  const ttr = uniqueWords.size / words.length;

  // TTR above 0.85 in longer texts is suspiciously high (AI avoids repetition)
  // TTR below 0.55 suggests repetitive human writing or very short text
  let score;
  let detail;
  if (ttr > 0.80) {
    score = 0.6;
    detail = `TTR: ${(ttr * 100).toFixed(1)}% — Unusually high diversity; AI models avoid repetition.`;
  } else if (ttr >= 0.55) {
    score = 0.3;
    detail = `TTR: ${(ttr * 100).toFixed(1)}% — Normal range for academic or professional text.`;
  } else {
    score = 0.1;
    detail = `TTR: ${(ttr * 100).toFixed(1)}% — Low diversity; more typical of informal human writing.`;
  }

  return {
    id: 'vocabulary_diversity',
    label: 'Vocabulary Diversity (TTR)',
    score,
    detail,
    weight: 0.10,
  };
}

/**
 * 4. PASSIVE VOICE FREQUENCY
 * AI prose tends to use passive constructions more heavily.
 */
const PASSIVE_PATTERNS = [
  /\b(is|are|was|were|be|been|being)\s+\w+ed\b/gi,
  /\b(is|are|was|were)\s+\w+en\b/gi,
];

function checkPassiveVoice(text) {
  const sentences = getSentences(text);
  if (sentences.length === 0) {
    return {
      id: 'passive_voice',
      label: 'Passive Voice Frequency',
      score: 0.5,
      detail: 'No sentences found.',
      weight: 0.10,
    };
  }

  let passiveCount = 0;
  sentences.forEach((s) => {
    PASSIVE_PATTERNS.forEach((pattern) => {
      if (pattern.test(s)) passiveCount++;
      pattern.lastIndex = 0;
    });
  });

  const ratio = passiveCount / sentences.length;
  const score = clamp(ratio / 0.6); // >60 % passive sentences → score ≈ 1

  return {
    id: 'passive_voice',
    label: 'Passive Voice Frequency',
    score,
    detail: `${passiveCount} of ${sentences.length} sentence(s) contain passive constructions (${(ratio * 100).toFixed(0)}%). ${
      ratio > 0.4 ? 'Elevated passive-voice usage — common in AI-generated academic prose.' : 'Moderate or low passive-voice usage.'
    }`,
    weight: 0.10,
  };
}

/**
 * 5. FORMAL / ACADEMIC VOCABULARY
 * AI tends to deploy polysyllabic, formal register words densely.
 */
const FORMAL_WORDS = [
  'qualitative', 'quantitative', 'generalizable', 'philosophical',
  'methodology', 'framework', 'paradigm', 'epistemological',
  'ontological', 'pragmatic', 'empirical', 'theoretical',
  'hermeneutic', 'contextualise', 'contextual', 'holistic',
  'systematic', 'comprehensive', 'delineate', 'ascertain',
  'elucidate', 'substantiate', 'corroborate', 'disseminate',
  'facilitate', 'utilise', 'leverage', 'pertaining',
  'nevertheless', 'notwithstanding', 'aforementioned',
];

function checkFormalVocabulary(text) {
  const lower = text.toLowerCase();
  const words = getWords(text);
  const wordCount = words.length || 1;

  const matched = FORMAL_WORDS.filter((w) => lower.includes(w));
  const density = (matched.length / wordCount) * 100;

  // >3 % formal word density is AI-like in general prose
  const score = clamp(density / 6);

  return {
    id: 'formal_vocabulary',
    label: 'Formal / Academic Vocabulary Density',
    score,
    detail: `${matched.length} formal/academic term(s) found in ${wordCount} words (${density.toFixed(1)}%). ${
      matched.length > 0 ? `Terms: "${matched.join('", "')}"` : ''
    }`,
    weight: 0.15,
  };
}

/**
 * 6. AVERAGE WORD LENGTH
 * AI generates lengthier, polysyllabic words more consistently.
 */
function checkAverageWordLength(text) {
  const words = getWords(text);
  if (words.length === 0) {
    return {
      id: 'word_length',
      label: 'Average Word Length',
      score: 0.5,
      detail: 'No words found.',
      weight: 0.10,
    };
  }

  const avgLen = words.reduce((sum, w) => sum + w.length, 0) / words.length;

  // Human casual text: 4–5 chars avg; AI academic: 5.5–7+ chars avg
  const score = clamp((avgLen - 4.5) / 3);

  return {
    id: 'word_length',
    label: 'Average Word Length',
    score,
    detail: `Average word length: ${avgLen.toFixed(2)} characters. ${
      avgLen > 6 ? 'Elevated — consistent with AI-generated academic prose.' : 'Within typical range.'
    }`,
    weight: 0.10,
  };
}

/**
 * 7. PUNCTUATION BALANCE
 * AI produces well-balanced punctuation with few errors.
 * Human text is more likely to have minor punctuation inconsistencies.
 */
function checkPunctuationBalance(text) {
  const sentences = getSentences(text);
  const properlyTerminated = sentences.filter((s) => /[.!?]$/.test(s.trim())).length;
  const ratio = sentences.length > 0 ? properlyTerminated / sentences.length : 0;

  // Very high proper-termination ratio → AI-like polish
  const score = clamp(ratio - 0.5);

  return {
    id: 'punctuation_balance',
    label: 'Punctuation Consistency',
    score,
    detail: `${properlyTerminated} of ${sentences.length} sentence(s) are properly terminated. ${
      ratio > 0.9 ? 'Near-perfect punctuation — AI models are highly consistent here.' : 'Some variation in punctuation.'
    }`,
    weight: 0.05,
  };
}

/**
 * 8. TYPOGRAPHICAL ERRORS / MISSPELLINGS
 * Human writers make occasional typos; AI rarely does.
 * We flag a curated short-list of common human slips as positive human signals.
 */
const COMMON_TYPOS = [
  'recourses',  // resources (present in the sample)
  'teh', 'hte', 'hte', 'adn', 'taht', 'adn', 'becuase', 'becasue',
  'definately', 'seperate', 'occured', 'recieve', 'untill', 'occurance',
  'prefered', 'existance', 'grammer', 'independant', 'beleive',
];

function checkTypographicalErrors(text) {
  const lower = text.toLowerCase();
  const found = COMMON_TYPOS.filter((t) => {
    const regex = new RegExp(`\\b${t}\\b`, 'i');
    return regex.test(lower);
  });

  // Typos → human signal (NEGATIVE AI score)
  const score = found.length > 0 ? Math.max(0, 0.2 - found.length * 0.1) : 0.5;

  return {
    id: 'typos',
    label: 'Typographical Errors (Human Signal)',
    score,
    detail: found.length > 0
      ? `Possible misspelling(s) detected: "${found.join('", "')}". Typos are a positive indicator of human authorship.`
      : 'No common misspellings detected (consistent with AI polish).',
    weight: 0.05,
  };
}

// ---------------------------------------------------------------------------
// Composite scoring
// ---------------------------------------------------------------------------

/**
 * Run all heuristic checks and return a comprehensive report object.
 * @param {string} text - The raw text to analyse.
 * @returns {object} Analysis report.
 */
export function analyseText(text) {
  if (!text || text.trim().length === 0) {
    return { error: 'No text provided for analysis.' };
  }

  const checks = [
    checkTransitionDensity(text),
    checkSentenceLengthUniformity(text),
    checkVocabularyDiversity(text),
    checkPassiveVoice(text),
    checkFormalVocabulary(text),
    checkAverageWordLength(text),
    checkPunctuationBalance(text),
    checkTypographicalErrors(text),
  ];

  // Weighted average
  const totalWeight = checks.reduce((sum, c) => sum + c.weight, 0);
  const weightedScore = checks.reduce((sum, c) => sum + c.score * c.weight, 0) / totalWeight;

  let verdict;
  let confidenceNote;
  if (weightedScore >= 0.70) {
    verdict = 'Likely AI-Generated';
    confidenceNote = 'Multiple strong AI indicators detected. High probability the text was generated by an AI model.';
  } else if (weightedScore >= 0.50) {
    verdict = 'Possibly AI-Generated / Mixed';
    confidenceNote = 'Several AI-associated patterns present. The text may be AI-generated, AI-assisted, or written in a formal academic style.';
  } else if (weightedScore >= 0.30) {
    verdict = 'Uncertain – Possibly Human';
    confidenceNote = 'Weak AI signals. The text could be human-authored academic writing or lightly AI-assisted.';
  } else {
    verdict = 'Likely Human-Written';
    confidenceNote = 'Few or no AI-typical patterns detected.';
  }

  const wordCount = getWords(text).length;
  const sentenceCount = getSentences(text).length;

  return {
    verdict,
    overallScore: Math.round(weightedScore * 100),
    confidenceNote,
    wordCount,
    sentenceCount,
    checks,
    limitations: [
      'This analysis uses rule-based heuristics, not a trained ML classifier.',
      'Short texts (< 100 words) produce less reliable results.',
      'Formal academic writing by humans can trigger AI-like signals.',
      'AI models that deliberately introduce errors may evade detection.',
      'Results should not be used as definitive proof of AI authorship.',
      'For higher-confidence detection, use dedicated tools such as GPTZero, Copyleaks, or Turnitin.',
    ],
  };
}
