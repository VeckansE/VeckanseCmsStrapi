import { Flex, IconButton, Typography } from '@strapi/design-system';
import { Menu } from '@strapi/design-system/v2';
import { CheckPermissions, useAPIErrorHandler, useNotification } from '@strapi/helper-plugin';
import { Cross, More, Pencil } from '@strapi/icons';
import { isAxiosError } from 'axios';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { DeleteReleaseAction, ReleaseAction } from '../../../shared/contracts/release-actions';
import { PERMISSIONS } from '../constants';
import { useDeleteReleaseActionMutation } from '../services/release';

const StyledMenuItem = styled(Menu.Item)<{ variant?: 'neutral' | 'danger' }>`
  &:hover {
    background: ${({ theme, variant = 'neutral' }) => theme.colors[`${variant}100`]};
  }

  svg {
    path {
      fill: ${({ theme, variant = 'neutral' }) => theme.colors[`${variant}600`]};
    }
  }

  &:hover {
    svg {
      path {
        fill: ${({ theme, variant = 'neutral' }) => theme.colors[`${variant}600`]};
      }
    }
  }
`;

const StyledCross = styled(Cross)`
  padding: ${({ theme }) => theme.spaces[1]};
`;

const StyledPencil = styled(Pencil)`
  padding: ${({ theme }) => theme.spaces[1]};
`;

interface ReleaseActionMenuProps {
  releaseId: DeleteReleaseAction.Request['params']['releaseId'];
  actionId: DeleteReleaseAction.Request['params']['actionId'];
  contentTypeUid?: ReleaseAction['contentType'];
  entryId?: ReleaseAction['entry']['id'];
  locale?: ReleaseAction['locale'];
}

export const ReleaseActionMenu = ({
  releaseId,
  actionId,
  contentTypeUid,
  entryId,
  locale,
}: ReleaseActionMenuProps) => {
  const { formatMessage } = useIntl();
  const toggleNotification = useNotification();
  const { formatAPIError } = useAPIErrorHandler();
  const [deleteReleaseAction] = useDeleteReleaseActionMutation();
  const { push } = useHistory();

  const handleEditEntry = async () => {
    push(`/content-manager/collectionType/${contentTypeUid}/${entryId}`);
  };

  const handleDeleteAction = async () => {
    const response = await deleteReleaseAction({
      params: { releaseId, actionId },
    });

    if ('data' in response) {
      // Handle success
      toggleNotification({
        type: 'success',
        message: formatMessage({
          id: 'content-releases.content-manager-edit-view.remove-from-release.notification.success',
          defaultMessage: 'Entry removed from release',
        }),
      });

      return;
    }

    if ('error' in response) {
      if (isAxiosError(response.error)) {
        // Handle axios error
        toggleNotification({
          type: 'warning',
          message: formatAPIError(response.error),
        });
      } else {
        // Handle generic error
        toggleNotification({
          type: 'warning',
          message: formatMessage({ id: 'notification.error', defaultMessage: 'An error occurred' }),
        });
      }
    }
  };

  return (
    // A user can access the dropdown if they have permissions to delete a release-action OR update a release
    <CheckPermissions permissions={[...PERMISSIONS.deleteAction, ...PERMISSIONS.update]}>
      <Menu.Root>
        {/* 
          TODO Fix in the DS
          - as={IconButton} has TS error:  Property 'icon' does not exist on type 'IntrinsicAttributes & TriggerProps & RefAttributes<HTMLButtonElement>'
          - The Icon doesn't actually show unless you hack it with some padding...and it's still a little strange
         */}
        <Menu.Trigger
          as={IconButton}
          paddingLeft={2}
          paddingRight={2}
          aria-label={formatMessage({
            id: 'content-releases.content-manager-edit-view.release-action-menu',
            defaultMessage: 'Release action options',
          })}
          // @ts-expect-error See above
          icon={<More />}
        />
        {/*
          TODO: Using Menu instead of SimpleMenu mainly because there is no positioning provided from the DS,
          Refactor this once fixed in the DS
         */}
        <Menu.Content top={1} popoverPlacement="bottom-end">
          {/*
            We show edit entry option only if contentTypeUid is provided
            which means that we are on the Release Details page
          */}
          {contentTypeUid && (
            <CheckPermissions
              permissions={[
                {
                  action: 'plugin::content-manager.explorer.update',
                  subject: contentTypeUid,
                  properties: {
                    locales: locale ? [locale] : [],
                  },
                },
              ]}
            >
              <StyledMenuItem onSelect={handleEditEntry}>
                <Flex gap={2}>
                  <StyledPencil />
                  <Typography variant="omega">
                    {formatMessage({
                      id: 'content-releases.content-manager-edit-view.edit-entry',
                      defaultMessage: 'Edit entry',
                    })}
                  </Typography>
                </Flex>
              </StyledMenuItem>
            </CheckPermissions>
          )}
          <CheckPermissions permissions={PERMISSIONS.deleteAction}>
            <StyledMenuItem color="danger600" variant="danger" onSelect={handleDeleteAction}>
              <Flex gap={2}>
                <StyledCross />
                <Typography color="danger600" variant="omega">
                  {formatMessage({
                    id: 'content-releases.content-manager-edit-view.remove-from-release',
                    defaultMessage: 'Remove from release',
                  })}
                </Typography>
              </Flex>
            </StyledMenuItem>
          </CheckPermissions>
        </Menu.Content>
      </Menu.Root>
    </CheckPermissions>
  );
};
