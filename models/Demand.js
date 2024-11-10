import mongoose from 'mongoose';

const demandSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    date: { type: Date, default: Date.now },
    content: { type: String, required: true },
    upvotes: { type: Number, default: 0 },
    storyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Story' }
});
  
const Demand = mongoose.model('Demand', demandSchema);

export default Demand;