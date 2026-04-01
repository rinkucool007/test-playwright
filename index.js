#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import inquirer from 'inquirer';
import chalk from 'chalk';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import gradient from 'gradient-string';
import { createSpinner } from 'nanospinner';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sleep = (ms = 2000) => new Promise((resolve) => setTimeout(resolve, ms));

// Color theme - More vibrant and colorful
const playwrightGradient = gradient(['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']);
const titleGradient = gradient(['#667eea', '#764ba2', '#f093fb']);
const successGradient = gradient(['#0cebeb', '#20e3b2', '#29ffc6']);
const commandGradient = gradient(['#FFD93D', '#6BCB77', '#4D96FF']);
const errorColor = chalk.bold.red;
const successColor = chalk.bold.hex('#00D9FF');
const infoColor = chalk.hex('#A8E6CF');
const warningColor = chalk.hex('#FFD93D');
const accentColor = chalk.hex('#FF6B9D');

async function welcome() {
  console.clear();
  
  // Top border with corners
  console.log(chalk.dim('┏' + '━'.repeat(78) + '┓'));
  
  const msg = 'NRG\nUNIFIED\nPLAYWRIGHT';
  
  figlet(msg, { font: 'ANSI Shadow' }, (err, data) => {
    if (!err) {
      console.log(playwrightGradient.multiline(data));
    }
  });
  
  await sleep(800);
  
  // Animated subtitle
  const subtitle = chalkAnimation.rainbow('\n        🎭 E2E Testing Framework 🎭\n');
  await sleep(1200);
  subtitle.stop();
  
  console.log(titleGradient('        CLI Version 1.0.0\n'));
  
  // Description box
  console.log(chalk.dim('┣' + '━'.repeat(78) + '┫'));
  console.log(
    chalk.bold.white('  Welcome to ') + 
    playwrightGradient.multiline('NRG Unified Playwright') + 
    chalk.bold.white(' Setup!')
  );
  console.log('');
  console.log(infoColor('  ✨ Fast, reliable, and powerful end-to-end testing'));
  console.log(infoColor('  🎯 Multi-browser support (Chrome, Firefox, Safari)'));
  console.log(infoColor('  🚀 TypeScript & JavaScript ready'));
  console.log(infoColor('  📦 Pre-configured templates with best practices'));
  console.log('');
  console.log(chalk.dim('┗' + '━'.repeat(78) + '┛'));
  console.log('');
}

async function getProjectDetails() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: accentColor('📝 What is your project name?'),
      default: 'my-playwright-project',
      prefix: '  ',
      validate: (input) => {
        if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;
        return errorColor('Project name may only include letters, numbers, underscores and hashes.');
      },
    },
    {
      type: 'list',
      name: 'language',
      message: accentColor('🔧 Do you want to use TypeScript or JavaScript?'),
      prefix: '  ',
      choices: [
        {
          name: `${chalk.hex('#3178C6')('● TypeScript')} ${chalk.dim('(Recommended for type safety)')}`,
          value: 'typescript',
        },
        {
          name: `${chalk.hex('#F7DF1E')('● JavaScript')} ${chalk.dim('(Classic and flexible)')}`,
          value: 'javascript',
        },
      ],
      default: 'typescript',
    },
  ]);

  return answers;
}

async function copyTemplate(language, projectName) {
  const spinner = createSpinner(chalk.hex('#A8E6CF')('⚙️  Setting up your project...')).start();
  
  try {
    await sleep(500);
    
    const templateDir = path.join(__dirname, 'templates', language);
    const targetDir = path.join(process.cwd(), projectName);
    
    // Check if directory exists
    try {
      await fs.access(targetDir);
      spinner.error({ text: errorColor(`❌ Directory "${projectName}" already exists!`) });
      process.exit(1);
    } catch {
      // Directory doesn't exist, good to proceed
    }
    
    // Create project directory
    await fs.mkdir(targetDir, { recursive: true });
    
    // Copy template files
    await copyRecursive(templateDir, targetDir);
    
    spinner.success({ text: successGradient(`✨ Project files created successfully!`) });
    
    return targetDir;
  } catch (error) {
    spinner.error({ text: errorColor('❌ Failed to create project files') });
    console.error(error);
    process.exit(1);
  }
}

async function copyRecursive(src, dest) {
  const stats = await fs.stat(src);
  
  if (stats.isDirectory()) {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src);
    
    for (const entry of entries) {
      await copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    await fs.copyFile(src, dest);
  }
}

