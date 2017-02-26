import mongoose, {Schema} from 'mongoose';
import crypto from 'crypto';
import config from '../../config';
import jwt from 'jsonwebtoken';

function initialize() {
    const UserSchema = new Schema({
        username: {
            type: String,
            min: [2, 'Username `{VALUE}` not valid', 'length must be at least 2 character'],
            max: [2, 'Username `{VALUE}` not valid', 'length must be less than 15 character'],
            required: [true, 'Username is required'],
            unique: true,
            match: [/^[(\u4e00-\u9fa5)0-9a-zA-Z\_\s@]+$/, 'Please fill a valid username address']
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
        },
        hashed_password: {
            type: String,
            required: true
        },
        avatar: String,
        salt: String,
        role: {
            type: String,
            required: true,
            default: 'user',
            enum: ['user', 'admin']
        },
        active: {
            type: Boolean,
            default: true
        },
        created_at: {
            type: Date,
            default: Date.now()
        },
        update_at: {
            type: Date,
            default: Date.now
        }
    }, {
        versionKey: false,
        toJSON: {
            transform(doc, ret) {
                ret.user_id = ret._id;
                delete ret._id;
                delete ret.salt;
                delete ret.hashed_password;
            }
        }
    });

   //创建索引
    UserSchema.index({username: 1}, {unique: true});
    UserSchema.index({email: 1}, {unique: true});

    UserSchema
        .virtual('password')
        .set(function(password) {
            this._password = password;
            this.salt = this.generateSalt();
            this.hashed_password = this.encryptPassword(password);
        })
        .get(function() {
            return this._password;
        });

// Non-sensitive info we'll be putting in the token
    UserSchema
        .virtual('token_payload')
        .get(function() {
            return {
                '_id': this._id,
                'role': this.role
            };
        });

    UserSchema.pre('save', function(next){
        this.update_at = new Date();
        next();
    });

    /**
     * methods
     */
    UserSchema.methods = {
        //检查用户权限
        hasRole: function(role) {
            return this.role.indexOf(role) !== -1;
        },
        //验证用户密码
        authenticate: function(plainText) {
            return this.encryptPassword(plainText) === this.hashed_password;
        },
        //生成盐
        generateSalt: function() {
            return crypto.randomBytes(16).toString('base64');
        },
        //生成token
        generateToken: function () {
            return jwt.sign(this.token_payload, config.tokenSecret, {expiresIn: config.tokenExpireIn})
        },
        //生成密码
        encryptPassword: function(password) {
            if (!password || !this.salt) return '';
            var salt = new Buffer(this.salt, 'base64');
            return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha1').toString('base64');
        }
    };

    UserSchema.set('toObject', { virtuals: true });
    return mongoose.model('User', UserSchema);
}

export default {
    initialize
}
