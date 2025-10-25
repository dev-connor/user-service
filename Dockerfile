# Dockerfile (development)
FROM node:20-alpine

# 필수 패키지 설치
RUN apk add --no-cache bash git openssh

# 작업 디렉토리
WORKDIR /usr/src/app

# 의존성 복사 및 설치
COPY package*.json ./
RUN npm ci --silent

# 소스 코드 복사
COPY . .

# 포트 오픈
EXPOSE 3000

# 개발용 명령 (ts-node로 개발 서버 실행)
CMD ["npm", "run", "start:dev"]
