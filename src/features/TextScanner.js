import React, { useState } from 'react';
import { analyseText } from '../utils/aiDetection';
import './TextScanner.css';

const SAMPLE_TEXT =
  'In general, qualitative research generates rich, detailed and valid ' +
  '(process) data that contribute to in-depth understanding of the context. ' +
  'Quantitative research generates reliable population based and ' +
  'generalizable data and is well suited to establishing cause-and-effect ' +
  'relationships. The decision of whether to choose a quantitative or a ' +
  'qualitative design is a philosophical question. Which methods to choose ' +
  'will depend on the nature of the project, the type of information needed ' +
  'the context of the study and the availability of recourses (time, money, ' +
  'and human).';

function ScoreBar({ score }) {
  const pct = Math.round(score * 100);
  let color = '#4caf50';
  if (pct >= 70) color = '#f44336';
  else if (pct >= 50) color = '#ff9800';
  else if (pct >= 30) color = '#ffc107';

  return (
    <div className="score-bar-container" title={`${pct}%`}>
      <div className="score-bar-fill" style={{ width: `${pct}%`, background: color }} />
      <span className="score-bar-label">{pct}%</span>
    </div>
  );
}

function VerdictBadge({ verdict, score }) {
  let cls = 'badge-uncertain';
  if (score >= 70) cls = 'badge-ai';
  else if (score >= 50) cls = 'badge-mixed';
  else if (score >= 30) cls = 'badge-uncertain';
  else cls = 'badge-human';

  return <span className={`verdict-badge ${cls}`}>{verdict}</span>;
}

const TextScanner = () => {
  const [text, setText] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleScan = () => {
    if (!text.trim()) return;
    setLoading(true);
    // Defer to allow React to render the loading state before computation
    setTimeout(() => {
      const result = analyseText(text);
      setReport(result);
      setLoading(false);
    }, 50);
  };

  const handleClear = () => {
    setText('');
    setReport(null);
  };

  const handleUseSample = () => {
    setText(SAMPLE_TEXT);
    setReport(null);
  };

  return (
    <div className="ts-container">
      <header className="ts-header">
        <h1>AI Content Scanner</h1>
        <p className="ts-subtitle">
          Paste any text below to analyse it for signs of AI-generated content.
          Results are based on linguistic heuristics and carry inherent
          uncertainty — see limitations at the bottom.
        </p>
      </header>

      <section className="ts-input-section">
        <textarea
          className="ts-textarea"
          rows={8}
          placeholder="Paste your text here…"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setReport(null);
          }}
        />
        <div className="ts-actions">
          <button className="ts-btn ts-btn-sample" onClick={handleUseSample}>
            Use Sample Text
          </button>
          <button className="ts-btn ts-btn-clear" onClick={handleClear} disabled={!text}>
            Clear
          </button>
          <button
            className="ts-btn ts-btn-scan"
            onClick={handleScan}
            disabled={!text.trim() || loading}
          >
            {loading ? 'Analysing…' : 'Scan for AI Content'}
          </button>
        </div>
      </section>

      {report && !report.error && (
        <section className="ts-report">
          {/* ── Overall verdict ── */}
          <div className="ts-verdict-card">
            <div className="ts-verdict-left">
              <VerdictBadge verdict={report.verdict} score={report.overallScore} />
              <div className="ts-overall-score">
                <span className="ts-score-number">{report.overallScore}</span>
                <span className="ts-score-unit">/ 100</span>
              </div>
              <p className="ts-confidence-note">{report.confidenceNote}</p>
            </div>
            <div className="ts-stats">
              <div className="ts-stat">
                <span className="ts-stat-value">{report.wordCount}</span>
                <span className="ts-stat-label">Words</span>
              </div>
              <div className="ts-stat">
                <span className="ts-stat-value">{report.sentenceCount}</span>
                <span className="ts-stat-label">Sentences</span>
              </div>
            </div>
          </div>

          {/* ── Individual checks ── */}
          <h2 className="ts-section-title">Detailed Signal Analysis</h2>
          <div className="ts-checks-grid">
            {report.checks.map((check) => (
              <div key={check.id} className="ts-check-card">
                <div className="ts-check-header">
                  <span className="ts-check-label">{check.label}</span>
                </div>
                <ScoreBar score={check.score} />
                <p className="ts-check-detail">{check.detail}</p>
              </div>
            ))}
          </div>

          {/* ── Limitations ── */}
          <div className="ts-limitations">
            <h3>⚠ Limitations &amp; Confidence Notes</h3>
            <ul>
              {report.limitations.map((lim, i) => (
                <li key={i}>{lim}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {report && report.error && (
        <p className="ts-error">{report.error}</p>
      )}
    </div>
  );
};

export default TextScanner;
