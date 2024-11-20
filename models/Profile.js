import mongoose from 'mongoose'

const profileSchema = new mongoose.Schema({
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
})

const Profile = mongoose.model('Profile', profileSchema)

export default Profile