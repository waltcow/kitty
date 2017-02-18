import mongoose, {Schema} from 'mongoose'

function initialize() {
    const TagSchema = new Schema({
        name: {						//标签名称
            type: String,
            unique: true
        },
        cid: {
            type: Schema.Types.ObjectId,
            ref: 'TagCategory'
        },
        is_index: {
            type: Boolean,
            default:false
        },
        is_show: {
            type:Boolean,
            default:false
        },
        sort:{
            type:Number,
            default:1
        }
    });
    return mongoose.model('Tag', TagSchema);
}
export default { initialize }
