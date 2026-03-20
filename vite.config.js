import { defineConfig } from "vite";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
    root: "./",
    publicDir: "public",
    build: {
        outDir: "dist",
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                founder: resolve(__dirname, "founder.html"),
                partners: resolve(__dirname, "partners.html"),
                courses: resolve(__dirname, "courses.html"),
                quiz: resolve(__dirname, "quiz.html"),
                gallery: resolve(__dirname, "gallery.html"),
                blog: resolve(__dirname, "blog.html"),
                legal: resolve(__dirname, "legal.html"),
                verify: resolve(__dirname, "verify.html"),
                roadmap: resolve(__dirname, "roadmap.html"),
                ams_kit: resolve(__dirname, "active-mind-sports-kit.html"),
                notfound: resolve(__dirname, "404.html"),

                // Blog Articles
                article_ai: resolve(__dirname, "blog/ai-in-sports-coaching.html"),
                article_nep: resolve(__dirname, "blog/nep-2020-physical-education.html"),
                article_career: resolve(__dirname, "blog/careers-in-sports-management.html"),
                article_women: resolve(__dirname, "blog/women-in-sports-management.html"),
                article_trips: resolve(__dirname, "blog/experiential-learning-trips.html"),
                article_mental: resolve(__dirname, "blog/student-athlete-mental-health.html"),
                article_esports: resolve(__dirname, "blog/esports-in-schools.html"),
                article_green: resolve(__dirname, "blog/green-stadiums.html"),
                article_nutrition: resolve(__dirname, "blog/sports-nutrition-myths.html"),
                article_law: resolve(__dirname, "blog/sports-law-careers.html"),
                article_vr: resolve(__dirname, "blog/vr-in-sports-recovery.html"),
                article_analytics: resolve(__dirname, "blog/grassroots-analytics.html"),

                // New High-Ranking Blogs
                article_gen_ai: resolve(__dirname, "blog/generative-ai-in-sports.html"),
                article_courses_12th: resolve(__dirname, "blog/best-courses-after-12th.html"),
            },
        },
    },
    server: { open: true },
});
