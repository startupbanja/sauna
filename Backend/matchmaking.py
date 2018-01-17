import json
import sys
import time
import random
import datetime

#{ feedbacks: [{startup: string, startupfeedback: int, coach: string, coachfeedback: int}],
# availabilities: {coachname(string): {starttime: string, duration: int}}
#}

# {startup: "asd", startupfeedback: 1, coach: "dasdsa", coachfeedback: 0}

# {"asd": {starttime, duration}}

# change starttime and duration to timedelta objects for easy comparison

# keep track of meeting count for startups, used for sorting
# return of the sum of coach and startup feedbacks
# returns 2.5 if both are -1 aka null
def getSum(startup, coach):
  if (startup + coach == -2):
    return 2.5
  return max(0, startup) + max(0, coach)

#Comparison functions for the different sorts used
# dictA, dictB are elements from the "feedbacks" list
def cmpByFeedback(dictA, dictB):
  sumA = getSum(dictA['startupfeedback'], dictA['coachfeedback'])
  sumB = getSum(dictB['startupfeedback'], dictB['coachfeedback'])
  return int(sumA - sumB)

#compare by starting time of coach availability
def cmpByTimestart(dictA, dictB, availabilities):
  a = availabilities[dictA['coach']]['starttime'].seconds
  b = availabilities[dictB['coach']]['starttime'].seconds
  return a - b

# compare by duration of coach availability
def cmpByTimetotal(dictA, dictB, availabilities):
  a = availabilities[dictA['coach']]['duration'].seconds
  b = availabilities[dictB['coach']]['duration'].seconds
  return a - b

def cmpByStartupMeetingCount(dictA, dictB, startupMeetingCount):
  a = startupMeetingCount[dictA['startup']]
  b = startupMeetingCount[dictB['startup']]
  return a - b

#Filters out feedback elements that meet the following criteria:
# Startuo gave feedback score 0
# Coach gave 0 and startup gave no response
# Sum of feedbacks is less than 0
# Coach did not give any available times
def filterFeedbacks(elem, availabilities):
  startup = elem['startupfeedback']
  coach = elem['coachfeedback']
  if startup == 0:
    return False
  if coach == 0 and startup == -1:
    return False
  if getSum(coach, startup) <= 2: #coach != -1 and startup != -1 and startup + coach <= 2:
    return False
  if elem['coach'] not in availabilities.keys():
    return False
  return True

def timedeltaToMins(timedelta):
  return timedelta.seconds / 60

# returns true if there would be a double booking at a certain timeslot in timetable
#
def isLegal(startup, timetable, coach, index):
  slotSize = 40#datetime.timedelta(minutes = 40) # TODO
  # check if they are already meeting
  if startup in timetable[coach][2]:
    return False
  # check if coach is reserved at that time
  if timetable[coach][2][index] != None:
    return False
  # check if startup is reserved at that time
  # starttime = coachTuple[0]
  nOfSlots = timetable[coach][1] // slotSize
  for newCoach in timetable:
    if newCoach != coach:
      starttime0 = timetable[coach][0]
      timeToBeChecked = starttime0 + datetime.timedelta(minutes=slotSize * index)
      starttime1 = timetable[newCoach][0]
      i1 = timedeltaToMins((timeToBeChecked - starttime1) // slotSize)
      if len(timetable[newCoach]) > i1 and timetable[newCoach][i1] == startup:
        return False
  return True


# find a place for a feedback element in the timetable(list)
# elem: {startup: "asd", startupfeedback: 1, coach: "dasdsa", coachfeedback: 0}
def findPlace(elem, timetable, startupMeetingCount):
  coach = elem['coach']
  startup = elem['startup']
  # TODO check here if startup and coach are already meeting?
  for i in range(len(timetable[coach][2])):
    if isLegal(startup, timetable, coach, i):
      #insert and return true
      startupMeetingCount[startup] += 1
      timetable[coach][2][i] = startup
      return True
  return False

def getEmptyTimetable(availabilities, slotSize):
  timetable = {}
  for name in availabilities.keys():
    timetable[name] = [availabilities[name]['starttime'], availabilities[name]['duration'], []]
    slotCount = (availabilities[name]['duration'] / slotSize).seconds / 60
    timetable[name][2] = [None] * int(slotCount)
  return timetable

def init(test, testData):
  if test:
    data = testData
  else:
    data = json.loads(sys.stdin.read())

  feedbacks = data['feedbacks']
  oldAvail = data['availabilities']
  startupMeetingCount = dict(map(lambda d: (d['startup'], 0), feedbacks))
  # startupMeetingCount = {feedbacks[k]['startup']: 0 for k in feedbacks.keys()}
  def mapAvail(coach):
    old = oldAvail[coach]
    times = old['starttime'].split(':')
    res = (coach,
    {
    'starttime': datetime.timedelta(hours=int(times[0]), minutes=int(times[1])),
    'duration': datetime.timedelta(minutes=old['duration'])
    })
    return res
  availabilities = dict(map(mapAvail , oldAvail.keys()) )
  return feedbacks, availabilities, startupMeetingCount
# timedelta, int (minutes), int
def toTimeString(start, duration, i):
  time = start.seconds + (duration * 60 * i)
  secs = time % 60
  mins = time / 60 % 60
  hrs = time / (60 * 60)
  return "{:02}:{:02}:{:02}".format(hrs, mins, secs)

def transformToReturn(timetable):
  duration = 40
  res = []
  for key in timetable.keys():
    times = timetable[key]
    start = times[0]
    total = times[1]
    slots = times[2]
    for i, startup in enumerate(slots):
      if startup != None:
        time = toTimeString(start, duration, i)
        res.append({'coach': key, 'startup': startup, 'time': time, 'duration': duration})
  return res


# return value: {coach, startup, time, duration}
def matchmake(feedbacks, availabilities, startupMeetingCount):
  slotSize = 40
  #timetable: {coach: [start, duration, [null, "startup1", etc]]}
  timetable = getEmptyTimetable(availabilities, slotSize)
  # filter out elements with too low feedback

  sortedList = filter(lambda a: filterFeedbacks(a, availabilities), feedbacks)
  random.shuffle(sortedList)

  # list of our comparison functions for sorting. we use lambdas because some of
  # the functions need additional parameters than a, b
  # here a, b are members of the "feedbacks" list
  cmpFunctions = [
    lambda a, b: cmpByStartupMeetingCount(a,b,startupMeetingCount),
    lambda a, b: cmpByTimetotal(a, b, availabilities),
    lambda a, b: cmpByTimestart(a, b, availabilities),
    cmpByFeedback
  ]
  i = 0
  while i < len(sortedList):
    # sort feedbacks list
    for f in cmpFunctions:
      sortedList = sorted(sortedList, f)

    curRating = getSum(sortedList[i]['startupfeedback'], sortedList[i]['coachfeedback'])
    newRating = curRating
    while (i < len(sortedList)):
      # take current element
      cur = sortedList[i]
      newRating = getSum(cur['startupfeedback'], cur['coachfeedback'])
      # are we still on the same rating? if not, break into outer loop, sort again
      if (newRating != curRating):
        break
      # place into a free slot in the timetable
      found = findPlace(cur, timetable, startupMeetingCount)
      i += 1

  transformed = transformToReturn(timetable)
  return json.dumps(transformed)


# COMMENT OUT THESE THREE LINES WHEN TESTING
###
params = init(False, None)
ready = matchmake(params[0], params[1], params[2])
sys.stdout.write(ready)
###
