Feature: SubtitleOverlay Component
  As a user
  I want to use a minimal voice-first chat overlay
  So that I can interact with AI without leaving my current context

  # ============================================================================
  # EXPANSION & COLLAPSE
  # ============================================================================

  Scenario: Collapsed state shows @/ icon
    Given I am on Routes.Demo.Subtitle
    Then Components.SubtitleOverlay.collapsedContainer should be visible
    Then Components.SubtitleOverlay.voiceButton should contain "@/"

  Scenario: Clicking @/ expands the overlay
    Given I am on Routes.Demo.Subtitle
    Given Components.SubtitleOverlay.collapsedContainer is visible
    When I click Components.SubtitleOverlay.voiceButton
    Then Components.SubtitleOverlay.container should be visible
    Then Components.SubtitleOverlay.input should be visible

  Scenario: Clicking X collapses the overlay
    Given I am on Routes.Demo.Subtitle
    Given Components.SubtitleOverlay.collapsedContainer is visible
    When I click Components.SubtitleOverlay.voiceButton
    And I click Components.SubtitleOverlay.collapseButton
    Then Components.SubtitleOverlay.collapsedContainer should be visible

  # ============================================================================
  # VOICE INPUT ICON BEHAVIOR
  # Issue: Icon should stay </ when listening, just show red highlight
  # ============================================================================

  Scenario: Expanded state shows </ icon (not listening)
    Given I am on Routes.Demo.Subtitle
    Given Components.SubtitleOverlay.collapsedContainer is visible
    When I click Components.SubtitleOverlay.voiceButton
    Then Components.SubtitleOverlay.voiceButton should contain "</"

  # NOTE: Testing that icon STAYS </  when listening (with red highlight)
  # requires checking that icon does NOT change to ~/
  # Current behavior: changes to ~/ (WRONG)
  # Expected behavior: stays </ with red styling (CORRECT)

  # ============================================================================
  # TEXT INPUT & SENDING MESSAGES
  # ============================================================================

  Scenario: Typing in input field
    Given I am on Routes.Demo.Subtitle
    Given Components.SubtitleOverlay.collapsedContainer is visible
    When I click Components.SubtitleOverlay.voiceButton
    And I type "Hello AI" in Components.SubtitleOverlay.input
    Then Components.SubtitleOverlay.input should contain "Hello AI"
    Then Components.SubtitleOverlay.sendButton should be visible

  Scenario: Sending a message shows AI response
    Given I am on Routes.Demo.Subtitle
    Given Components.SubtitleOverlay.collapsedContainer is visible
    When I click Components.SubtitleOverlay.voiceButton
    And I type "What time is it?" in Components.SubtitleOverlay.input
    And I click Components.SubtitleOverlay.sendButton
    Then Components.SubtitleOverlay.aiMessage should be visible

  # ============================================================================
  # FIXED WIDTH (Issue: width changes when idle - annoying)
  # ============================================================================

  # NOTE: Width should be fixed at 650px (desktop), not just maxWidth
  # This prevents width flex during opacity transitions
  # Requires CSS assertion: width: 650px AND maxWidth: 650px

  # ============================================================================
  # DRAGGING (Issue: NOT WORKING)
  # ============================================================================

  Scenario: Drag handle is visible on desktop
    Given I am on Routes.Demo.Subtitle
    Given Components.SubtitleOverlay.collapsedContainer is visible
    When I click Components.SubtitleOverlay.voiceButton
    Then Components.SubtitleOverlay.dragHandle should be visible

  # NOTE: Actual drag testing requires custom Playwright actions:
  # - Mouse down on drag handle
  # - Mouse move to new position
  # - Mouse up
  # - Assert position changed
  # This is beyond standard Gherkin patterns

  # ============================================================================
  # TTS DETECTION (Issue: NOT WORKING)
  # ============================================================================

  # NOTE: TTS detection requires a page with TTS widgets
  # When TTS widgets are present, ~+ button should appear

  Scenario: TTS button hidden when no TTS widgets on page
    Given I am on Routes.Demo.Subtitle
    Then Components.SubtitleOverlay.ttsPlaylistButton should be hidden

  # For pages WITH TTS widgets:
  # Scenario: TTS button visible when TTS widgets detected
  #   Given I am on Routes.Blog  # Assuming blog has TTS
  #   Then Components.SubtitleOverlay.ttsPlaylistButton should be visible

  # ============================================================================
  # COMPLETED ACTIONS TOGGLE
  # ============================================================================

  Scenario: Completed actions toggle hidden when no actions
    Given I am on Routes.Demo.Subtitle
    Given Components.SubtitleOverlay.collapsedContainer is visible
    When I click Components.SubtitleOverlay.voiceButton
    Then Components.SubtitleOverlay.actionsToggle should be hidden

  # After sending a message, completed actions should appear
  Scenario: Completed actions toggle visible after sending message
    Given I am on Routes.Demo.Subtitle
    Given Components.SubtitleOverlay.collapsedContainer is visible
    When I click Components.SubtitleOverlay.voiceButton
    And I type "Test message" in Components.SubtitleOverlay.input
    And I click Components.SubtitleOverlay.sendButton
    Then Components.SubtitleOverlay.actionsToggle should be visible

  Scenario: Clicking completed actions toggle shows list
    Given I am on Routes.Demo.Subtitle
    Given Components.SubtitleOverlay.collapsedContainer is visible
    When I click Components.SubtitleOverlay.voiceButton
    And I type "Test message" in Components.SubtitleOverlay.input
    And I click Components.SubtitleOverlay.sendButton
    And I click Components.SubtitleOverlay.actionsToggle
    Then Components.SubtitleOverlay.actionsList should be visible

  # ============================================================================
  # AI MESSAGE PERSISTENCE (Issue: Should only show once, then never again)
  # ============================================================================

  # NOTE: AI message persistence requires localStorage tracking:
  # - Each message gets unique ID: ${text}-${timestamp}
  # - Shown messages stored in localStorage Set
  # - On refresh/mode toggle, already-shown messages stay hidden
  # This requires custom test implementation with localStorage checks

  Scenario: AI message fades out after display time
    Given I am on Routes.Demo.Subtitle
    Given Components.SubtitleOverlay.collapsedContainer is visible
    When I click Components.SubtitleOverlay.voiceButton
    And I type "Hello" in Components.SubtitleOverlay.input
    And I click Components.SubtitleOverlay.sendButton
    # Wait 8+ seconds for auto-fade
    Then Components.SubtitleOverlay.aiMessage should be hidden

  # ============================================================================
  # MESSAGE HISTORY (Issue: Not implemented)
  # ============================================================================

  # NOTE: Message history feature requirements:
  # - Subtle up indicator at top of overlay
  # - Clicking expands to show last 10 messages
  # - "Expand to Full" button at top
  # This feature needs to be implemented first

  # Scenario: Message history toggle visible
  #   Given I am on Routes.Demo.Subtitle
  #   Given subtitle state is Components.SubtitleOverlay.state.withMessages
  #   Then Components.SubtitleOverlay.messageHistoryToggle should be visible

  # ============================================================================
  # HIGH OPACITY ON EXPAND (Issue: Should be 1.0 immediately when opening)
  # ============================================================================

  # NOTE: When pressing / to expand, opacity should immediately be 1.0
  # This requires checking CSS opacity value
  # Keyboard shortcut testing may need custom steps

  # ============================================================================
  # SUGGESTION ACCEPTANCE (Issue: Should use Tab/swipe-right, not tap)
  # ============================================================================

  # NOTE: Current behavior: tapping suggestion auto-fills input (WRONG)
  # Expected behavior:
  # - Mobile: swipe-right to accept suggestion
  # - Desktop: Tab key to accept suggestion
  # - Placeholder format: "message (swipe)" or "message (Tab)"
  # This requires custom gesture/keyboard testing
