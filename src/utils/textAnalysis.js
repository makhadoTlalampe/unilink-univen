// src/utils/textAnalysis.js
// Shared utility functions for text humanization and AI detection analysis

/**
 * Splits text into individual sentences.
 * @param {string} text
 * @returns {string[]}
 */
export function splitIntoSentences(text) {
    if (!text || !text.trim()) return [];
    return text
        .trim()
        .split(/(?<=[.!?])\s+/)
        .filter(s => s.trim().length > 0);
}

/**
 * Splits text into individual words (no punctuation).
 * @param {string} text
 * @returns {string[]}
 */
export function splitIntoWords(text) {
    if (!text || !text.trim()) return [];
    return text.trim().split(/\s+/).filter(w => w.length > 0);
}

/**
 * Returns the type-token ratio (unique words / total words).
 * A low TTR can indicate repetitive / formulaic writing.
 * @param {string[]} words
 * @returns {number} 0-1
 */
export function typeTokenRatio(words) {
    if (!words.length) return 0;
    const unique = new Set(words.map(w => w.toLowerCase().replace(/[^a-z]/g, '')));
    return unique.size / words.length;
}

/**
 * Returns the average sentence length in words.
 * @param {string[]} sentences
 * @returns {number}
 */
export function averageSentenceLength(sentences) {
    if (!sentences.length) return 0;
    const total = sentences.reduce((sum, s) => sum + splitIntoWords(s).length, 0);
    return total / sentences.length;
}

/**
 * Returns the variance of sentence lengths.
 * Low variance → very uniform sentences → common in AI text.
 * @param {string[]} sentences
 * @returns {number}
 */
export function sentenceLengthVariance(sentences) {
    if (sentences.length < 2) return 0;
    const lengths = sentences.map(s => splitIntoWords(s).length);
    const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const variance = lengths.reduce((sum, l) => sum + Math.pow(l - avg, 2), 0) / lengths.length;
    return variance;
}

/**
 * Counts personal pronouns – typically low in AI-generated text.
 * @param {string[]} words
 * @returns {number} ratio 0-1
 */
export function personalPronounRatio(words) {
    if (!words.length) return 0;
    const pronouns = new Set(['i', 'me', 'my', 'mine', 'myself', 'we', 'us', 'our', 'ours', 'ourselves']);
    const count = words.filter(w => pronouns.has(w.toLowerCase().replace(/[^a-z]/g, ''))).length;
    return count / words.length;
}

/**
 * Detects phrases statistically common in AI-generated text.
 * @param {string} text
 * @returns {string[]} matched phrases
 */
export function detectAIPhrases(text) {
    const aiPhrases = [
        'it is important to note',
        'it is worth noting',
        'in conclusion',
        'in summary',
        'furthermore',
        'moreover',
        'additionally',
        'it is essential to',
        'it is crucial to',
        'delve into',
        'it is imperative',
        'in the realm of',
        'in the context of',
        'a multifaceted',
        'nuanced',
        'robust',
        'leverage',
        'utilize',
        "in today's world",
        "in today's rapidly evolving",
        'as an ai language model',
        'as a language model',
    ];
    const lower = text.toLowerCase();
    return aiPhrases.filter(phrase => lower.includes(phrase));
}

/**
 * Counts passive-voice constructions (approximate heuristic).
 * @param {string} text
 * @returns {number}
 */
export function countPassiveVoice(text) {
    const passivePattern = /\b(is|are|was|were|be|been|being)\s+\w+ed\b/gi;
    const matches = text.match(passivePattern);
    return matches ? matches.length : 0;
}

/**
 * Aggregates all signals into a single AI-likelihood score from 0-100.
 * Higher score means more likely AI-generated.
 * @param {string} text
 * @returns {{ score: number, breakdown: object }}
 */
export function computeAIScore(text) {
    const sentences = splitIntoSentences(text);
    const words = splitIntoWords(text);

    if (!sentences.length || !words.length) {
        return { score: 0, breakdown: {} };
    }

    const ttr = typeTokenRatio(words);
    const avgLen = averageSentenceLength(sentences);
    const variance = sentenceLengthVariance(sentences);
    const pronounRatio = personalPronounRatio(words);
    const aiPhrases = detectAIPhrases(text);

    // Scoring heuristics (each component contributes up to 20-25 points)
    const ttrScore = Math.max(0, (0.7 - ttr) / 0.7) * 20;
    const lenScore = (avgLen >= 15 && avgLen <= 28) ? 15 : 0;
    const varianceScore = variance < 30 ? (1 - variance / 30) * 20 : 0;
    const pronounScore = Math.max(0, (0.03 - pronounRatio) / 0.03) * 20;
    const phraseScore = Math.min(aiPhrases.length * 5, 25);

    const raw = ttrScore + lenScore + varianceScore + pronounScore + phraseScore;
    const score = Math.round(Math.min(raw, 100));

    return {
        score,
        breakdown: {
            vocabularyDiversity: Math.round(ttr * 100),
            avgSentenceLength: Math.round(avgLen * 10) / 10,
            sentenceVariance: Math.round(variance * 10) / 10,
            personalPronounPercent: Math.round(pronounRatio * 100 * 10) / 10,
            aiPhrasesFound: aiPhrases,
            passiveConstructions: countPassiveVoice(text),
        },
    };
}

