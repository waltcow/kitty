import UserModel from './user';
import TagModel from  './tag';
import ArticleModel from './article';
import TagCategoryModel from './tag.category';
import mongoClient from '../connect_client/mongod';
import {logger} from '../utils/logger';

mongoClient.connect().then(function () {
    logger.info('mongo connect establish');
}).catch(function () {
    process.exit(1)
});

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
