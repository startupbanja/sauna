import unittest
import matchmaking
import datetime
import random

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
    testData = {'feedbacks': self.feedbacks, 'availabilities': self.availabilities}
    self.paramTuple = matchmaking.init(True, testData)

  def tearDown(self):
    pass

  def test_getSum(self):
    self.assertEqual(matchmaking.getSum(0,0),0)
    self.assertEqual(matchmaking.getSum(0,1),1)
    self.assertEqual(matchmaking.getSum(-1,0),0)
    self.assertEqual(matchmaking.getSum(-1,-1),2.5)
    self.assertEqual(matchmaking.getSum(2,3),5)
    self.assertEqual(matchmaking.getSum(-1,2),2)

  def test_matchmake(self):
    print(matchmaking.matchmake(self.paramTuple[0], self.paramTuple[1], self.paramTuple[2]))





if __name__ == '__main__':
    unittest.main()
