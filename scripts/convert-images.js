const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const PROJECT_ROOT = path.join(__dirname, '..');

// Image conversion configs
const conversions = [
  // Products
  {
    input: path.join(PROJECT_ROOT, 'products', 'sofa_negro.png'),
    output: path.join(PROJECT_ROOT, 'public', 'images', 'products', 'sofa-negro.webp'),
    maxWidth: 1200,
    quality: 80,
    maxSizeKB: 200
  },
  {
    input: path.join(PROJECT_ROOT, 'products', 'sofa_rosa.jpeg'),
    output: path.join(PROJECT_ROOT, 'public', 'images', 'products', 'sofa-rosa.webp'),
    maxWidth: 1200,
    quality: 80,
    maxSizeKB: 200
  },
  {
    input: path.join(PROJECT_ROOT, 'products', 'sofa_verde.jpeg'),
    output: path.join(PROJECT_ROOT, 'public', 'images', 'products', 'sofa-verde.webp'),
    maxWidth: 1200,
    quality: 80,
    maxSizeKB: 200
  },
  // Heritage
  {
    input: path.join(PROJECT_ROOT, 'heritage', 'colosseo_hero-artistic-sketch.png'),
    output: path.join(PROJECT_ROOT, 'public', 'images', 'heritage', 'colosseo-hero.webp'),
    maxWidth: 1920,
    quality: 80,
    maxSizeKB: 500
  },
  {
    input: path.join(PROJECT_ROOT, 'heritage', 'sofa_hero-artistic-sketch.jpg'),
    output: path.join(PROJECT_ROOT, 'public', 'images', 'heritage', 'sofa-hero.webp'),
    maxWidth: 1920,
    quality: 80,
    maxSizeKB: 500
  },
  // Lifestyle
  {
    input: path.join(PROJECT_ROOT, 'lifestyle', 'amor_sofa_negro.png'),
    output: path.join(PROJECT_ROOT, 'public', 'images', 'lifestyle', 'amor-sofa-negro.webp'),
    maxWidth: 1200,
    quality: 80,
    maxSizeKB: 200
  },
  {
    input: path.join(PROJECT_ROOT, 'lifestyle', 'duena_acariciando_perro_dormido_en_sofa_negro.png'),
    output: path.join(PROJECT_ROOT, 'public', 'images', 'lifestyle', 'duena-acariciando-perro.webp'),
    maxWidth: 1200,
    quality: 80,
    maxSizeKB: 200
  },
  {
    input: path.join(PROJECT_ROOT, 'lifestyle', 'duena_y_perro_mirandose_los_ojos.png'),
    output: path.join(PROJECT_ROOT, 'public', 'images', 'lifestyle', 'duena-perro-ojos.webp'),
    maxWidth: 1200,
    quality: 80,
    maxSizeKB: 200
  },
  {
    input: path.join(PROJECT_ROOT, 'lifestyle', 'mirada_de_amor_sofa_rosa.png'),
    output: path.join(PROJECT_ROOT, 'public', 'images', 'lifestyle', 'mirada-amor-rosa.webp'),
    maxWidth: 1200,
    quality: 80,
    maxSizeKB: 200
  },
  // Logo
  {
    input: path.join(PROJECT_ROOT, 'logo', 'LOGO_LUXURY.png'),
    output: path.join(PROJECT_ROOT, 'public', 'images', 'logo', 'logo-luxury.webp'),
    maxWidth: 800,
    quality: 90,
    maxSizeKB: 200
  },
  {
    input: path.join(PROJECT_ROOT, 'logo', 'MPV_logo_oro_no_background.png'),
    output: path.join(PROJECT_ROOT, 'public', 'images', 'logo', 'mpv-logo.webp'),
    maxWidth: 600,
    quality: 90,
    maxSizeKB: 150
  }
];

async function convertImage(config) {
  if (config.copyOnly) {
    fs.copyFileSync(config.input, config.output);
    console.log(`✓ Copied: ${path.basename(config.output)}`);
    return;
  }

  let quality = config.quality;

  // Try conversion with decreasing quality if needed
  for (let attempt = 0; attempt < 5; attempt++) {
    const buffer = await sharp(config.input)
      .resize(config.maxWidth, null, { withoutEnlargement: true })
      .webp({ quality })
      .toBuffer();

    const sizeKB = buffer.length / 1024;

    if (sizeKB <= config.maxSizeKB) {
      fs.writeFileSync(config.output, buffer);
      console.log(`✓ Converted: ${path.basename(config.output)} (${Math.round(sizeKB)}KB, quality: ${quality})`);
      return;
    }

    quality -= 10;
  }

  // Final attempt - write whatever we get
  const buffer = await sharp(config.input)
    .resize(config.maxWidth, null, { withoutEnlargement: true })
    .webp({ quality: 50 })
    .toBuffer();

  fs.writeFileSync(config.output, buffer);
  console.log(`⚠ Converted: ${path.basename(config.output)} (${Math.round(buffer.length / 1024)}KB, quality: 50 - exceeded target)`);
}

async function main() {
  console.log('Converting images to WebP...\n');

  for (const config of conversions) {
    try {
      await convertImage(config);
    } catch (error) {
      console.error(`✗ Failed: ${path.basename(config.input)} - ${error.message}`);
    }
  }

  console.log('\nDone!');
}

main();
