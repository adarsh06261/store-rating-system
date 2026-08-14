import * as ownerService from '../services/owner.service.js';

export const getDashboard = async (req, res, next) => {
  try {
    const dashboard = await ownerService.getOwnerDashboard(req.user.id);
    res.json({ success: true, data: dashboard });
  } catch (error) {
    next(error);
  }
};
