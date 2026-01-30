Feature: API Key Configuration (BYOK)
  As a user
  I want to configure my own Anthropic API key
  So that I can use real AI responses in the chat interface

  Background:
    Given I am on Routes.demo.root
    Given Components.Chat.bubble is visible
    When I click Components.Chat.bubble

  Scenario: Opening the API key configuration
    When I click Components.ApiKey.moreMenuButton
    Then Components.ApiKey.moreMenu should be visible
    And Components.ApiKey.configureButton should be visible

  Scenario: Entering a new API key
    When I click Components.ApiKey.moreMenuButton
    And I click Components.ApiKey.configureButton
    Then Components.ApiKey.section should be visible
    And Components.ApiKey.input should be visible
    And Components.ApiKey.submitButton should be visible
    And Components.ApiKey.cancelButton should be visible

  Scenario: Submitting a valid API key
    When I click Components.ApiKey.moreMenuButton
    And I click Components.ApiKey.configureButton
    And I type "sk-ant-api03-validkey123" in Components.ApiKey.input
    And I click Components.ApiKey.submitButton
    Then Components.ApiKey.status should be visible
    And Components.ApiKey.masked should be visible

  Scenario: Showing and hiding API key
    When I click Components.ApiKey.moreMenuButton
    And I click Components.ApiKey.configureButton
    And I type "sk-ant-api03-validkey123" in Components.ApiKey.input
    And I click Components.ApiKey.submitButton
    And I click Components.ApiKey.showToggle
    Then Components.ApiKey.input should be visible

  Scenario: Clearing the API key
    When I click Components.ApiKey.moreMenuButton
    And I click Components.ApiKey.configureButton
    And I type "sk-ant-api03-validkey123" in Components.ApiKey.input
    And I click Components.ApiKey.submitButton
    And I click Components.ApiKey.clearButton
    Then Components.ApiKey.configureButton should be visible
    And Components.ApiKey.status should be hidden

  Scenario: Canceling API key entry
    When I click Components.ApiKey.moreMenuButton
    And I click Components.ApiKey.configureButton
    And I type "sk-ant-api03-partial" in Components.ApiKey.input
    And I click Components.ApiKey.cancelButton
    Then Components.ApiKey.section should be hidden

  Scenario: Invalid API key format shows error
    When I click Components.ApiKey.moreMenuButton
    And I click Components.ApiKey.configureButton
    And I type "invalid-key" in Components.ApiKey.input
    And I click Components.ApiKey.submitButton
    Then Components.ApiKey.error should be visible

  Scenario: API key persists after page refresh
    When I click Components.ApiKey.moreMenuButton
    And I click Components.ApiKey.configureButton
    And I type "sk-ant-api03-validkey123" in Components.ApiKey.input
    And I click Components.ApiKey.submitButton
    And I refresh the page
    And I click Components.Chat.bubble
    And I click Components.ApiKey.moreMenuButton
    Then Components.ApiKey.status should be visible
    And Components.ApiKey.masked should be visible
