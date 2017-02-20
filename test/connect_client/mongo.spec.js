import MongoClient from '../../app/connect_client/mongod';
import Models from '../../app/models';

describe('mongodb connect', function() {

    it('initialize database with fake data', function (done) {
        const User = Models.User;
        User.count().then(function (userCount) {
            if (userCount === 0) {
                return User.create({
                    username:'admin',
                    email:'admin@admin.com',
                    role:'admin',
                    password:'admin'
                },{
                    username:'test001',
                    email:'a@test.com',
                    role:'user',
                    password:'test'
                },{
                    username:'test002',
                    email:'b@test.com',
                    role:'user',
                    password:'test'
                },{
                    username:'test003',
                    email:'c@test.com',
                    role:'user',
                    password:'test'
                });
            }
        }).then(function (data) {
            console.log(data);
            done()
        }).catch(function (err) {
            console.log(err);
            done();
        })
    });
});


