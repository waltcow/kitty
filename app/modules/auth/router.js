import * as auth from './controller'

export const baseUrl = '/auth';

export const routes =  [
    {
        method: 'POST',
        route: '/',
        handlers: [
            auth.authUser
        ]
    }
];
