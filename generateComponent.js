import fs from 'fs';
import path from 'path';
import readline from 'readline';

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

rl.question('👉 Enter the component name: ', (componentName) => {
	if (!componentName) {
		console.error('❌ Component name cannot be empty.');
		rl.close();
		process.exit(1);
	}
	
	rl.question('👉 Is it a page (p) or a component (c) ? ', (answer) => {
		if (!answer || (answer !== "p" && answer !== "c")) {
			console.error("❌ Can only be 'p' or 'c'.");
			rl.close();
			process.exit(1);
		}
		
		// Sanitize and capitalize component name
		const sanitizedComponent = componentName.replace(/[^a-zA-Z0-9]/g, '');
		const componentCapitalized = sanitizedComponent.charAt(0).toUpperCase() + sanitizedComponent.slice(1);
		
		// Component content template
		const componentContent = `export default function ${componentCapitalized}() {
  return (
    <div>
      <h1>${componentCapitalized} Component</h1>
    </div>
  );
};
`;
		
		if (answer === "p") {
			// Directory and file paths
			const componentDir = path.join(process.cwd(), 'app', componentCapitalized);
			
			// Create directory and files
			fs.mkdirSync(componentDir, {recursive: true});
			fs.writeFileSync(path.join(componentDir, `page.tsx`), componentContent);
			
			console.log(`✅ Page "${componentCapitalized}" created successfully at ./app/${componentDir}/page.tsx`);
		} else {
			// Directory and file paths
			const componentDir = path.join(process.cwd(), 'components');
			
			// Create directory and files
			fs.mkdirSync(componentDir, {recursive: true});
			fs.writeFileSync(path.join(componentDir, `${componentCapitalized}.tsx`), componentContent);
			
			console.log(`✅ Component "${componentCapitalized}" created successfully at ${componentDir}`);
		}
		
		rl.close();
	});
});
