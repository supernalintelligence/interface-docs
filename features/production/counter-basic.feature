Feature: Counter Basic Operations
  As a user
  I want to interact with a counter
  So that I can increment, decrement, and reset values

  Background:
    Given I am on Routes.demo
    Given Components.Counter.widget is visible

  Scenario: Increment counter
    When I click Components.Counter.increment
    Then Components.Counter.widget should contain "1"

  Scenario: Increment three times
    When I click Components.Counter.increment 3 times
    Then Components.Counter.widget should contain "3"

  Scenario: Increment and decrement
    When I click Components.Counter.increment 2 times
    And I click Components.Counter.decrement
    Then Components.Counter.widget should contain "1"

  Scenario: Reset counter
    When I click Components.Counter.increment 3 times
    And I click Components.Counter.reset
    Then Components.Counter.widget should contain "0"
