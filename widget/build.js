const esbuild = require('esbuild');
const path = require('path');

const isWatch = process.argv.includes('--watch');

async function build() {
  const ctx = await esbuild.context({
    entryPoints: [path.join(__dirname, 'src/index.ts')],
    bundle: true,
    minify: !isWatch,
    sourcemap: isWatch ? 'inline' : false,
    target: ['es2018'],
    format: 'iife',
    outfile: path.join(__dirname, 'dist/widget.js'),
    define: {
      'process.env.NODE_ENV': isWatch ? '"development"' : '"production"',
    },
    banner: {
      js: '/* AutoCrew Chat Widget v1.0.0 - https://autocrew.ai */',
    },
  });

  if (isWatch) {
    await ctx.watch();
    console.log('Watching for changes...');
  } else {
    await ctx.rebuild();
    await ctx.dispose();
    const fs = require('fs');
    const stats = fs.statSync(path.join(__dirname, 'dist/widget.js'));
    console.log(`Build complete: dist/widget.js (${(stats.size / 1024).toFixed(2)} KB)`);
  }
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
