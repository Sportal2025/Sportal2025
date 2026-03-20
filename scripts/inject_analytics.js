const fs = require('fs');
const path = require('path');
const glob = require('glob');

const gaTag = `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-HBYEBP1SGC"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-HBYEBP1SGC');
</script>`;

const rootDir = path.resolve(__dirname, '..');

// Find all HTML files in root and blog/, excluding dist and node_modules
glob("**/*.html", { cwd: rootDir, ignore: ["dist/**", "node_modules/**"] }, (err, files) => {
    if (err) {
        console.error("Error finding files:", err);
        return;
    }

    files.forEach(file => {
        const filePath = path.join(rootDir, file);
        let content = fs.readFileSync(filePath, 'utf8');

        if (content.includes("googletagmanager.com/gtag/js")) {
            console.log(`Skipping ${file} - GA already present.`);
            return;
        }

        // Insert after <head>
        if (content.includes("<head>")) {
            content = content.replace("<head>", `<head>\n    ${gaTag}`);
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Injected GA into ${file}`);
        } else {
            console.warn(`Warning: No <head> tag found in ${file}`);
        }
    });
});
