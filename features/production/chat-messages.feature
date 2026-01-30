Feature: Chat Messages
  As a user
  I want to send chat messages
  So that I can communicate

  Background:
    Given I am on Routes.demo
    Given Components.Chat.bubble is visible
    When I click Components.Chat.bubble

  Scenario: Send one message
    When I type "Hello, World!" in Components.Chat.input
    And I click Components.Chat.sendButton
    Then Components.Chat.messages should contain 1 message

  Scenario: Send multiple messages
    When I type "First message" in Components.Chat.input
    And I click Components.Chat.sendButton
    And I type "Second message" in Components.Chat.input
    And I click Components.Chat.sendButton
    And I type "Third message" in Components.Chat.input
    And I click Components.Chat.sendButton
    Then Components.Chat.messages should contain 3 messages
