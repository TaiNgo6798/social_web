import { Injectable } from '@nestjs/common'

@Injectable()
export class UserService {
  async decodeToken(token: String): Promise<any> {
    // TODO:
    // Decode token để lấy object trong token
    return { userID: '1', signedAt: 1577590325199 }
  }
}
