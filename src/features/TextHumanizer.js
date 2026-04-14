// src/features/TextHumanizer.js
// Transforms formal or AI-generated text into natural, conversational prose.

import React, { useState, useCallback } from 'react';
import { humanizeText, computeAIScore } from '../utils/textAnalysis';
import './TextHumanizer.css';

const EXAMPLE_TEXT =
    'It is important to note that the utilization of advanced methodologies ' +
    'will facilitate the enhancement of academic performance. Furthermore, ' +
    'students are required to demonstrate their ability to leverage available ' +
    'resources in order to obtain optimal results. It is crucial to commence ' +
    'the process prior to the deadline to ensure that all requirements are met.';

const TextHumanizer = () => {
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [beforeScore, setBeforeScore] = useState(null);
    const [afterScore, setAfterScore] = useState(null);
    const [copied, setCopied] = useState(false);

    const handleHumanize = useCallback(() => {
        if (!inputText.trim()) return;
        const before = computeAIScore(inputText);
        const humanized = humanizeText(inputText);
        const after = computeAIScore(humanized);
        setBeforeScore(before);
        setAfterScore(after);
        setOutputText(humanized);
        setCopied(false);
    }, [inputText]);

    const handleLoadExample = () => {
        setInputText(EXAMPLE_TEXT);
        setOutputText('');
        setBeforeScore(null);
        setAfterScore(null);
        setCopied(false);
    };

    const handleCopy = () => {
        if (!outputText) return;
        navigator.clipboard.writeText(outputText).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleClear = () => {
        setInputText('');
        setOutputText('');
        setBeforeScore(null);
        setAfterScore(null);
        setCopied(false);
    };

    const scoreLabel = (score) => {
        if (score < 25) return { label: 'Likely Human', color: '#27ae60' };
        if (score < 55) return { label: 'Mixed', color: '#f39c12' };
        return { label: 'Likely AI', color: '#e74c3c' };
    };

    return (
        <div className="humanizer-page">
            <div className="humanizer-header">
                <h1>✍️ Text Humanizer</h1>
                <p className="humanizer-subtitle">
                    Paste formal or AI-generated text below and transform it into natural,
                    conversational writing that sounds authentically human.
                </p>
            </div>

            <div className="humanizer-layout">
                {/* Input panel */}
                <div className="humanizer-panel">
                    <div className="panel-header">
                        <span className="panel-title">Original Text</span>
                        <div className="panel-actions">
                            <button className="btn-secondary" onClick={handleLoadExample}>
                                Load Example
                            </button>
                            <button className="btn-secondary" onClick={handleClear}>
                                Clear
                            </button>
                        </div>
                    </div>
                    <textarea
                        className="humanizer-textarea"
                        value={inputText}
                        onChange={e => setInputText(e.target.value)}
                        placeholder="Paste your text here…"
                        rows={12}
                    />
                    <div className="panel-footer">
                        <span className="word-count">
                            {inputText.trim().split(/\s+/).filter(Boolean).length} words
                        </span>
                        <button
                            className="btn-primary"
                            onClick={handleHumanize}
                            disabled={!inputText.trim()}
                        >
                            Humanize →
                        </button>
                    </div>
                </div>

                {/* Output panel */}
                <div className="humanizer-panel">
                    <div className="panel-header">
                        <span className="panel-title">Humanized Text</span>
                        <div className="panel-actions">
                            <button
                                className="btn-secondary"
                                onClick={handleCopy}
                                disabled={!outputText}
                            >
                                {copied ? '✓ Copied!' : 'Copy'}
                            </button>
                        </div>
                    </div>
                    <div
                        className={`humanizer-output ${outputText ? 'has-content' : ''}`}
                    >
                        {outputText || (
                            <span className="output-placeholder">
                                Your humanized text will appear here…
                            </span>
                        )}
                    </div>
                    <div className="panel-footer">
                        <span className="word-count">
                            {outputText ? outputText.split(/\s+/).filter(Boolean).length : 0} words
                        </span>
                    </div>
                </div>
            </div>

            {/* Score comparison */}
            {beforeScore && afterScore && (
                <div className="score-comparison">
                    <h2>AI-Likelihood Comparison</h2>
                    <p className="score-note">
                        Lower scores indicate text that reads more like genuine human writing.
                    </p>
                    <div className="score-cards">
                        <div className="score-card">
                            <div className="score-label">Before</div>
                            <div
                                className="score-value"
                                style={{ color: scoreLabel(beforeScore.score).color }}
                            >
                                {beforeScore.score}%
                            </div>
                            <div
                                className="score-verdict"
                                style={{ color: scoreLabel(beforeScore.score).color }}
                            >
                                {scoreLabel(beforeScore.score).label}
                            </div>
                        </div>

                        <div className="score-arrow">→</div>

                        <div className="score-card score-card--after">
                            <div className="score-label">After</div>
                            <div
                                className="score-value"
                                style={{ color: scoreLabel(afterScore.score).color }}
                            >
                                {afterScore.score}%
                            </div>
                            <div
                                className="score-verdict"
                                style={{ color: scoreLabel(afterScore.score).color }}
                            >
                                {scoreLabel(afterScore.score).label}
                            </div>
                        </div>
                    </div>

                    {/* Breakdown */}
                    <div className="breakdown">
                        <h3>Analysis Breakdown</h3>
                        <table className="breakdown-table">
                            <thead>
                                <tr>
                                    <th>Metric</th>
                                    <th>Before</th>
                                    <th>After</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Vocabulary Diversity</td>
                                    <td>{beforeScore.breakdown.vocabularyDiversity}%</td>
                                    <td>{afterScore.breakdown.vocabularyDiversity}%</td>
                                </tr>
                                <tr>
                                    <td>Avg. Sentence Length</td>
                                    <td>{beforeScore.breakdown.avgSentenceLength} words</td>
                                    <td>{afterScore.breakdown.avgSentenceLength} words</td>
                                </tr>
                                <tr>
                                    <td>Sentence Variance</td>
                                    <td>{beforeScore.breakdown.sentenceVariance}</td>
                                    <td>{afterScore.breakdown.sentenceVariance}</td>
                                </tr>
                                <tr>
                                    <td>Personal Pronoun Use</td>
                                    <td>{beforeScore.breakdown.personalPronounPercent}%</td>
                                    <td>{afterScore.breakdown.personalPronounPercent}%</td>
                                </tr>
                                <tr>
                                    <td>AI Phrases Detected</td>
                                    <td>{beforeScore.breakdown.aiPhrasesFound.length}</td>
                                    <td>{afterScore.breakdown.aiPhrasesFound.length}</td>
                                </tr>
                                <tr>
                                    <td>Passive Constructions</td>
                                    <td>{beforeScore.breakdown.passiveConstructions}</td>
                                    <td>{afterScore.breakdown.passiveConstructions}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TextHumanizer;
