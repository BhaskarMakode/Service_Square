const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, 'ServiceSq_backend-main', 'routes');
const files = fs.readdirSync(routesDir).filter(f => f.endsWith('.js'));

let markdown = '| Method | Route | Request Body | Response Body | Auth Required | Role |\n|---|---|---|---|---|---|\n';

files.forEach(file => {
    const content = fs.readFileSync(path.join(routesDir, file), 'utf8');
    
    // Simplistic regex to match router methods
    const routeRegex = /router\.(get|post|put|delete|patch)\(\s*["']([^"']+)["']\s*(.*?)\)/g;
    let match;
    while ((match = routeRegex.exec(content)) !== null) {
        const method = match[1].toUpperCase();
        const routePath = match[2];
        const argsStr = match[3];
        
        let auth = 'No';
        let role = 'Any';
        if (argsStr.includes('protect') || argsStr.includes('optionalAuth')) {
            auth = argsStr.includes('optionalAuth') ? 'Optional' : 'Yes';
        }
        
        const roleMatch = argsStr.match(/authorizeRoles\(([^)]+)\)/);
        if (roleMatch) {
            role = roleMatch[1].replace(/["']/g, '');
        }
        
        // This is a simplistic parse since extracting exact bodies from Swagger docs is complex for a quick script
        // For Phase 1 we just list them. We can infer Request Body and Response from common REST patterns
        let reqBody = method === 'GET' || method === 'DELETE' ? 'None' : 'JSON Object';
        let resBody = 'JSON Response';

        markdown += `| ${method} | ${routePath} | ${reqBody} | ${resBody} | ${auth} | ${role} |\n`;
    }
});

fs.writeFileSync(path.join(__dirname, 'endpoints.md'), markdown);
console.log('Endpoints written to endpoints.md');
