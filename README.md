# testcafe-reporter-atm
[![Build Status](https://travis-ci.org/ricwal-richa/testcafe-reporter-atm.svg)](https://travis-ci.org/ricwal-richa/testcafe-reporter-atm)

This is the **atm** reporter plugin for [TestCafe](http://devexpress.github.io/testcafe).


## Install

```
npm install testcafe-reporter-atm
```

## Environment Variables

Set following environment variables on your machine:

- JIRA_BASE_URL=baseurl (e.g. --> jira.abcdef.com)
- JIRA_USERNAME=username
- JIRA_PASSWORD=password
- JIRA_TEST_RUN=ATMrunid
- PROJECT_ID=XYZ

## Usage

When you run tests from the command line, specify the reporter name by using the `--reporter` option:

```
testcafe chrome 'path/to/test/file.js' --reporter atm
```


When you use API, pass the reporter name to the `reporter()` method:

```js
testCafe
    .createRunner()
    .src('path/to/test/file.js')
    .browsers('chrome')
    .reporter('atm') // <-
    .run();
```

## How to pass test ID & test environment from your test file
Fixture sample below demonstrates how test environment and test case id information can be passed from fixture file. If the test environment passed has an exact match in Kanoah's list of test environment for the project, environment information also be updated with the test execution status against corresponding test id.

example of environment from sample below :
* local_desktop_chrome_latest_sampleapp_en

Test environment information depicted below is only suggestive.

```js 
fixture`Scenario description`
    .page`${sUrl}`
    .meta({ 
        Env: Destination + '_' + Breakpoint + '_' + Browser + '_' + Version + '_' + ApplicationName + '_' + Locale
    })
test
    .meta({ID: 'TEST-T1'})
    .before(async t => {
        // before test code
    })('Test description', async t => {
        // Test code
    });
```

Note: If test environment is not provided, test execution result will still be uploaded minus environment information.


