
import { QUIZ_CONFIG, CAREER_CATEGORIES } from "./quizConfig.js";

/**
 * answers format:
 * {
 *   q1: "A",
 *   q2: "C",
 *   ...
 * }
 */
export function scoreQuiz(answers) {
    // init scores
    const scores = {};
    Object.keys(CAREER_CATEGORIES).forEach((k) => (scores[k] = 0));

    // apply scoring
    for (const q of QUIZ_CONFIG.questions) {
        const chosenOptionId = answers[q.id];
        if (!chosenOptionId) continue;

        const opt = q.options.find((o) => o.id === chosenOptionId);
        if (!opt) continue;

        for (const rule of opt.scores) {
            if (!scores.hasOwnProperty(rule.key)) scores[rule.key] = 0;
            scores[rule.key] += rule.pts;
        }
    }

    // rank results
    const ranked = Object.entries(scores)
        .sort((a, b) => b[1] - a[1])
        .map(([key, score]) => ({
            key,
            score,
            title: CAREER_CATEGORIES[key]?.title || key
        }));

    const primary = ranked[0] || { key: "general", score: 0, title: "General Sports Career Path" };
    const secondary = ranked[1] || null;

    return { scores, ranked, primary, secondary };
}

/**
 * Save result for rest of app (badge, roadmap, share)
 */
export function persistResult(resultObj) {
    const { primary, secondary } = resultObj;

    sessionStorage.setItem("sportal_match_key", primary.key);
    sessionStorage.setItem("sportal_last_match", primary.title);

    if (secondary) {
        sessionStorage.setItem("sportal_secondary_match_key", secondary.key);
    } else {
        sessionStorage.removeItem("sportal_secondary_match_key");
    }

    // Optional: persist full score table for report explanations
    sessionStorage.setItem("sportal_score_table", JSON.stringify(resultObj.ranked));
}

/**
 * Convenience: Validate answers
 */
export function validateAnswers(answers) {
    const missing = [];
    for (const q of QUIZ_CONFIG.questions) {
        if (!answers[q.id]) missing.push(q.id);
    }
    return { ok: missing.length === 0, missing };
}
