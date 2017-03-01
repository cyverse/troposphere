
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


# @when(u'I click on "Tags" subheading')
# def step_impl(context):
#     raise NotImplementedError(u'STEP: When I click on "Tags"')

# @when(u'search for tag "base"')
# def step_impl(context):
#     raise NotImplementedError(u'STEP: When search for tag "base"')

# @then(u'a tag named "base" is present')
# def step_impl(context):
#     raise NotImplementedError(u'STEP: Then a tag named "base" is present')

# @then(u'all results are related to "{term}"')
# def step_should_see_term_in_fields(context):
#     lst = context.browser.find_by_css('.app-card-list')
#     # after a search, only 1 `.app-card-list` should exist
#     assert len(lst) == 1, "It appears that more than results listing is present"
#     elements = context.browser.find_by_css('.app-card-list > .MediaCard')
#     for element in elements:

#     raise NotImplementedError(u'STEP: Then all results are related to "base"')
