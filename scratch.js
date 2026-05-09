const fs = require('fs');
const file = 'src/components/Ferramentas.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add gap-4 to the flex justify-between wrappers
content = content.replace(/className="flex justify-between /g, 'className="flex justify-between gap-4 ');

// Regex to swap span and Info
const regex = /(<span(?: className="[^"]*")?>\s*[^<]*\s*<\/span>)\s*(<Info\s*size=\{14\}\s*className="[^"]+"\s*\/>)/g;

content = content.replace(regex, (match, span, info) => {
    // Add flex-shrink-0 to Info
    const newInfo = info.replace('className="', 'className="flex-shrink-0 ');
    return newInfo + '\n                ' + span;
});

fs.writeFileSync(file, content);
console.log('Done!');
