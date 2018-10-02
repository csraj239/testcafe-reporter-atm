'use strict';

var req = require('request');
require('dotenv').config();

function createJiraEnvironment(Env) {
    req({
        method: 'GET',
        url: 'https://' + process.env.JIRA_USERNAME + ':' + process.env.JIRA_PASSWORD + '@' + process.env.JIRA_BASE_URL + '/rest/tests/1.0/environment?projectId=' + process.env.PROJECT_ID,
        json: true }, // indicates the returning data is JSON, no need for JSON.parse()
    function (error, response, body) {
        var EnvExist = false;
        if (error) {
            console.log('ERROR with user request.');
        } else {
            for (var key in body) {
                if (JSON.stringify(body[key].name) === '"' + Env + '"') {
                    EnvExist = true;
                    break;
                }
            }
            if (EnvExist === false) {
                var jiraEnvInfo = {
                    uri: 'https://' + process.env.JIRA_USERNAME + ':' + process.env.JIRA_PASSWORD + '@' + process.env.JIRA_BASE_URL + '/rest/tests/1.0/environment',
                    method: 'POST',
                    json: { "projectId": parseInt(process.env.PROJECT_ID),
                        "name": Env
                    }
                };
                req(jiraEnvInfo, function (error, response) {
                    if (response.statusCode === 200 || response.statusCode === 201) console.log('New Environment Create :: ' + Env);else {
                        console.log('Error Code --> ' + response.statusCode);
                        console.log('Error while Environment creation.');
                    }
                });
            }
        }
    });
}
module.exports.createJiraEnvironment = createJiraEnvironment;