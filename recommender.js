// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

const path = require('path');

const app = require('./dist/recommender');

module.exports = app.createRecommendationServer();
