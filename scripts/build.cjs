const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'public');
fs.mkdirSync(output, { recursive: true });
for (const file of ['index.html', 'style.css', 'script.js', 'catalog.js', 'assets', 'admin']) {
  fs.cpSync(path.join(root, file), path.join(output, file), { recursive: true });
}
fs.mkdirSync(path.join(output, 'admin', 'vendor'), { recursive: true });
fs.copyFileSync(path.join(root, 'node_modules/lucide/dist/umd/lucide.js'), path.join(output, 'admin/vendor/lucide.js'));
console.log('Static files prepared in public/. Backend stays outside the public directory.');
