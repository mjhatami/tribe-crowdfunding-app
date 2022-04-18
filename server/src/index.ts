import App from '@/app';
import HealthRoute from '@routes/health.route';
import WebhookRoute from '@routes/webhook.route';
import Setting from '@routes/setting.route';
import validateEnv from '@utils/validateEnv';
import stripeRoute from '@routes/stripe.route';
validateEnv();

const app = new App([
    new WebhookRoute(), 
    new HealthRoute(),
    new Setting(),
    new stripeRoute()
]);

app.listen();
