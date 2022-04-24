export interface StripeFeeConfig {
  feeName: string;
  currency: string;
  stripe: {
    fixed:number,
    percentage:number,
  };
  status: string;
  isDefault: boolean;
}
