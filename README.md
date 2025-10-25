# 프로젝트 설정 및 실행 방법

Docker Compose 실행 방법

```bash
docker-compose up -d 
```

# 사용된 기술 스택 및 라이브러리

TypeScript, NestJS, RabbitMQ 

# 설계 결정 이유 

Event-driven microservices 를 적용하기로 결정했습니다. 


구현 시 적용한 설계 패턴/원칙, 특정 기술 스택이나 라이브러리를 선택한 이유, 데이터베이스 스키마 설계 이유 등에 대해 설명합니다.

# 문제 해결 과정 및 고민 

과제를 수행하며 마주쳤던 기술적인 문제와 해결 과정, 성능 및 확장성을 고려한 부분, 인증/인가 로직 설계 시 고민했던 내용 등을 상세히 기술합니다.

# 비동기 처리 설명 

해당 기능의 구현 내용과 목적, 기술 선택 이유 등을 설명합니다.

## 🧩 User Deletion Flow (비동기 처리 구조)

사용자 탈퇴 요청 시, API Gateway가 메시지 큐(RabbitMQ)에 이벤트를 발행하고,  
Worker Service가 비동기로 이메일 발송 및 S3 파일 삭제를 수행하는 구조입니다.

---

### 🧭 전체 시퀀스 다이어그램

```mermaid
sequenceDiagram
    participant C as 🧑 Client
    participant G as 🌐 API Gateway
    participant MQ as 📬 Message Queue (RabbitMQ)
    participant DB as 🗄️ User DB
    participant W as ⚙️ Worker Service
    participant WD as 🗃️ Worker DB
    participant S3 as ☁️ AWS S3

    C->>G: DELETE /users/{userId} (탈퇴 요청)
    Note right of G: 트랜잭션 시작

    G->>MQ: Publish "UserDeleted" message<br/>({ userId })
    MQ-->>G: ✅ Publish 성공 (or 실패 시 롤백)
    alt Publish 실패
        G-->>C: ❌ 탈퇴 실패 응답
        Note right of G: 메시지 발행 실패 → 전체 롤백
    else Publish 성공
        G->>DB: UPDATE users SET deleted_at = NOW()
        DB-->>G: ✅ 성공
        G-->>C: ✅ 탈퇴 성공 응답
    end

    Note over W,MQ: (비동기 처리 시작)

    W->>MQ: Consume "UserDeleted" message
    MQ-->>W: { userId }

    W->>WD: SELECT file_paths FROM user_files WHERE user_id = {userId}
    WD-->>W: [ "s3://bucket/path1", "s3://bucket/path2", ... ]

    loop 각 파일 경로에 대해
        W->>S3: DELETE object
        S3-->>W: ✅ 삭제 성공
    end

    W->>W: Send email to user<br/>("탈퇴 완료 안내 메일 발송")
    W-->>MQ: Ack message consumed
```


*설계한 시퀀스를 설명하여 mermaid 작성을 Prompt 를 활용했습니다. 

# 테스트 전략 

작성한 테스트 코드의 범위(단위/통합)와 주요 테스트 시나리오에 대해 설명합니다.

미구현했습니다. 

