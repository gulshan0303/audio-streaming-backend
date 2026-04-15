import { esClient } from "../config/elasticsearch";

const createIndex = async () => {
  const exists = await esClient.indices.exists({ index: "songs" });

  if (!exists) {
    await esClient.indices.create({
      index: "songs",
      mappings: {
        properties: {
          title: { type: "text" },
          artist: { type: "text" },
        },
      },
    });

    console.log("✅ Index created");
  }
};

createIndex();
