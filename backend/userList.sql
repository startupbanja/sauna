-- get list of users
SELECT name, description, email, linkedin, company, title
FROM Profiles
LEFT OUTER JOIN Credentials ON Profiles.user_id = Credentials.user_id
WHERE user_id IN (
  SELECT id
  FROM USERS
  WHERE type = ? AND batch = ? AND active = true
);
