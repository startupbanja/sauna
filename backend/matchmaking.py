import json, sys, time, random, datetime, functools
import convertToCsv


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
    return 25
  if startup == 3 and coach == -1:
    return 35
  return max(0, startup)*10 + max(0, coach)*10

#Comparison functions for the different sorts used
# dictA, dictB are elements from the "feedbacks" list
#TODO check if ordering is done the correct way
#return largest first
def cmpByFeedback(dictA, dictB):
  sumA = getSum(dictA['startupfeedback'], dictA['coachfeedback'])
  sumB = getSum(dictB['startupfeedback'], dictB['coachfeedback'])
  return -1*(sumA - sumB)

#compare by starting time of coach availability
#return earlies first
def cmpByTimestart(dictA, dictB, availabilities):
  a = availabilities[dictA['coach']]['starttime'].seconds
  b = availabilities[dictB['coach']]['starttime'].seconds
  return a - b

# compare by duration of coach availability
# return smallest duration first
def cmpByTimetotal(dictA, dictB, availabilities):
  a = availabilities[dictA['coach']]['duration'].seconds
  b = availabilities[dictB['coach']]['duration'].seconds
  return a - b

#return smallest count first
def cmpByStartupMeetingCount(dictA, dictB, startupMeetingCount):
  a = startupMeetingCount[dictA['startup']]
  b = startupMeetingCount[dictB['startup']]
  return a - b

#Filters out feedback elements that meet the following criteria:
# Startup gave feedback score 0
# Coach gave 0 and startup gave no response
# Sum of feedbacks is 2 or less
# Coach did not give any available times
def filterFeedbacks(elem, availabilities):
  startup = elem['startupfeedback']
  coach = elem['coachfeedback']
  if startup == 0:
    return False
  if coach == 0 and startup == -1:
    return False
  if getSum(coach, startup) <= 20: #coach != -1 and startup != -1 and startup + coach <= 2:
    return False
  if elem['coach'] not in availabilities.keys():
    return False
  return True

def timedeltaToMins(timedelta):
  return timedelta.seconds / 60

# returns true if there would be a double booking at a certain timeslot in timetable
#
def isLegal(startup, timetable, coach, index, slotSize):
  # slotSize = 40#datetime.timedelta(minutes = 40)
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
      if timeToBeChecked < starttime1:
        continue
      delta = int(timedeltaToMins(timeToBeChecked - starttime1))
      i1 = delta // slotSize
      if i1 < len(timetable[newCoach][2]) and timetable[newCoach][2][i1] == startup:
        return False
  return True


# find a place for a feedback element in the timetable(list)
# elem: {startup: "asd", startupfeedback: 1, coach: "dasdsa", coachfeedback: 0}
def findPlace(elem, timetable, startupMeetingCount, slotSize):
  coach = elem['coach']
  startup = elem['startup']
  # TODO check here if startup and coach are already meeting?
  rng = list(range(len(timetable[coach][2])))
  random.shuffle(rng)
  for i in rng:
    if isLegal(startup, timetable, coach, i, slotSize):
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

def init(data, slotSize=40):
  feedbacks = data['feedbacks']
  oldAvail = data['availabilities']
  startups = data['startups']

  startupMeetingCount = dict(map(lambda a: (a, 0), startups))
  # startupsFromFeedbacks = set(map(lambda a: a['startup'], feedbacks))
  # coachesFromFeedbacks = set(map(lambda a: a['coach'], feedbacks))

  def containsElem(startup, coach):
    for elem in feedbacks:
      if elem['startup'] == startup and elem['coach'] == coach:
        return True
    return False

  #Generate empty feedbacks(-1, -1) for coaches, startup pairs who are available but have no feedback data
  for coach in oldAvail.keys():
    for startup in startups:
      if not containsElem(startup, coach):
        feedbacks.append({'coach': coach, 'startup': startup, 'coachfeedback': -1, 'startupfeedback': -1})


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

  #normalize availability times so they all begin at the same increments of 40 mins
  firstTime = min(map(lambda a: availabilities[a]['starttime'], availabilities.keys()))
  for k in availabilities.keys():
    delta = (availabilities[k]['starttime'] - firstTime).seconds // 60 % slotSize
    if delta != 0:
      availabilities[k]['starttime'] += datetime.timedelta(minutes=delta)
      availabilities[k]['duration'] -= datetime.timedelta(minutes=delta)

  return feedbacks, availabilities, startupMeetingCount

# timedelta, int (minutes), int
def toTimeString(start, duration, i):
  time = start.seconds + (duration * 60 * i)
  secs = time % 60
  mins = time // 60 % 60
  hrs = time // (60 * 60)
  return "{:02}:{:02}:{:02}".format(hrs, mins, secs)

def transformToReturn(timetable, slotSize):
  duration = slotSize
  res = []
  for key in timetable.keys():
    times = timetable[key]
    start = times[0]
    total = times[1]
    slots = times[2]
    for i, startup in enumerate(slots):
      # if startup != None:
        time = toTimeString(start, duration, i)
        res.append({'coach': key, 'startup': startup, 'time': time, 'duration': duration})
  return res

def countSlots(timetable):
  matched = 0
  empty = 0
  size = 0
  for k in timetable.keys():
    for slot in timetable[k][2]:
      size += 1
      if slot == None:
        empty +=1
      else:
        matched += 1
  return { 'matched': matched, 'empty': empty, 'size': size }

# finds a timeslot for a meeting between a startup and a coach by moving
# other startups, guaranteed to produce a legal timetable
# def fit(coach, startup):
#   pass

# return value: {coach, startup, time, duration}
def matchmake(feedbacks,
  availabilities,
  startupMeetingCount,
  slotSize=40,
  seed=None):
  random.seed(seed)
  #timetable: {coach: [start, duration, [null, "startup1", etc]]}
  timetable = getEmptyTimetable(availabilities, slotSize)
  # filter out elements with too low feedback

  # sortedList = filter(lambda a: filterFeedbacks(a, availabilities), feedbacks)
  sortedList = [x for x in feedbacks if filterFeedbacks(x, availabilities)]
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
  # itemsMatched = 0
  elementsToRetry = []
  retries = 0
  stats = {'notFoundCount': 0, 'notFound': [], 'coachFull': []}
  while retries < 1:
    i = 0
    if elementsToRetry:
      sortedList = elementsToRetry
      random.shuffle(sortedList)

      elementsToRetry = []
    while i < len(sortedList):
      # i -= itemsMatched
      # itemsMatched = 0
      # sort feedbacks list
      # sortedList = filter(lambda a: a != None, sortedList)
      for f in cmpFunctions:
        sortedList = sorted(sortedList, key=functools.cmp_to_key(f))

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
        found = findPlace(cur, timetable, startupMeetingCount, slotSize)
        if found and retries > 0:
          sys.stderr.write("found one retrying")
        if not found:
          #Check if that coach has a full timetable already
          if None not in timetable[cur['coach']][2]:
            stats['coachFull'].append(cur)
          else:
            elementsToRetry.append(cur)
        # if found:
        #   itemsMatched += 1
        #   sortedList[i] = None
        i += 1
    retries += 1

  stats['notFound'] = elementsToRetry
  stats['notFoundCount'] = len(elementsToRetry)
  stats['slots'] = countSlots(timetable)
  transformed = transformToReturn(timetable, slotSize)
  return (json.dumps(transformed), json.dumps(stats))
