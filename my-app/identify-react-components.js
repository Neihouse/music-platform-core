const fs = require('fs');
const path = require('path');

const directory = './my-app/components'; // Adjust the directory path to your components folder

const isReactComponent = (filePath) => {
    const content = fs.readFileSync(filePath, 'utf-8');
    return (
        content.includes('return') &&
        (content.includes('<') && content.includes('>')) && // JSX-like syntax
        content.match(/export\s+(const|function|default|class)/)
    );
};

const scanDirectory = (dir) => {
    fs.readdirSync(dir).forEach((file) => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            scanDirectory(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.jsx')) {
            if (isReactComponent(fullPath)) {
                console.log(`React Component: ${fullPath}`);
            } else {
                console.log(`Not a React Component: ${fullPath}`);
            }
        }
    });
};

scanDirectory(directory);
