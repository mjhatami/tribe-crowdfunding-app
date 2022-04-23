import { Router } from 'express';
import SettingController from '@controllers/setting.controller';
import { Routes } from '@interfaces/routes.interface';

class settingRoute implements Routes {
  public path = '/setting';
  public router = Router();
  public settingController = new SettingController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**
     * ! An authorization middleware must be developed for these routes
     */
    this.router.get(`${this.path}`, this.settingController.getStripeConfigs);
    this.router.post(`${this.path}`, this.settingController.createStripeConfig);
  }
}

export default settingRoute;
