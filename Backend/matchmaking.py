import json
import sys
import time
import random


data = json.loads(sys.stdin.read())

# {startup: "asd", startupfeedback: 1, coach: "dasdsa", coachfeedback: 0}

# {"asd": {starttime, duration}}
availabilities = data.availabilities
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
# TODO string? int?
def cmpByTimestart(dictA, dictB):
  a = availabilities[dictA.coach].starttime
  b = availabilities[dictB.coach].starttime
  return a - b

def cmpByTimetotal(dictA, dictB):
  a = availabilities[dictA.coach].duration
  b = availabilities[dictB.coach].duration
  return a - b

def cmpByStartupMeetingCount:


def filterFeedbacks(elem):
  startup = elem.startupfeedback
  coach = elem.coachfeedback
  if startup == 0:
    return false
  if coach == 0 and startup == -1:
    return false
  if getSum(coach, startup) <= 2: #coach != -1 and startup != -1 and startup + coach <= 2:
    return false
  return true

def checkDoubleBookings(startup, starttime):

# find a place for a feedback element in the timetable(list)
def findPlace(elem, list):
  slotSize = 40 # mins
  meetinglist = list.filter(lambda a: a.coach == elem.coach)
  availability = availabilities[elem.coach]
  slotCount = availability.duration / slotSize #TODO int/double?


# return value: {coach, startup, time, duration}
def matchmake(feedbacks, availabilities):
  ready = []
  # filter out elements with too low feedback
  filtered = filter(filterFeedbacks, feedbacks)

  sortedList = random.shuffle(filtered)
  cmpFunctions = [cmpByTimetotal, cmpByTimestart, cmpByFeedback, cmpByStartupMeetingCount]
  i = 0
  while i < len(feedbacks):
# sort feedbacks list
    for f in cmpFunctions:
      sortedList = sorted(sortedList, f)

    curRating = getSum(sortedList[i].startupfeedback, sortedList[i].coachfeedback)
    newRating = curRating
    while (i < len(feedbacks)):
#     take current element, insert it into timetable
      cur = sortedList[i]
      newRating = getSum(cur.startupfeedback, cur.coachfeedback)
      if (newRating != curRating):
        break
      found = findPlace(cur, ready)
      i += 1
  return ready
