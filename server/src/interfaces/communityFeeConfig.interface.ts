export interface CommunityFeeConfig {
  feeName: string;
  currency: string;
  community: {
    static: number,
    percentage: number
  };
  status: string;
  default: boolean;
}
