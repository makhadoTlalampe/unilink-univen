import React, { useState } from 'react';

// ---------------------------------------------------------------------------
// Heuristic helpers
// ---------------------------------------------------------------------------

const AI_MARKER_WORDS = [
  'delve', 'certainly', 'notably', 'it is worth noting', 'it\'s worth noting',
  'in general', 'furthermore', 'moreover', 'additionally', 'in conclusion',
  'to summarize', 'in summary', 'as a result', 'it is important to note',
  'comprehensive', 'robust', 'intricate', 'multifaceted', 'nuanced',
  'utilize', 'leverage', 'facilitate', 'endeavor', 'commence',
  'in-depth understanding', 'cause-and-effect', 'generalizable',
];

const TRANSITION_WORDS = [
  'however', 'therefore', 'furthermore', 'moreover', 'additionally',
  'consequently', 'nevertheless', 'nonetheless', 'subsequently',
  'alternatively', 'accordingly', 'specifically', 'particularly',
  'in contrast', 'on the other hand', 'in addition', 'as a result',
  'for example', 'for instance', 'in general',
];

// Splits text into sentences. Handles common abbreviations and ellipses
// on a best-effort basis; edge cases such as "Dr." or "3.14" may still
// cause occasional mis-splits, which is noted in the UI limitations.
function splitSentences(text) {
  // Temporarily mask common abbreviations to avoid false splits
  const masked = text
    .replace(/\b(Mr|Mrs|Ms|Dr|Prof|Sr|Jr|vs|etc|approx|Fig|vol|no)\./gi, '$1<DOT>')
    .replace(/\.{2,}/g, '<ELLIPSIS>');
  const raw = masked.match(/[^.!?]+[.!?]+/g) || [];
  return raw.map(s => s.replace(/<DOT>/g, '.').replace(/<ELLIPSIS>/g, '...'));
}

