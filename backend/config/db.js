import mongoose from "mongoose";

export const connectDB = async() =>{
    await mongoose.connect('mongodb+srv://supriyaacharya63:supriya07@cluster0.xyb68lw.mongodb.net/food-del').then(()=>console.log("DB Connected"));
}