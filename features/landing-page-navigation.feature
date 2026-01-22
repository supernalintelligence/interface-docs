Feature: Landing Page Navigation
  As a user on the landing page
  I want to navigate to other sections using global navigation tools
  So that I can explore the docs-site

  Background:
    Given I am on the landing page "/"

  Scenario: Navigate to demo page from landing
    When I navigate to "/demo"
    Then the current URL should be "/demo"

  Scenario: Navigate to blog page from landing
    When I navigate to "/blog"
    Then the current URL should be "/blog"

  Scenario: Return to home page
    Given I navigate to "/demo"
    When I navigate to "/"
    Then the current URL should be "/"
