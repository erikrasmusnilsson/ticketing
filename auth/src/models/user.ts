import mongoose from 'mongoose';
import { Password } from '../utils/password';

interface UserAttributes {
    email: string;
    password: string; 
};

interface UserModel extends mongoose.Model<UserDocument> {
    build(attrs: UserAttributes): UserDocument
}

interface UserDocument extends mongoose.Document {
    email: string;
    password: string;
}

const schema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.password; 
            delete ret.__v;
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

schema.pre("save", async function(this: UserDocument, done) {
    if (this.isModified("password")) {
        const hash = await Password.toHash(this.get("password"));
        this.set("password", hash);
    }
    done();
});

schema.statics.build = (attrs: UserAttributes) => {
    return new User(attrs);
};

export const User = mongoose.model<UserDocument, UserModel>("User", schema);