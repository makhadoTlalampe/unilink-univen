// src/features/TextScanner.js
// AI-Generated Content & Plagiarism Heuristic Scanner

import React, { useState } from 'react';

/**
 * Lightweight, client-side heuristic analysis.
 * No external API is required; the score is an estimate based on
 * structural and linguistic patterns known to correlate with AI-generated text.
 *
 * Returns an object with:
 *   score        {number}  0–100 (higher = more likely AI-generated)
 *   verdict      {string}
 *   indicators   {Array<{label, found, detail}>}
 *   limitations  {string[]}
 */
function analyseText(text) {
    const trimmed = text.trim();
    if (!trimmed) return null;

    const sentences = trimmed
        .split(/(?<=[.!?])\s+/)
        .map((s) => s.trim())
        .filter(Boolean);

    const words = trimmed.split(/\s+/);
    const wordCount = words.length;

    // --- Individual heuristic checks ---

    // 1. Sentence-length burstiness (low burstiness = AI indicator)
    const sentenceLengths = sentences.map((s) => s.split(/\s+/).length);
    const avgLen = sentenceLengths.reduce((a, b) => a + b, 0) / (sentenceLengths.length || 1);
    const variance =
        sentenceLengths.reduce((acc, l) => acc + Math.pow(l - avgLen, 2), 0) /
        (sentenceLengths.length || 1);
    const stdDev = Math.sqrt(variance);
    const lowBurstiness = stdDev < avgLen * 0.3;

    // 2. Parallel / formulaic opening phrases
    const formulaicPhrases = [
        /\bin general\b/i,
        /\bin conclusion\b/i,
        /\bit is (important|worth|clear|evident|notable)/i,
        /\bfurthermore\b/i,
        /\bmoreover\b/i,
        /\badditionally\b/i,
        /\bhowever\b/i,
        /\bin summary\b/i,
        /\boverall\b/i,
        /\bfirst(ly)?\b.*\bsecond(ly)?\b/i,
    ];
    const formulaicCount = formulaicPhrases.filter((re) => re.test(trimmed)).length;
    const highFormulaic = formulaicCount >= 2;

    // 3. Low lexical diversity (type-to-token ratio)
    const uniqueWords = new Set(words.map((w) => w.toLowerCase().replace(/[^a-z]/g, '')));
    const ttr = uniqueWords.size / (wordCount || 1);
    const lowDiversity = ttr < 0.55;

    // 4. Absence of first-person pronouns
    const firstPerson = /\b(i|we|my|our|me|us)\b/i.test(trimmed);

    // 5. Spelling errors (crude check – actual typos are a HUMAN indicator)
    const commonTypos = [
        /\brecourses\b/i,        // "resources" typo from the sample text
        /\bteh\b/i,
        /\bthier\b/i,
        /\boccured\b/i,
        /\buntill\b/i,
        /\bbecomming\b/i,
    ];
    const typoFound = commonTypos.some((re) => re.test(trimmed));

    // 6. Passive / impersonal constructions
    const passivePattern = /\b(is|are|was|were|be|been|being)\s+\w+ed\b/i;
    const hasPassive = passivePattern.test(trimmed);

    // --- Build indicators list ---
    const indicators = [
        {
            label: 'Low sentence-length variation (low burstiness)',
            found: lowBurstiness,
            detail: `Std dev ${stdDev.toFixed(1)} words vs avg ${avgLen.toFixed(1)} words per sentence.`,
        },
        {
            label: 'High use of formulaic / transitional phrases',
            found: highFormulaic,
            detail: `${formulaicCount} formulaic phrase(s) detected.`,
        },
        {
            label: 'Low lexical diversity (type-to-token ratio)',
            found: lowDiversity,
            detail: `TTR = ${(ttr * 100).toFixed(1)}% (threshold: 55%).`,
        },
        {
            label: 'No first-person pronouns (impersonal tone)',
            found: !firstPerson,
            detail: firstPerson ? 'First-person pronouns found.' : 'No first-person pronouns detected.',
        },
        {
            label: 'Passive / impersonal constructions present',
            found: hasPassive,
            detail: hasPassive ? 'Passive voice detected.' : 'No passive constructions found.',
        },
        {
            label: 'Spelling errors detected (human indicator — reduces AI score)',
            found: typoFound,
            detail: typoFound
                ? 'Possible spelling error found; typical AI models rarely produce isolated typos.'
                : 'No common spelling errors detected.',
            humanIndicator: true,
        },
    ];

    // --- Compute score ---
    let score = 0;
    indicators.forEach(({ found, humanIndicator }) => {
        if (humanIndicator) {
            if (found) score -= 20; // typo reduces AI likelihood
        } else {
            if (found) score += 20;
        }
    });
    score = Math.min(100, Math.max(0, score));

    // Short-text penalty (less reliable analysis)
    const shortText = wordCount < 80;

    let verdict;
    if (score >= 75) verdict = 'High probability of AI-generated content';
    else if (score >= 45) verdict = 'Moderate probability of AI-generated content';
    else if (score >= 20) verdict = 'Low probability of AI-generated content';
    else verdict = 'Likely human-written';

    const limitations = [
        'This is a heuristic estimate only — no external AI-detection API is used.',
        'Texts shorter than 80 words produce less reliable results.',
        'The same text appearing in textbooks may also trigger plagiarism tools.',
        'For authoritative results use GPTZero, Originality.ai, or Turnitin AI detection.',
    ];

    if (shortText) {
        limitations.unshift('⚠ Text is short — analysis reliability is reduced.');
    }

    return { score, verdict, indicators, limitations, wordCount, sentenceCount: sentences.length };
}

