#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

async function generateReadmeFromClaude() {
  try {
    // Read CLAUDE.md
    const claudeContent = await fs.readFile('./CLAUDE.md', 'utf8');
    
    // Generate README.md from CLAUDE.md content
    const readmeContent = `# ${extractProjectTitle(claudeContent)}

${extractProjectDescription(claudeContent)}

## 🚀 Quick Start

${extractQuickStartSection(claudeContent)}

## 📖 Documentation

For detailed information, see [CLAUDE.md](./CLAUDE.md)

---

*README generated automatically from CLAUDE.md*
`;

    // Write README.md
    await fs.writeFile('./README.md', readmeContent);
    console.log('✅ README.md generated from CLAUDE.md');
    
  } catch (error) {
    console.error('❌ Error generating README:', error.message);
  }
}

function extractProjectTitle(content) {
  const titleMatch = content.match(/^#\s+(.+)/m);
  return titleMatch ? titleMatch[1] : 'Project Documentation';
}

function extractProjectDescription(content) {
  const lines = content.split('\n');
  let description = '';
  let capturing = false;
  
  for (const line of lines) {
    if (line.startsWith('# ')) {
      capturing = true;
      continue;
    }
    if (line.startsWith('## ') && capturing) {
      break;
    }
    if (capturing && line.trim()) {
      description += line + '\n';
    }
  }
  
  return description.trim() || 'Un proyecto educativo con Claude Code.';
}

function extractQuickStartSection(content) {
  const quickStartMatch = content.match(/## 🚀[^#]*?```bash\n([\s\S]*?)```/);
  if (quickStartMatch) {
    return '```bash\n' + quickStartMatch[1] + '```';
  }
  return '```bash\nnode simple-doc-generator.js\n```';
}

// Execute if called directly
if (require.main === module) {
  generateReadmeFromClaude();
}

module.exports = { generateReadmeFromClaude };