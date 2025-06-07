//
//  LocationManager.swift
//  AFFLE-WatchOut Watch App
//
//  Created by 김지민 on 5/31/25.
//

import CoreLocation
import Combine
import Foundation

extension Notification.Name {
    static let didReceiveDisasterAlert = Notification.Name("didReceiveDisasterAlert")
}

class LocationManager: NSObject, ObservableObject, CLLocationManagerDelegate {
    static let shared = LocationManager()
    private let locationManager = CLLocationManager()
    @Published var latitude: Double?
    @Published var longitude: Double?
    @Published var authorizationStatus: CLAuthorizationStatus = .notDetermined
    
    var currentLocation: (latitude: Double, longitude: Double) {
        guard let lat = latitude, let lng = longitude else {
            return (0, 0) // 기본값 처리
        }
        return (lat, lng)
    }

    private var hasCalledAPIForCurrentToken = false //최초 Ambee API 호출 여부 트래킹
    private var lastNotifiedLocation: CLLocation?
    let cityLevelLocationChanged = PassthroughSubject<(lat: Double, lng: Double), Never>()
  
    private override init() {
        super.init()
        locationManager.delegate = self
        locationManager.desiredAccuracy = kCLLocationAccuracyBest
        locationManager.requestWhenInUseAuthorization()
        locationManager.startUpdatingLocation()
    }

    func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
        authorizationStatus = manager.authorizationStatus
    }

 
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard let location = locations.last else { return }
      
        let roundedLat = location.coordinate.latitude.rounded(toPlaces: 5)
        let roundedLng = location.coordinate.longitude.rounded(toPlaces: 5)
      
        print("현재 위치: \(roundedLat), \(roundedLng)")
      
        DispatchQueue.main.async {
            self.latitude = location.coordinate.latitude
            self.longitude = location.coordinate.longitude
        }
      
        if !hasCalledAPIForCurrentToken {
            // ✅ 토큰이 처음 생긴 시점에만 1회 호출
            callDisasterAPI(lat: roundedLat, lng: roundedLng)
            hasCalledAPIForCurrentToken = true
        } else if let last = lastNotifiedLocation {
            let distance = last.distance(from: location)
            if distance >= 1000 {
                callDisasterAPI(lat: roundedLat, lng: roundedLng)
                lastNotifiedLocation = location
            } else {
                print("🚫 1km 미만 이동 - API 호출 스킵")
            }
        } else {
            lastNotifiedLocation = location
        }
        cityLevelLocationChanged.send((lat: roundedLat, lng: roundedLng))
    }
    func resetAPICallState() {
        hasCalledAPIForCurrentToken = false
        lastNotifiedLocation = nil
    }
    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        print("위치 업데이트 실패: \(error.localizedDescription)")
    }
  
    func requestCurrentLocationAndCallAPI() {
        locationManager.requestLocation() // 단일 위치 요청
    }

}

extension LocationManager {
    func callDisasterAPI(lat: Double, lng: Double) {
        guard let token = TokenManager.shared.accessToken else {
            print("🔑 토큰 없음 - API 호출 취소")
            return
        }
        print("🌐 API 호출: \(lat), \(lng), 토큰: \(token)")
        APIservice.shared.fetchDisasterAlert(lat: lat, lng: lng) { result in
            if let disaster = result {
                print("✅ 재난 데이터 수신: \(disaster.title ?? "제목 없음")")
                NotificationCenter.default.post(
                    name: .didReceiveDisasterAlert,
                    object: nil,
                    userInfo: ["title": disaster.title ?? "", "contents": disaster.contents ?? ""]
                )
            } else {
                print("❌ 재난 알림 데이터 없음")
            }
        }
    }
}
