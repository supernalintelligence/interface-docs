'use client';

/**
 * Tour Chat - AI Guide Integration (Placeholder)
 *
 * NOTE: This is a placeholder component for Phase 1 implementation.
 * Full integration with ChatProvider will be added in Phase 2.
 *
 * Planned features:
 * - Listen for user chat commands ("next", "back", "skip to X")
 * - Update tour navigation based on commands
 * - Send contextual narration for each section
 * - Provide help and guidance
 *
 * For now, this component does nothing - chat functionality will be
 * integrated once the ChatProvider API is extended to support
 * programmatic message injection.
 */

import React from 'react';

export function TourChat() {
  // TODO: Integrate with ChatProvider
  // - Hook into useChatContext to listen for messages
  // - Parse user commands and call tour navigation methods
  // - Inject AI narration messages when sections change
  //
  // Current blocker: ChatProvider.sendMessage() expects string input
  // and auto-generates responses. Need to extend API to support
  // direct message injection for AI narration.

  return null;
}
