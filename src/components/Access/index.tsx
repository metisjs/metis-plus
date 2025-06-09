import React, { useMemo, type FC, type PropsWithChildren } from 'react';
import { useUserStore } from '@/store/user';
import { hasPermission, type Permission } from '@/utils/auth';

type AccessProps = {
  fallback?: React.ReactNode;
  permission: Permission;
};

function convertReactElement(node: React.ReactNode): React.ReactElement {
  if (!React.isValidElement(node)) {
    return <>{node}</>;
  }
  return node;
}

const Access: FC<PropsWithChildren<AccessProps>> = ({ fallback, permission, children }) => {
  const { permissions } = useUserStore((state) => state.currentUser);

  const accessible = useMemo(() => {
    return hasPermission(permission, permissions);
  }, [permissions, JSON.stringify(permission)]);

  if (accessible) {
    return convertReactElement(accessible ? children : fallback);
  }
  if (fallback) {
    return convertReactElement(fallback);
  }
  return null;
};

export default Access;
