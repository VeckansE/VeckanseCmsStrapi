import { lazy } from 'react';

import type { Route } from '../../../../../admin/src/pages/Settings/constants';

export const ROUTES_EE: Route[] = [
  ...(window.strapi.features.isEnabled(window.strapi.features.AUDIT_LOGS)
    ? [
        {
          Component: lazy(() =>
            import('./pages/AuditLogs/ListPage').then((mod) => ({ default: mod.ProtectedListPage }))
          ),
          to: '/audit-logs',
        },
      ]
    : []),
  ...(window.strapi.features.isEnabled(window.strapi.features.REVIEW_WORKFLOWS)
    ? [
        {
          Component: lazy(() =>
            import('./pages/ReviewWorkflows/ListPage').then((mod) => ({
              default: mod.ProtectedReviewWorkflowsPage,
            }))
          ),
          to: '/review-workflows',
        },
        {
          Component: lazy(() =>
            import('./pages/ReviewWorkflows/CreatePage').then((mod) => ({
              default: mod.ReviewWorkflowsCreatePage,
            }))
          ),
          to: '/review-workflows/create',
        },
        {
          Component: lazy(() =>
            import('./pages/ReviewWorkflows/EditPage').then((mod) => ({
              default: mod.ReviewWorkflowsEditPage,
            }))
          ),
          to: '/review-workflows/:workflowId',
        },
      ]
    : []),
  ...(window.strapi.features.isEnabled(window.strapi.features.SSO)
    ? [
        {
          Component: lazy(() =>
            import('./pages/SingleSignOnPage').then((mod) => ({ default: mod.ProtectedSSO }))
          ),
          to: '/single-sign-on',
        },
      ]
    : []),
];
