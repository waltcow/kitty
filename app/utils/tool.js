import bcrypt from 'bcryptjs';
import moment from 'moment';

moment.locale('zh-cn'); // 使用中文

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

export default {
    formatDate,
    validateId,
    bhash,
    bcompare
}
