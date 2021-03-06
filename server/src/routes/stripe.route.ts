import { Router } from 'express';
import stripeController from '@controllers/stripe.controller';
import { Routes } from '@interfaces/routes.interface';
import auth from '@middlewares/auth.middleware';

class stripeRoute implements Routes {
  public path = '/stripe';
  public router = Router();
  public stripeController = new stripeController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    //! This route must be removed in production 
    this.router.post(`${this.path}/fixture`, this.stripeController.stripeConfigFixture);

    this.router.post(`${this.path}/intent/:donationCode`, this.stripeController.createIntent);
    this.router.route(`${this.path}/onboarding`).post(auth,this.stripeController.onboarding);
    // this.router.post(`${this.path}/setting`, this.stripeController.createStripeConfig);
    // this.router.get(`${this.path}/fixture`, this.stripeController.stripeConfigFixture);
  }
}

export default stripeRoute;
