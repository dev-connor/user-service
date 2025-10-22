import { RefreshToken } from "../entities/RefreshToken"

export class RefreshTokenMapper {
  static toEntity(refreshTokenHash: string, expireAt: Date): RefreshToken {
    const entity = new RefreshToken()
    entity.tokenHash = refreshTokenHash
    entity.expireAt = expireAt
    return entity
  }
}