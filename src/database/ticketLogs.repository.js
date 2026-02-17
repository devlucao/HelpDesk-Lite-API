const createLog = async (db, logModel) => {
  return db.ticketLog.create({
    data: logModel,
  });
};

module.exports = { createLog }