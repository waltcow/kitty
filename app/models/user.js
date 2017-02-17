import mongoose, {Schema} from 'mongoose';

const UserSchema = new Schema({
    username: {
       type: String,
       required: true,
       unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    hashed_password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['user','admin']
    },
    active: {
        type: Boolean,
        default: true
    },
    created_at: {
        type: Date,
        required: true,
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
            delete ret.hashed_password;
        }
    }
});

UserSchema.index({email: 1}, {unique: true});

UserSchema.pre('save', function(next){
    this.update_at = new Date();
    next();
});

export default mongoose.models('User', UserSchema)
