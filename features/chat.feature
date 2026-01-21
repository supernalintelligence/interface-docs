Feature: Chat Component
  As a user
  I want to send and manage chat messages
  So that I can communicate effectively

  Background:
    Given I am on Routes.Demo
    Given Components.Chat.bubble is visible
    When I click Components.Chat.bubble

  Scenario: Starting with empty chat
    Given chat state is Components.Examples.chat.state.empty
    Then Components.Chat.messages should be empty
    And Components.Chat.input should be enabled

  Scenario: Sending a single message
    Given chat state is Components.Examples.chat.state.empty
    When I type "Hello, World!" in Components.Chat.input
    And I click Components.Chat.sendButton
    Then Components.Chat.messages should contain 1 message
    And Components.Chat.messages last message should be "Hello, World!"

  Scenario: Viewing existing conversation
    Given chat state is Components.Examples.chat.state.withMessages
    Then Components.Chat.messages should contain 2 messages

  Scenario: Adding to existing conversation
    Given chat state is Components.Examples.chat.state.single
    When I type "How are you?" in Components.Chat.input
    And I click Components.Chat.sendButton
    Then Components.Chat.messages should contain 2 messages

  Scenario: Clearing all messages
    Given chat state is Components.Examples.chat.state.withMessages
    When I click Components.Chat.clearButton
    Then chat state should be Components.Examples.chat.state.empty
    And Components.Chat.messages should be empty

  Scenario: Multiple messages in sequence
    Given chat state is Components.Examples.chat.state.empty
    When I type "Hello" in Components.Chat.input
    And I click Components.Chat.sendButton
    And I type "How are you?" in Components.Chat.input
    And I click Components.Chat.sendButton
    And I type "Nice to meet you" in Components.Chat.input
    And I click Components.Chat.sendButton
    Then Components.Chat.messages should contain 3 messages

  Scenario: Message persistence across actions
    Given chat state is Components.Examples.chat.state.single
    When I refresh the page
    Then chat state should be Components.Examples.chat.state.single
    And Components.Chat.messages should contain 1 message
