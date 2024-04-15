import dayjs from 'dayjs';
import { jwtDecode } from "jwt-decode";

export default class Token {
  static getTokenClaims(token: string) {
    return jwtDecode(token);
  }

  static isTokenExpired(token?: string) {
    if (!token) {
      return true;
    }
    try {
      const claims: any = this.getTokenClaims(token);
      const {exp} = claims;
      return dayjs.unix(exp).diff(dayjs()) < 1;
    } catch (err) {
      console.error(err);
      return true;
    }
  }
}