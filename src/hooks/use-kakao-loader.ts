import { useKakaoLoader as useKakaoLoaderOrigin } from "react-kakao-maps-sdk";

export default function useKakaoLoader() {
  useKakaoLoaderOrigin({
    appkey: "8c128bf4c65d5db0416a297d2dd42911",
    libraries: ["clusterer", "drawing", "services"],
  });
}
