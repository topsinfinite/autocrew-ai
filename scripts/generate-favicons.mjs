import sharp from 'sharp';
import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const appDir = join(root, 'app');

// Primary teal #16A085 (from design)
const color = { r: 22, g: 160, b: 133 };

async function main() {
  const icon48 = await sharp({
    create: { width: 48, height: 48, channels: 3, background: color },
  })
    .png()
    .toBuffer();
  const apple180 = await sharp({
    create: { width: 180, height: 180, channels: 3, background: color },
  })
    .png()
    .toBuffer();

  writeFileSync(join(appDir, 'icon.png'), icon48);
  writeFileSync(join(appDir, 'apple-icon.png'), apple180);
  console.log('Created app/icon.png (48x48) and app/apple-icon.png (180x180)');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
