const fs = require('fs');
const path = require('path');

const dir = __dirname;

const files = [
  'LOGO_no_background.svg',
  'LOGO_LUXURY_no_background.svg',
];

for (const file of files) {
  const filePath = path.join(dir, file);
  const svg = fs.readFileSync(filePath, 'utf8');

  // Extract viewBox
  const vbMatch = svg.match(/viewBox="([^"]+)"/);
  if (!vbMatch) {
    console.error(`No viewBox found in ${file}`);
    continue;
  }
  const [x, y, w, h] = vbMatch[1].split(/\s+/).map(Number);

  // Circle center and radius (inscribed in the smaller dimension)
  const cx = x + w / 2;
  const cy = y + h / 2;
  const r = Math.min(w, h) / 2;

  // Extract inner content (everything between <svg ...> and </svg>)
  const inner = svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');

  const roundSvg = `<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="${x} ${y} ${w} ${h}">
  <defs>
    <clipPath id="round-clip">
      <circle cx="${cx}" cy="${cy}" r="${r}"/>
    </clipPath>
  </defs>
  <g clip-path="url(#round-clip)">
    ${inner}
  </g>
</svg>`;

  const outName = file.replace('_no_background', '_round');
  const outPath = path.join(dir, outName);
  fs.writeFileSync(outPath, roundSvg, 'utf8');
  console.log(`Created ${outName}`);
}
