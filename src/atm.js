'use strict';

var req = require('request');
var fs = require('fs');

function uploadAttachement (testRunInfo, resultId) {
    var testCafeErrorObject = testRunInfo.errs[0];
    var screenshotPath = testCafeErrorObject.screenshotPath;
    if (!screenshotPath || !fs.existsSync(screenshotPath)) {
        console.log('Screenshot does not exist.');
        return null;
    }

    var jiraInfo = {
        uri: 'https://' + process.env.JIRA_USERNAME + ':' + process.env.JIRA_PASSWORD + 
        '@' + process.env.JIRA_BASE_URL + '/rest/atm/1.0/testresult/' + resultId + '/attachments',
        method: 'POST',
        headers: {
            'Content-Type' : 'multipart/form-data'
        },
        formData: {
            file: fs.createReadStream(screenshotPath)
        }
    };

    req(jiraInfo, function (error, response) {
        if (response && (response.statusCode === 200 || response.statusCode === 201)) {
            console.log('Screenshot uploaded in ATM. Response Code :: ' + response.statusCode);
        }
        else {
            console.log('Screenshot not uploaded in ATM.');
        }
    });
}

require('dotenv').config();

function updateTestResult(TestCaseID, TestDur, TestStatus, TestComment, TestEnv, testRunInfo) {
    var jiraInfo = {
        uri: 'https://' + process.env.JIRA_USERNAME + ':' + process.env.JIRA_PASSWORD + '@' + process.env.JIRA_BASE_URL + '/rest/atm/1.0/testrun/' + process.env.JIRA_TEST_RUN + '/testcase/' + TestCaseID + '/testresult',
        method: 'POST',
        json: { 'status': TestStatus,
            'userKey': process.env.JIRA_USERNAME,
            "executionTime": TestDur,
            'environment': TestEnv,
            'scriptResults': [{
                'index': 0,
                'status': TestStatus,
                'comment': TestEnv + ' :: --> ' + TestComment
            }]
        }
    };

    req(jiraInfo, function (error, response) {
        if (response.statusCode === 200 || response.statusCode === 201) {
                console.log('ATM result uploaded successfully. Response Code :: ' + response.statusCode);
                if (TestStatus === 'Fail') {
                    uploadAttachement(testRunInfo, response.body.id);
                }
        } else {
            console.log('Enviornment is missing. Trying without environment.');
            jiraInfo = {
                uri: 'https://' + process.env.JIRA_USERNAME + ':' + process.env.JIRA_PASSWORD + '@' + process.env.JIRA_BASE_URL + '/rest/atm/1.0/testrun/' + process.env.JIRA_TEST_RUN + '/testcase/' + TestCaseID + '/testresult',
                method: 'POST',
                json: { 'status': TestStatus,
                    'userKey': process.env.JIRA_USERNAME,
                    "executionTime": TestDur,
                    'scriptResults': [{
                        'index': 0,
                        'status': TestStatus,
                        'comment': TestEnv + ' :: --> ' + TestComment
                    }]
                }
            };

            req(jiraInfo, function (error, response) {
                if (response.statusCode === 200 || response.statusCode === 201) {
                    console.log('ATM result uploaded successfully without Environment. Response Code :: ' + response.statusCode);
                    if (TestStatus === 'Fail') {
                        uploadAttachement(testRunInfo, response.body.id);
                    }
                } else {
                    console.log('Result not uploaded in ATM.');
                }
            });
        }
    });
}

exports.updateTestResult = updateTestResult;