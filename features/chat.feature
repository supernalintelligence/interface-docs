Feature: Chat Component
  As a user
  I want to send chat messages
  So that I can interact with the AI interface

  # Note: Chat starts expanded by default on the demo page (defaultExpanded=true)
  # Note: State injection via setComponentState is NOT connected to the actual chat component
  # Note: The chat uses localStorage for persistence, not the test state manager
  Background:
    Given I am on Routes.demo

  Scenario: Chat input is enabled on page load
    Then Components.Chat.input should be enabled

  Scenario: Sending a message adds it to the chat
    When I type "Hello, World!" in Components.Chat.input
    And I click Components.Chat.sendButton
    Then Components.Chat.messages last message should be "Hello, World!"

  Scenario: Multiple messages appear in sequence
    When I type "First message" in Components.Chat.input
    And I click Components.Chat.sendButton
    And I type "Second message" in Components.Chat.input
    And I click Components.Chat.sendButton
    Then Components.Chat.messages last message should be "Second message"
