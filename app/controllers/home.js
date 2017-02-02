const index = async (ctx, _next) => {
    var n = ctx.session.views || 0;
    ctx.session.views = ++n;
    let locals = {view: n};
    await ctx.render('home/index', locals);
};

const about = async (ctx, _next) => {
    await ctx.render('home/about', locals);
};

export default {
    index,
    about
};
