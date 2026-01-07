import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the mockData.js file
const filePath = path.join(__dirname, '../src/data/mockData.js');
let content = fs.readFileSync(filePath, 'utf8');

// Department assignments
const departments = {
    '1': 'Administration',
    '2': 'Security',
    '3': 'Visitor',
    '4': 'Visitor',
    '5': 'Maintenance',
    '6': 'Visitor',
    '7': 'Visitor',
    '8': 'Customer Service',
    '9': 'Visitor',
    '10': 'Visitor',
    '11': 'Operations',
    '12': 'Visitor',
    '13': 'Visitor',
    '14': 'Administration',
    '15': 'Visitor'
};

// For each vehicle, add department field before the closing brace
Object.keys(departments).forEach(id => {
    const dept = departments[id];

    // Find the vehicle object by id
    const regex = new RegExp(`(\\{[^}]*id:\\s*'${id}'[^}]*)(\\s*\\})`, 's');

    content = content.replace(regex, (match, vehicleContent, closingBrace) => {
        // Check if department already exists
        if (vehicleContent.includes('department:')) {
            return match;
        }
        // Add department before closing brace
        return vehicleContent + `,\n    department: '${dept}'` + closingBrace;
    });
});

// Write back to file
fs.writeFileSync(filePath, content, 'utf8');
console.log('Department fields added successfully!');
