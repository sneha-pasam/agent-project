import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
  endpoint: "http://localhost:4566", // Pointing to your local Docker container
  region: "us-east-1",
  credentials: { accessKeyId: "test", secretAccessKey: "test" },
  forcePathStyle: true,
});

export async function fetchEvalData() {
  const command = new GetObjectCommand({
    Bucket: "agent-bench-results",
    Key: "latest-eval.json",
  });

  try {
    const response = await s3Client.send(command);
    const str = await response.Body?.transformToString();
    return str ? JSON.parse(str) : null;
  } catch (err) {
    console.error("No data found in local S3 yet.");
    return null;
  }
}