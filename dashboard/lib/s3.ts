import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  endpoint: "http://localhost:4566",
  region: "us-east-1",
  credentials: { accessKeyId: "test", secretAccessKey: "test" },
  forcePathStyle: true,
});

export async function fetchEvalData() {
  try {
    const listCmd = new ListObjectsV2Command({ Bucket: "agent-bench-results" });
    const list = await s3Client.send(listCmd);

    if (!list.Contents) return [];

    // Fetch details for all objects
    const dataPromises = list.Contents.map(async (obj) => {
      const getCmd = new GetObjectCommand({ Bucket: "agent-bench-results", Key: obj.Key });
      const response = await s3Client.send(getCmd);
      const str = await response.Body?.transformToString();
      return str ? JSON.parse(str) : null;
    });

    const results = await Promise.all(dataPromises);
    // Sort by timestamp if available, otherwise return all
    return results.filter(r => r !== null).reverse(); 
  } catch (e) {
    console.error("S3 Fetch Error:", e);
    return [];
  }
}