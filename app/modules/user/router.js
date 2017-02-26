import * as user from './controller'
import { authToken } from '../../middlewares/validator'

export const baseUrl = '/user';

export const routes =  [
    {
        method: 'POST',
        route: '/',
        handlers: [
            user.createUser
        ]
    },

    {
        method: 'GET',
        route: '/',
        handlers: [
            authToken,
            user.getUsers
        ]
    },
    {
        method: 'GET',
        route: '/:id',
        handlers: [
            authToken,
            user.getUser
        ]
    },
    {
        method: 'PUT',
        route: '/:id',
        handlers: [
          /*  authToken,*/
            user.updateUser
        ]
    },
    {
        method: 'DELETE',
        route: '/:id',
        handlers: [
            user.getUser,
            user.deleteUser
        ]
    }
];
