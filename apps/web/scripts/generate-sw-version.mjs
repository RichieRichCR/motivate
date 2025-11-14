#!/usr/bin/env node
/**
 * Generate service worker version from git commit hash
 * This runs during the build process to inject the current version
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getGitCommitHash() {
  try {
    // Get short commit hash (7 characters)
    const hash = execSync('git rev-parse --short HEAD', {
      encoding: 'utf8',
    }).trim();
    return hash;
  } catch {
    console.warn('Warning: Could not get git commit hash, using timestamp');
    // Fallback to timestamp if git is not available
    return Date.now().toString(36);
  }
}

function getGitCommitDate() {
  try {
    const date = execSync('git log -1 --format=%cd --date=iso', {
      encoding: 'utf8',
    }).trim();
    return date;
  } catch {
    return new Date().toISOString();
  }
}

function generateServiceWorker() {
  const version = getGitCommitHash();
  const buildDate = getGitCommitDate();
  const timestamp = Date.now();

  // Read the template service worker
  const templatePath = path.join(__dirname, '..', 'src', 'sw-template.js');
  const outputPath = path.join(__dirname, '..', 'public', 'sw.js');

  let template = fs.readFileSync(templatePath, 'utf8');

  // Replace placeholders
  template = template.replace('__SW_VERSION__', version);
  template = template.replace('__BUILD_DATE__', buildDate);
  template = template.replace('__BUILD_TIMESTAMP__', timestamp.toString());

  // Write the generated service worker
  fs.writeFileSync(outputPath, template, 'utf8');

  console.log(`✅ Service worker generated with version: ${version}`);
  console.log(`   Build date: ${buildDate}`);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateServiceWorker();
}

export { generateServiceWorker, getGitCommitHash };
