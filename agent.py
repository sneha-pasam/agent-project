import boto3
import json
import time
import random
from datetime import datetime

# Configuration
BUCKET_NAME = "agent-bench-results"
s3 = boto3.client('s3', endpoint_url="http://localhost:4566")

def run_agent_loop():
    # Ensure bucket exists
    try:
        s3.create_bucket(Bucket=BUCKET_NAME)
        print(f"Checking bucket: {BUCKET_NAME}...")
    except:
        pass

    print("🚀 Agent Live Loop Started. Press Ctrl+C to stop.")
    
    while True:
        # Simulate evaluation with slight variations
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        simulated_latency = f"{random.randint(140, 180)}ms"
        
        log_data = {
            "agent": "Terminal-Bench-V1",
            "result": "SUCCESS",
            "last_updated": timestamp,
            "metrics": {
                "latency": simulated_latency,
                "accuracy": "99.9%"
            }
        }

        # Upload to S3
        file_name = "latest_results.json"
        s3.put_object(Bucket=BUCKET_NAME, Key=file_name, Body=json.dumps(log_data))
        
        print(f"[{timestamp}] ✅ Dashboard Updated (Latency: {simulated_latency})")
        
        # Wait for 10 seconds before next update
        time.sleep(10)

if __name__ == "__main__":
    run_agent_loop()