import type { ComponentType, LazyExoticComponent } from 'react';

export type RouteConfig = {
  path: string;
  component: LazyExoticComponent<ComponentType<any>>;
  protected?: boolean;
  roleProtected?: {
    allowedRoles?: string[];
    blockedRoles?: string[];
  };
};

