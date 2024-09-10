const { StatusCodes } = require("http-status-codes");
const BadRequestError = require("../errors/bad-request");
const Monitor = require("../models/monitors");
const NotFoundError = require("../errors/not-found");

const createMonitor = async (req, res) => {
  const { url, alertEmail } = req.body;
  if (!url) {
    throw new BadRequestError("Please provide the URL to monitor");
  }
  if(!alertEmail){
    req.body = {...req.body, alertEmail : req.user.email}
  }
  req.body = {...req.body, createdBy:req.user.userId}
  const monitor = await Monitor.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({ monitor });
};

const editMonitor = async (req, res) => {
  const {
    body: { url },
    user: { userId },
    params: { id },
  } = req;
  if (url == "") {
    throw new BadRequestError("URL cannot be empty");
  }
  const monitor = await Monitor.findByIdAndUpdate(
    { _id: id, createdBy: userId },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if(!monitor){
    throw new NotFoundError(`No monitor found with id :${id} `)
  }
  res.status(StatusCodes.OK).json({monitor});
};

const getAllMonitors = async (req, res) => {
  const monitors = await Monitor.find({ createdBy: req.user.userId }).sort(
    "createdAt"
  );
  res.status(StatusCodes.OK).json({ monitors, count: monitors.length });
};

const deleteMonitor = async (req, res) => {
  const {user:{userId},params:{id}} = req
  const monitor = await Monitor.findByIdAndDelete({_id:id,createdBy:userId})
  if(!monitor){
    throw new NotFoundError(`No monitor with id ${id}`);
  }
  res.status(StatusCodes.OK).send();
};

module.exports = {
  createMonitor,
  editMonitor,
  getAllMonitors,
  deleteMonitor,
};
