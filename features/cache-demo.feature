Feature: Cache Demo
  Background:
    Given the cache is enabled

  Scenario: Demonstrate cache hits
    # First reference - will be a cache MISS
    Given counter state is Components.counter.state.zero
    # Second reference to same state - should be cache HIT
    Given counter state is Components.counter.state.zero
    # Third reference to same state - another cache HIT
    Then counter state should be Components.counter.state.zero
    # Different state - cache MISS
    Given counter state is Components.counter.state.five
    # Same different state again - cache HIT
    Then counter state should be Components.counter.state.five

