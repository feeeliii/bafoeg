import mongoose from 'mongoose';

const demandSchema = new mongoose.Schema({
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
    storyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Story'
    }
});
  
const Demand = mongoose.model('Demand', demandSchema);

export default Demand;