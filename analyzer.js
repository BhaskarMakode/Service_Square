const fs = require('fs');
const path = require('path');

const frontendDir = 'c:/Users/makod/Desktop/Service_Square/booking-frontend/src';
const backendRoutesDir = 'c:/Users/makod/Desktop/Service_Square/ServiceSq_backend-main/routes';
const backendModelsDir = 'c:/Users/makod/Desktop/Service_Square/ServiceSq_backend-main/models';

function getFiles(dir, files = []) {
    if(!fs.existsSync(dir)) return files;
    const items = fs.readdirSync(dir);
    for (let item of items) {
        const fullPath = path.join(dir, item);
        if (fs.statSync(fullPath).isDirectory()) {
            getFiles(fullPath, files);
        } else {
            files.push(fullPath);
        }
    }
    return files;
}

const frontendFiles = getFiles(frontendDir).filter(f => f.endsWith('.jsx') || f.endsWith('.js'));
const apiCalls = [];

frontendFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const regex = /(?:fetch|axios(?:\.\w+)?)\(['"`](.*?)['"`]/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
        apiCalls.push({ file: path.basename(file), url: match[1] });
    }
});

const backendFiles = getFiles(backendRoutesDir);
const routes = [];

backendFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const regex = /router\.(get|post|put|delete|patch)\(['"`](.*?)['"`]/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
        routes.push({ file: path.basename(file), method: match[1].toUpperCase(), route: match[2] });
    }
});

console.log("=== FRONTEND API CALLS ===");
apiCalls.forEach(c => console.log(`${c.file}: ${c.url}`));

console.log("\n=== BACKEND ROUTES ===");
routes.forEach(r => console.log(`${r.file}: ${r.method} ${r.route}`));
