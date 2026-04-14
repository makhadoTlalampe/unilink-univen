import React, { useState, useCallback } from 'react';
import {
    analyzeAILikelihood,
    analyzePlagiarism,
    textStats,
} from '../utils/textAnalysis';
import './TextAnalyzer.css';

const MIN_WORDS = 30;

const TextAnalyzer = () => {
    const [inputText, setInputText] = useState('');
    const [results, setResults] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);

    const wordCount = (inputText.match(/\b\w+\b/g) || []).length;

    const handleAnalyze = useCallback(() => {
        if (wordCount < MIN_WORDS) return;
        setAnalyzing(true);

        // Use a short timeout so the UI can update before the (synchronous) analysis runs
        setTimeout(() => {
            try {
                const ai = analyzeAILikelihood(inputText);
                const plagiarism = analyzePlagiarism(inputText);
                const stats = textStats(inputText);
                setResults({ ai, plagiarism, stats });
            } finally {
                setAnalyzing(false);
            }
        }, 50);
    }, [inputText, wordCount]);

    const handleClear = () => {
        setInputText('');
        setResults(null);
    };

    return (
        <div className="text-analyzer">
            <h1>📝 Text Analyzer</h1>
            <p className="subtitle">
                Paste or type any text below to check for signs of AI-generated content and
                structural plagiarism. All analysis runs locally in your browser — no text is
                sent to any external server.
            </p>

            {/* ── Input ── */}
            <div className="ta-input-section">
                <label htmlFor="ta-text-input">Your text</label>
                <textarea
                    id="ta-text-input"
                    className="ta-textarea"
                    placeholder={`Paste or type your text here (minimum ${MIN_WORDS} words)…`}
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    spellCheck={false}
                />
                <div className="ta-controls">
                    <span className="ta-word-count">
                        {wordCount} word{wordCount !== 1 ? 's' : ''}
                        {wordCount > 0 && wordCount < MIN_WORDS && (
                            <span style={{ color: '#e57373' }}>
                                {' '}— need at least {MIN_WORDS} words
                            </span>
                        )}
                    </span>
                    <div className="ta-btn-row">
                        <button
                            className="ta-btn-clear"
                            onClick={handleClear}
                            disabled={!inputText}
                        >
                            Clear
                        </button>
                        <button
                            className="ta-btn-analyze"
                            onClick={handleAnalyze}
                            disabled={wordCount < MIN_WORDS || analyzing}
                        >
                            {analyzing ? 'Analyzing…' : 'Analyze Text'}
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Results ── */}
            {results && (
                <div className="ta-results">
                    <h2>Analysis Results</h2>

                    {/* Score cards */}
                    <div className="ta-score-cards">
                        <ScoreCard
                            type="ai"
                            title="AI-Generation Likelihood"
                            score={results.ai.score}
                            label={results.ai.label}
                        />
                        <ScoreCard
                            type="plagiarism"
                            title="Structural Repetition Score"
                            score={results.plagiarism.score}
                            label={results.plagiarism.label}
                        />
                    </div>

                    {/* Known-phrase matches */}
                    {results.plagiarism.knownPhrases.length > 0 && (
                        <div className="ta-known-phrases">
                            <h4>⚠ Well-known phrases detected in your text:</h4>
                            <ul>
                                {results.plagiarism.knownPhrases.map((p, i) => (
                                    <li key={i}>"{p}"</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Per-metric AI breakdown */}
                    <div className="ta-breakdown">
                        <h3>AI-detection metric breakdown</h3>
                        {results.ai.breakdown.map(metric => (
                            <div key={metric.key}>
                                <div className="ta-metric-row">
                                    <span className="ta-metric-name">{metric.label}</span>
                                    <div className="ta-metric-bar-wrap">
                                        <div
                                            className="ta-metric-bar-fill"
                                            style={{ width: `${Math.round(metric.value * 100)}%` }}
                                        />
                                    </div>
                                    <span className="ta-metric-pct">
                                        {Math.round(metric.value * 100)}%
                                    </span>
                                </div>
                                <p className="ta-metric-desc">{metric.description}</p>
                            </div>
                        ))}
                    </div>

                    {/* Text stats */}
                    <div className="ta-stats">
                        <StatChip label="Words" value={results.stats.wordCount} />
                        <StatChip label="Sentences" value={results.stats.sentenceCount} />
                        <StatChip label="Paragraphs" value={results.stats.paragraphCount} />
                        <StatChip label="Unique words" value={results.stats.uniqueWords} />
                        <StatChip label="Avg words/sentence" value={results.stats.avgWordsPerSentence} />
                        <StatChip label="Flesch readability" value={`${results.stats.fleschScore}/100`} />
                    </div>

                    {/* Disclaimer */}
                    <div className="ta-disclaimer">
                        <strong>Disclaimer & Limitations:</strong> This tool uses heuristic algorithms
                        and statistical patterns to estimate the likelihood of AI-generated content and
                        detect structural repetition within your text. It does <em>not</em> compare your
                        text against any external academic database, internet sources, or proprietary
                        plagiarism corpus (such as Turnitin or iThenticate). Results should be
                        interpreted as indicative guidance only and are not a substitute for
                        professional plagiarism-checking services. All analysis is performed entirely
                        within your browser — no text is transmitted to any server.
                    </div>
                </div>
            )}
        </div>
    );
};

// ── Sub-components ──────────────────────────────────────────────────────────

const ScoreCard = ({ type, title, score, label }) => (
    <div className={`ta-score-card ${type}`}>
        <h3>{title}</h3>
        <div className="ta-score-number">{score}%</div>
        <div className="ta-progress-bar">
            <div className="ta-progress-fill" style={{ width: `${score}%` }} />
        </div>
        <div className="ta-score-label">{label}</div>
    </div>
);

const StatChip = ({ label, value }) => (
    <span className="ta-stat-chip">
        {label}: <strong>{value}</strong>
    </span>
);

export default TextAnalyzer;
