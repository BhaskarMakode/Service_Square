const fs = require('fs');
const https = require('https');

const config = JSON.parse(fs.readFileSync('pages_config.json', 'utf8'));

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function htmlToJsx(html) {
  let bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let bodyContent = bodyMatch ? bodyMatch[1] : html;

  bodyContent = bodyContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  bodyContent = bodyContent.replace(/\bclass="/g, 'className="');
  bodyContent = bodyContent.replace(/\bfor="/g, 'htmlFor="');
  bodyContent = bodyContent.replace(/<(img|input|hr|br)([^>]*?)(?<!\/)>/g, '<$1$2 />');
  bodyContent = bodyContent.replace(/<!--([\s\S]*?)-->/g, '{/*$1*/}');

  bodyContent = bodyContent.replace(/style="[^"]*"/g, (match) => {
    if (match.includes('font-variation-settings')) {
      return "style={{ fontVariationSettings: \"'FILL' 1\" }}";
    }
    if (match.includes('width:')) {
      let w = match.match(/width:\s*([^;"]+)/);
      if (w) return `style={{ width: '${w[1]}' }}`;
    }
    return '';
  });

  bodyContent = bodyContent.replace(/stroke-width/g, 'strokeWidth');
  bodyContent = bodyContent.replace(/stroke-linecap/g, 'strokeLinecap');
  bodyContent = bodyContent.replace(/stroke-linejoin/g, 'strokeLinejoin');
  bodyContent = bodyContent.replace(/fill-rule/g, 'fillRule');
  bodyContent = bodyContent.replace(/clip-rule/g, 'clipRule');
  bodyContent = bodyContent.replace(/stroke-miterlimit/g, 'strokeMiterlimit');
  bodyContent = bodyContent.replace(/clip-path/g, 'clipPath');

  return bodyContent;
}

async function run() {
  for (const page of config) {
    console.log(`Fetching ${page.component}...`);
    try {
      const html = await fetchUrl(page.url);
      const jsxContent = htmlToJsx(html);
      
      const fileContent = `import React from 'react';\nimport { Link } from 'react-router-dom';\n\nexport default function ${page.component}() {\n  return (\n    <>\n      ${jsxContent}\n    </>\n  );\n}\n`;
      fs.writeFileSync(`src/pages/${page.component}.jsx`, fileContent);
      console.log(`Created src/pages/${page.component}.jsx`);
    } catch (e) {
      console.error(`Error processing ${page.component}:`, e);
    }
  }
}

run();
