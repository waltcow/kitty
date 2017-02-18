import mongoose, {Schema} from 'mongoose'

function initialize() {
    let TagCategorySchema = new Schema({
        name: {
            type:String,
            unique: true
        },	//分类名称
        desc: String		//分类描述
    });
    return mongoose.model('TagCategory', TagCategorySchema);
}


export default { initialize }
