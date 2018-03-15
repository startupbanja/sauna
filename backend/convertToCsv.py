import json

# Return the first header row, which contains the times of meetings
# params: two time strings, HH:MM:HH
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
  return res
# Data is a json string, mapping is a dict
def convert(data, filename, mapping):
  parsed = json.loads(data)
  result = {}
  #result will be in form:
  # {'coachname': [[timestring, startupname], [...] ]}
  for element in parsed:
    coach = element['coach']
    if coach not in result.keys():
      result[coach] = [[ element['time'], element['startup'] ]]
    else:
      result[coach].append([ element['time'], element['startup'] ])
  for k in result.keys():
    result[k].sort(key=lambda a: a[0])

  # Get the first and last meeting times
  times = map(lambda a: result[a], result.keys())
  firstTimes = map(lambda a: result[a][0][0], result.keys())
  lastTimes = map(lambda a: result[a][-1][0], result.keys())
  firstTime = min(firstTimes)
  lastTime = max(lastTimes)

  firstRow = getFirstRow(firstTime, lastTime)
  # rows will be in form: [[coachid, startupid, startupid, ...], [...]]
  # Empty string if coach not available, None if no match found
  rows = [ [a]+[""]*(len(firstRow) - 1) for a in result.keys()]
  for row in rows:
    coach = row[0]
    for pair in result[coach]:
      for i, val in enumerate(firstRow):
        if firstRow[i] == pair[0]:
          row[i] = pair[1]
  # Map ids to names
  for row in rows:
    for i, val in enumerate(row):
      if i == 0:
        if val in mapping['coaches'].keys():
          row[i] = mapping['coaches'][val]
      else:
        if val in mapping['startups'].keys():
          row[i] = mapping['startups'][val]

  # Transform to .csv format string
  resString = ""
  rows.sort(key=lambda a: a[0])
  for row in [firstRow] + rows:
    for element in row:
      resString += str(element) + ","
    resString += "\n"

  f = open(filename, "w")
  f.write(resString)
  f.close()
