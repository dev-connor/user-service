import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { JwtService } from "@nestjs/jwt"
import { Observable } from "rxjs"
import { JWT_SECRET } from "./constants"
import { Request } from "express"
import { Roles } from "./auth.decorator"

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const tokenPayload = await this.verifyToken(request)
    const requireRoles: string[] = this.reflector.get(
      Roles,
      context.getHandler(),
    )
    // 해당 권한이 있어야 API 호출 가능
    if (requireRoles) {
      if (requireRoles.includes(tokenPayload.role)) {
        return true
      } else {
        throw new ForbiddenException(
          `require role '${requireRoles}', can't access with '${tokenPayload.role}' role`,
        )
      }
    }

    // 자신의 유저정보만 조회/삭제/변경 가능 
    if (this.hasOwnership(request, tokenPayload)) {
      return true
    } 
    throw new ForbiddenException(`can't access other user info with '${tokenPayload.role}' role`)
  }

  private async verifyToken(request) {
    const token = this.extractTokenFromHeader(request)
    if (!token) {
      throw new UnauthorizedException("token is empty")
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: JWT_SECRET.secret,
      })
      return payload
    } catch {
      throw new UnauthorizedException("token is invalid")
    }
  }

  private hasOwnership(request, tokenPayload): boolean {
    if (tokenPayload.role === "admin") {
      return true
    }
    const { userId } = request.params
    return tokenPayload.sub === userId
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? []
    return type === "Bearer" ? token : undefined
  }
}