// ---------------------------------------------------------------------------
// Text Humanization helpers
// ---------------------------------------------------------------------------

const FORMAL_TO_CASUAL = [
    [/\butilize\b/gi, 'use'],
    [/\bfurthermore\b/gi, 'also'],
    [/\bmoreover\b/gi, 'on top of that'],
    [/\badditionally\b/gi, 'and'],
    [/\bnevertheless\b/gi, 'still'],
    [/\bnotwithstanding\b/gi, 'despite that'],
    [/\bsubsequently\b/gi, 'then'],
    [/\bprior to\b/gi, 'before'],
    [/\bcommence\b/gi, 'start'],
    [/\bterminate\b/gi, 'end'],
    [/\bpurchase\b/gi, 'buy'],
    [/\bobtain\b/gi, 'get'],
    [/\brequire\b/gi, 'need'],
    [/\bdemonstrate\b/gi, 'show'],
    [/\bascertain\b/gi, 'find out'],
    [/\bfacilitate\b/gi, 'help'],
    [/\bin order to\b/gi, 'to'],
    [/\bdue to the fact that\b/gi, 'because'],
    [/\bin the event that\b/gi, 'if'],
    [/\bfor the purpose of\b/gi, 'for'],
    [/\bit is important to note that\b/gi, 'note that'],
    [/\bit is worth noting that\b/gi, 'note that'],
    [/\bit is essential to\b/gi, 'you should'],
    [/\bit is crucial to\b/gi, "it's important to"],
    [/\bin conclusion\b/gi, 'to wrap up'],
    [/\bin summary\b/gi, 'to sum up'],
    [/\bleverage\b/gi, 'use'],
    [/\brobust\b/gi, 'strong'],
    [/\bdelve into\b/gi, 'explore'],
    [/\bin the realm of\b/gi, 'in'],
    [/\ba multifaceted\b/gi, 'a complex'],
];

const CONTRACTIONS = [
    [/\bit is\b/gi, "it's"],
    [/\bthey are\b/gi, "they're"],
    [/\bwe are\b/gi, "we're"],
    [/\byou are\b/gi, "you're"],
    [/\bhe is\b/gi, "he's"],
    [/\bshe is\b/gi, "she's"],
    [/\bI am\b/g, "I'm"],
    [/\bdo not\b/gi, "don't"],
    [/\bdoes not\b/gi, "doesn't"],
    [/\bdid not\b/gi, "didn't"],
    [/\bcannot\b/gi, "can't"],
    [/\bwill not\b/gi, "won't"],
    [/\bwould not\b/gi, "wouldn't"],
    [/\bcould not\b/gi, "couldn't"],
    [/\bshould not\b/gi, "shouldn't"],
    [/\bhas not\b/gi, "hasn't"],
    [/\bhave not\b/gi, "haven't"],
    [/\bhad not\b/gi, "hadn't"],
    [/\bwas not\b/gi, "wasn't"],
    [/\bwere not\b/gi, "weren't"],
    [/\bthat is\b/gi, "that's"],
    [/\bthere is\b/gi, "there's"],
    [/\bwhat is\b/gi, "what's"],
    [/\bwho is\b/gi, "who's"],
];

/**
 * Replaces formal / stiff vocabulary with more conversational alternatives.
 * @param {string} text
 * @returns {string}
 */
export function replaceFormalVocabulary(text) {
    let result = text;
    for (const [pattern, replacement] of FORMAL_TO_CASUAL) {
        result = result.replace(pattern, replacement);
    }
    return result;
}

/**
 * Introduces natural contractions to make text feel less formal.
 * @param {string} text
 * @returns {string}
 */
export function addContractions(text) {
    let result = text;
    for (const [pattern, replacement] of CONTRACTIONS) {
        result = result.replace(pattern, replacement);
    }
    return result;
}

/**
 * Breaks sentences longer than `maxWords` at a natural conjunction.
 * @param {string} text
 * @param {number} maxWords
 * @returns {string}
 */
export function breakLongSentences(text, maxWords = 30) {
    const sentences = splitIntoSentences(text);
    return sentences
        .map(sentence => {
            const words = splitIntoWords(sentence);
            if (words.length <= maxWords) return sentence;
            const midpoint = Math.floor(words.length / 2);
            const conjunctions = ['and', 'but', 'so', 'yet', 'or', 'because', 'while', 'although'];
            for (let i = midpoint; i < words.length - 1; i++) {
                const word = words[i].toLowerCase().replace(/[^a-z]/g, '');
                if (conjunctions.includes(word)) {
                    const first = words.slice(0, i).join(' ');
                    const second = words.slice(i).join(' ');
                    return first + '. ' + second.charAt(0).toUpperCase() + second.slice(1);
                }
            }
            return sentence;
        })
        .join(' ');
}

/**
 * Removes redundant phrases and consecutive filler words.
 * @param {string} text
 * @returns {string}
 */
export function removeRedundancy(text) {
    return text
        .replace(/\b(very|really|just|so) \1\b/gi, '$1')
        .replace(/\b(in terms of|with regard to|with respect to)\b/gi, 'regarding');
}

/**
 * Applies all humanization passes to the provided text.
 * @param {string} text
 * @returns {string}
 */
export function humanizeText(text) {
    let result = text;
    result = replaceFormalVocabulary(result);
    result = addContractions(result);
    result = breakLongSentences(result);
    result = removeRedundancy(result);
    return result;
}
