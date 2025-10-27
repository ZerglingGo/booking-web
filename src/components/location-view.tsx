"use client";

import { Map as KakaoMap, MapMarker, ZoomControl } from "react-kakao-maps-sdk";
import useKakaoLoader from "@/hooks/use-kakao-loader";

export default function LocationView() {
  useKakaoLoader();

  return (
    <div className="mx-auto w-full overflow-hidden rounded border shadow">
      <KakaoMap className="h-128 w-full" center={{ lat: 37.194881754, lng: 126.794678659 }} level={5} mapTypeId={"ROADMAP"}>
        <MapMarker position={{ lat: 37.194881754, lng: 126.794678659 }} />
        <ZoomControl position={"RIGHT"} />
      </KakaoMap>
    </div>
  );
}
