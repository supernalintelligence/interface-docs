Feature: Counter Component
  As a user
  I want to interact with a counter
  So that I can increment, decrement, and reset the count

  Background:
    Given I am on the demo page
    And the counter component is visible

  Scenario: Starting from zero
    Given counter state is Components.counter.state.zero
    When I click the increment button
    Then the count should be 1
    And the count should display "1"

  Scenario: Incrementing multiple times
    Given counter state is Components.counter.state.zero
    When I click the increment button 3 times
    Then the count should be 3

  Scenario: Decrementing from five
    Given counter state is Components.counter.state.five
    When I click the decrement button
    Then the count should be 4
    And counter state should show count 4

  Scenario: Reset to zero
    Given counter state is Components.counter.state.five
    When I click the reset button
    Then counter state should be Components.counter.state.zero
    And the count should display "0"

  Scenario: Increment and decrement combination
    Given counter state is Components.counter.state.zero
    When I click the increment button 5 times
    And I click the decrement button 2 times
    Then the count should be 3

  Scenario: Working with negative values
    Given counter state is Components.counter.state.negative
    Then the count should display "-3"
    When I click the increment button
    Then the count should be -2

