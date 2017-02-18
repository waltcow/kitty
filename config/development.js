const port = Number.parseInt(process.env.PORT) || 3000;

export default {
    port: port,
    hostName: 'http://demo.waltcow.com:' + port,
    serveStatic: true,
    assetHost: '',
    redis: {
        url: 'redis://demo.waltcow.com:6379',
        password: 'kitty'
    },
    mongo: {
        host: 'demo.waltcow.com',
        name: 'kitty_dev',
        user: 'kitty',
        password: 'kitty_pwd',
        port: 27017,
        auth: true
    },
    initMockData: true,
    cookie:  {
        domain: '',
        maxAge: 60000 * 5
    },
    auth: {
        accessTokenTtl: 60 * 5,
        refreshTokenTtl: 60 * 2
    },
    secretKeyBase: 'e22aa737f2efd74a2d9bd06e492fb525ee2e79802ada8f7759f21b604f39b3e803abc9ddf37c7f9554a5658593ffac1370631c341c8a034e7604954916a0786d'
};
