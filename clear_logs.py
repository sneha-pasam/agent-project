import boto3

# Connect to your LocalStack instance
s3 = boto3.resource('s3', endpoint_url="http://localhost:4566")
bucket = s3.Bucket("agent-bench-results")

print("⚠️  Attempting to clear all evaluation logs...")

try:
    # Delete all objects in the bucket
    bucket.objects.all().delete()
    print("✅ Success! S3 bucket is now empty.")
    print("🔄 Refresh your dashboard to see the 'No Data' state.")
except Exception as e:
    print(f"❌ Error: {e}")