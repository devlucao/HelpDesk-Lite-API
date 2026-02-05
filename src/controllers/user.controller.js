const getMe = (req, res) => {
  const { userId, role } = req.user;

  try {
    return res.status(200).json({ userId, role });
  } catch(error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = { getMe }