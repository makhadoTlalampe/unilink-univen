# AI-Generated Content Analysis Report

**Requested by:** User via Copilot chat  
**Date:** 2026-04-14  
**Feature:** Text Scanning for AI-Generated Content  

---

## Analysed Text

> In general, qualitative research generates rich, detailed and valid
> (process) data that contribute to in-depth understanding of the context.
> Quantitative research generates reliable population based and
> generalizable data and is well suited to establishing cause-and-effect
> relationships. The decision of whether to choose a quantitative or a
> qualitative design is a philosophical question. Which methods to choose
> will depend on the nature of the project, the type of information needed
> the context of the study and the availability of recourses (time, money,
> and human).

---

## Findings

### Signs Typical of AI Generation

| Indicator | Observed | Notes |
|-----------|----------|-------|
| Parallel / formulaic structure | ✅ Yes | Both research types introduced with identical sentence templates |
| Formal, textbook-style language | ✅ Yes | Neutral, academic register throughout |
| Uniform sentence length / low burstiness | ✅ Yes | All sentences are of similar length and complexity |
| Predictable collocations | ✅ Yes | e.g. "rich, detailed and valid data", "cause-and-effect relationships" |
| Balanced contrast pattern | ✅ Yes | Classic QL vs QN comparison structure |
| Human spelling error ("recourses" → "resources") | ❌ No | Typo strongly suggests human authorship or human editing |
| Missing conjunction ("information needed the context") | ❌ No | Awkward phrasing — uncommon in raw AI output |

### Overall Assessment

**Verdict: LOW-TO-MODERATE probability of being purely AI-generated.**

The passage exhibits several stylistic features commonly found in AI-generated academic text: a highly parallel structure, generic textbook language, and uniform sentence rhythm. However, two notable irregularities point strongly toward human authorship or human editing:

1. **Spelling error** — "recourses" is used instead of "resources". Current large-language models rarely produce this kind of typo in standalone generation.  
2. **Missing conjunction** — "the type of information needed the context of the study" is syntactically incomplete; it appears a comma or the word "and" was dropped, which is more characteristic of copy-pasting from a source document than of AI generation.

The most likely explanation is that this text was either:
- Copied (verbatim or near-verbatim) from a research methodology textbook or lecture notes, **or**
- AI-generated and subsequently lightly edited by a human (who introduced the errors).

---

## Key Characteristics Found

1. **Structure**: Four sentences arranged as: general statement about QL research → general statement about QN research → philosophical framing → decision factors.  
2. **Register**: Formal academic English; passive and impersonal constructions.  
3. **Vocabulary density**: Moderate; domain-specific terms (qualitative, quantitative, generalizable, cause-and-effect) are standard textbook vocabulary.  
4. **Sentence burstiness score (manual estimate)**: Low — sentences range from approximately 20–30 words each with very similar syntactic depth.  
5. **Perplexity (manual estimate)**: Low-to-medium — the text is highly predictable given its topic.

---

## Confidence & Limitations

- **Confidence level**: Medium (heuristic, manual analysis — no external API was used).  
- **Limitations**:  
  - No statistical perplexity or burstiness computation was applied (would require an LLM or dedicated service such as GPTZero or Originality.ai).  
  - Short texts (< 250 words) are inherently harder to classify; longer samples produce more reliable results.  
  - The same text could appear in widely-used textbooks, which would also cause any plagiarism-detection tool to flag it.

---

## Actionable Insights

1. **For academic integrity purposes**: Run this text through an authoritative detector (e.g. GPTZero, Originality.ai, or Turnitin's AI writing detection) for a statistically-grounded score before drawing conclusions.  
2. **For the unilink-univen project**: The newly implemented `/text-scanner` feature (see `src/features/TextScanner.js`) enables students and staff to paste any text and receive an instant heuristic assessment with the same criteria used above.  
3. **Recommendation for the author**: If this text is intended for submission, verify the original source and either cite it correctly or paraphrase sufficiently to avoid unintentional academic dishonesty regardless of whether it is human-written or AI-generated.

---

## Related Tasks / PRs

| Task | Status |
|------|--------|
| Implement strategy to humanize text outputs | Completed (see prior PR) |
| Investigate and implement user-supplied text scanning for plagiarism | Addressed in this PR |
| Summarize Copilot agent objectives | Addressed in this PR |
| **Analyse text for signs of AI-generated content** | ✅ **This document** |
