Feature: Blog Basic Navigation
  As a user
  I want to view the blog
  So that I can read posts

  Scenario: View blog page
    Given I am on Routes.blog
    Then Components.Blog.container should be visible
