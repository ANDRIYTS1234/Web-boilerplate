const getMatchPercent = (users, predicate) => {
  if (users.length === 0) return 0;

  const matched = users.filter(predicate).length;
  return Math.round((matched / users.length) * 10000) / 100;
};

export default getMatchPercent;
