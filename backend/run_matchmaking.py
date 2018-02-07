import matchmaking, json, sys
import convertToCsv

received = json.loads(sys.stdin.read())
# parameters for matchmaking algorithm
data = received['data']
# mapping from startup and coach id to name
mapping = received['mapping']
params = matchmaking.init(data)
bestResult = None
bestStats = None
retries = 100
#run the algorithm *retries* times and store the best results
#The return values are in string json format
for i in range(retries):
  (ready, stats) = matchmaking.matchmake(params[0], params[1], params[2])
  stats = json.loads(stats)
  if bestResult == None or stats['slots']['empty'] < bestStats['slots']['empty']:
    bestResult = ready
    bestStats = stats

convertToCsv.convert(bestResult, "database_data.csv", mapping)
stats = json.dumps(bestStats).replace("{", "\n{")
sys.stderr.write(stats)
sys.stdout.write(bestResult)
