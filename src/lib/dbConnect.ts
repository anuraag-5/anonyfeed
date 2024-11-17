import mongoose from "mongoose";

type ConnectionObject = {
    isConnected? : number
}

const connection : ConnectionObject = {}

async function dbConnect() : Promise<void> {
    if(connection.isConnected){
        console.log("Already connected")
        return
    }

    try {
        const db = await mongoose.connect(process.env.MONGO_URI || "" , {})
        console.log(db)

        connection.isConnected = db.connections[0].readyState

        console.log("Db connected successfully")
    } catch (error) {
        console.log("Db not connected",error)
    }
}

export default dbConnect