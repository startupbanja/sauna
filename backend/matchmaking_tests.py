import unittest
import matchmaking
import datetime
import random
import convertToCsv

class TestMatchmaking(unittest.TestCase):

  def setUp(self):
    random.seed(1)
    self.feedbacks = []
    for i in range(10):
      for j in range(10):
        self.feedbacks.append({
          'startup': i,
          'startupfeedback': random.choice([-1,0,1,3]),
          'coach': j,
          'coachfeedback': random.choice([-1,0,1,2])
        })
    self.availabilities = {}
    for i in range(10):
      self.availabilities[i] = {
      'starttime': str(random.randrange(9,12))+ ":00:00",
      'duration': random.randrange(0, 240, 40)
      }
    self.startups = list(range(10))
    testData = {'feedbacks': self.feedbacks, 'availabilities': self.availabilities, 'startups': self.startups}
    self.paramTuple = matchmaking.init(testData)
    self.definedFeedbacks = [];
    userid = 0;
    for i in [-1,0,1,3]:
        userid += 1
        for j in [-1,0,1,2]:
            self.definedFeedbacks.append({
              'startup': userid,
              'startupfeedback': i,
              'coach': userid,
              'coachfeedback': j
            })
    self.definedAvailabilities = {};
    self.definedAvailabilities[1] = {
      'starttime': "09:00:00",
      'duration': 240
    }
    self.definedAvailabilities[2] = {
      'starttime': "09:00:00",
      'duration': 120
    }
    self.definedAvailabilities[3] = {
      'starttime': "10:00:00",
      'duration': 120
    }
    definedTestData = {'feedbacks': self.definedFeedbacks, 'availabilities': self.definedAvailabilities, 'startups': self.startups}
    self.definedParamTuple = matchmaking.init(definedTestData)
    self.definedAvailabilities = self.definedParamTuple[1]


  def tearDown(self):
    pass

  def test_getSum(self):
    self.assertEqual(matchmaking.getSum(0,0),0)
    self.assertEqual(matchmaking.getSum(0,1),10)
    self.assertEqual(matchmaking.getSum(-1,0),0)
    self.assertEqual(matchmaking.getSum(-1,-1),25)
    self.assertEqual(matchmaking.getSum(2,3),50)
    self.assertEqual(matchmaking.getSum(-1,2),20)
    self.assertEqual(matchmaking.getSum(3,-1),35)


  def test_matchmake(self):
    pass
    # print("---test_matchmake")
    # (result, stats) = matchmaking.matchmake(self.paramTuple[0], self.paramTuple[1], self.paramTuple[2])
    # print(stats)
    # print("---")

  def test_cmpByFeedback(self):
    def test(i1,i2):
      # print(str(i1) + ': ' + str(self.definedFeedbacks[i1]) +'\n'+str(i2)+ ': '+ str(self.definedFeedbacks[i2]))
      return matchmaking.cmpByFeedback(self.definedFeedbacks[i1],self.definedFeedbacks[i2])
    self.assertTrue(test(0,0) == 0)
    self.assertTrue(test(0,12) > 0)
    self.assertTrue(test(12,0) < 0)
    self.assertTrue(test(0,4) < 0)
    self.assertTrue(test(0,8) < 0)
    self.assertTrue(test(4,0) > 0)
    self.assertTrue(test(8,0) > 0)

  def test_cmpByTimestart(self):
    def test(i1, i2):
      return matchmaking.cmpByTimestart(self.definedFeedbacks[i1],self.definedFeedbacks[i2],self.definedAvailabilities)
    self.assertTrue(test(0,0) == 0)
    self.assertTrue(test(0,4) == 0)
    self.assertTrue(test(0,8) < 0)
    self.assertTrue(test(8,0) > 0)
    # self.assertEqual(matchmaking.cmpByTimestart(self.definedFeedbacks[0],self.definedFeedbacks[0],self.definedAvailabilities),0)
    # self.assertEqual(matchmaking.cmpByTimestart(self.definedFeedbacks[0],self.definedFeedbacks[4],self.definedAvailabilities),0)
    # self.assertEqual(matchmaking.cmpByTimestart(self.definedFeedbacks[0],self.definedFeedbacks[8],self.definedAvailabilities),-3600)
    # self.assertEqual(matchmaking.cmpByTimestart(self.definedFeedbacks[8],self.definedFeedbacks[0],self.definedAvailabilities),3600)

  def test_cmpByTimetotal(self):
    def test(i1, i2):
      return matchmaking.cmpByTimetotal(self.definedFeedbacks[i1],self.definedFeedbacks[i2],self.definedAvailabilities)
    self.assertTrue(test(0,0) == 0)
    self.assertTrue(test(0,4) > 0)
    self.assertTrue(test(0,8) > 0)
    self.assertTrue(test(8,0) < 0)
    # self.assertEqual(matchmaking.cmpByTimetotal(self.definedFeedbacks[0],self.definedFeedbacks[0],self.definedAvailabilities),0)
    # self.assertEqual(matchmaking.cmpByTimetotal(self.definedFeedbacks[0],self.definedFeedbacks[4],self.definedAvailabilities),7200)
    # self.assertEqual(matchmaking.cmpByTimetotal(self.definedFeedbacks[0],self.definedFeedbacks[8],self.definedAvailabilities),7200)
    # self.assertEqual(matchmaking.cmpByTimetotal(self.definedFeedbacks[8],self.definedFeedbacks[0],self.definedAvailabilities),-7200)

  def test_cmpByStartupMeetingCount(self):
    startupMeetingCount = {
      1: 1,
      2: 2
    }
    self.assertEqual(matchmaking.cmpByStartupMeetingCount(self.definedFeedbacks[0],self.definedFeedbacks[0],startupMeetingCount),0)
    self.assertEqual(matchmaking.cmpByStartupMeetingCount(self.definedFeedbacks[0],self.definedFeedbacks[4],startupMeetingCount),-1)
    self.assertEqual(matchmaking.cmpByStartupMeetingCount(self.definedFeedbacks[4],self.definedFeedbacks[0],startupMeetingCount),1)

  def test_filterFeedbacks(self):
    self.assertEqual(matchmaking.filterFeedbacks(self.definedFeedbacks[0], self.definedAvailabilities),True)
    # Coach not in availabilities
    self.assertEqual(matchmaking.filterFeedbacks(self.definedFeedbacks[12], self.definedAvailabilities),False)
    # Startup gave feedback score 0
    self.assertEqual(matchmaking.filterFeedbacks(self.definedFeedbacks[4], self.definedAvailabilities),False)
    # Coach gave 0 and startup gave no response
    self.assertEqual(matchmaking.filterFeedbacks({'startup': 1,'startupfeedback':-1,'coach':1,'coachfeedback':0}, self.definedAvailabilities),False)
    # Sum of feedbacks is 2 or less
    self.assertEqual(matchmaking.filterFeedbacks({'startup': 1,'startupfeedback':1,'coach':1,'coachfeedback':1}, self.definedAvailabilities),False)

  def test_csvconversion(self):
    (data, stats) = matchmaking.matchmake(self.paramTuple[0], self.paramTuple[1], self.paramTuple[2])
    convertToCsv.convert(data, "unittest_data.csv")

if __name__ == '__main__':
    unittest.main()
