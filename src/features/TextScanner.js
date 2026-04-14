// src/features/TextScanner.js
// Scans user-supplied (pasted/typed) text for AI-generation indicators
// and basic originality signals, without requiring external API access.

import React, { useState, useCallback } from 'react';
import {
    computeAIScore,
    splitIntoSentences,
    splitIntoWords,
    detectAIPhrases,
    countPassiveVoice,
    typeTokenRatio,
} from '../utils/textAnalysis';
import './TextScanner.css';

const MIN_WORDS = 30;

const EXAMPLE_TEXT =
    'Artificial intelligence is transforming the way we approach education. ' +
    'It is important to note that the utilization of AI tools can facilitate ' +
    'personalized learning experiences. Furthermore, these robust technologies ' +
    'leverage data-driven insights to enhance academic outcomes. In conclusion, ' +
    'it is crucial to adopt a multifaceted strategy when integrating AI into ' +
    'educational institutions in order to achieve optimal results.';

const ScoreGauge = ({ score }) => {
    const clamp = Math.max(0, Math.min(score, 100));
    let color = '#27ae60';
    let label = 'Likely Human';
    if (clamp >= 55) { color = '#e74c3c'; label = 'Likely AI-Generated'; }
    else if (clamp >= 25) { color = '#f39c12'; label = 'Uncertain / Mixed'; }

    return (
        <div className="gauge-wrapper">
            <svg viewBox="0 0 120 70" className="gauge-svg" aria-hidden="true">
                {/* Background arc */}
                <path
                    d="M10,65 A55,55 0 0,1 110,65"
                    fill="none"
                    stroke="#eee"
                    strokeWidth="12"
                    strokeLinecap="round"
                />
                {/* Foreground arc */}
                <path
                    d="M10,65 A55,55 0 0,1 110,65"
                    fill="none"
                    stroke={color}
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={`${(clamp / 100) * 172.8} 172.8`}
                />
                <text x="60" y="60" textAnchor="middle" fontSize="18" fontWeight="800" fill={color}>
                    {clamp}%
                </text>
            </svg>
            <div className="gauge-label" style={{ color }}>{label}</div>
        </div>
    );
};

const MetricBar = ({ label, value, max, unit = '', tooltip = '' }) => {
    const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
    return (
        <div className="metric-bar" title={tooltip}>
            <div className="metric-bar-label">{label}</div>
            <div className="metric-bar-track">
                <div className="metric-bar-fill" style={{ width: `${pct}%` }} />
            </div>
            <div className="metric-bar-value">{value}{unit}</div>
        </div>
    );
};

