const port = Number.parseInt(process.env.PORT) || 3000;

module.exports = {
    port: port,
    hostName: 'http://localhost:' + port,
    serveStatic: true,
    assetHost: '',
    redisUrl: 'redis://localhost:6379/1',
    secretKeyBase: 'e22aa737f2efd74a2d9bd06e492fb525ee2e79802ada8f7759f21b604f39b3e803abc9ddf37c7f9554a5658593ffac1370631c341c8a034e7604954916a0786d'
};
