"use server";

import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command, DeleteObjectsCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  endpoint: "http://localhost:4566",
  region: "us-east-1",
  credentials: { accessKeyId: "test", secretAccessKey: "test" },
  forcePathStyle: true,
});

const BUCKET_NAME = "agent-bench-results";

export async function sendChatToS3(content: string) {
  const timestamp = Date.now();
  const fileName = `chat_user_${timestamp}.json`;
  try {
    await s3.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: JSON.stringify({ role: "user", content, timestamp }),
      ContentType: "application/json",
    }));
    return { success: true, id: timestamp };
  } catch (error) {
    console.error("S3 Upload Error:", error);
    return { success: false };
  }
}

export async function checkForBotResponse(id: number) {
  const fileName = `chat_bot_${id}.json`;
  try {
    const data = await s3.send(new GetObjectCommand({ Bucket: BUCKET_NAME, Key: fileName }));
    const body = await data.Body?.transformToString();
    return body ? JSON.parse(body) : null;
  } catch (error) { 
    return null; 
  }
}

export async function getChatHistory() {
  try {
    const list = await s3.send(new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: "chat_",
    }));
    if (!list.Contents || list.Contents.length === 0) return [];

    const messages = await Promise.all(
      list.Contents.map(async (file) => {
        try {
          const data = await s3.send(new GetObjectCommand({ Bucket: BUCKET_NAME, Key: file.Key }));
          const body = await data.Body?.transformToString();
          return body ? JSON.parse(body) : null;
        } catch (e) {
          return null;
        }
      })
    );
    return messages.filter((m) => m !== null).sort((a, b) => a.timestamp - b.timestamp);
  } catch (error) { 
    return []; 
  }
}

export async function clearChatHistory() {
  try {
    const list = await s3.send(new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: "chat_",
    }));

    if (!list.Contents || list.Contents.length === 0) return { success: true };

    const deleteParams = {
      Bucket: BUCKET_NAME,
      Delete: {
        Objects: list.Contents.map((content) => ({ Key: content.Key })),
      },
    };

    await s3.send(new DeleteObjectsCommand(deleteParams));
    return { success: true };
  } catch (error) {
    console.error("Error clearing history:", error);
    return { success: false };
  }
}