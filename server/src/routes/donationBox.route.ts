import { Router } from 'express';
import DonationBoxController from '@controllers/donationBox.controller';
import { Routes } from '@interfaces/routes.interface';

import auth from '@middlewares/auth.middleware';

class donationBoxRoute implements Routes {
  public path = '/donation-box';
  public router = Router();
  public donationBoxController = new DonationBoxController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:donationCode`, this.donationBoxController.getDonationBoxByCode);

    // this.router.use(auth);
    // this.router.post(`${this.path}/`, this.donationBoxController.createDonationBox);
    this.router.route(`${this.path}/`).post(auth, this.donationBoxController.createDonationBox);
  }
}

export default donationBoxRoute;
