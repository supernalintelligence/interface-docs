Feature: State Transitions and Caching
  As a developer
  I want the story system to cache intermediate states
  So that test execution is faster on subsequent runs

  Background:
    Given the story cache is enabled
    And checkpoint tracking is active

  @cache
  Scenario: Cache hit for identical state sequence
    Given counter state is Components.counter.state.zero
    When I click the increment button
    Then the count should be 1
    # Second execution should hit cache
    Given counter state is Components.counter.state.zero
    When I click the increment button
    Then the count should be 1
    And the step should have been cached

  @cache
  Scenario: Cache miss for different state sequence
    Given counter state is Components.counter.state.zero
    When I click the increment button
    Then the count should be 1
    # Different starting state = cache miss
    Given counter state is Components.counter.state.five
    When I click the increment button
    Then the count should be 6
    And the step should not have been cached

  @checkpoint
  Scenario: Resume from checkpoint after failure
    Given counter state is Components.counter.state.zero
    When I click the increment button 3 times
    And a checkpoint is created
    And I click the increment button 2 times
    # Simulate failure and resume
    When I resume from the last checkpoint
    Then counter state should show count 3
    And I can continue from that point

  @state-aware
  Scenario: State-dependent caching
    Given chat state is Components.chat.state.empty
    When I send message "Test 1"
    Then the message list should contain 1 message
    # Same initial state, same action = cache hit
    Given chat state is Components.chat.state.empty
    When I send message "Test 1"
    Then the result should match cached execution

  @state-hash
  Scenario: State hash verification
    Given counter state is Components.counter.state.zero
    Then the state hash should be deterministic
    # Same state should always produce same hash
    Given counter state is Components.counter.state.zero
    Then the state hash should match previous hash

  @transition
  Scenario: Transition function execution
    Given counter state is Components.counter.state.five
    When I apply transition Components.counter.after.increment
    Then counter state should show count 6
    And the original state should be unchanged

  @immutability
  Scenario: Immutable state transitions
    Given chat state is Components.chat.state.single
    When I apply transition Components.chat.after.sendMessage with "New message"
    Then chat state should have 2 messages
    And Components.chat.state.single should still have 1 message

