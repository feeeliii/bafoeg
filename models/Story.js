import mongoose from 'mongoose';

const storySchema = new mongoose.Schema({
    userName: { type: String, required: true },
    date: { type: Date, default: Date.now },
    content: { type: String, required: true },
    upvotes: { type: Number, default: 0 },
    sentiment: { type: String, enum: ['positive', 'negative'], required: true },
    demandId: { type: mongoose.Schema.Types.ObjectId, ref: 'Demand' }
});
  
const Story = mongoose.model('Story', storySchema);

export default Story;