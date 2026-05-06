const fs = require('fs');
const path = require('path');

function walk(dir) {
  fs.readdirSync(dir).forEach(file => {
    const p = path.join(dir, file);
    if (fs.statSync(p).isDirectory()) {
      walk(p);
    } else if (p.endsWith('.tsx') || p.endsWith('.css')) {
      let content = fs.readFileSync(p, 'utf-8');
      content = content.replace(/tranzinc-/g, 'translate-');
      fs.writeFileSync(p, content);
    }
  });
}

walk('src');
console.log('done fixing tranzinc');
