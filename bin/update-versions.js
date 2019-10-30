#!/usr/bin/env node
// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: loopback4-example-shopping-monorepo
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

/**
 * This is an internal script to update versions
 */
'use strict';

const path = require('path');
const fs = require('fs-extra');
const Project = require('@lerna/project');

async function updateVersionRefs(rootPath, version, ...paths) {
  for (const valuePath of paths) {
    const valueFile = path.join(rootPath, valuePath);
    let values = await fs.readFile(valueFile, 'utf-8');
    values = values.replace(
      /(loopback4\-example\-(recommender|shopping))\:(\d+\.\d+\.\d+)/g,
      `$1:${version}`,
    );
    await fs.writeFile(valueFile, values);
    console.log('%s updated to version %s', valuePath, version);
  }
}

async function updatePackage(rootPath, version) {
  const files = ['package.json', 'package-lock.json'];
  for (const f of files) {
    const jsonFile = path.join(rootPath, f);
    const pkg = await fs.readJson(jsonFile);
    pkg.version = version;
    await fs.writeJson(jsonFile, pkg, {spaces: 2});
    console.log('%s updated to version %s', f, version);
  }
}

/**
 * Update versions
 */
async function updateVersions() {
  const project = new Project(process.cwd());
  const rootPath = project.rootPath;

  // Read `version` from `lerna.json`
  const version = project.config.version;
  console.log('Shopping application version: %s', version);

  await updatePackage(rootPath, version);

  await updateVersionRefs(
    rootPath,
    version,
    'kubernetes/shopping-app/values.yaml',
    'kubernetes/shopping-app/ibmcloud-values.yaml',
    'kubernetes/docs/deploy-to-ibmcloud.md',
    'kubernetes/docs/try-with-minikube.md',
  );
}

if (require.main === module) {
  updateVersions().catch(err => {
    console.error(err);
    process.exit(1);
  });
}
