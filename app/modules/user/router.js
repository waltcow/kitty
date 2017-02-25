import * as user from './controller'
import { ensureUser } from '../../middlewares/validator'

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
        route: '/:id',
        handlers: [
            ensureUser,
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
