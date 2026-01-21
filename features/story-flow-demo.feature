Feature: Story Flow Demonstration
  As a developer
  I want to see a complete story flow demonstration
  So that I can understand how components work together

  Background:
    Given I am on Routes.Demo

  Scenario: Complete user journey through chat and counter
    Given Components.Counter.widget is visible
    And Components.Chat.bubble is visible
    When I click Components.Chat.bubble
    And I type "Hello, I'm testing the story flow" in Components.Chat.input
    And I click Components.Chat.sendButton
    Then Components.Chat.messages should contain 1 message
    When I click Components.Counter.increment 3 times
    Then Components.Counter.widget should contain "3"
    When I click Components.Counter.reset
    Then Components.Counter.widget should contain "0"

  Scenario: Multiple counter increments
    Given Components.Counter.widget is visible
    When I click Components.Counter.increment
    And I click Components.Counter.increment
    And I click Components.Counter.increment
    Then Components.Counter.widget should contain "3"

  Scenario: Chat and counter together
    Given Components.Chat.bubble is visible
    And Components.Counter.widget is visible
    When I click Components.Chat.bubble
    And I type "Testing multi-component" in Components.Chat.input
    And I click Components.Chat.sendButton
    Then Components.Chat.messages should contain 1 message
    When I click Components.Counter.increment
    Then Components.Counter.widget should contain "1"
