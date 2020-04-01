#!/usr/bin/env node
// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: loopback4-example-shopping-monorepo
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

/**
 * **Experimental**
 *
 * This script generates Docker files for packages from a monorepo managed
 * by lerna. The image is built in two stages:
 *
 * 1. Create an image for the monorepo by copying the source code and running a build
 * 2. Copy individual packages to their own images
 */
'use strict';

const path = require('path');
const fs = require('fs-extra');
const Project = require('@lerna/project');

/**
 * Generate a file
 * @param - file File path
 * @param - content File content
 */
async function generateFile(
  file,
  content,
  options = {
    rootPath: process.cwd(),
    dryRun: process.argv.includes('--dry-run'),
  },
) {
  if (options.dryRun) {
    console.log('\n%s:', path.relative(options.rootPath, file));
    console.log('-----------------------------------------------------------');
    console.log(content);
    console.log('-----------------------------------------------------------');
    return;
  }
  await fs.outputFile(file, content, {encoding: 'utf-8', mode: options.mode});
}

/**
 * Generate Docker files for the monorepo
 * @param project - Lerna project
 */
async function generateDockerFiles(project = new Project(process.cwd())) {
  const packages = await project.getPackages();

  const rootPkg = require(path.join(project.rootPath, 'package.json'));
  const appName = rootPkg.name.replace(/[@\/]/g, '_');
  const appVersion = rootPkg.version;

  const outDir = path.join(project.rootPath, 'docker-build');
  const options = {
    rootPath: project.rootPath,
    dryRun: process.argv.includes('--dry-run'),
  };

  const rootDockerFile = path.join(outDir, 'Dockerfile');

  // Generate root-level Dockerfile
  await generateFile(
    rootDockerFile,
    `# Stage 1: build the monorepo
# Use the full image so that binary modules can be built
FROM node:12

# Set to a non-root built-in user \`node\`
USER node

# Create app directory (with user \`node\`)
RUN mkdir -p /home/node/app

WORKDIR /home/node/app

# Bundle app source code
COPY --chown=node . ./
RUN HUSKY_SKIP_INSTALL=1 npm ci && npm run build
`,
    options,
  );

  // Generate root-level .dockerignore
  await generateFile(
    `${rootDockerFile}.dockerignore`,
    `**/node_modules
npm-debug.log
**/dist
**/*.tsbuildinfo
`,
    options,
  );

  for (const p of packages) {
    const dir = path.relative(project.rootPath, p.location);
    const dockerFile = path.join(outDir, dir, 'Dockerfile');
    await generateFile(
      dockerFile,
      `# Stage 1: build the monorepo
ARG version=${appVersion}
FROM ${appName}:$\{version\} AS monorepo

# Stage 2: create the ${p.name} image
FROM node:12-slim

# Set to a non-root built-in user \`node\`
USER node

# Create app directory (with user \`node\`)
RUN mkdir -p /home/node/app

WORKDIR /home/node/app

# Bundle app source code
COPY --from=monorepo --chown=node /home/node/app/${dir} .

# Bind to all network interfaces so that it can be mapped to the host OS
ENV HOST=0.0.0.0 PORT=3001

EXPOSE $\{PORT\} 50051
CMD [ "node", "." ]
`,
      options,
    );
  }

  const buildCommands = [];
  for (const p of packages) {
    const dir = path.relative(project.rootPath, p.location);
    buildCommands.push(`docker build -t ${p.name}:${p.version} ${dir}`);
  }

  await generateFile(
    path.join(outDir, 'build-docker-images.sh'),
    `#!/bin/bash
export DOCKER_BUILDKIT=1
set -e
BASE_DIR=\`dirname "$0"\`
pushd $BASE_DIR 2>&1 1>/dev/null
docker build -t ${appName}:${appVersion} -f Dockerfile ${path.relative(
      outDir,
      project.rootPath,
    )}
${buildCommands.join('\n')}
popd
`,
    {...options, mode: 0o755},
  );
}

if (require.main === module) {
  generateDockerFiles().catch(err => {
    console.error(err);
    process.exit(1);
  });
}
