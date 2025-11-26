import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    urls: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Url',
        },
    ],
});

const User = mongoose.model('User', UserSchema);

export default User;