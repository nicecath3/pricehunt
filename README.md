# 📦 PriceHunt — 스마트 가격 비교 서비스

네이버 쇼핑 API 연동 가격 비교 + 목표가 알림 서비스 포트폴리오 프로젝트

## 🛠 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | Next.js 14 (App Router) |
| 언어 | TypeScript |
| 스타일 | SCSS Modules |
| 차트 | Chart.js + react-chartjs-2 |
| 이메일 | Nodemailer (Gmail SMTP) |
| 푸시 알림 | Web Push API + VAPID |
| API | 네이버 쇼핑 검색 API |

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── api/
│   │   ├── search/        # 네이버 쇼핑 검색 API Route
│   │   ├── alert/         # 알림 CRUD API Routes
│   │   └── product/       # Web Push 구독 API
│   ├── alerts/            # 알림 관리 페이지
│   ├── layout.tsx
│   └── page.tsx           # 메인 대시보드
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   └── Topbar.tsx
│   ├── product/
│   │   ├── Dashboard.tsx   # 메인 대시보드 컨테이너
│   │   ├── StatCards.tsx   # 통계 카드 4종
│   │   ├── FilterBar.tsx   # 카테고리 필터 + 정렬
│   │   ├── ProductList.tsx # 상품 목록 (스켈레톤 포함)
│   │   └── ProductDetail.tsx # 하단 상세 패널 + 차트
│   ├── alert/
│   │   └── AlertModal.tsx  # 목표가 설정 모달
│   └── common/
│       ├── Toast.tsx
│       └── ServiceWorkerRegistrar.tsx
├── hooks/
│   ├── useSearch.ts       # 검색 + 필터/정렬 상태
│   ├── useAlert.ts        # 알림 CRUD
│   └── useWebPush.ts      # Web Push 구독
├── lib/
│   ├── naver.ts           # 네이버 API 유틸 + 가격 포맷
│   ├── email.ts           # Nodemailer 이메일 발송
│   ├── webpush.ts         # Web Push 발송
│   └── store.ts           # 인메모리 스토어 (→ DB로 교체)
├── styles/
│   ├── _variables.scss    # 디자인 토큰 + 믹스인
│   └── globals.scss       # 전역 리셋
└── types/
    └── index.ts           # 전체 타입 정의
```

## 🚀 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local.example`을 복사해서 `.env.local`로 만들고 값을 채워주세요.

```bash
cp .env.local .env.local
```

#### 네이버 쇼핑 API 키 발급
1. [네이버 개발자 센터](https://developers.naver.com/apps/#/register) 접속
2. 애플리케이션 등록 → 검색 API 선택
3. `NAVER_CLIENT_ID`, `NAVER_CLIENT_SECRET` 복사

#### Gmail SMTP 설정
1. Google 계정 → 보안 → 2단계 인증 활성화
2. 앱 비밀번호 생성 (메일 앱 선택)
3. `SMTP_USER`, `SMTP_PASS`에 입력

#### VAPID 키 생성 (Web Push)
```bash
npx web-push generate-vapid-keys
```
출력된 키를 `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`에 입력

### 3. 개발 서버 실행

```bash
npm run dev
```

→ [http://localhost:3000](http://localhost:3000) 접속

## ⚡ 주요 기능

- **실시간 가격 검색** — 네이버 쇼핑 API로 최저가 조회 (API 키 없을 시 Mock 데이터)
- **가격 추이 차트** — 14일 Chart.js 라인 차트
- **목표가 알림** — 이메일(Nodemailer) + 브라우저 푸시(Web Push)
- **스켈레톤 로딩** — UX 개선을 위한 로딩 상태 처리
- **필터 & 정렬** — 카테고리 필터, 가격순/최저가 갱신순 정렬

## 🔧 DB 연동 (실제 서비스 적용 시)

현재 `src/lib/store.ts`는 인메모리 저장 방식입니다. 실제 서비스에는 아래로 교체를 권장해요.

**Supabase** (추천, 빠른 설정):
```bash
npm install @supabase/supabase-js
```

**Prisma + PostgreSQL**:
```bash
npm install prisma @prisma/client
npx prisma init
```

## 📬 API 엔드포인트

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/search?q=검색어` | 네이버 쇼핑 상품 검색 |
| GET | `/api/alert` | 전체 알림 조회 |
| POST | `/api/alert` | 알림 생성 |
| PATCH | `/api/alert/:id` | 알림 수정 (활성/일시정지) |
| DELETE | `/api/alert/:id` | 알림 삭제 |
| POST | `/api/product` | Web Push 구독 저장 |

## 🎨 디자인 토큰

`src/styles/_variables.scss`에서 색상/간격/폰트 등 디자인 토큰을 한 곳에서 관리합니다.
