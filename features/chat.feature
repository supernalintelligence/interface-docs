Feature: Chat Component
  As a user
  I want to send and manage chat messages
  So that I can communicate effectively

  Background:
    Given I am on the chat page
    And the chat component is visible

  Scenario: Starting with empty chat
    Given chat state is Components.chat.state.empty
    Then the message list should be empty
    And the input field should be enabled

  Scenario: Sending a single message
    Given chat state is Components.chat.state.empty
    When I type "Hello, World!" in the chat input
    And I click the send button
    Then the message list should contain 1 message
    And the last message text should be "Hello, World!"

  Scenario: Viewing existing conversation
    Given chat state is Components.chat.state.multiple
    Then the message list should contain 2 messages
    And the first message should be from "Alice"
    And the second message should be from "Bob"

  Scenario: Adding to existing conversation
    Given chat state is Components.chat.state.single
    When I type "How are you?" in the chat input
    And I click the send button
    Then the message list should contain 2 messages

  Scenario: Clearing all messages
    Given chat state is Components.chat.state.multiple
    When I click the clear messages button
    Then chat state should be Components.chat.state.empty
    And the message list should be empty

  Scenario: Multiple messages in sequence
    Given chat state is Components.chat.state.empty
    When I send the following messages:
      | message             |
      | Hello              |
      | How are you?       |
      | Nice to meet you   |
    Then the message list should contain 3 messages
    And the messages should appear in chronological order

  Scenario: Message persistence across actions
    Given chat state is Components.chat.state.single
    When I refresh the page
    Then chat state should be Components.chat.state.single
    And the message should still be visible

