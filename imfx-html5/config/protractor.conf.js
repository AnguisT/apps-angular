/**
 * @author: @AngularClass
 */

// Перед запуском убедится что protractor 5.0.0
// Для начала в консоле напиши webdriver-manger update, потом webdriver-manager update --ie.
// Потом webdriver-manger start, дождаться когда сервер запустится.
// После этого можно запускать тесты.

// Скриншоты не делаются.
// Надо раскомитить address, и в capibility ie.
// Что бы работал хром надо закомитить takeScreen.
// И еще в каждом beforeEach надо как в login.e2e.ts сделать.
// Что бы запустить MicrosoftEdge я скачал MicrosoftWebDriver. Запустил вручную.
// В появившем окне скопировал аддрес. И вставил в seleniumAddress. Запускаю только Edge.


require('ts-node/register');
var prot = require('protractor');
var helpers = require('./helpers');

exports.config = {
    baseUrl: 'http://192.168.90.39/imfx3-dev/', // http://192.168.90.39/imfx3-dev/
    // seleniumAddress: 'http://localhost:17556/',
    // seleniumArgs: ['-Dwebdriver.edge.driver=node_modules/protractor/selenium/MicrosoftWebDriver.exe'],
    chromeOnly: true,
    // use `npm run e2e`
    specs: [
        helpers.root('src/**/**.e2e.ts'),
        helpers.root('src/**/*.e2e.ts')
        // E:\Работа\local\imfx-html5\src\app\modules\search\slick-grid\e2e\slick-grid.ui.e2e.ts
        // E:\Работа\imfx-html5\src\app\views\media\e2e\media.qbe.functional.e2e.ts
        // helpers.root('src/app/views/media/e2e/media.qbe.functional.e2e.ts'),
        // helpers.root('src/app/views/media/e2e/media.qbu.ui.e2e.ts'),
        // helpers.root('src/app/modules/search/slick-grid/e2e/slick-grid.functional.e2e.ts')
        // helpers.root('src/e2e/general.testing.e2e.ts'),
        // helpers.root('src/e2e/media.search.e2e.ts'),
        // helpers.root('src/e2e/*.e2e.ts')
        // helpers.root('src/app/views/login/e2e/**.e2e.ts'),
        // helpers.root('src/app/views/login/e2e/*.e2e.ts')
        // helpers.root('src/e2e/developers/developers.testing.e2e.ts')
    ],

    exclude: [],

    framework: 'jasmine2',

    jasmineNodeOpts: {
        showTiming: true,
        showColors: true,
        isVerbose: false,
        includeStackTrace: false,
        defaultTimeoutInterval: 400000
    },
    directConnect: true,

    multiCapabilities: [
        // {'browserName': 'internet explorer'},
        // {'browserName': 'chrome'},
        // {'browserName': 'firefox'}, // Перестал запускаться.
        // {'browserName': 'MicrosoftEdge'},
    ],

    maxSessions: 1,

    onPrepare: function() {
        browser.driver.manage().window().maximize();
        prot.browser.manage().timeouts().pageLoadTimeout(60000);
        prot.browser.manage().timeouts().implicitlyWait(10000);
        prot.browser.manage().timeouts().setScriptTimeout(60000);
        var jasmineReporters = require('jasmine-reporters');
        jasmine.getEnv().addReporter(new jasmineReporters.TeamCityReporter());
        jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
            consolidateAll: true,
            savePath: './testresults/',
            filePrefix: 'xmlresults'
        }));

        var fs = require('fs-extra');

        fs.emptyDir('./testresults/screenshots/', function (err) {
            console.log(err);
        });

        jasmine.getEnv().addReporter({
            specDone: function(result) {
                if (result.status != 'disabled') {
                    browser.getCapabilities().then(function (caps) {
                        var browserName = caps.get('browserName');

                        browser.takeScreenshot().then(function (png) {
                            var stream = fs.createWriteStream('./testresults/screenshots/' + browserName + '-' + result.fullName /*.replace(/ /g, '_')*/ + '.png');
                            stream.write(new Buffer(png, 'base64'));
                            stream.end();
                        });
                    });
                }
            }
        });
    },

    onComplete: function() {
        var browserName, browserVersion;
        var capsPromise = browser.getCapabilities();

        capsPromise.then(function (caps) {
            browserName = caps.get('browserName');
            browserVersion = caps.get('version');

            var HTMLReport = require('protractor-html-reporter');

            testConfig = {
                reportTitle: 'Test Execution Report',
                outputPath: './testresults',
                screenshotPath: './screenshots',
                testBrowser: browserName,
                browserVersion: browserVersion,
                modifiedSuiteName: false,
                screenshotsOnlyOnFailure: false
            };
            new HTMLReport().from('./testresults/xmlresults.xml', testConfig);
        });
    },

    // onPrepare: function () {
    //     // Use it in your test if you using as single test
    //     // let loginToAppHelper = require("../../tests/e2e/login-helper.ts");
    //     // loginToAppHelper.loginToApp();
    // },

    /**
     * Angular 2 configuration
     *
     * useAllAngular2AppRoots: tells Protractor to wait for any angular2 apps on the page instead of just the one matching
     * `rootEl`
     */
    useAllAngular2AppRoots: true
};
