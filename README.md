# nightwatch-data-driven

Utilities for writing data driven tests with nightwatch.

import DataDrivenTest from 'nightwatch-data-driven';
import {authConfig}  from '../configs/auth';

var test = {
	after: function (browser) {
		browser.init();
	}
	'Valid credentials => successfull login': function (browser) {
		new DataDrivenTest(browser, function(data, name){
			// . Arrange
			browser.logout();
			// . Act
			browser.page.login().loginAndWaitForRedirect(data.email, data.pass);
			// . Assert
			browser.page.workspace().assertIsCurrentPage(name);
		})
	  	.forCases({
            "Valid credentials": {email: authConfig.main.EMAIL, pass: authConfig.main.PASS},
            "Ignore leading space in email": {email: ' ' + authConfig.main.EMAIL, pass: authConfig.main.PASS},
            "Email in upper case": {
                email: authConfig.main.EMAIL.toUpperCase(),
                pass: authConfig.main.PASS,
                disabled: true
            }
        });
    },
	after: function (browser) {
		browser.end();
	}
};

export = test;
