const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [192, 512];
const inputFile = path.join(__dirname, '../public/logo.png');
const outputDir = path.join(__dirname, '../public');

// Check if input file exists
if (!fs.existsSync(inputFile)) {
  console.log('Please place a logo.png file in the public directory first!');
  process.exit(1);
}

// Generate icons
sizes.forEach(size => {
  sharp(inputFile)
    .resize(size, size)
    .png()
    .toFile(path.join(outputDir, `logo${size}.png`))
    .then(() => console.log(`Generated logo${size}.png`))
    .catch(err => console.error(`Error generating logo${size}.png:`, err));
});
