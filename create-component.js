#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  console.log('🚀 UI Lab Component Generator\n');

  // Get component name
  const componentName = await question('Component name (e.g., MyButton): ');
  if (!componentName) {
    console.error('❌ Component name is required');
    process.exit(1);
  }

  // Get category
  console.log('\nAvailable categories:');
  console.log('1. physical-controls - Components that mimic real-world physical interfaces');
  console.log('2. microinteractions - Small, delightful animated interactions');
  console.log('3. animated-components - Complex animated UI elements');
  const categoryChoice = await question('\nSelect category (1-3): ');

  const categories = ['physical-controls', 'microinteractions', 'animated-components'];
  const categoryIndex = parseInt(categoryChoice) - 1;

  if (categoryIndex < 0 || categoryIndex >= categories.length) {
    console.error('❌ Invalid category choice');
    process.exit(1);
  }

  const category = categories[categoryIndex];

  // Get description
  const description = await question('\nBrief description: ');
  if (!description) {
    console.error('❌ Description is required');
    process.exit(1);
  }

  // Get tags
  const tagsInput = await question('\nTags (comma-separated, e.g., button, sound, interactive): ');
  const tags = tagsInput.split(',').map(t => t.trim()).filter(t => t);

  // Ask if component has sound
  const hasSoundInput = await question('\nDoes it have sound? (y/n): ');
  const hasSound = hasSoundInput.toLowerCase() === 'y';

  // Ask if it should be featured
  const featuredInput = await question('\nShould it be featured? (y/n): ');
  const featured = featuredInput.toLowerCase() === 'y';

  rl.close();

  // Create component ID (kebab-case)
  const componentId = componentName.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');

  // Create folders
  const storiesFolder = path.join(process.cwd(), 'stories', componentName);

  if (fs.existsSync(storiesFolder)) {
    console.error(`❌ Component ${componentName} already exists`);
    process.exit(1);
  }

  fs.mkdirSync(storiesFolder, { recursive: true });

  // Generate component files
  const tsxContent = `'use client';
import styles from './${componentName}.module.css';

export interface ${componentName}Props {
  onChange?: (value: number) => void;
}

export const ${componentName} = ({ onChange }: ${componentName}Props) => {
  return (
    <div className={styles.wrapper}>
      {/* Component implementation */}
    </div>
  );
};
`;

  const cssContent = `.wrapper {
  /* Component styles */
}
`;

  const storiesContent = `import type { Meta, StoryObj } from '@storybook/react';
import { ${componentName} } from './${componentName}';

const meta: Meta<typeof ${componentName}> = {
  title: '${category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}/${componentName}',
  component: ${componentName},
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'changed' },
  },
};

export default meta;
type Story = StoryObj<typeof ${componentName}>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
`;

  const readmeContent = `# ${componentName}

${description}

## Usage

\`\`\`tsx
import { ${componentName} } from '@/stories/${componentName}/${componentName}';

export default function MyComponent() {
  return (
    <${componentName} onChange={(value) => console.log(value)} />
  );
}
\`\`\`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| onChange | \`(value: number) => void\` | - | Callback fired when value changes |

## Category

${category.replace('-', ' ')}

## Tags

${tags.join(', ')}

${hasSound ? '## Sound\n\nThis component includes sound effects.' : ''}
`;

  // Write component files
  fs.writeFileSync(path.join(storiesFolder, `${componentName}.tsx`), tsxContent);
  fs.writeFileSync(path.join(storiesFolder, `${componentName}.module.css`), cssContent);
  fs.writeFileSync(path.join(storiesFolder, `${componentName}.stories.ts`), storiesContent);
  fs.writeFileSync(path.join(storiesFolder, 'README.md'), readmeContent);

  console.log(`\n✅ Created component files in stories/${componentName}/`);

  // Update component registry
  const registryPath = path.join(process.cwd(), 'lib', 'components.ts');
  let registryContent = fs.readFileSync(registryPath, 'utf-8');

  const today = new Date().toISOString().split('T')[0];

  const newComponentEntry = `  {
    id: '${componentId}',
    name: '${componentName}',
    category: '${category}',
    tags: [${tags.map(t => `'${t}'`).join(', ')}],
    hasSound: ${hasSound},
    description: '${description}',
    component: lazy(() => import('@/stories/${componentName}/${componentName}').then(m => ({ default: m.${componentName} }))),
    createdDate: '${today}',
    featured: ${featured}
  },`;

  // Insert before the closing bracket of the COMPONENTS array
  registryContent = registryContent.replace(
    /export const COMPONENTS: ComponentMetadata\[\] = \[([\s\S]*?)\];/,
    (match, components) => {
      return `export const COMPONENTS: ComponentMetadata[] = [${components}
${newComponentEntry}
];`;
    }
  );

  fs.writeFileSync(registryPath, registryContent);

  console.log(`✅ Updated component registry`);
  console.log(`\n🎉 Component ${componentName} created successfully!\n`);
  console.log(`Next steps:`);
  console.log(`  1. Implement the component in stories/${componentName}/${componentName}.tsx`);
  console.log(`  2. Add styles in stories/${componentName}/${componentName}.module.css`);
  console.log(`  3. View in Storybook: npm run storybook`);
  console.log(`  4. View in app: npm run dev\n`);
}

main().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
