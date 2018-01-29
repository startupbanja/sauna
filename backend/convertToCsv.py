import json

# two time strings, HH:MM:HH
def getFirstRow(first, last):
  start = int(first[0:2])
  end = int(last[0:2])
  res = [""]
  ##TODO hard coded for 40 mins currently
  mins = ["00", "40", "20" ] * (end - start)
  hours = []
  for i, h in enumerate(range(start, end + 1)):
    hours.append(h)
    if i % 2 == 0:
      hours.append(h)
  for hour, minute in zip (hours, mins):
    res.append("{:02}:{}:00".format(hour, minute))
  # for hour in hours:
  #   for minute in mins:
  #     res.append("{:02}:{}:00".format(hour, minute))
  return res

def convert(data, filename):
  parsed = json.loads(data)
  result = {}
  for element in parsed:
    coach = element['coach']
    if coach not in result.keys():
      result[coach] = [[ element['time'], element['startup'] ]]
    else:
      result[coach].append([ element['time'], element['startup'] ])
# Now: { 'coachname': [[ time1, startup1],[time2, startup2]]}
  for k in result.keys():
    result[k].sort(key=lambda a: a[0])

  # for k in result.keys():
  #   print(str(k) + ": " + str(result[k]))
  times = map(lambda a: result[a], result.keys())
  firstTimes = map(lambda a: result[a][0][0], result.keys())
  lastTimes = map(lambda a: result[a][-1][0], result.keys())
  firstTime = min(firstTimes)
  lastTime = max(lastTimes)

  firstRow = getFirstRow(firstTime, lastTime)
  rows = map(lambda a: [a]+[""]*(len(firstRow) - 1), result.keys())
  for row in rows:
    coach = row[0]
    for pair in result[coach]:
      for i, val in enumerate(firstRow):
        if firstRow[i] == pair[0]:
          row[i] = pair[1]
  # print(firstRow)
  # for r in rows:
  #   print(r)
  resString = ""
  rows.sort(key=lambda a: a[0])
  for row in [firstRow] + rows:
    for element in row:
      resString += str(element) + ","
    resString += "\n"

  f = open(filename, "w")
  f.write(resString)
  f.close()
