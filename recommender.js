// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

const distUtil = require('@loopback/dist-util');
const path = require('path');

const app = require(path.join(
  __dirname,
  distUtil.getDist(__dirname),
  '/recommender',
));

module.exports = app.createRecommendationServer().start();
