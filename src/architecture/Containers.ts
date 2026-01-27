/**
 * Auto-generated Container registrations
 *
 * @deprecated Containers are deprecated. Use zero-config element-based inference instead.
 * Tools are automatically available based on element visibility.
 */

import { createContainer } from '@supernal/interface';

/**
 * Register all containers
 * @deprecated Use zero-config element-based inference instead
 */
export function registerContainers() {
  createContainer({
  id: 'pages',
  name: 'Pages',
  type: 'page',
  route: '/',
});
}

// Auto-register containers on import
registerContainers();
