Feature: Simple Interface Demo
  As a developer
  I want to demonstrate basic UI interactions
  So that stakeholders can see the interface in action

  Background:
    Given I navigate to "http://localhost:3000/demo/simple"
    And I wait for 2 seconds for the page to load

  Scenario: Interacting with the counter
    When I wait for 1 second
    Then I wait for 2 seconds

