
export const CAREER_CATEGORIES = {
    ATH: { title: "Playing & Competition (Athlete Career)" },
    COA: { title: "Coaching & Athlete Development" },
    SCI: { title: "Sports Science & Health" },
    MGT: { title: "Sports Management & Business" },
    ANA: { title: "Sports Analytics & Technology" },
    FIT: { title: "Fitness, Wellness & Yoga" },
    MED: { title: "Sports Media & Content" },
    EDU: { title: "Education, Research & Policy" },
    ENT: { title: "Sports Entrepreneurship" },
    PSY: { title: "Sports Psychology" },
    OFF: { title: "Officiating & Refereeing" }
};

/**
 * Scoring rule format:
 *  - scores: array of { key: "ATH", pts: 2 }
 *  - You can put multiple keys per option (primary + secondary)
 */
export const QUIZ_CONFIG = {
    version: "1.0",
    questions: [
        {
            id: "q1",
            prompt: "What excites you MOST about sports?",
            options: [
                { id: "A", text: "Playing and competing", scores: [{ key: "ATH", pts: 2 }] },
                { id: "B", text: "Training and improving athletes", scores: [{ key: "COA", pts: 2 }, { key: "FIT", pts: 1 }] },
                { id: "C", text: "Understanding body, injuries, or recovery", scores: [{ key: "SCI", pts: 2 }] },
                { id: "D", text: "Managing teams, events, or organizations", scores: [{ key: "MGT", pts: 2 }] },
                { id: "E", text: "Working with data, performance metrics, or tech", scores: [{ key: "ANA", pts: 2 }] },
                { id: "F", text: "Teaching, research, or policy-making", scores: [{ key: "EDU", pts: 2 }] },
                { id: "G", text: "Storytelling, commentary, or content creation", scores: [{ key: "MED", pts: 2 }] },
                { id: "H", text: "Building a sports-related business or startup", scores: [{ key: "ENT", pts: 2 }, { key: "MGT", pts: 1 }] },
                { id: "I", text: "Helping athletes mentally and emotionally", scores: [{ key: "PSY", pts: 2 }] },
                { id: "J", text: "Enforcing rules and officiating matches", scores: [{ key: "OFF", pts: 2 }] }
            ]
        },
        {
            id: "q2",
            prompt: "How do you want to contribute in sports?",
            options: [
                { id: "A", text: "On the field/court", scores: [{ key: "ATH", pts: 2 }] },
                { id: "B", text: "On the sidelines (coach/support staff)", scores: [{ key: "COA", pts: 2 }, { key: "SCI", pts: 1 }] },
                { id: "C", text: "Behind the scenes (analysis/admin/tech)", scores: [{ key: "ANA", pts: 2 }, { key: "MGT", pts: 1 }] },
                { id: "D", text: "In classrooms or research environments", scores: [{ key: "EDU", pts: 2 }, { key: "SCI", pts: 1 }] },
                { id: "E", text: "As a decision-maker or founder", scores: [{ key: "ENT", pts: 2 }, { key: "MGT", pts: 1 }] }
            ]
        },
        {
            id: "q3",
            prompt: "What is your current education level?",
            options: [
                { id: "A", text: "Class 10 / 12", scores: [{ key: "ATH", pts: 1 }, { key: "COA", pts: 1 }] },
                { id: "B", text: "Undergraduate (ongoing/completed)", scores: [{ key: "COA", pts: 1 }, { key: "MGT", pts: 1 }] },
                { id: "C", text: "Master’s degree", scores: [{ key: "SCI", pts: 1 }, { key: "EDU", pts: 1 }] },
                { id: "D", text: "Already working professional", scores: [{ key: "ENT", pts: 1 }, { key: "MGT", pts: 1 }] }
            ]
        },
        {
            id: "q4",
            prompt: "Which subjects are you naturally good at?",
            options: [
                { id: "A", text: "Physical performance & movement", scores: [{ key: "ATH", pts: 2 }, { key: "FIT", pts: 1 }] },
                { id: "B", text: "Biology / human science", scores: [{ key: "SCI", pts: 2 }] },
                { id: "C", text: "Psychology & behavior", scores: [{ key: "PSY", pts: 2 }] },
                { id: "D", text: "Mathematics / statistics", scores: [{ key: "ANA", pts: 2 }] },
                { id: "E", text: "Communication & writing", scores: [{ key: "MED", pts: 2 }, { key: "EDU", pts: 1 }] },
                { id: "F", text: "Business, finance, operations", scores: [{ key: "MGT", pts: 2 }, { key: "ENT", pts: 1 }] },
                { id: "G", text: "Technology / software tools", scores: [{ key: "ANA", pts: 2 }, { key: "ENT", pts: 1 }] }
            ]
        },
        {
            id: "q5",
            prompt: "How important is physical performance in your career?",
            options: [
                { id: "A", text: "Central – I want to perform/train physically", scores: [{ key: "ATH", pts: 2 }, { key: "FIT", pts: 1 }] },
                { id: "B", text: "Important but supportive", scores: [{ key: "COA", pts: 2 }, { key: "SCI", pts: 1 }] },
                { id: "C", text: "Not important at all", scores: [{ key: "ANA", pts: 2 }, { key: "MGT", pts: 1 }] }
            ]
        },
        {
            id: "q6",
            prompt: "What work environment do you prefer?",
            options: [
                { id: "A", text: "Field / ground / gym", scores: [{ key: "ATH", pts: 2 }, { key: "COA", pts: 1 }, { key: "FIT", pts: 1 }] },
                { id: "B", text: "Lab / clinic", scores: [{ key: "SCI", pts: 2 }, { key: "PSY", pts: 1 }] },
                { id: "C", text: "Office / boardroom", scores: [{ key: "MGT", pts: 2 }, { key: "ENT", pts: 1 }] },
                { id: "D", text: "Classroom / academic setting", scores: [{ key: "EDU", pts: 2 }] },
                { id: "E", text: "Hybrid / remote / digital", scores: [{ key: "ANA", pts: 2 }, { key: "MED", pts: 1 }] }
            ]
        },
        {
            id: "q7",
            prompt: "How do you feel about long-term education?",
            options: [
                { id: "A", text: "I want deep specialization (Master’s/PhD)", scores: [{ key: "SCI", pts: 2 }, { key: "EDU", pts: 2 }, { key: "PSY", pts: 1 }] },
                { id: "B", text: "Prefer certifications & practical learning", scores: [{ key: "COA", pts: 2 }, { key: "FIT", pts: 2 }] },
                { id: "C", text: "Combine work + learning", scores: [{ key: "MGT", pts: 2 }, { key: "ANA", pts: 1 }] },
                { id: "D", text: "Avoid long academic routes", scores: [{ key: "ENT", pts: 2 }, { key: "MED", pts: 1 }] }
            ]
        },
        {
            id: "q8",
            prompt: "What level of career risk are you comfortable with?",
            options: [
                { id: "A", text: "High risk, high reward", scores: [{ key: "ATH", pts: 2 }, { key: "ENT", pts: 2 }] },
                { id: "B", text: "Moderate risk with growth", scores: [{ key: "COA", pts: 2 }, { key: "MGT", pts: 1 }] },
                { id: "C", text: "Low risk, stable path", scores: [{ key: "EDU", pts: 2 }, { key: "OFF", pts: 2 }] }
            ]
        },
        {
            id: "q9",
            prompt: "Do you prefer working with people or systems?",
            options: [
                { id: "A", text: "People (athletes, students, teams)", scores: [{ key: "COA", pts: 2 }, { key: "PSY", pts: 2 }, { key: "EDU", pts: 1 }] },
                { id: "B", text: "Systems (data, processes, tech)", scores: [{ key: "ANA", pts: 2 }, { key: "MGT", pts: 1 }] },
                { id: "C", text: "A balance of both", scores: [{ key: "ENT", pts: 2 }, { key: "COA", pts: 1 }] }
            ]
        },
        {
            id: "q10",
            prompt: "What does “success” mean to you in sports?",
            options: [
                { id: "A", text: "Recognition & performance results", scores: [{ key: "ATH", pts: 2 }, { key: "MED", pts: 1 }] },
                { id: "B", text: "Helping others improve", scores: [{ key: "COA", pts: 2 }, { key: "PSY", pts: 1 }] },
                { id: "C", text: "Stable income & growth", scores: [{ key: "MGT", pts: 2 }, { key: "EDU", pts: 1 }] },
                { id: "D", text: "Leadership & influence", scores: [{ key: "ENT", pts: 2 }, { key: "MGT", pts: 1 }] },
                { id: "E", text: "Innovation & creation", scores: [{ key: "ANA", pts: 2 }, { key: "ENT", pts: 1 }] }
            ]
        }
    ]
};
