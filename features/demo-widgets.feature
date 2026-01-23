Feature: Demo Interactive Widgets
  As a user
  I want to interact with status and theme widgets
  So that I can change application settings

  Background:
    Given I navigate to "http://localhost:3000/demo"
    And I wait for 2 seconds for the page to load

  Scenario: Change status using dropdown
    When I select "active" from Components.Demo.statusDropdown
    Then the status should be set to "active"

  Scenario: Change theme using dropdown
    When I select "dark" from Components.Demo.themeToggle
    Then the theme should be set to "dark"

  Scenario: Change status to processing
    When I select "processing" from Components.Demo.statusDropdown
    Then the status should be set to "processing"

  Scenario: Change theme to light
    When I select "light" from Components.Demo.themeToggle
    Then the theme should be set to "light"

  Scenario: Change theme to auto
    When I select "auto" from Components.Demo.themeToggle
    Then the theme should be set to "auto"

  Scenario: Change status to complete
    When I select "complete" from Components.Demo.statusDropdown
    Then the status should be set to "complete"
