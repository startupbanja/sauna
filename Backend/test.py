import json
import sys

print("testing test.py")

data = json.load(sys.stdin)

print(json.dumps(data))
