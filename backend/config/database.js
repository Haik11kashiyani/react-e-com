
import mongoose from "mongoose";
import process from "process";

const connectDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/db_techorbit';
    await mongoose.connect(MONGO_URI, {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    });
 console.log("MongoDB connected");
 return true;
  } catch (error) { 
    console.error("MongoDB connection error:", error);
  }
}
export default connectDB;
// async function connectDB() {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log("MongoDB connected");
//   } catch (error) { 
//     console.error("MongoDB connection error:", error);
//   } 

// }
// export default connectDB;