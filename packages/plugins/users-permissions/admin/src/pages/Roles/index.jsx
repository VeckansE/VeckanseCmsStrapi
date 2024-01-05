import React from 'react';

import { CheckPagePermissions } from '@strapi/helper-plugin';
import { Route, Routes } from 'react-router-dom';

import { PERMISSIONS } from '../../constants';

import { ProtectedRolesCreatePage } from './pages/CreatePage';
import { ProtectedRolesEditPage } from './pages/EditPage';
import { ProtectedRolesListPage } from './pages/ListPage';

const Roles = () => {
  return (
    <CheckPagePermissions permissions={PERMISSIONS.accessRoles}>
      <Routes>
        <Route path="/user-permissions">
          <Route path="/roles/new" exact>
            <ProtectedRolesCreatePage />
          </Route>
          <Route path="/roles/:id" exact>
            <ProtectedRolesEditPage />
          </Route>
          <Route path="/roles" exact>
            <ProtectedRolesListPage />
          </Route>
        </Route>
      </Routes>
    </CheckPagePermissions>
  );
};

export default Roles;
