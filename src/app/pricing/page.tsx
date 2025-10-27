import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "요금 안내",
  description: "캠핑장 이용 요금을 안내해드립니다.",
};

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      <div className="mb-8 flex flex-col items-center justify-center">
        <h1 className="mb-4 inline-block font-bold text-3xl underline decoration-from-font decoration-primary underline-offset-8">요금 안내</h1>

        <span>캠핑장 이용 요금을 안내해드립니다.</span>
      </div>

      <div className="mx-auto max-w-4xl px-6">
        <div className="whitespace-pre-line rounded-lg border p-4 text-sm shadow">
          <span className="font-bold text-2xl">취소환불</span>
          <br />
          <br />- 이용일 3일 전까지는 100% 환불 가능합니다
          <br />- 이용일 이틀전은 70%환불 (30%차감)
          <br />- 이용일 하루전은 50%환불
          <br />- 당일은 환불 불가능합니다
          <br />
          (날짜 변경 또한 취소와 동일합니다.)
          <br />
          <br />
          우천적용(없음)
          <br />
          <br />
          -어썸월드 화성점은 텐트,실내테이블존,야외테이블존은 비가 내려도 무관하게 전체 이용가능합니다.
          <br />
          -야외 놀이시설이용시 우비 착용을 추천드립니다.(실내 놀이시설이용시 마른옷으로 환복후 이용.)
          <br />
          -어썸월드 화성점은 타 지점과 다르게 우천적용이 되지 않습니다.
          <br />
          -우천시에도 위 환불규정에 따라 환불되니 날씨 확인후 꼭 3일전까지 취소 하셔야 합니다.
          <br />
          <br />
          -마지막으로 다시한번 말씀드립니다. 이용날짜의 날씨확인후 꼭 3일전 취소 하셔야 100% 환불되며 , 우천시에도 위 환불규정에 따라 환불처리 됩니다 . 당일 취소 불가합니다.
          <br />
          -5팀미만시 운영이어려워서 양해부탁드립니다.
          <br />
          -(날짜 변경 또한 취소와 동일합니다.)
          <br />
        </div>
      </div>
    </div>
  );
}
