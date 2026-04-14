/**
 * textAnalysis.js
 * Client-side heuristic utilities for AI-text detection and basic plagiarism fingerprinting.
 *
 * LIMITATIONS
 * -----------
 * - AI detection is heuristic-only (no neural classifier or proprietary model).
 *   Results indicate *likelihood* based on writing patterns, not a definitive verdict.
 * - Plagiarism detection is structural/statistical only. Without access to an academic
 *   database (e.g. Turnitin, iThenticate), cross-source similarity cannot be verified.
 * - All processing is done in the browser. No text is sent to any third-party server.
 * - Accuracy improves with longer texts (at least 150 words recommended).
 */

// ---------------------------------------------------------------------------
// Tokenisation helpers
// ---------------------------------------------------------------------------

/** Split text into sentences (handles ., !, ? and ellipsis). */
export function splitSentences(text) {
    return text
        .split(/(?<=[.!?…])\s+/)
        .map(s => s.trim())
        .filter(s => s.length > 0);
}

/** Split text into word tokens (lowercase, letters only). */
export function tokenize(text) {
    return text.toLowerCase().match(/\b[a-z']+\b/g) || [];
}

// ---------------------------------------------------------------------------
// Statistical helpers
// ---------------------------------------------------------------------------

function mean(arr) {
    if (arr.length === 0) return 0;
    return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function stdDev(arr) {
    if (arr.length < 2) return 0;
    const m = mean(arr);
    const variance = arr.reduce((sum, x) => sum + (x - m) ** 2, 0) / arr.length;
    return Math.sqrt(variance);
}

// ---------------------------------------------------------------------------
// Individual metric functions (each returns a 0–1 raw score)
// ---------------------------------------------------------------------------

/**
 * Sentence-length uniformity score.
 * AI text tends to have lower variance in sentence length.
 * Returns a value close to 1 when variance is very low (AI-like).
 */
export function sentenceLengthUniformity(text) {
    const sentences = splitSentences(text);
    if (sentences.length < 3) return 0.5; // not enough data
    const lengths = sentences.map(s => tokenize(s).length);
    const sd = stdDev(lengths);
    const avg = mean(lengths);
    // Coefficient of variation: low CV → uniform → more AI-like
    const cv = avg > 0 ? sd / avg : 0;
    // Map CV: 0 → score 1 (very uniform), ≥0.8 → score 0 (very varied)
    return Math.max(0, 1 - cv / 0.8);
}

/**
 * Transition-phrase frequency score.
 * AI text overuses academic connectors.
 * Returns proportion of sentences starting with a transition phrase.
 */
const TRANSITION_PHRASES = [
    'furthermore', 'moreover', 'in addition', 'additionally', 'however',
    'nevertheless', 'on the other hand', 'in conclusion', 'to summarize',
    'in summary', 'it is worth noting', 'it should be noted', 'notably',
    'importantly', 'interestingly', 'significantly', 'consequently',
    'therefore', 'thus', 'hence', 'as a result', 'in contrast',
    'conversely', 'similarly', 'likewise', 'for instance', 'for example',
    'to illustrate', 'in particular', 'specifically', 'overall',
    'in general', 'generally speaking', 'it is important to', 'one must',
];

// Pre-compiled regexps for each transition phrase (built once at module load time)
const TRANSITION_REGEXPS = TRANSITION_PHRASES.map(
    phrase => new RegExp(`(^|[.!?]\\s+)${phrase.replace(/ /g, '\\s+')}`, 'gi')
);

export function transitionPhraseScore(text) {
    const sentences = splitSentences(text);
    if (sentences.length === 0) return 0;
    const lower = text.toLowerCase();
    let hits = 0;
    for (const re of TRANSITION_REGEXPS) {
        // Reset lastIndex before each use because the RegExp has the 'g' flag
        re.lastIndex = 0;
        const matches = lower.match(re);
        if (matches) hits += matches.length;
    }
    // Normalise: >40% of sentences starting with transition = very AI-like (score ~1)
    const ratio = hits / sentences.length;
    return Math.min(1, ratio / 0.4);
}

/**
 * Vocabulary richness (Type-Token Ratio).
 * Lower TTR indicates repetitive vocabulary, common in AI-generated text.
 * Returns a score close to 1 when TTR is very low.
 */
export function vocabularyRepetitiveness(text) {
    const tokens = tokenize(text);
    if (tokens.length < 20) return 0.5;
    const unique = new Set(tokens).size;
    const ttr = unique / tokens.length; // 0 = all same, 1 = all unique
    // Map: low TTR (0.3) → score 1; high TTR (0.9) → score 0
    return Math.max(0, Math.min(1, (0.9 - ttr) / 0.6));
}

/**
 * Passive-voice proxy score.
 * Counts be-verb + past-participle patterns ("is done", "was found", "are considered").
 * Short common words ending in -ed that are not past participles are excluded.
 */
const BE_VERBS = ['is', 'are', 'was', 'were', 'be', 'been', 'being'];
// Common -ed words that are NOT past participles (nouns, adjectives, other)
const NON_PARTICIPLE_ED = new Set([
    'red', 'bed', 'fed', 'led', 'wed', 'bled', 'bred', 'fled', 'shed',
    'sped', 'ted', 'ned', 'ed', 'med', 'head', 'dead', 'read', 'spread',
    'thread', 'instead', 'ahead', 'dread', 'tread', 'bread', 'embed',
]);
export function passiveVoiceScore(text) {
    const tokens = tokenize(text);
    if (tokens.length < 10) return 0.5;
    let passiveCount = 0;
    for (let i = 0; i < tokens.length - 1; i++) {
        if (
            BE_VERBS.includes(tokens[i]) &&
            tokens[i + 1].endsWith('ed') &&
            tokens[i + 1].length > 4 &&
            !NON_PARTICIPLE_ED.has(tokens[i + 1])
        ) {
            passiveCount++;
        }
    }
    const ratio = passiveCount / (tokens.length / 10);
    return Math.min(1, ratio / 2); // 2 per 10-word chunk = fully AI-like
}

/**
 * First-person pronoun usage.
 * Human text tends to include more personal voice ("I", "my", "we").
 * Returns a score close to 1 when there are very few first-person pronouns (AI-like).
 */
const FIRST_PERSON = ['i', 'me', 'my', 'mine', 'myself', 'we', 'us', 'our', 'ours', 'ourselves'];
export function lowFirstPersonScore(text) {
    const tokens = tokenize(text);
    if (tokens.length === 0) return 0.5;
    const fpCount = tokens.filter(t => FIRST_PERSON.includes(t)).length;
    const ratio = fpCount / tokens.length;
    // 0% first-person → score 1 (AI-like); ≥5% → score 0 (human-like)
    return Math.max(0, 1 - ratio / 0.05);
}

/**
 * Formal/generic word density.
 * AI tends to use vague academic words.
 */
const GENERIC_WORDS = [
    'utilize', 'utilise', 'leverage', 'facilitate', 'implement', 'ensure',
    'enhance', 'crucial', 'essential', 'fundamental', 'significant', 'various',
    'numerous', 'diverse', 'comprehensive', 'robust', 'effective', 'efficient',
    'optimal', 'innovative', 'dynamic', 'synergy', 'paradigm', 'framework',
    'holistic', 'streamline', 'underscore', 'delve', 'embark', 'elucidate',
    'demonstrate', 'highlight', 'exhibit', 'depict', 'portray',
];

export function genericWordScore(text) {
    const tokens = tokenize(text);
    if (tokens.length === 0) return 0;
    const hits = tokens.filter(t => GENERIC_WORDS.includes(t)).length;
    const ratio = hits / tokens.length;
    return Math.min(1, ratio / 0.06); // 6% generic = very AI-like
}

// ---------------------------------------------------------------------------
// Combined AI-likelihood score
// ---------------------------------------------------------------------------

/**
 * Returns a score from 0 to 100 indicating the likelihood that the text
 * was generated by an AI, along with a per-metric breakdown.
 */
export function analyzeAILikelihood(text) {
    const metrics = {
        sentenceUniformity: sentenceLengthUniformity(text),
        transitionPhrases: transitionPhraseScore(text),
        vocabularyRepetition: vocabularyRepetitiveness(text),
        passiveVoice: passiveVoiceScore(text),
        lowFirstPerson: lowFirstPersonScore(text),
        genericWords: genericWordScore(text),
    };

    const weights = {
        sentenceUniformity: 0.20,
        transitionPhrases: 0.20,
        vocabularyRepetition: 0.15,
        passiveVoice: 0.15,
        lowFirstPerson: 0.15,
        genericWords: 0.15,
    };

    const raw = Object.keys(metrics).reduce(
        (sum, key) => sum + metrics[key] * weights[key],
        0
    );

    const score = Math.round(raw * 100);
    const label =
        score >= 75 ? 'Likely AI-generated' :
        score >= 50 ? 'Possibly AI-assisted' :
        score >= 25 ? 'Mostly human-written' :
                      'Very likely human-written';

    const breakdown = [
        {
            key: 'sentenceUniformity',
            label: 'Sentence-length uniformity',
            value: metrics.sentenceUniformity,
            description: 'AI text tends to use sentences of similar length.',
        },
        {
            key: 'transitionPhrases',
            label: 'Transition-phrase overuse',
            value: metrics.transitionPhrases,
            description: 'AI overuses connectors like "furthermore", "moreover", "in conclusion".',
        },
        {
            key: 'vocabularyRepetition',
            label: 'Low vocabulary diversity',
            value: metrics.vocabularyRepetition,
            description: 'AI tends to reuse the same words more often than humans.',
        },
        {
            key: 'passiveVoice',
            label: 'Passive-voice density',
            value: metrics.passiveVoice,
            description: 'AI text leans heavily on passive constructions.',
        },
        {
            key: 'lowFirstPerson',
            label: 'Absence of first-person voice',
            value: metrics.lowFirstPerson,
            description: 'Human writers typically include personal pronouns (I, we, my).',
        },
        {
            key: 'genericWords',
            label: 'Generic / buzzword density',
            value: metrics.genericWords,
            description: 'AI frequently uses vague academic words like "utilize", "leverage", "delve".',
        },
    ];

    return { score, label, breakdown };
}

// ---------------------------------------------------------------------------
// Basic plagiarism / structural fingerprinting
// ---------------------------------------------------------------------------

/**
 * Generate a rough "fingerprint" of the text for self-comparison.
 * Returns an array of normalised 4-gram strings.
 */
export function buildFingerprint(text) {
    const tokens = tokenize(text);
    const ngrams = [];
    for (let i = 0; i <= tokens.length - 4; i++) {
        ngrams.push(tokens.slice(i, i + 4).join(' '));
    }
    return ngrams;
}

/**
 * Structural repetition score within the text itself.
 * Detects copy-pasted blocks or templated phrases.
 * Returns 0–100 as a "self-similarity" percentage.
 */
export function selfSimilarityScore(text) {
    const ngrams = buildFingerprint(text);
    if (ngrams.length === 0) return 0;
    const unique = new Set(ngrams).size;
    const duplicates = ngrams.length - unique;
    return Math.min(100, Math.round((duplicates / ngrams.length) * 100 * 2));
}

/**
 * Check text against a small built-in corpus of well-known academic sentences /
 * commonly-copied passages. Returns matched phrases (if any).
 *
 * NOTE: This list is intentionally short. A production system would compare
 * against a large indexed database.
 */
const KNOWN_PHRASES = [
    'to be or not to be that is the question',
    'we the people of the united states in order to form a more perfect union',
    'four score and seven years ago our fathers brought forth',
    'it was the best of times it was the worst of times',
    'in the beginning god created the heavens and the earth',
    'all animals are equal but some animals are more equal than others',
    'ask not what your country can do for you ask what you can do for your country',
    'the only thing we have to fear is fear itself',
    'i have a dream that one day this nation will rise up',
];

/** Score penalty added per matched well-known phrase (each phrase contributes this many points). */
const KNOWN_PHRASE_WEIGHT = 15;

export function checkKnownPhrases(text) {
    const lower = text.toLowerCase().replace(/[^a-z\s]/g, ' ').replace(/\s+/g, ' ');
    return KNOWN_PHRASES.filter(phrase => lower.includes(phrase));
}

/**
 * Full structural plagiarism analysis.
 * Returns a summary object.
 */
export function analyzePlagiarism(text) {
    const selfSim = selfSimilarityScore(text);
    const knownMatches = checkKnownPhrases(text);

    const score = Math.min(
        100,
        selfSim + knownMatches.length * KNOWN_PHRASE_WEIGHT
    );

    const label =
        score >= 60 ? 'High structural repetition detected' :
        score >= 30 ? 'Moderate repetition / possible copying' :
                      'Low repetition – appears original';

    return {
        score,
        label,
        selfSimilarity: selfSim,
        knownPhrases: knownMatches,
    };
}

// ---------------------------------------------------------------------------
// Word and readability stats (bonus info for the user)
// ---------------------------------------------------------------------------

export function textStats(text) {
    const words = tokenize(text);
    const sentences = splitSentences(text);
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);

    const avgWordsPerSentence = sentences.length > 0
        ? Math.round(words.length / sentences.length)
        : 0;

    // Flesch Reading Ease (approximate)
    const syllableCount = words.reduce((sum, w) => sum + countSyllables(w), 0);
    const fleschScore = sentences.length > 0 && words.length > 0
        ? Math.round(206.835 - 1.015 * (words.length / sentences.length) - 84.6 * (syllableCount / words.length))
        : 0;

    return {
        wordCount: words.length,
        sentenceCount: sentences.length,
        paragraphCount: paragraphs.length,
        avgWordsPerSentence,
        uniqueWords: new Set(words).size,
        fleschScore: Math.max(0, Math.min(100, fleschScore)),
    };
}

function countSyllables(word) {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const matches = word.match(/[aeiouy]{1,2}/g);
    return matches ? matches.length : 1;
}
