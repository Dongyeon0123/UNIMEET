# UniMeet
## 백엔드 명세 요청서 (공유용)

아래 항목 정보 제공

### 1) 공통
- 베이스 URL: dev/stage/prod 각각
- API 명세: Swagger/OpenAPI URL, Postman 컬렉션(있으면)
- 공통 헤더/미들웨어: `Authorization`, `X-Client-Id` 등 사용 여부/형식
- 인증 체계: JWT(서명 알고리즘, 만료), 리프레시 토큰 유무/로테이션 규칙, CORS 정책(origin/headers/methods)
- 페이징/정렬 규약: 쿼리 파라미터(page,size,sort 등) 기본값, 응답 포맷(meta: total/items 등)
- 에러 표준: HTTP 코드, 에러코드/메시지 테이블, 필드 검증 포맷({ field, reason }[])
- 파일 업로드(있다면): 엔드포인트, 멀티파트 필드명(key), 최대 용량, 허용 확장자

### 2) 인증(회원가입/로그인/토큰)
- POST /auth/signup: 요청 바디(필수/선택/정규식), 성공/실패 응답 예시
- POST /auth/login: 로그인 식별자(email/username/phone), 성공 응답(token/user), 실패 응답 예시
- POST /auth/refresh: 리프레시 사용 유무, 요청/응답 스키마, 로테이션 정책
- 비밀번호 찾기/재설정(있다면): 플로우/엔드포인트

프론트 요청 바디(현재 가정)
- signup: { email, password, name, nickname, studentId, department, birth(YYYY.MM.DD), phone }
- login: { email, password }

프론트가 필요로 하는 응답 필드(가정)
- token, user{ id, email, name, nickname, department, studentId, mbti, interests[], height, phone, birth }

### 3) 마이페이지(프로필)
- GET /api/user/profile: 사용자 필드 정의
- PUT /api/user/profile: 수정 가능 필드/검증 규칙, 성공 응답
- 이미지 변경(있다면): 업로드 엔드포인트/URL 발급 방식

### 4) 미팅방
- GET /api/meetings: 리스트(쿼리: 상태/검색/페이징), 카드 요약 필드
- GET /api/meetings/{id}: 상세(참가자 구조, 정원/타입 정보, 내가 신청했는지 여부)
- POST /api/meetings: 생성 요청 바디(제목/타입/인원), 권한
- POST /api/meetings/{id}/apply: 신청(중복/정원/상태 에러 정의)
- POST /api/meetings/{id}/leave 및 승인/거절/취소 관련 엔드포인트(있다면)

### 5) 채팅(REST + WebSocket/STOMP)
REST
- GET /api/chat/rooms: 목록(미리보기/안읽음/인원수)
- GET /api/chat/rooms/{roomId}/messages: 히스토리(페이징)
- POST /api/chat/rooms/{roomId}/messages: 전송 바디(content/첨부)

WebSocket/STOMP
- 연결: /ws
- 발행: /app/chat/{roomId}
- 구독: /topic/chat/{roomId}
- 핸드셰이크 인증: connectHeaders에 Authorization 필요 여부
- 메시지 스키마: 보내기/받기 구조, 타임스탬프, 보낸이, 읽음 카운트

### 6) 커뮤니티(게시글/댓글)
게시글
- GET /api/posts: 목록(카테고리/검색/정렬/페이징)
- GET /api/posts/{id}: 상세(본문/작성자/통계)
- POST /api/posts: 생성(제목/본문/익명 여부/첨부)
- PUT /api/posts/{id}, DELETE /api/posts/{id}: 수정/삭제 권한
- 좋아요: POST /api/posts/{id}/like, 취소: DELETE /api/posts/{id}/like (또는 토글 API)
- 스크랩(있다면): POST /api/posts/{id}/scrap, 취소: DELETE /api/posts/{id}/scrap
- 응답 구조: 현재 좋아요 수, 내가 좋아요/스크랩 했는지 여부 반환 필요

댓글
- GET /api/posts/{id}/comments: 목록(대댓글/정렬)
- POST /api/posts/{id}/comments: 생성(본문/익명)
- PUT/DELETE /api/comments/{id}: 수정/삭제 권한
- 댓글 좋아요: POST /api/comments/{id}/like, 취소: DELETE /api/comments/{id}/like
- 응답 구조: 현재 좋아요 수, 내가 좋아요 했는지 여부 반환 필요

### 7) 알림/기타(있다면)
- 알림 목록/읽음 처리, 구독 채널, 푸시 토큰 등록 API
- 신고/차단, 약관 동의/버전, 앱 설정 항목

### 8) 예시/샘플
- 각 주요 엔드포인트 성공/실패 샘플 JSON
- 테스트 계정(로그인 가능) 및 시나리오(예: 신청→승인→채팅 시작)
- 대역폭/속도 제약, 레이트리밋, 서버 타임존/시간 포맷(예: ISO 8601)

### 9) 프론트 환경/네트워크 참고
- 시뮬레이터 기준 호스트 규칙
  - iOS: http://localhost:8080
  - Android: http://10.0.2.2:8080
- 실제 기기: Expo hostUri 기반 LAN IP 사용
- 요청/응답 포맷: JSON UTF-8, 날짜 ISO 8601 선호
- CORS: Expo Dev(예: http://localhost:19006, http://<LAN-IP>:19006) 등 허용 필요