function getWords(text) {
  return text.toLowerCase().match(/\b[a-z']+\b/g) || [];
}

function countMatches(lowerText, phrases) {
  return phrases.reduce((acc, phrase) => {
    const regex = new RegExp(`\\b${phrase.replace(/[-']/g, '[\\-\']')}\\b`, 'gi');
    const matches = lowerText.match(regex);
    return acc + (matches ? matches.length : 0);
  }, 0);
}

function sentenceLengthUniformity(sentences) {
  if (sentences.length < 2) return 0;
  const lengths = sentences.map(s => s.trim().split(/\s+/).length);
  const mean = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const variance =
    lengths.reduce((sum, l) => sum + Math.pow(l - mean, 2), 0) / lengths.length;
  const stdDev = Math.sqrt(variance);
  // Low std-dev relative to mean → high uniformity → AI indicator
  const cv = mean > 0 ? stdDev / mean : 1;
  // Score 0-1: cv < 0.2 → high uniformity (AI-like), cv > 0.6 → varied (human)
  return Math.max(0, Math.min(1, 1 - cv / 0.6));
}

function passiveVoiceDensity(text) {
  const beVerbs = /\b(is|are|was|were|be|been|being)\b/gi;
  // Match "ed" words of 4+ characters to reduce false positives (excludes "red", "bed", etc.)
  const pastParticiples = /\b(?![a-z]{1,3}\b)[a-z]{4,}ed\b/gi;
  const sentences = splitSentences(text);
  if (!sentences.length) return 0;
  const passiveCount = sentences.filter(s => {
    const hasBe = beVerbs.test(s);
    beVerbs.lastIndex = 0;
    const hasPP = pastParticiples.test(s);
    pastParticiples.lastIndex = 0;
    return hasBe && hasPP;
  }).length;
  return passiveCount / sentences.length;
}

// Match common contractions (n't, 'm, 're, 've, 'll, 'd, 's used as verb)
// Excludes possessives like "John's" by requiring the preceding word to be a
// pronoun or auxiliary, or the suffix to be a known contraction pattern.
const CONTRACTION_PATTERN = /\b(?:I|you|he|she|it|we|they|that|there|here|who|what|would|could|should|is|are|was|were|have|had|did|do|does|will|can|might|must|need|ought|shall|let|ain)(?:'t|'m|'re|'ve|'ll|'d|'s)\b/gi;

function contractionDensity(text) {
  const contractions = text.match(CONTRACTION_PATTERN) || [];
  const words = getWords(text);
  return words.length > 0 ? contractions.length / words.length : 0;
}

// ---------------------------------------------------------------------------
// Main analysis function
// ---------------------------------------------------------------------------

function analyzeText(text) {
  if (!text || text.trim().length === 0) return null;

  const lowerText = text.toLowerCase();
  const sentences = splitSentences(text);
  const words = getWords(text);
  const wordCount = words.length;

  // 1. AI marker words
  const markerCount = countMatches(lowerText, AI_MARKER_WORDS);
  const markerDensity = wordCount > 0 ? markerCount / wordCount : 0;
  const markerScore = Math.min(1, markerDensity * 20); // 5 per 100 words → score 1

  // 2. Transition word density
  const transitionCount = countMatches(lowerText, TRANSITION_WORDS);
  const transitionDensity = sentences.length > 0 ? transitionCount / sentences.length : 0;
  const transitionScore = Math.min(1, transitionDensity); // 1+ per sentence → score 1

  // 3. Sentence length uniformity
  const uniformityScore = sentenceLengthUniformity(sentences);

  // 4. Passive voice
  const passiveScore = Math.min(1, passiveVoiceDensity(text) * 2); // 50% passive → score 1

  // 5. Absence of contractions (AI rarely uses contractions)
  const contractionScore = Math.max(0, 1 - contractionDensity(text) * 50);

  // 6. Formal vocabulary: long words
  const longWords = words.filter(w => w.length >= 8).length;
  const formalityScore = Math.min(1, wordCount > 0 ? (longWords / wordCount) * 4 : 0);

  // Overall weighted AI likelihood score
  const weights = {
    markerScore: 0.30,
    transitionScore: 0.15,
    uniformityScore: 0.15,
    passiveScore: 0.10,
    contractionScore: 0.15,
    formalityScore: 0.15,
  };

  const overallScore =
    markerScore * weights.markerScore +
    transitionScore * weights.transitionScore +
    uniformityScore * weights.uniformityScore +
    passiveScore * weights.passiveScore +
    contractionScore * weights.contractionScore +
    formalityScore * weights.formalityScore;

  // Collect found AI markers
  const foundMarkers = AI_MARKER_WORDS.filter(phrase => {
    const regex = new RegExp(`\\b${phrase.replace(/[-']/g, '[\\-\']')}\\b`, 'i');
    return regex.test(lowerText);
  });

  return {
    overallScore,
    scores: {
      markerScore,
      transitionScore,
      uniformityScore,
      passiveScore,
      contractionScore,
      formalityScore,
    },
    stats: {
      wordCount,
      sentenceCount: sentences.length,
      markerCount,
      transitionCount,
      foundMarkers,
    },
  };
}

// ---------------------------------------------------------------------------
// Rendering helpers
// ---------------------------------------------------------------------------

function scoreLabel(score) {
  if (score >= 0.75) return { label: 'High', color: '#d32f2f' };
  if (score >= 0.45) return { label: 'Medium', color: '#f57c00' };
  return { label: 'Low', color: '#388e3c' };
}

function ScoreBar({ value, color }) {
  return (
    <div style={{ background: '#e0e0e0', borderRadius: 4, height: 10, width: '100%', marginTop: 4 }}>
      <div
        style={{
          width: `${Math.round(value * 100)}%`,
          background: color,
          height: '100%',
          borderRadius: 4,
          transition: 'width 0.5s ease',
        }}
      />
    </div>
  );
}

function HeuristicRow({ label, score, description }) {
  const pct = Math.round(score * 100);
  const { color } = scoreLabel(score);
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
        <span style={{ fontWeight: 600 }}>{label}</span>
        <span style={{ color, fontWeight: 700 }}>{pct}%</span>
      </div>
      <ScoreBar value={score} color={color} />
      <p style={{ margin: '4px 0 0', fontSize: 12, color: '#666' }}>{description}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const TextScanner = () => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState(null);
  const [analyzed, setAnalyzed] = useState(false);

  const handleAnalyze = () => {
    const analysis = analyzeText(inputText);
    setResult(analysis);
    setAnalyzed(true);
  };

  const handleClear = () => {
    setInputText('');
    setResult(null);
    setAnalyzed(false);
  };

  const overall = result ? scoreLabel(result.overallScore) : null;

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '30px 20px', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
      <h1 style={{ color: '#333', marginBottom: 6 }}>AI Content Scanner</h1>
      <p style={{ color: '#666', marginBottom: 24, fontSize: 14 }}>
        Paste or type any text below to analyze it for characteristics commonly associated with
        AI-generated content. This tool uses heuristic indicators — results are indicative, not definitive.
      </p>

      <textarea
        value={inputText}
        onChange={e => setInputText(e.target.value)}
        placeholder="Paste your text here…"
        rows={8}
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: 8,
          border: '1px solid #ccc',
          fontSize: 14,
          resize: 'vertical',
          boxSizing: 'border-box',
          fontFamily: 'inherit',
        }}
      />

      <div style={{ marginTop: 12, display: 'flex', gap: 12 }}>
        <button
          onClick={handleAnalyze}
          disabled={!inputText.trim()}
          style={{
            padding: '10px 24px',
            background: inputText.trim() ? '#667eea' : '#bbb',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: inputText.trim() ? 'pointer' : 'not-allowed',
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          Analyze Text
        </button>
        {analyzed && (
          <button
            onClick={handleClear}
            style={{
              padding: '10px 24px',
              background: '#fff',
              color: '#667eea',
              border: '1px solid #667eea',
              borderRadius: 6,
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            Clear
          </button>
        )}
      </div>

      {analyzed && result && (
        <div style={{ marginTop: 32 }}>
          {/* Overall verdict */}
          <div
            style={{
              padding: '20px 24px',
              borderRadius: 10,
              background: overall.color + '18',
              border: `2px solid ${overall.color}`,
              marginBottom: 28,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div>
                <div style={{ fontSize: 13, color: '#555', marginBottom: 4 }}>Overall AI-generation likelihood</div>
                <div style={{ fontSize: 36, fontWeight: 800, color: overall.color }}>
                  {Math.round(result.overallScore * 100)}%
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: overall.color }}>{overall.label}</div>
              </div>
              <div style={{ flex: 1, fontSize: 13, color: '#555', lineHeight: 1.6 }}>
                {overall.label === 'High' && (
                  <>
                    <strong>High probability of AI-generated content.</strong> The text exhibits multiple strong
                    indicators including formal vocabulary, typical AI phrase patterns, and uniform sentence
                    structure typical of large language models.
                  </>
                )}
                {overall.label === 'Medium' && (
                  <>
                    <strong>Some AI-generation indicators detected.</strong> The text shows several characteristics
                    consistent with AI-assisted writing, but also contains traits that may be human-authored.
                    Further review is recommended.
                  </>
                )}
                {overall.label === 'Low' && (
                  <>
                    <strong>Few AI-generation indicators found.</strong> The text appears more consistent with
                    human writing. Note that skilled paraphrasing can reduce detection scores.
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div
            style={{
              display: 'flex',
              gap: 16,
              marginBottom: 28,
              flexWrap: 'wrap',
            }}
          >
            {[
              { label: 'Words', value: result.stats.wordCount },
              { label: 'Sentences', value: result.stats.sentenceCount },
              { label: 'AI Markers Found', value: result.stats.markerCount },
              { label: 'Transition Phrases', value: result.stats.transitionCount },
            ].map(stat => (
              <div
                key={stat.label}
                style={{
                  flex: '1 1 120px',
                  padding: '14px 18px',
                  background: '#f5f5f5',
                  borderRadius: 8,
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 26, fontWeight: 700, color: '#333' }}>{stat.value}</div>
                <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Heuristic breakdown */}
          <h2 style={{ fontSize: 18, color: '#333', marginBottom: 16 }}>Heuristic Breakdown</h2>
          <div
            style={{
              background: '#fafafa',
              border: '1px solid #eee',
              borderRadius: 10,
              padding: '20px 24px',
              marginBottom: 24,
            }}
          >
            <HeuristicRow
              label="AI Marker Words"
              score={result.scores.markerScore}
              description="Frequency of known AI-associated words and phrases (e.g. 'in general', 'furthermore', 'comprehensive')."
            />
            <HeuristicRow
              label="Transition Word Density"
              score={result.scores.transitionScore}
              description="Number of transition phrases per sentence. AI text tends to use transitions heavily for cohesion."
            />
            <HeuristicRow
              label="Sentence Length Uniformity"
              score={result.scores.uniformityScore}
              description="How uniform sentence lengths are. AI models tend to produce consistently-sized sentences."
            />
            <HeuristicRow
              label="Passive Voice Usage"
              score={result.scores.passiveScore}
              description="Proportion of sentences using passive constructions. Academic AI text often favors passive voice."
            />
            <HeuristicRow
              label="Absence of Contractions"
              score={result.scores.contractionScore}
              description="AI text rarely uses contractions (e.g. 'don't', 'it's'). High score means few contractions found."
            />
            <HeuristicRow
              label="Formal / Complex Vocabulary"
              score={result.scores.formalityScore}
              description="Proportion of long words (8+ characters). AI text frequently employs formal, complex vocabulary."
            />
          </div>

          {/* Found markers */}
          {result.stats.foundMarkers.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, color: '#333', marginBottom: 12 }}>Detected AI Marker Phrases</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {result.stats.foundMarkers.map(marker => (
                  <span
                    key={marker}
                    style={{
                      background: '#fff3e0',
                      border: '1px solid #ffb74d',
                      color: '#e65100',
                      borderRadius: 20,
                      padding: '4px 12px',
                      fontSize: 13,
                      fontWeight: 500,
                    }}
                  >
                    {marker}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Limitations notice */}
          <div
            style={{
              background: '#e3f2fd',
              border: '1px solid #90caf9',
              borderRadius: 8,
              padding: '14px 18px',
              fontSize: 13,
              color: '#1565c0',
              lineHeight: 1.6,
            }}
          >
            <strong>⚠ Limitations:</strong> This analysis relies on statistical heuristics and known phrase
            patterns. It does not access external AI-detection databases or proprietary models. Results should be
            treated as indicative guidance only and not used as definitive proof of AI generation. Skilled
            paraphrasing, mixed authorship, and domain-specific academic writing can all affect scores.
          </div>
        </div>
      )}

      {analyzed && !result && (
        <p style={{ color: '#c62828', marginTop: 16 }}>Please enter some text before analyzing.</p>
      )}
    </div>
  );
};

export default TextScanner;
