Feature: Story Flow Demonstration
  As a developer
  I want to see a complete story flow demonstration
  So that I can understand how our tool system commands the site

  Background:
    Given I am on the demo page
    And the page has loaded completely
    And all components are initialized

  Scenario: Complete user journey through chat and counter
    Given I am on the demo page
    When I open the main menu using Components.demo.openMainMenu
    Then the menu should be visible
    When I navigate to the chat demo using Components.demo.navigateToChat
    Then I should see the chat component
    When I type "Hello, I'm testing the story flow" in Components.chat.input
    And I click Components.chat.sendButton
    Then the message should appear in Components.chat.messageList
    When I navigate to the counter demo using Components.demo.navigateToCounter
    Then I should see the counter component
    When I click Components.counter.increment 3 times
    Then the counter should display "3"
    When I click Components.counter.reset
    Then the counter should display "0"
    And the story flow demonstration is complete

  Scenario: AI command execution flow
    Given I am on the demo page
    And the chat component is visible
    When I type "open menu" in Components.chat.input
    And I click Components.chat.sendButton
    Then the menu should open via AI command
    When I type "increment counter" in Components.chat.input
    And I click Components.chat.sendButton
    Then the counter should increment via AI command
    And the AI command flow is demonstrated

  Scenario: Multi-component interaction flow
    Given I am on the demo page
    When I interact with Components.demo.openMainMenu
    Then Components.demo.mainMenu should be visible
    When I interact with Components.chat.input
    And I send a message via Components.chat.sendButton
    Then Components.chat.messageList should contain the message
    When I interact with Components.counter.increment
    Then Components.counter.display should update
    And all components work together seamlessly