async function installDependencies(projectDir) {
  const spinner = createSpinner(chalk.hex('#FFD93D')('📦 Installing dependencies...')).start();
  
  try {
    await sleep(500);
    
    // Check if npm is available
    await execAsync('npm --version');
    
    // Install dependencies
    await execAsync('npm install', { cwd: projectDir });
    
    spinner.success({ text: successGradient('✅ Dependencies installed successfully!') });
  } catch (error) {
    spinner.error({ text: warningColor('⚠️  Failed to install dependencies automatically') });
    console.log(infoColor('\n💡 You can install them manually by running:'));
    console.log(chalk.bold.hex('#4ECDC4')(`  cd ${path.basename(projectDir)}`));
    console.log(chalk.bold.hex('#4ECDC4')('  npm install\n'));
  }
}

function displayNextSteps(projectName, language) {
  console.log('\n' + chalk.dim('┏' + '━'.repeat(78) + '┓') + '\n');
  
  const rainbow = chalkAnimation.karaoke(`
  🎉 SUCCESS! Your Playwright project is ready! 🎉
  `);
  
  setTimeout(() => {
    rainbow.stop();
    
    console.log(chalk.dim('┣' + '━'.repeat(78) + '┫\n'));
    
    console.log(successGradient.multiline('  ╔═══════════════════════════════════════════════════════════════════════════╗'));
    console.log(successGradient.multiline('  ║                        AVAILABLE COMMANDS                                 ║'));
    console.log(successGradient.multiline('  ╚═══════════════════════════════════════════════════════════════════════════╝'));
    
    console.log('');
    
    const commands = [
      {
        icon: '🧪',
        cmd: 'npx playwright test',
        desc: 'Runs the end-to-end tests',
        color: '#FF6B6B'
      },
      {
        icon: '🎨',
        cmd: 'npx playwright test --ui',
        desc: 'Starts the interactive UI mode',
        color: '#4ECDC4'
      },
      {
        icon: '🌐',
        cmd: 'npx playwright test --project=chromium',
        desc: 'Runs tests only on Desktop Chrome',
        color: '#45B7D1'
      },
      {
        icon: '📄',
        cmd: 'npx playwright test example',
        desc: 'Runs the tests in a specific file',
        color: '#96CEB4'
      },
      {
        icon: '🐛',
        cmd: 'npx playwright test --debug',
        desc: 'Runs the tests in debug mode',
        color: '#FFEAA7'
      },
      {
        icon: '⚡',
        cmd: 'npx playwright codegen',
        desc: 'Auto generate tests with Codegen',
        color: '#A8E6CF'
      },
    ];
    
    commands.forEach(({ icon, cmd, desc, color }) => {
      console.log(`  ${icon}  ${chalk.hex(color).bold(cmd)}`);
      console.log(`     ${chalk.dim('→')} ${chalk.hex('#B0B0B0')(desc)}`);
      console.log('');
    });
    
    console.log(chalk.dim('┣' + '━'.repeat(78) + '┫\n'));
    
    console.log(titleGradient.multiline('  💡 We suggest that you begin by typing:\n'));
    console.log(`     ${chalk.hex('#00D9FF')('❯')} ${commandGradient(`cd ${projectName}`)}`);
    console.log(`     ${chalk.hex('#00D9FF')('❯')} ${commandGradient('npx playwright test')}\n`);
    
    console.log(chalk.dim('┗' + '━'.repeat(78) + '┛'));
    
    // Final animated message
    const finalMsg = chalkAnimation.rainbow('\n          🎭  Happy Testing with Playwright!  🎭\n');
    setTimeout(() => {
      finalMsg.stop();
      console.log(playwrightGradient('          🎭  Happy Testing with Playwright!  🎭\n'));
    }, 2000);
    
  }, 1500);
}

async function main() {
  try {
    await welcome();
    
    const { projectName, language } = await getProjectDetails();
    
    console.log('\n');
    
    const projectDir = await copyTemplate(language, projectName);
    
    await installDependencies(projectDir);
    
    displayNextSteps(projectName, language);
    
  } catch (error) {
    if (error.isTtyError) {
      console.log(errorColor('Prompt couldn\'t be rendered in the current environment'));
    } else if (error.name === 'ExitPromptError') {
      console.log(warningColor('\n\nSetup cancelled by user.'));
      process.exit(0);
    } else {
      console.log(errorColor('An error occurred:'), error);
      process.exit(1);
    }
  }
}

main();
