export const API = {
  auth: {
    login: 'auth/login',
    register: 'auth/register',
    logout: 'auth/logout',
    refresh: 'auth/refresh-token',
  },
  language: {
    list: 'languages',
    create: 'language/create',
    update: 'language/update',
    destroy: 'language/destroy',
  },
  item: {
    list: 'items',
    create: 'item/create',
    update: 'item/update',
    destroy: 'item/destroy',
    allItemsList: 'all-items-list',
  },
  mapping: {
    list: 'item-translations',
    create: 'item-translation/create',
    update: 'item-translation/update',
    destroy: 'item-translation/destroy',
  },
};