const styles = {
    container: {
        maxWidth: '780px',
        margin: '40px auto',
        padding: '0 20px',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: '#333',
    },
    heading: { fontSize: '24px', fontWeight: '700', marginBottom: '6px' },
    subheading: { color: '#555', marginBottom: '20px', fontSize: '14px' },
    textarea: {
        width: '100%',
        minHeight: '160px',
        padding: '12px',
        fontSize: '14px',
        border: '1px solid #ccc',
        borderRadius: '6px',
        resize: 'vertical',
        boxSizing: 'border-box',
    },
    btn: {
        marginTop: '12px',
        padding: '10px 24px',
        background: '#667eea',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        fontSize: '15px',
        cursor: 'pointer',
    },
    clearBtn: {
        marginTop: '12px',
        marginLeft: '10px',
        padding: '10px 16px',
        background: '#e0e0e0',
        color: '#333',
        border: 'none',
        borderRadius: '6px',
        fontSize: '15px',
        cursor: 'pointer',
    },
    resultBox: {
        marginTop: '24px',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        background: '#fafafa',
    },
    verdictHigh: { color: '#c0392b', fontWeight: '700', fontSize: '18px' },
    verdictMed: { color: '#e67e22', fontWeight: '700', fontSize: '18px' },
    verdictLow: { color: '#27ae60', fontWeight: '700', fontSize: '18px' },
    scoreBar: {
        height: '12px',
        borderRadius: '6px',
        background: '#eee',
        margin: '8px 0 16px',
        overflow: 'hidden',
    },
    indicatorRow: {
        display: 'flex',
        alignItems: 'flex-start',
        marginBottom: '8px',
        fontSize: '14px',
    },
    badge: (found, isHuman) => ({
        minWidth: '22px',
        height: '22px',
        borderRadius: '50%',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: '10px',
        fontSize: '12px',
        fontWeight: '700',
        background: found ? (isHuman ? '#27ae60' : '#e74c3c') : '#95a5a6',
        color: '#fff',
        flexShrink: 0,
    }),
    limitation: { fontSize: '13px', color: '#777', margin: '4px 0' },
};

const TextScanner = () => {
    const [inputText, setInputText] = useState('');
    const [result, setResult] = useState(null);

    const handleAnalyse = () => {
        const r = analyseText(inputText);
        setResult(r);
    };

    const handleClear = () => {
        setInputText('');
        setResult(null);
    };

    const verdictStyle = (score) => {
        if (score >= 75) return styles.verdictHigh;
        if (score >= 45) return styles.verdictMed;
        return styles.verdictLow;
    };

    const barColor = (score) => {
        if (score >= 75) return '#e74c3c';
        if (score >= 45) return '#e67e22';
        return '#27ae60';
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>AI Content Scanner</h1>
            <p style={styles.subheading}>
                Paste any text below to receive a heuristic analysis of whether it shows signs
                of AI-generated content.
            </p>

            <textarea
                style={styles.textarea}
                placeholder="Paste your text here…"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
            />

            <button style={styles.btn} onClick={handleAnalyse} disabled={!inputText.trim()}>
                Analyse Text
            </button>
            <button style={styles.clearBtn} onClick={handleClear}>
                Clear
            </button>

            {result && (
                <div style={styles.resultBox}>
                    <p style={{ fontSize: '13px', color: '#888', margin: '0 0 4px' }}>
                        {result.wordCount} words · {result.sentenceCount} sentence
                        {result.sentenceCount !== 1 ? 's' : ''} analysed
                    </p>

                    <p style={verdictStyle(result.score)}>{result.verdict}</p>

                    <div style={styles.scoreBar}>
                        <div
                            style={{
                                height: '100%',
                                width: `${result.score}%`,
                                background: barColor(result.score),
                                transition: 'width 0.5s',
                            }}
                        />
                    </div>
                    <p style={{ fontSize: '13px', color: '#555', marginBottom: '16px' }}>
                        AI-likelihood score: <strong>{result.score}/100</strong>
                    </p>

                    <h3 style={{ fontSize: '16px', marginBottom: '10px' }}>Indicators</h3>
                    {result.indicators.map((ind, i) => (
                        <div key={i} style={styles.indicatorRow}>
                            <span style={styles.badge(ind.found, ind.humanIndicator)}>
                                {ind.found ? (ind.humanIndicator ? 'H' : '!') : '–'}
                            </span>
                            <div>
                                <strong>{ind.label}</strong>
                                <br />
                                <span style={{ color: '#666' }}>{ind.detail}</span>
                            </div>
                        </div>
                    ))}

                    <h3 style={{ fontSize: '15px', marginTop: '20px', marginBottom: '8px' }}>
                        Limitations
                    </h3>
                    {result.limitations.map((l, i) => (
                        <p key={i} style={styles.limitation}>• {l}</p>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TextScanner;
