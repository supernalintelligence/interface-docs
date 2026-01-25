/**
 * Auto-generated Component Names for Next.js project
 *
 * These names provide type-safe access to all interactive elements
 * discovered in the project. Use them with the testId helper:
 *
 * @example
 * import { testId } from '@supernal/interface/testing';
 * import { Blog } from './ComponentNames';
 *
 * // In component:
 * <button data-testid={testId(Blog.submitButton)}>Submit</button>
 *
 * // In test:
 * await page.locator(testId(Blog.submitButton)).click();
 *
 * Generated from: 9 components
 * Total interactive elements: 34
 */

import { createNames } from '@supernal/interface';

/**
 * Document Component Names
 * Prefix: document
 * Note: Renamed to DocumentNames to avoid conflict with global Document type
 */
export const DocumentNames = createNames('document', {
  link: 'link',
  link2: 'link2',
  link3: 'link3',
  link4: 'link4',
  link5: 'link5',
});

/**
 * BlogPost Component Names
 * Prefix: blogPost
 */
export const BlogPost = createNames('blogPost', {
  link: 'link',
});

/**
 * NewLandingPage Component Names
 * Prefix: newLandingPage
 */
export const NewLandingPage = createNames('newLandingPage', {
  forUsers: 'forUsers',
  forDevelopers: 'forDevelopers',
  forBusiness: 'forBusiness',
  showcase: 'showcase',
  pricing: 'pricing',
  vsCompetitors: 'vsCompetitors',
  documentation: 'documentation',
  examples: 'examples',
  gitHub: 'gitHub',
  blog: 'blog',
  communityDiscord: 'communityDiscord',
  support: 'support',
});

/**
 * Footer Component Names
 * Prefix: footer
 */
export const Footer = createNames('footer', {
  form: 'form',
  link: 'link',
  link2: 'link2',
  link3: 'link3',
  link4: 'link4',
  link5: 'link5',
  link6: 'link6',
  link7: 'link7',
  link8: 'link8',
  link9: 'link9',
  link10: 'link10',
});

/**
 * Header Component Names
 * Prefix: header
 */
export const Header = createNames('header', {
  link: 'link',
});

/**
 * InteractiveWidgets Component Names
 * Prefix: interactiveWidgets
 */
export const InteractiveWidgets = createNames('interactiveWidgets', {
  form: 'form',
});

/**
 * StatefulInteractiveWidgets Component Names
 * Prefix: statefulInteractiveWidgets
 */
export const StatefulInteractiveWidgets = createNames('statefulInteractiveWidgets', {
  form: 'form',
});

/**
 * Pages Component Names
 * Prefix: pages
 */
export const Pages = createNames('pages', {
  link: 'link',
  button: 'button',
});
