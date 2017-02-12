import router from 'koa-router';
import passport from 'koa-passport';

function checkCaptcha(ctx, next) {
    //测试环境不用验证码
    let error_msg;
    if (process.env.NODE_ENV !== 'test'){
        if (!ctx.body.captcha){
            error_msg = "验证码不能为空.";
        } else if (ctx.session.captcha !== ctx.body.captcha.toUpperCase()){
            error_msg = "验证码错误.";
        } else if (ctx.body.email === '' || ctx.body.password === ''){
            error_msg = "用户名和密码不能为空.";
        }
    }
    if (error_msg){
        ctx.status = 422;
        this.body = {error_msg};
        return false;
    }
    next();
}


/*
router.post('/', checkCaptcha, async (ctx, next) => {
    await passport.authenticate('local')
});*/

export default router;
