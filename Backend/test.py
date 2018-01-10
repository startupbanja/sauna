import json
import sys
import time

print("testing test.py")

data = json.loads(sys.stdin.read())

print(json.dumps(data))