const TextScanner = () => {
    const [inputText, setInputText] = useState('');
    const [result, setResult] = useState(null);
    const [scanned, setScanned] = useState(false);

    const handleScan = useCallback(() => {
        if (!inputText.trim()) return;
        const { score, breakdown } = computeAIScore(inputText);
        const sentences = splitIntoSentences(inputText);
        const words = splitIntoWords(inputText);
        const ttr = typeTokenRatio(words);
        const aiPhrases = detectAIPhrases(inputText);
        const passiveCount = countPassiveVoice(inputText);

        setResult({
            score,
            breakdown,
            stats: {
                wordCount: words.length,
                sentenceCount: sentences.length,
                uniqueWordPct: Math.round(ttr * 100),
                passiveCount,
                aiPhraseCount: aiPhrases.length,
                aiPhrases,
            },
        });
        setScanned(true);
    }, [inputText]);

    const handleLoadExample = () => {
        setInputText(EXAMPLE_TEXT);
        setResult(null);
        setScanned(false);
    };

    const handleClear = () => {
        setInputText('');
        setResult(null);
        setScanned(false);
    };

    const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
    const tooShort = wordCount > 0 && wordCount < MIN_WORDS;

    return (
        <div className="scanner-page">
            <div className="scanner-header">
                <h1>🔍 Text Scanner</h1>
                <p className="scanner-subtitle">
                    Paste or type any text below to analyse whether it shows signs of being
                    AI-generated. No files needed — just copy and paste your content.
                </p>
            </div>

            <div className="scanner-input-section">
                <div className="scanner-toolbar">
                    <span className="toolbar-title">Your Text</span>
                    <div className="toolbar-actions">
                        <button className="btn-secondary" onClick={handleLoadExample}>
                            Load Example
                        </button>
                        <button className="btn-secondary" onClick={handleClear}>
                            Clear
                        </button>
                    </div>
                </div>

                <textarea
                    className="scanner-textarea"
                    value={inputText}
                    onChange={e => { setInputText(e.target.value); setScanned(false); }}
                    placeholder={`Paste at least ${MIN_WORDS} words of text here to scan…`}
                    rows={10}
                />

                <div className="scanner-input-footer">
                    <span className={`word-count ${tooShort ? 'word-count--warn' : ''}`}>
                        {wordCount} words{tooShort ? ` (minimum ${MIN_WORDS} required for reliable analysis)` : ''}
                    </span>
                    <button
                        className="btn-primary"
                        onClick={handleScan}
                        disabled={!inputText.trim() || tooShort}
                    >
                        Scan Text
                    </button>
                </div>
            </div>

            {scanned && result && (
                <div className="scanner-results">
                    <h2>Scan Results</h2>

                    <div className="results-top">
                        {/* Gauge */}
                        <div className="results-gauge-card">
                            <h3>AI-Likelihood Score</h3>
                            <ScoreGauge score={result.score} />
                            <p className="gauge-note">
                                Based on heuristic analysis of sentence structure, vocabulary
                                diversity, personal pronouns, and common AI phrasing patterns.
                                This score is indicative, not conclusive.
                            </p>
                        </div>

                        {/* Quick stats */}
                        <div className="results-stats-card">
                            <h3>Text Statistics</h3>
                            <div className="stats-grid">
                                <div className="stat-item">
                                    <span className="stat-value">{result.stats.wordCount}</span>
                                    <span className="stat-label">Words</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-value">{result.stats.sentenceCount}</span>
                                    <span className="stat-label">Sentences</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-value">{result.stats.uniqueWordPct}%</span>
                                    <span className="stat-label">Unique Words</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-value">{result.breakdown.avgSentenceLength}</span>
                                    <span className="stat-label">Avg. Sentence Length</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-value">{result.stats.passiveCount}</span>
                                    <span className="stat-label">Passive Constructions</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-value">{result.breakdown.personalPronounPercent}%</span>
                                    <span className="stat-label">Personal Pronouns</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Metric bars */}
                    <div className="results-metrics-card">
                        <h3>Detailed Metrics</h3>
                        <MetricBar
                            label="Vocabulary Diversity (higher = more human)"
                            value={result.stats.uniqueWordPct}
                            max={100}
                            unit="%"
                            tooltip="Type-token ratio: percentage of unique words. AI text tends to be more repetitive."
                        />
                        <MetricBar
                            label="Sentence Variance (higher = more human)"
                            value={Math.round(result.breakdown.sentenceVariance)}
                            max={200}
                            tooltip="How much sentence lengths vary. Humans write unevenly; AI tends to be uniform."
                        />
                        <MetricBar
                            label="Personal Pronoun Use (higher = more human)"
                            value={result.breakdown.personalPronounPercent}
                            max={10}
                            unit="%"
                            tooltip="Use of I, we, me, my, etc. AI-generated text rarely uses first-person pronouns."
                        />
                        <MetricBar
                            label="AI Phrase Matches (higher = more AI-like)"
                            value={result.stats.aiPhraseCount}
                            max={10}
                            tooltip="Count of phrases commonly used by AI models."
                        />
                    </div>

                    {/* Flagged phrases */}
                    {result.stats.aiPhrases.length > 0 && (
                        <div className="results-phrases-card">
                            <h3>⚠️ AI-Associated Phrases Detected</h3>
                            <ul className="phrase-list">
                                {result.stats.aiPhrases.map((phrase, idx) => (
                                    <li key={idx} className="phrase-item">"{phrase}"</li>
                                ))}
                            </ul>
                            <p className="phrases-note">
                                These phrases appear frequently in AI-generated content. Their
                                presence does not definitively confirm AI authorship but warrants
                                closer review.
                            </p>
                        </div>
                    )}

                    {/* Disclaimer */}
                    <div className="disclaimer">
                        <strong>Disclaimer:</strong> This tool uses heuristic pattern analysis and
                        does not have access to external plagiarism databases. Results are
                        indicative only. For official academic integrity checks, use an accredited
                        service such as Turnitin or Copyleaks.
                    </div>
                </div>
            )}
        </div>
    );
};

export default TextScanner;
