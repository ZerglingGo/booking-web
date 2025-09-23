/**
 * Commitlint configuration extending Conventional Commits.
 * Docs: https://commitlint.js.org/
 */

/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // 허용 타입 (Conventional Commits)
    "type-enum": [
      2,
      "always",
      [
        "feat", // 기능 추가
        "fix", // 버그 수정
        "docs", // 문서 변경
        "style", // 코드 스타일(포매팅 등, 로직 변경 없음)
        "refactor", // 리팩토링
        "perf", // 성능 개선
        "test", // 테스트 추가/수정
        "build", // 빌드 시스템 또는 외부 종속성 변경
        "ci", // CI 구성 변경
        "chore", // 기타 변경
        "revert", // 되돌리기
      ],
    ],
    // 스코프는 선택 사항. 있으면 아래 목록을 권장(경고) 수준으로 체크
    "scope-enum": [
      1,
      "always",
      [
        // Next.js App Router areas
        "app",
        "layout",
        "route",
        // UI & styles
        "ui",
        "styles",
        "css",
        // Config & tooling
        "config",
        "build",
        "deps",
        "lint",
        "types",
        "dev",
        // Docs & release
        "docs",
        "release",
      ],
    ],
    // 제목 대소문자 제한 없음(한국어 허용)
    "subject-case": [0],
    // 헤더 최대 길이
    "header-max-length": [2, "always", 100],
  },
};
