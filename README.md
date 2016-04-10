# nightwatch-data-driven

Provides tool for emulating [data driven tests](https://en.wikipedia.org/wiki/Data-driven_testing) in [Nightwatch.js](http://nightwatchjs.org/).

#### Installation

```sh
npm i nightwatch-data-driven --save
```

#### Example 1: Simple usage

1. Create DataDrivenTest instance passing a **browser** object, provided by Nightwatch and **function representing the body of the test** (the _**A**rrange**A**ct**A**ssert_ function).
2. Call **forCases** method with object containing *names* and *data* for test cases. Use **disabled** parameter to deactivate test case(see example).

```js
import DataDrivenTest from 'nightwatch-data-driven';
import {authConfig}  from '../configs/auth';

var test = {
    before: function (browser) {
        browser.init();
    },
    'Valid credentials => successfull login': function (browser) {
        // . Initialize DataDrivenTest with browser and AAA function
        //   and call it for a set of test cases
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
```

#### Example 2: Building and reusing of "test blanks"
1. Create DataDrivenTest instance without parameters for our "test blank".
2. Call **withArrange** method passing _**A**rrange_ function of "test blank".
3. Call **withAct** method passing _**A**ct_ function of "test blank".
4. Call **withBrowser** method(in *before* hook for example), passing Nightwatch browser object.
5. Now you can reuse "test blank" calling **withAssert** and **forCases** methods with different _**A**ssert_ functions and data in each particular test.


```js
import DataDrivenTest from 'nightwatch-data-driven';
import {mother} from '../mother';

// . Create "test blank"
let submitLoginForm = new DataDrivenTest()
	.withArrange(function(cb) {
		this.browser.logout(cb)
	})
	.withAct(function(dt) {
		this.browser.page.login().section.loginForm.fillAndSubmit(dt.email, dt.pass)
	});
	
 var test = {
    before: function (browser) {
        browser.init();
        // . Initialize "test blank" with browser
        submitLoginForm.withBrowser(browser);
    },
    'Login is invalid email: show error': function (browser) {
        // . Use "test blank" with specific assertion and test cases
        submitLoginForm
            .withAssert((dt, nm) => browser.page.login().assertNoProgress(nm))
            .forCases({
                "1. ": {email: "a", pass: mother.Valid.PASS},
                "2. ": {email: "@b", pass: mother.Valid.PASS},
                "3. ": {email: "@b.", pass: mother.Valid.PASS},
                "4. ": {email: "@b.c", pass: mother.Valid.PASS},
                "5. ": {email: "a@b", pass: mother.Valid.PASS},
                "6. ": {email: "a@b.", pass: mother.Valid.PASS},
                "7. ": {email: "a@b.c", pass: mother.Valid.PASS},
                "8. ": {email: "й@ц.ук", pass: mother.Valid.PASS},
            });
    },
    'Login is valid email: show progress': function (browser) {
        // . Use "test blank" with specific assertion and test cases
        submitLoginForm
            .withAssert((dt, nm) => browser.page.login().assertProgressDisplayed(nm))
            .forCases({
                "1. ": {email: "a@b.cd"},
                "2. ": {email: "1#$%&'*+/=?^-_`{|}~.a@b.cd"},
                "3. ": {email: "a@1-b.cd"},
                "4. ": {email: "a@b.12"}
            });
    },
    after: function (browser) {
        browser.end();
    }
}
export = test;
```
