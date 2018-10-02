'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
var uploadReport = require('./atm');
var createEnv = require('./createJiraEnvironment');

exports['default'] = function () {
    return {
        noColors: true,

        reportTaskStart: function reportTaskStart(startTime, userAgents, testCount) {
            console.log('Start Time --> ' + startTime);
            this.startTime = startTime;
            this.testCount = testCount;
            this.userAgents = userAgents;
        },

        reportFixtureStart: function reportFixtureStart(name, path, meta) {
            this.currentFixtureName = name;
            this.currentFixtureMeta = meta;
            createEnv.createJiraEnvironment(meta.Env.toUpperCase());
        },

        reportTestDone: function reportTestDone(name, testRunInfo, meta) {
            var _this = this;

            var testDur = testRunInfo.durationMs;
            var testMeta = meta;
            var fixtureMeta = this.currentFixtureMeta;
            var testID = testMeta.ID;
            var sTestCaseDescription = name;
            var hasErr = !!testRunInfo.errs.length;
            var currentBrowser = this.userAgents.toString();
            currentBrowser = currentBrowser.replace(' / ', '_');
            currentBrowser = currentBrowser.replace(/\s/g, '_');
            if (fixtureMeta.Env === undefined) fixtureMeta.Env = 'UNDEFINED';
            if (hasErr) {
                testRunInfo.errs.forEach(function (err, idx) {
                    uploadReport.updateTestResult(testID, testDur, 'Fail', _this.formatError(err, idx + 1 + ') '), fixtureMeta.Env.toUpperCase(), testRunInfo);
                });
            } else {
                uploadReport.updateTestResult(testID, testDur, 'Pass', 'Test is successful --> ' + sTestCaseDescription, fixtureMeta.Env.toUpperCase(), testRunInfo);
            }
        },

        reportTaskDone: function reportTaskDone(endTime, passed) {
            console.log('End Time --> ' + endTime);
            console.log('Total Pass --> ' + passed);
        }
    };
};

module.exports = exports['default'];