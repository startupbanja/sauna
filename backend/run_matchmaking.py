import matchmaking, json, sys
import convertToCsv

data = json.loads(sys.stdin.read())
params = matchmaking.init(data)
bestResult = None
bestStats = None
retries = 100
#run the algorithm *restries* times and store the best results
for i in range(retries):
  (ready, stats) = matchmaking.matchmake(params[0], params[1], params[2])
  stats = json.loads(stats)
  if bestResult == None or stats['slots']['empty'] < bestStats['slots']['empty']:
    bestResult = ready
    bestStats = stats

convertToCsv.convert(bestResult, "database_data.csv")
stats = json.dumps(bestStats).replace("{", "\n{")
sys.stderr.write(stats)
sys.stdout.write(bestResult)
