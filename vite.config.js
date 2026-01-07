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
                verify: resolve(__dirname, "verify.html"),
                notfound: resolve(__dirname, "404.html"),
            },
        },
    },
    server: { open: true },
});
