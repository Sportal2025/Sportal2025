import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = 'https://www.sportalcorporate.org';
const DIST_DIR = path.resolve(__dirname, '../dist');
const SOURCE_DIR = path.resolve(__dirname, '../'); // Fallback if dist doesn't exist yet

// Priority Mapping
const priorities = {
    'index.html': '1.0',
    'courses.html': '0.9',
    'partners.html': '0.8',
    'quiz.html': '0.8',
    'blog.html': '0.8',
    'course_gen_ai.html': '0.9',
    'roadmap.html': '0.7',
    'founder.html': '0.7',
    'verify.html': '0.6',
    'legal.html': '0.5',
    '404.html': '0.0'
};

function getFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        let stat;
        try {
            stat = fs.statSync(filePath);
        } catch (e) {
            return; // Skip invalid links or permission errors
        }
        if (stat.isDirectory()) {
            if (file !== 'node_modules' && file !== '.git' && file !== 'dist' && file !== 'src' && file !== 'public' && file !== 'scripts') {
                getFiles(filePath, fileList);
            }
        } else {
            if (file.endsWith('.html')) {
                fileList.push(filePath);
            }
        }
    });
    return fileList;
}

// Ensure dist or source check
const targetDir = fs.existsSync(DIST_DIR) ? DIST_DIR : SOURCE_DIR;
console.log(`Scanning directory: ${targetDir}`);

const htmlFiles = getFiles(targetDir);
const today = new Date().toISOString().split('T')[0];

let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

htmlFiles.forEach(filePath => {
    let relativePath = path.relative(targetDir, filePath);

    // Normalize path (remove index.html for root, handle windows \ to /)
    relativePath = relativePath.split(path.sep).join('/');

    if (relativePath === '404.html') return; // Skip 404

    let urlPath = relativePath;
    if (urlPath === 'index.html') {
        urlPath = '';
    }

    const priority = priorities[relativePath] || (relativePath.startsWith('blog/') ? '0.8' : '0.6');

    sitemap += `  <url>
    <loc>${DOMAIN}/${urlPath}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>
`;
});

sitemap += `</urlset>`;

const outputPath = path.resolve(__dirname, '../public/sitemap.xml');
fs.writeFileSync(outputPath, sitemap);
console.log(`✅ Sitemap generated at: ${outputPath}`);
