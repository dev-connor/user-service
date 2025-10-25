import { REFRESH_TOKEN_EXPIRE_IN } from "../constants"
import { RefreshToken } from "../entities/RefreshToken"
import * as ms from "ms"

export class RefreshTokenMapper {
  static toUpsertEntity(
    existing: RefreshToken | null,
    tokenHash: string,
  ): RefreshToken {
    const entity = existing ?? new RefreshToken()

    entity.tokenHash = tokenHash
    entity.issuedAt = new Date()
    entity.expireAt = new Date(Date.now() + ms(REFRESH_TOKEN_EXPIRE_IN))

    return entity
  }
}
