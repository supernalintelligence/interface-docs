Feature: Counter Tools Demo
  As a user
  I want to see the counter tools in action
  So that I can demonstrate the tool system

  Background:
    Given I navigate to "http://localhost:3000/demo/simple"
    And I wait for 2 seconds for the page to load

  Scenario: Using counter tools
    When I increment counter
    And I wait for 1 second
    When I increment counter
    And I wait for 1 second
    When I reset counter
    And I wait for 1 second
    Then the counter should be at zero

