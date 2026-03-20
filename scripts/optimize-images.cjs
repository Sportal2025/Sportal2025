
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const dirs = ['public', 'public/gallery', 'public/images'];

async function processDirectory(dir) {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        if (file.match(/\.(jpg|jpeg|png)$/i)) {
            const inputPath = path.join(dir, file);
            const outputPath = path.join(dir, file.replace(/\.(jpg|jpeg|png)$/i, '.webp'));
            
            // Skip if webp already exists
            if (fs.existsSync(outputPath)) continue;

            try {
                await sharp(inputPath)
                    .webp({ quality: 80 })
                    .toFile(outputPath);
                console.log(`Converted: ${file} -> ${path.basename(outputPath)}`);
            } catch (err) {
                console.error(`Error converting ${file}:`, err);
            }
        }
    }
}

async function main() {
    console.log('Starting image optimization...');
    for (const dir of dirs) {
        await processDirectory(path.join(__dirname, '..', dir));
    }
    console.log('Image optimization complete.');
}

main();
