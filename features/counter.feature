Feature: Counter Component
  As a user
  I want to interact with a counter
  So that I can increment, decrement, and reset the count

  Background:
    Given I am on Routes.demo
    And Components.Counter.widget is visible

  Scenario: Starting from zero
    When I click Components.Counter.increment
    Then Components.Counter.widget should contain "1"

  Scenario: Incrementing multiple times
    When I click Components.Counter.increment
    And I click Components.Counter.increment
    And I click Components.Counter.increment
    Then Components.Counter.widget should contain "3"

  Scenario: Decrementing after incrementing
    When I click Components.Counter.increment
    And I click Components.Counter.increment
    And I click Components.Counter.decrement
    Then Components.Counter.widget should contain "1"

  Scenario: Reset to zero
    When I click Components.Counter.increment
    And I click Components.Counter.increment
    And I click Components.Counter.increment
    And I click Components.Counter.reset
    Then Components.Counter.widget should contain "0"

  Scenario: Increment and decrement combination
    When I click Components.Counter.increment
    And I click Components.Counter.increment
    And I click Components.Counter.increment
    And I click Components.Counter.increment
    And I click Components.Counter.increment
    And I click Components.Counter.decrement
    And I click Components.Counter.decrement
    Then Components.Counter.widget should contain "3"
