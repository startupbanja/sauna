import matchmaking, json, sys
import convertToCsv

data = json.loads(sys.stdin.read())
params = matchmaking.init(data)
(ready, stats) = matchmaking.matchmake(params[0], params[1], params[2])
convertToCsv.convert(ready, "database_data.csv")
stats = stats.replace("{", "\n{")
sys.stderr.write(stats)
sys.stdout.write(ready)
