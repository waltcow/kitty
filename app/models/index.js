import UserModel from './user';
import TagModel from  './tag';
import ArticleModel from './article';
import TagCategoryModel from './tag.category';
import mongoClient from '../connect_client/mongod';

mongoClient.connect();

// Mongoose lets you start using your models immediately, without waiting for mongoose to establish a connection to MongoDB.
// models registry
const User = UserModel.initialize();
const Tag = TagModel.initialize();
const Article = ArticleModel.initialize();
const TagCategory = TagCategoryModel.initialize();

export {
    User,
    Article,
    Tag,
    TagCategory
}
