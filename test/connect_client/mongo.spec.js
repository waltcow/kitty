import MongodClient from '../../app/connect_client/mongod';


describe('mongodb connect', function() {
    var connection;

    after(() => {
        connection && connection.disconnect();
    });

    it('mongodb connect test', function(done) {
        connection = MongodClient.connect();
        connection.then(() => {
            done();
        }, (err) => {
            done(err);
        });
    });
});
