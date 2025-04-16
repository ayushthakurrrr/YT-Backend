import { Schema, model } from "mongoose";

const commentSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    commentBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    commentOn: {
        type: Schema.Types.ObjectId,
        ref: "Video"
    }
},
    {
        timestamps: true
    });

export const commentModel = model("Comment", commentSchema);