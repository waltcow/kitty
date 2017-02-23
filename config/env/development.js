export default {
    serveStatic: true,
    sessionName: 'kitty:id',
    sessionKey: 'kitty-secret-session',
    token: 'kitty-secret-token',
    mongodbURI: 'mongodb://kitty:kitty_pwd@demo.waltcow.com:27017/kitty_dev',
    redisURI: 'redis://kitty:kitty@demo.waltcow.com:6379/0'
}
