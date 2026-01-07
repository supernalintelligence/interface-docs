Feature: Complete Interface Demo
  As a product manager
  I want to create a demonstration video
  So that I can show stakeholders how our interface works

  Background:
    Given I navigate to "http://localhost:3000/demo/simple"
    And I wait for 2 seconds for the page to load completely

  Scenario: Opening and using the chat interface
    Given the page has loaded
    When I locate the chat bubble
    And I click to expand the chat
    Then the chat input should be visible
    When I type "Hello! This is a demonstration of our AI-powered interface." in the chat input slowly
    And I wait for 500 milliseconds
    And I click the send button
    Then I should see my message appear in the chat history
    And I wait for 2 seconds to show the result

  Scenario: Interacting with the counter
    Given the demo page is visible
    When I locate the counter component
    And I click the increment button
    Then the counter value should increase
    When I click the increment button 2 more times
    Then the counter should show 3
    And I wait for 1 second
    When I click the reset button
    Then the counter should return to 0
    And I wait for 1 second to show the reset

  Scenario: Using AI commands to control the interface
    Given the chat interface is expanded
    When I type "open menu" in the chat input
    And I click send
    Then the main menu should open via AI command
    And I wait for 2 seconds to highlight the opened menu
    When I type "close menu" in the chat input
    And I click send
    Then the menu should close
    And I wait for 1 second

  Scenario: Final demonstration of the complete workflow
    Given all components are visible
    When I interact with the counter
    And I send a chat message
    And I use an AI command
    Then all features work together seamlessly
    And I wait for 2 seconds before ending the demonstration

