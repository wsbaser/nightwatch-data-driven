"use strict";
var DataDrivenTest = (function () {
    function DataDrivenTest(aaa) {
        this.browser = null;
        this.arrange = null;
        this.act = null;
        this.assert = null;
        this.aaa = aaa;
    }
    DataDrivenTest.prototype.withBrowser = function (browser) {
        this.browser = browser;
        return this;
    };
    DataDrivenTest.prototype.withArrange = function (arrange) {
        this.checkNoAAA();
        this.arrange = arrange;
        return this;
    };
    DataDrivenTest.prototype.withAct = function (act) {
        this.checkNoAAA();
        this.act = act;
        return this;
    };
    DataDrivenTest.prototype.withAssert = function (assert) {
        this.checkNoAAA();
        this.assert = assert;
        return this;
    };
    DataDrivenTest.prototype.checkNoAAA = function () {
        if (this.aaa) {
            throw "AAA already initialized";
        }
    };
    DataDrivenTest.prototype.forCases = function (cases) {
        var self = this;
        if (!cases) {
            throw 'Cases not initialized';
        }
        if (!self.browser) {
            throw 'Browser not initialized';
        }
        if (!self.arrange) {
            throw 'Arrange not initialized';
        }
        if (!self.assert) {
            throw 'Assert not initialized';
        }
        for (var name_1 in cases) {
            if (cases.hasOwnProperty(name_1)) {
                self.runCase(cases[name_1], name_1);
            }
        }
    };
    DataDrivenTest.prototype.runCase = function (data, name) {
        var self = this;
        if (data.disabled) {
            self.browser.perform(function (client, done) {
                self.logCaseHeader(data, name);
                console.log('<<<<< Test case DISABLED');
                done();
            });
        }
        else {
            if (self.aaa) {
                self.browser.perform(function (client, done) {
                    self.logCaseHeader(data, name);
                    self.aaa(data, name);
                    done();
                });
            }
            else {
                self.browser.perform(function (client, done) {
                    self.logCaseHeader(data, name);
                    console.log('***** Arrange *****');
                    self.arrange(function () {
                        if (self.act) {
                            console.log('***** Act *****');
                            self.act(data);
                        }
                        console.log('***** Assert *****');
                        self.assert(data, name);
                        done();
                    });
                });
            }
        }
    };
    DataDrivenTest.prototype.logCaseHeader = function (data, name) {
        console.log('=============================================');
        console.log(">>>>> " + name + ': ' + JSON.stringify(data));
    };
    return DataDrivenTest;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DataDrivenTest;
