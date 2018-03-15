import matchmaking, json, sys
# import convertToCsv

received = json.loads(sys.stdin.read())
# parameters for matchmaking algorithm
data = received.get('data', {})
slotSize = received.get('slotSize', 40)
try:
  params = matchmaking.init(data, slotSize)
except ValueError as e:
  # One of the parameters was probably empty, can't continue execution
  sys.stderr.write(e)
else:
  bestResult = None
  bestStats = None
  retries = 100
  # run the algorithm *retries* times and store the best results
  # best result is the one with least empty slots
  # The return values are in string json format
  for i in range(retries):
    (ready, stats) = matchmaking.matchmake(params[0], params[1], params[2], slotSize=slotSize)
    stats = json.loads(stats)
    if bestResult == None or stats['slots']['empty'] < bestStats['slots']['empty']:
      bestResult = ready
      bestStats = stats

  # TODO do we want to log these stats somehow? using stderr is not a good idea
  # stats = json.dumps(bestStats).replace("{", "\n{")
  # sys.stderr.write(stats)
  sys.stdout.write(bestResult)
