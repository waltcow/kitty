import bcrypt from 'bcryptjs';
import moment from 'moment';

moment.locale('zh-cn'); // 使用中文

function getToken(ctx) {
    const header = ctx.request.header.authorization;
    if (!header) return null;
    const parts = header.split(' ');
    if (parts.length !== 2) return null;
    const scheme = parts[0];
    const token = parts[1];
    if (/^Bearer$/i.test(scheme)) return token;
    return null;
}

// 格式化时间
function formatDate(date, friendly) {
    date = moment(date);
    if (friendly) {
        return date.fromNow();
    } else {
        return date.format('YYYY-MM-DD HH:mm');
    }
}

function validateId(str) {
    return (/^[a-zA-Z0-9\-_]+$/i).test(str);
}

function bhash(str, callback) {
    bcrypt.hash(str, 10, callback);
}

function bcompare(str, hash, callback) {
    bcrypt.compare(str, hash, callback);
}

export {
    getToken,
    formatDate,
    validateId,
    bhash,
    bcompare
}
