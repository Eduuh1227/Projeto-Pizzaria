const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'public');
fs.mkdirSync(output, { recursive: true });
for (const file of ['index.html', 'style.css', 'script.js', 'catalog.js', 'assets', 'admin']) {
  fs.cpSync(path.join(root, file), path.join(output, file), { recursive: true });
}
// Export only the four storefront icons, without loading the entire library in the browser.
const { Timer, CreditCard, ShoppingBag, Clock3 } = require('lucide');
const iconDirectory = path.join(output, 'assets', 'icons');
fs.mkdirSync(iconDirectory, { recursive: true });
fs.copyFileSync(path.join(root, 'node_modules/lucide/LICENSE'), path.join(iconDirectory, 'LICENSE.txt'));
for (const [name, nodes, color] of [
  ['delivery', Timer, '#fff7ec'],
  ['payment', CreditCard, '#a12325'],
  ['pickup', ShoppingBag, '#285442'],
  ['hours', Clock3, '#efcf88']
]) {
  const shapes = nodes.map(([tag, attributes]) => `<${tag} ${Object.entries(attributes).map(([key, value]) => `${key}="${value}"`).join(' ')} />`).join('');
  fs.writeFileSync(path.join(iconDirectory, `info-${name}.svg`), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${shapes}</svg>`);
}
fs.mkdirSync(path.join(output, 'admin', 'vendor'), { recursive: true });
fs.copyFileSync(path.join(root, 'node_modules/lucide/dist/umd/lucide.js'), path.join(output, 'admin/vendor/lucide.js'));
console.log('Static files prepared in public/. Backend stays outside the public directory.');
