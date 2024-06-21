import { DB_NAME } from "../constants.js";
import mongoose from "mongoose";

const connectDB = async () => {
    try {
        // console.log(process.env.MONGODB_URI);
        // console.log(DB_NAME);
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`MongoDB connected : ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log('Error in connection of DB at connectDB in src/db/index.js :: ', error)
        process.exit(1)
    }
}

export default connectDB