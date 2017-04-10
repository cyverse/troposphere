
from behave import given, when, then

from behaving.web.steps import (given_a_browser,
                                wait_for_timeout,
                                should_see_within_timeout)

@given(u'the Image Catalog')
def step_the_image_catalog(context):
    context.browser.visit(context.base_url + '/application/images')
    assert context.browser.is_text_present("Images")


@when(u'image searching for "{term}"')
def step_image_searching_for(context, term):
    assert context.browser.is_text_present("Image Search")
    els = context.browser.find_by_css('#search-container > input[type=text]')
    el = els[0]
    assert el
    el.fill(term)


@then(u'I should see at least one result')
def step_should_see_at_least(context):
    assert context.browser.is_text_present("All Images")
    results = context.browser.find_by_css('li > .MediaCard')
    assert len(results) > 1
