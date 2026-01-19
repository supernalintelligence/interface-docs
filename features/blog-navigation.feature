Feature: Blog Navigation
  As a user
  I want to navigate and view blog posts
  So that I can read content

  Scenario: View blog index page
    Given I am on Routes.Blog
    Then Components.Blog.container should be visible

  Scenario: Navigate to blog from home
    Given I am on Routes.Home
    When I click Components.GlobalNav.blog
    Then Components.Blog.container should be visible
