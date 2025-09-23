# Contributing

이 레포는 Conventional Commits 규칙을 따릅니다. 모든 커밋 메시지는 자동으로 검사되며, 규칙을 위반하면 커밋이 거부됩니다.

## 커밋 컨벤션 (Conventional Commits)

형식:

```
<type>(<scope>): <subject>

<body>

<footer>
```

- type: 아래 목록 중 하나
  - feat: 새로운 기능
  - fix: 버그 수정
  - docs: 문서 변경
  - style: 코드 스타일, 포매팅 (로직 변경 없음)
  - refactor: 리팩토링
  - perf: 성능 개선
  - test: 테스트 추가/수정
  - build: 빌드/의존성 관련 변경
  - ci: CI 구성/스크립트 변경
  - chore: 기타 변경
  - revert: 이전 커밋 되돌리기
- scope: 선택 사항이며, 다음을 권장합니다: app, layout, route, ui, styles, css, config, build, deps, lint, types, dev, docs, release
- subject: 간결하게 요점만 (한국어 가능)
- body: 선택 사항, 변경 이유/배경 설명
- footer: 이슈/브레이킹 체인지 표기

### 예시

- `feat(app): 로그인 페이지 추가`
- `fix(api): 사용자 생성 시 null 체크`
- `docs(readme): 설치 가이드 보강`
- `refactor(ui): 버튼 컴포넌트 단순화`
- `perf(app): 홈 히어로 섹션 이미지 최적화`

### BREAKING CHANGE

하위 호환성이 깨질 때는 본문 또는 footer에 BREAKING CHANGE를 명시합니다.

```
feat(api): 세션 구조 개편

BREAKING CHANGE: 기존 토큰 포맷을 더 이상 지원하지 않습니다.
```

## 훅과 자동화

- 커밋 메시지는 commitlint로 검사됩니다: `.husky/commit-msg`
- 커밋 전에는 Biome으로 린트/포매팅이 실행됩니다: `.husky/pre-commit`
- Husky는 `bun install` 후 자동 준비되며, 필요한 경우 수동으로 `bun run prepare`를 실행하세요.

## 브랜치 명명 (권장)

- feature/<짧은-설명>
- fix/<이슈번호-또는-짧은-설명>
- chore/<작업-설명>

## PR 타이틀

PR 타이틀도 커밋 컨벤션을 따르는 것을 권장합니다.
