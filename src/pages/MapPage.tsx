
import React, { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import MapComponent from "@/components/MapComponent";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin } from "lucide-react";

const MapPage = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");

  const categories = [
    { id: "all", name: "전체" },
    { id: "event", name: "행사정보" },
    { id: "culture", name: "반려동물 입장가능 문화시설" },
    { id: "hospital", name: "동물병원" },
    { id: "grooming", name: "애견미용실" },
    { id: "restaurant", name: "반려동물 입장가능 업장" },
    { id: "shelter", name: "유기견보호소" },
    { id: "park", name: "산책명소" },
  ];

  const regions = [
    { id: "all", name: "전체지역" },
    { id: "gangnam", name: "강남구" },
    { id: "jung", name: "중구" },
    { id: "mapo", name: "마포구" },
    { id: "seocho", name: "서초구" },
    { id: "songpa", name: "송파구" },
  ];

  const allLocations = [
    {
      id: 1,
      name: "서울역 근처 분양",
      address: "서울 중구 세종대로 18",
      category: "event",
      region: "jung",
      lat: 37.5556,
      lng: 126.9723,
    },
    {
      id: 2,
      name: "남부터미널역 근처 분양",
      address: "서울 서초구 서초대로 지하 194",
      category: "culture",
      region: "seocho",
      lat: 37.4767,
      lng: 127.0041,
    },
    {
      id: 3,
      name: "강남역 근처 분양",
      address: "서울 강남구 강남대로 390",
      category: "hospital",
      region: "gangnam",
      lat: 37.4979,
      lng: 127.0276,
    },
    {
      id: 4,
      name: "홍대입구역 근처 분양",
      address: "서울 마포구 양화로 160",
      category: "grooming",
      region: "mapo",
      lat: 37.5573,
      lng: 126.9235,
    },
    {
      id: 5,
      name: "건대입구역 근처 분양",
      address: "서울 광진구 아차산로 272",
      category: "restaurant",
      region: "gangnam",
      lat: 37.5403,
      lng: 127.0695,
    },
    {
      id: 6,
      name: "신촌역 근처 분양",
      address: "서울 서대문구 신촌로 120",
      category: "shelter",
      region: "mapo",
      lat: 37.5556,
      lng: 126.9368,
    },
    {
      id: 7,
      name: "잠실역 근처 분양",
      address: "서울 송파구 올림픽로 265",
      category: "park",
      region: "songpa",
      lat: 37.5133,
      lng: 127.1,
    },
    {
      id: 8,
      name: "종로3가역 근처 분양",
      address: "서울 종로구 종로 151",
      category: "event",
      region: "jung",
      lat: 37.5703,
      lng: 126.991,
    },
    {
      id: 9,
      name: "을지로3가역 근처 분양",
      address: "서울 중구 을지로 166",
      category: "culture",
      region: "jung",
      lat: 37.5663,
      lng: 126.991,
    },
    {
      id: 10,
      name: "동대문역 근처 분양",
      address: "서울 중구 청계천로 428",
      category: "hospital",
      region: "jung",
      lat: 37.5712,
      lng: 127.0094,
    },
  ];

  const filteredLocations = allLocations.filter((location) => {
    const matchesCategory = selectedCategory === "all" || location.category === selectedCategory;
    const matchesRegion = selectedRegion === "all" || location.region === selectedRegion;
    const matchesSearch = location.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesRegion && matchesSearch;
  });

  const handleLocationClick = (location) => {
    setSelectedLocation(location);
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedLocation(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-pink-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* 상단 검색 영역 */}
              <div className="p-6 border-b">
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <Input 
                    placeholder="제목으로 검색" 
                    className="flex-1"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="지역 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((region) => (
                        <SelectItem key={region.id} value={region.id}>
                          {region.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button className="bg-orange-500 hover:bg-orange-600 w-full sm:w-auto">
                    검색
                  </Button>
                </div>

                {/* 카테고리 버튼들 */}
                <div className="mt-6">
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleCategoryClick(category.id)}
                        className={selectedCategory === category.id ? "bg-orange-500 hover:bg-orange-600" : ""}
                      >
                        {category.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 목록과 지도 영역 - 세로 배치 */}
              <div className="p-6">
                <div className="space-y-8">
                  {/* 위: 목록 */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      분양 위치 목록 ({filteredLocations.length}개)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                      {filteredLocations.map((location) => (
                        <Card
                          key={location.id}
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            selectedLocation?.id === location.id
                              ? "ring-2 ring-orange-500"
                              : ""
                          }`}
                          onClick={() => handleLocationClick(location)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                              <MapPin className="h-5 w-5 text-orange-500 mt-1 flex-shrink-0" />
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900 text-sm">
                                  {location.name}
                                </h4>
                                <p className="text-xs text-gray-600 mt-1">
                                  {location.address}
                                </p>
                                <span className="inline-block mt-2 px-2 py-1 text-xs bg-orange-100 text-orange-600 rounded-full">
                                  {categories.find(c => c.id === location.category)?.name}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* 아래: 지도 */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">위치 지도</h3>
                    <div className="h-96 rounded-lg overflow-hidden border">
                      <MapComponent
                        locations={filteredLocations}
                        selectedLocation={selectedLocation}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden lg:block lg:col-span-1">
            <Sidebar />
          </div>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">냥</span>
              </div>
              <p className="font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                냥몽 - 반려동물과 함께하는 따뜻한 커뮤니티
              </p>
            </div>
            <p className="text-sm">© 2024 냥몽. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MapPage;
