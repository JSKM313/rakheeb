// Builds the www/ folder: app page + bundled native bridge + offline fonts.
const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

const root = path.join(__dirname, '..');
const www = path.join(root, 'www');
fs.rmSync(www, { recursive: true, force: true });
fs.mkdirSync(path.join(www, 'fonts'), { recursive: true });

// 1. native bridge
esbuild.buildSync({
  entryPoints: [path.join(root, 'src/native.js')],
  bundle: true, format: 'iife', minify: true, target: 'es2019',
  outfile: path.join(www, 'native.js'),
});

// 2. offline fonts (so the app looks right with no internet)
const faces = [
  ['inter', 'Inter', [300, 400, 500, 600]],
  ['amiri', 'Amiri', [400, 700]],
];
let css = '';
for (const [pkg, family, weights] of faces) {
  for (const w of weights) {
    for (const subset of ['latin', 'arabic']) {
      const file = `${pkg}-${subset}-${w}-normal.woff2`;
      const src = path.join(root, 'node_modules/@fontsource', pkg, 'files', file);
      if (!fs.existsSync(src)) continue;
      fs.copyFileSync(src, path.join(www, 'fonts', file));
      const range = subset === 'arabic' ? 'U+0600-06FF,U+0750-077F,U+08A0-08FF,U+FB50-FDFF,U+FE70-FEFF'
                                         : 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';
      css += `@font-face{font-family:'${family}';font-style:normal;font-weight:${w};font-display:swap;` +
             `src:url(fonts/${file}) format('woff2');unicode-range:${range}}\n`;
    }
  }
}
fs.writeFileSync(path.join(www, 'fonts.css'), css);

// 3. page: swap the Google Fonts link for the local one and load the native bridge
let html = fs.readFileSync(path.join(root, 'src/index.html'), 'utf8');
html = html.replace(/<link href="https:\/\/fonts\.googleapis\.com[^>]*>/, '<link rel="stylesheet" href="fonts.css">');
html = html.replace('<!--NATIVE_SCRIPT-->', '<script src="native.js"></script>');
fs.writeFileSync(path.join(www, 'index.html'), html);
console.log('www built:', fs.readdirSync(www).join(', '));
