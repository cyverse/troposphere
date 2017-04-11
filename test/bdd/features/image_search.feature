
Feature: A community member can search for an image

  Background: Searching without logging in
    Given a browser

  Scenario: Search keyword
    Given the Image Catalog
    When image searching for "ubuntu"
    Then I wait for 2 seconds
    And I should see "All Images"
    And I should see at least one result

  Scenario: Filter by image tag
    Given the Image Catalog
    When I click on "Tags" subheading
    And search for tag "base"
    Then I wait for 1 seconds
    And a tag named "base" is present
