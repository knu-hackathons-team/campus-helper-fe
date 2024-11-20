import axios from "axios";

export const fetchRoute = async (
  start: { latitude: number; longitude: number },
  end: { latitude: number; longitude: number }
) => {
  const TMAP_API_KEY = import.meta.env.VITE_TMAP_API_KEY;

  try {
    const response = await axios.post(
      "https://apis.openapi.sk.com/tmap/routes/pedestrian",
      {
        startX: start.longitude,
        startY: start.latitude,
        endX: end.longitude,
        endY: end.latitude,
        reqCoordType: "WGS84GEO", // 좌표 타입
        resCoordType: "WGS84GEO", // 응답 좌표 타입
        startName: "출발지",
        endName: "도착지",
      },
      {
        headers: {
          "Content-Type": "application/json",
          appKey: TMAP_API_KEY,
        },
      }
    );

    // 경로 데이터를 반환 (경로 좌표 배열)
    return response.data.features
      .filter((feature: any) => feature.geometry.type === "LineString")
      .flatMap((feature: any) => feature.geometry.coordinates);
  } catch (error) {
    console.error("경로 요청 실패:", error);
    return [];
  }
};
