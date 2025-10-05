import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);

export const mongoDbBasicQuery = async ()=>{
    await client.connect();
    return client.db("FestivalAcademyBudapest");
}

export const getIdentitiesByIdsList = async (db: any, participantsArray: any)=>{
    const identitiesObjects = await db
      .collection("artists_and_students")
      .find({ _id: { $in: participantsArray.map((id: number) => new ObjectId(id)) } })
      .toArray();
    return identitiesObjects;
}