import type { CollectionConfig } from 'payload';

export const Users: CollectionConfig = {
  slug: 'users',
  admin: { useAsTitle: 'username' },
  // Log in with a username (or email). requireEmail: false lets users be created with just a username.
  auth: { loginWithUsername: { allowEmailLogin: true, requireEmail: false } },
  fields: [],
};
