import { lazy } from 'react';

import { MenuItem } from '@strapi/helper-plugin';

export interface Route extends Pick<MenuItem, 'to'>, Required<Pick<MenuItem, 'Component'>> {}

export const ROUTES_CE: Route[] = [
  {
    Component: lazy(() =>
      import('./pages/Roles/ListPage').then((mod) => ({ default: mod.ProtectedListPage }))
    ),
    to: '/roles',
  },
  {
    Component: lazy(() =>
      import('./pages/Roles/CreatePage').then((mod) => ({ default: mod.ProtectedCreatePage }))
    ),
    to: '/roles/duplicate/:id',
  },
  {
    Component: lazy(() =>
      import('./pages/Roles/CreatePage').then((mod) => ({ default: mod.ProtectedCreatePage }))
    ),
    to: '/roles/new',
  },
  {
    Component: lazy(() =>
      import('./pages/Roles/EditPage').then((mod) => ({ default: mod.ProtectedEditPage }))
    ),
    to: '/roles/:id',
  },
  {
    Component: lazy(() =>
      import('./pages/Users/ListPage').then((mod) => ({ default: mod.ProtectedListPage }))
    ),
    to: '/users',
  },
  {
    Component: lazy(() =>
      import('./pages/Users/EditPage').then((mod) => ({ default: mod.ProtectedEditPage }))
    ),
    to: '/users/:id',
  },
  {
    Component: lazy(() =>
      import('./pages/Webhooks/CreatePage').then((mod) => ({ default: mod.ProtectedCreatePage }))
    ),
    to: '/webhooks/create',
  },
  {
    Component: lazy(() =>
      import('./pages/Webhooks/EditPage').then((mod) => ({ default: mod.ProtectedEditPage }))
    ),
    to: '/webhooks/:id',
  },
  {
    Component: lazy(() =>
      import('./pages/Webhooks/ListPage').then((mod) => ({ default: mod.ProtectedListPage }))
    ),
    to: '/webhooks',
  },
  {
    Component: lazy(() =>
      import('./pages/ApiTokens/ListView').then((mod) => ({ default: mod.ProtectedListView }))
    ),
    to: '/api-tokens',
  },
  {
    Component: lazy(() =>
      import('./pages/ApiTokens/CreateView').then((mod) => ({ default: mod.ProtectedCreateView }))
    ),
    to: '/api-tokens/create',
  },
  {
    Component: lazy(() =>
      import('./pages/ApiTokens/EditView/EditViewPage').then((mod) => ({
        default: mod.ProtectedEditView,
      }))
    ),
    to: '/api-tokens/:id',
  },
  {
    Component: lazy(() =>
      import('./pages/TransferTokens/CreateView').then((mod) => ({
        default: mod.ProtectedCreateView,
      }))
    ),
    to: '/transfer-tokens/create',
  },
  {
    Component: lazy(() =>
      import('./pages/TransferTokens/ListView').then((mod) => ({ default: mod.ProtectedListView }))
    ),
    to: '/transfer-tokens',
  },
  {
    Component: lazy(() =>
      import('./pages/TransferTokens/EditView').then((mod) => ({ default: mod.ProtectedEditView }))
    ),
    to: '/transfer-tokens/:id',
  },
  {
    Component: lazy(() =>
      import('./pages/PurchaseAuditLogs').then((mod) => ({ default: mod.PurchaseAuditLogs }))
    ),
    to: '/purchase-audit-logs',
  },
  {
    Component: lazy(() =>
      import('./pages/PurchaseReviewWorkflows').then((mod) => ({
        default: mod.PurchaseReviewWorkflows,
      }))
    ),
    to: '/purchase-review-workflows',
  },
  {
    Component: lazy(() =>
      import('./pages/PurchaseSingleSignOn').then((mod) => ({ default: mod.PurchaseSingleSignOn }))
    ),
    to: '/purchase-single-sign-on',
  },
];
