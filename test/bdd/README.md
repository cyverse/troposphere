# Behavior-Driven Development

This is the root directory for behavior-driven tests illustrating the expectations of how features will work from the perspective of the end-user (via the browser).

## Background

As the project grows, we need to be able to ensure the user interface is behaving as expected when new functionality is added. Part of the process refinement was to "tests" as criteria for new pull requests. We are looking to implement those tests using `behave` and `behaving`. 

For example, see [`operation-sanity`](https://github.com/cyverse/operation-sanity), the end-to-end test suite used when validating an Atmosphere release.

## Setup

Right now, tests are being written from a clone of this repository on a Mac (or Linux) machine that target other installed environments. We are not running these tests in a "headless", server-side mode yet (but could, and will, in the future). The notion here is that using the `behave` command from a virtualenv, we can execute and iterate on features without having to go through the "test-runner" cycle of Django or other tools. 

Ensure that you have the Selenium driver for Firefox installed:
```
brew install geckodriver
```

> For Linux users, there currently is _not_ a packaged version of `geckodriver`. The only option is to download a release from https://github.com/mozilla/geckodriver/releases and follow the installation instructions.

Ensure you've activate a virtualenv with behave and associated modules:
```
virualenv env
. env/bin/activate
pip install -r dev_requirements.txt
```

## Trying Out Things

[`splinter`](https://splinter.readthedocs.io/en/latest/drivers/firefox.html) provides a nice abstraction of the raw Selenium web_driver interface. You can run `ipython` and initialize a browser session to try out various things. This is important when you need to implement a new "step" (`Given`, `When`, `Then`, etc). 

```
14:58 $ ipython

In [1]: %doctest_mode
Exception reporting mode: Plain
Doctest mode is: ON

>>> from splinter import Browser
>>> browser = Browser()
>>> url = "https://local.atmo.cloud/application/images"
>>> browser.visit(url)
>>> len(browser.find_by_css(".tag"))
174
>>> browser.is_text_present("Image Search")
True
```

Using `ipython`'s new "suggest" feature (<kbd>.</kbd> + <kbd>TAB</kbd> or via <kbd>TAB</kbd> completions for the current substring) will allow you to explore the methods available to `browser`, or you can review the `splinter` [docs](https://splinter.readthedocs.io/en/latest/drivers/firefox.html). 

## Contribute

We need to add more steps (`@given`, `@when`, `@then`) to "./features/steps/steps.py" to make adding functional "feature" specfications easier to author and included with pull requests.
