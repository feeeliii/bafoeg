import mongoose from 'mongoose';

const storySchema = new mongoose.Schema({
    // userName: { type: String, required: true },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    date: { 
        type: Date,
        default: Date.now
    },
    content: {
        type: String,
        required: true,
        minlength: 20
    },
    upvotes: {
        type: Number,
        default: 0
    },
    sentiment: {
        type: String,
        enum: ['positive', 'negative'],
        required: true
    },
    demandId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Demand'
    }
});
  
const Story = mongoose.model('Story', storySchema);

export default Story;