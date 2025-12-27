import boto3
import json

# Setup connection to your LocalStack "Cloud"
s3 = boto3.client(
    's3',
    endpoint_url="http://localhost:4566",
    aws_access_key_id="test",
    aws_secret_access_key="test",
    region_name="us-east-1"
)

def run_local_eval():
    bucket_name = "agent-bench-results"
    
    # Create the bucket in your local cloud
    print(f"Creating bucket: {bucket_name}...")
    try:
        s3.create_bucket(Bucket=bucket_name)
    except Exception as e:
        print("Bucket might already exist, moving on...")

    # Simulating a mock evaluation log
    eval_data = {
        "agent": "Terminal-Bench-V1",
        "result": "SUCCESS",
        "metrics": {"latency": "150ms", "accuracy": "99.9%"}
    }

    # Upload to LocalStack
    s3.put_object(
        Bucket=bucket_name,
        Key="latest-eval.json",
        Body=json.dumps(eval_data)
    )
    print("✅ Log successfully uploaded to your local AWS S3!")

if __name__ == "__main__":
    run_local_eval()