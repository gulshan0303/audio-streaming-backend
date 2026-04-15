import { Client } from "@elastic/elasticsearch";

export const esClient = new Client({
  node: "http://127.0.0.1:9200",
});
