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

> For Linux users, it is recommended to download Chrome > v59, which supports fully headless browser without the need of xvfb.

1. To include google chrome to the apt repository:
```bash
wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
sudo sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
sudo apt-get update
apt-get install google-chrome-unstable
```
2. Ensure you've activate a virtualenv with behave and associated modules:
```
virtualenv env
. env/bin/activate
pip install -r dev_requirements.txt
```
3. Download chromedriver and save it to your env
```bash
# platform options: linux32, linux64, mac64, win32
PLATFORM=linux64
VERSION=$(curl http://chromedriver.storage.googleapis.com/LATEST_RELEASE)
wget -O chromedriver.zip http://chromedriver.storage.googleapis.com/$VERSION/chromedriver_$PLATFORM.zip
unzip chromedriver.zip
mv chromedriver ./env/bin/
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

### Google Chrome example

```
14:59 $ ipython

In [1]: %doctest_mode
Exception reporting mode: Plain
Doctest mode is: ON

>>> from selenium import webdriver
>>> from splinter import Browser
>>> options = webdriver.ChromeOptions()
>>> options.binary_location = '/usr/bin/google-chrome-unstable'
>>> options.add_argument('headless')
>>> options.add_argument('window-size=1200x600')
>>> browser = Browser('chrome', options=options)
>>> browser.visit('https://google.com')
>>> browser.title
Google
>>> 'Ok Google' in browser.html
True
```

## Contribute

We need to add more steps (`@given`, `@when`, `@then`) to "./features/steps/steps.py" to make adding functional "feature" specfications easier to author and included with pull requests.
