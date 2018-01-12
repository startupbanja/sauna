import unittest
import matchmaking

class TestMatchmaking(unittest.TestCase):

  def setUp(self):
    self.dictA = {
      'startup': 1,
      'startupfeedback': 2,
      'coach': 2,
      'coachfeedback': 2
    }
    self.dictB = {
      'startup': 2,
      'startupfeedback': 1,
      'coach': 1,
      'coachfeedback': 1
    }

  def tearDown(self):
    pass

  def test_getSum(self):
    self.assertEqual(matchmaking.getSum(0,0),0)
    self.assertEqual(matchmaking.getSum(0,1),1)
    self.assertEqual(matchmaking.getSum(-1,0),0)
    self.assertEqual(matchmaking.getSum(-1,-1),2.5)
    self.assertEqual(matchmaking.getSum(2,3),5)
    self.assertEqual(matchmaking.getSum(-1,2),2)





if __name__ == '__main__':
    unittest.main()
