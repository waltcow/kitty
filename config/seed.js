import mongoose from 'mongoose';

const User = mongoose.model('User');
const Article = mongoose.model('Article');
const TagCategory = mongoose.model('TagCategory');
const Tag = mongoose.model('Tag');

export default async () => {
    const userCount = await User.count();
    if (userCount === 0) {
        return await User.create({
            username:'admin',
            email:'admin@admin.com',
            role:'admin',
            password:'admin'
        },{
            username:'test001',
            email:'a@test.com',
            role:'user',
            password:'test'
        },{
            username:'test002',
            email:'b@test.com',
            role:'user',
            password:'test',
        },{
            username:'test003',
            email:'c@test.com',
            role:'user',
            password:'test',
        });
    }
}
