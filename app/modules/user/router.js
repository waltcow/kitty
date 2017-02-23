import * as user from './controller'

export const baseUrl = 'api/v1/user';

export default [
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
            user.getUsers
        ]
    },
    {
        method: 'GET',
        route: '/:id',
        handlers: [

            user.getUser
        ]
    },
    {
        method: 'PUT',
        route: '/:id',
        handlers: [

            user.getUser,
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
]
