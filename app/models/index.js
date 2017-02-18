import UserModel from './user';
import TagModel from  './tag';
import ArticleModel from './article';
import TagCategoryModel from './tag.category';

// models registry

const User = UserModel.initialize();
const Tag = TagModel.initialize();
const Article = ArticleModel.initialize();
const TagCategory = TagCategoryModel.initialize();

export default {
    User,
    Article,
    Tag,
    TagCategory
}
