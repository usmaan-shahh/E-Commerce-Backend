
export interface ITokenService {
  issueAccessToken(payload: { sub: string }): string;
  issueRefreshToken(payload: { sub: string }): string;
}
