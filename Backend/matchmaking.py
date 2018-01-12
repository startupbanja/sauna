import json
import sys
import time
import random
import datetime

data = json.loads(sys.stdin.read())

#{ feedbacks: [{startup: string, startupfeedback: int, coach: string, coachfeedback: int}],
# availabilities: {coachname(string): {starttime: string, duration: int}}
#}

# {startup: "asd", startupfeedback: 1, coach: "dasdsa", coachfeedback: 0}

# {"asd": {starttime, duration}}

# change starttime and duration to timedelta objects for easy comparison
oldAvail = data.availabilities
def mapAvail(coach):
  old = oldAvail[coach]
  times = old['starttime'].split[':']
  res = (key,
  {
    'starttime': timedelta(hours=times[0], minutes=times[1]),
    'duration': timedelta(minutes=old['duration'])
  })
  return res

availabilities = dict(map(mapAvail , data.availabilities.keys()) )

# keep track of meeting count for startups, used for sorting
startupMeetingCount = {}
# return of the sum of coach and startup feedbacks
# returns 2.5 if both are -1 aka null
def getSum(startup, coach):
  if (startup + coach == -2):
    return 2.5
  return min(0, startup) + min(0, coach)

#Comparison functions for the different sorts used
def cmpByFeedback(dictA, dictB):
  sumA = getSum(dictA.startupfeedback, dictA.coachfeedback)
  sumB = getSum(dictB.startupfeedback, dictB.coachfeedback)
  return sumA - sumB

def cmpByTimestart(dictA, dictB):
  a = availabilities[dictA.coach]['starttime']
  b = availabilities[dictB.coach]['starttime']
  return a - b

def cmpByTimetotal(dictA, dictB):
  a = availabilities[dictA.coach]['duration']
  b = availabilities[dictB.coach]['duration']
  return a - b

def cmpByStartupMeetingCount:
  pass
# TODO

def filterFeedbacks(elem):
  startup = elem.startupfeedback
  coach = elem.coachfeedback
  if startup == 0:
    return False
  if coach == 0 and startup == -1:
    return False
  if getSum(coach, startup) <= 2: #coach != -1 and startup != -1 and startup + coach <= 2:
    return False
  return True

# returns true if there would be a double booking
def isLegal(startup, timetable, coach, index):
  slotSize = timedelta(minutes = 40) # TODO
  # check if they are already meeting
  if startup in timetable[coach][2]:
    return False
  # check if coach is reserved at that time
  if coachTuple[2][i] != None:
    return False
  # check if startup is reserved at that time
  # starttime = coachTuple[0]
  nOfSlots = timetable[coach][1] / slotSize
  for newCoach in timetable:
    if newCoach != coach:
      starttime0 = timetable[coach][0]
      timeToBeChecked = starttime0 + slotSize * i
      starttime1 = timetable[newCoach][0]
      i1 = (timeToBeChecked - starttime1) / slotSize ## TODO int? double?
      if timetable[newCoach][i1] == startup:
        return False
  return True


# find a place for a feedback element in the timetable(list)
# elem: {startup: "asd", startupfeedback: 1, coach: "dasdsa", coachfeedback: 0}
def findPlace(elem, timetable):
  coachTuple = timetable[elem[coach]]
  # TODO check here if startup and coach are already meeting?
  for i in range(len(coachTuple[2])):
    if isLegal(elem[startup], timetable, coachTuple, i):
      #insert and return true
  return False

def getEmptyTimetable(availabilities, slotSize):
  timetable = {}
  for name in availabilities.keys()
    timetable[name] = (availabilities[name]['starttime'], availabilities[name]['duration'], [])
    timetable[name][2] = [None] * (availabilities[name]['duration'] / slotSize)
  return timetable


# return value: {coach, startup, time, duration}
def matchmake(feedbacks, availabilities):
  slotSize = 40
  #timetable: {coach: (start, duration, [null, "startup1", etc])}
  timetable = getEmptyTimetable(availabilities, slotSize)
  # filter out elements with too low feedback
  filtered = filter(filterFeedbacks, feedbacks)

  sortedList = random.shuffle(filtered)
  cmpFunctions = [cmpByStartupMeetingCount, cmpByTimetotal, cmpByTimestart, cmpByFeedback]
  i = 0
  while i < len(feedbacks):
    # sort feedbacks list
    for f in cmpFunctions:
      sortedList = sorted(sortedList, f)

    curRating = getSum(sortedList[i].startupfeedback, sortedList[i].coachfeedback)
    newRating = curRating
    while (i < len(feedbacks)):
      # take current element
      cur = sortedList[i]
      newRating = getSum(cur.startupfeedback, cur.coachfeedback)
      # are we still on the same rating? if not, break into outer loop, sort again
      if (newRating != curRating):
        break
      # place into a free slot in the timetable
      found = findPlace(cur, timetable)
      i += 1
  return timetable
