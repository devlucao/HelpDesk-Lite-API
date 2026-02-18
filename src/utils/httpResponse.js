const ok = (res, data) => res.status(200).json({ data });

const created = (res, data) => res.status(201).json({ data });

const okList = (res, data, meta) => res.status(200).json({ meta, data });

module.exports = { ok, created, okList };

