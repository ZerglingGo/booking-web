"use client";

import { Map as KakaoMap, MapMarker, ZoomControl } from "react-kakao-maps-sdk";
import useKakaoLoader from "@/hooks/use-kakao-loader";

export default function LocationView() {
  useKakaoLoader();

  return (
    <div className="rounded w-full mx-auto overflow-hidden shadow border">
      <KakaoMap className="w-full h-128" center={{ lat: 37.56647, lng: 126.9705 }} level={4} mapTypeId={"ROADMAP"}>
        <MapMarker position={{ lat: 37.56647, lng: 126.9705 }} />
        <ZoomControl position={"RIGHT"} />
      </KakaoMap>
    </div>
  );
}
