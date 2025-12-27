import boto3
import json
import time
import random
from datetime import datetime

# Configuration
BUCKET_NAME = "agent-bench-results"
# Connect to LocalStack S3
s3 = boto3.client('s3', endpoint_url="http://localhost:4566")

def run_agent_loop():
    try:
        s3.create_bucket(Bucket=BUCKET_NAME)
        print(f"✅ Bucket ready: {BUCKET_NAME}")
    except:
        pass

    print("🚀 Agent Chaos Loop Started. Press Ctrl+C to stop.")
    
    while True:
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # 1. 80% Success, 20% Failure logic
        is_success = random.random() < 0.8
        status = "SUCCESS" if is_success else "FAILED"
        
        # 2. Dynamic metrics based on status
        latency_val = random.randint(140, 180) if is_success else random.randint(2000, 5000)
        accuracy_val = "99.9%" if is_success else "0.0%"
        
        log_data = {
            "agent": "Terminal-Bench-V1",
            "result": status,
            "last_updated": timestamp,
            "metrics": {
                "latency": f"{latency_val}ms",
                "accuracy": accuracy_val
            }
        }

        # 3. Create a unique filename for the history table
        file_name = f"eval_{datetime.now().strftime('%H%M%S')}.json"
        
        # 4. Single Upload
        s3.put_object(Bucket=BUCKET_NAME, Key=file_name, Body=json.dumps(log_data))

        icon = "✅" if is_success else "❌"
        print(f"[{timestamp}] {icon} Uploaded: {status} (Latency: {latency_val}ms)")

        # 5. Wait 10 seconds for the next "heartbeat"
        time.sleep(10)

if __name__ == "__main__":
    run_agent_loop()