import { Schema } from "mongoose";
import { StripeFeeConfig } from "@interfaces/stripeFeeConfig.interface";

export interface StripeConfig {
  tag: string;
  secretKey: string;
  publishKey: string;
  webhookKey: string;
  stripeFeeConfig: Schema.Types.ObjectId | StripeFeeConfig; 
  status: string;
  isDefault: boolean;
}
