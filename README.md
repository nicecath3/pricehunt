# 🔍 PriceHunt — 스마트 가격 비교 서비스

네이버 쇼핑 API 기반 상품 가격 비교 + 목표가 알림 포트폴리오 프로젝트

배포 주소: [kgrpricehunt.vercel.app](https://kgrpricehunt.vercel.app)

---

## ⚡ 주요 기능

- **상품 검색** — 네이버 쇼핑 API로 실시간 최저가 조회
- **무한 스크롤** — IntersectionObserver 기반 페이지네이션
- **카테고리 필터** — 검색 결과를 카테고리별로 클라이언트 사이드 필터링
- **정렬** — 정확도순 / 날짜순 / 가격 낮은순 / 가격 높은순
- **그리드 / 리스트 뷰** — 상품 목록 보기 방식 전환
- **상품 상세 모달** — 14일 가격 추이 차트 (Chart.js), 쇼핑몰별 최저가 비교
- **가격 알림 등록** — 목표가 설정 후 이메일 또는 문자 알림 방법 선택
- **알림 내역 관리** — 헤더 벨 아이콘 드롭다운에서 등록 내역 조회 / 삭제, 상품 링크 이동

---

## 🛠 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | Next.js 14 (App Router) |
| 언어 | TypeScript |
| 스타일 | SCSS Modules |
| 상태 관리 | Jotai |
| 서버 상태 | TanStack React Query v5 |
| 차트 | Chart.js + react-chartjs-2 |
| 알림 저장 | localStorage |
| API | 네이버 쇼핑 검색 API |
| 배포 | Vercel |

---

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── api/search/        # 네이버 쇼핑 검색 API Route Handler
│   ├── layout.tsx
│   ├── page.tsx           # 메인 페이지 (Suspense 래퍼)
│   ├── HomeContent.tsx    # 메인 페이지 콘텐츠 (useSearchParams 사용)
│   └── page.module.scss
├── components/
│   ├── Header/            # 검색 바 + 알림 드롭다운 (벨 아이콘)
│   ├── Sidebar/           # 카테고리 필터 + 정렬 옵션
│   ├── ProductGrid/       # 상품 카드 목록 (그리드 / 리스트 뷰)
│   ├── ProductModal/      # 상품 상세 모달 + 가격 추이 차트
│   ├── AlertModal/        # 가격 알림 등록 모달
│   └── Providers.tsx      # React Query Provider
├── hooks/
│   ├── useSearch.ts       # 상품 검색 (useInfiniteQuery)
│   └── useAlerts.ts       # 알림 내역 상태 관리
├── lib/
│   ├── alertStorage.ts    # localStorage CRUD + 커스텀 이벤트
│   ├── search/api.ts      # 검색 API 클라이언트 함수
│   ├── naver.ts           # 네이버 API 유틸
│   └── validate.tsx       # 이메일 / 전화번호 유효성 검사
├── store/
│   └── atom.ts            # Jotai atoms (상품 모달, 알림 모달)
├── styles/
│   ├── _variables.scss    # 디자인 토큰 (색상, 간격, 믹스인)
│   └── globals.scss       # 전역 스타일
└── types/
    └── index.ts           # 전체 타입 정의
```

---

## 🚀 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일 생성 후 아래 값을 입력하세요.

```env
NAVER_CLIENT_ID=your_client_id
NAVER_CLIENT_SECRET=your_client_secret
```

#### 네이버 쇼핑 API 키 발급
1. [네이버 개발자 센터](https://developers.naver.com/apps/#/register) 접속
2. 애플리케이션 등록 → **검색** API 선택
3. 발급된 `Client ID`, `Client Secret` 복사

### 3. 개발 서버 실행

```bash
npm run dev
```

→ [http://localhost:3000](http://localhost:3000) 접속

---

## 📌 구현 참고 사항

### 카테고리 필터
네이버 쇼핑 API는 카테고리 파라미터를 지원하지 않아 클라이언트 사이드에서 `category1` 필드를 기준으로 필터링합니다.

### 무한 스크롤
- `IntersectionObserver`로 하단 sentinel 요소 감지
- 정렬/검색어 변경 시 `blockRef`로 중복 호출 방지, `gcTime: 0`으로 이전 캐시 즉시 제거

### 가격 알림
실제 이메일/문자 발송은 구현되어 있지 않으며, 알림 등록 내역은 `localStorage`에 저장됩니다.
등록/삭제 시 커스텀 이벤트(`pricehunt_alert_change`)를 발행해 같은 탭에서도 즉시 반영됩니다.
