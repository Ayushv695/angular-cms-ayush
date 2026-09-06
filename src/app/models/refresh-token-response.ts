export interface RefreshTokenResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    token_type: string;
  };
}
