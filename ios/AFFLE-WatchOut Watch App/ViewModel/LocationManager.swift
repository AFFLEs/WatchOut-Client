//
//  LocationManager.swift
//  AFFLE-WatchOut Watch App
//
//  Created by 김지민 on 5/31/25.
//

import CoreLocation
import Combine

class LocationManager: NSObject, ObservableObject, CLLocationManagerDelegate {
    private let locationManager = CLLocationManager()
    @Published var latitude: Double?
    @Published var longitude: Double?
    @Published var authorizationStatus: CLAuthorizationStatus = .notDetermined
  
    private var lastNotifiedLocation: CLLocation?
    let cityLevelLocationChanged = PassthroughSubject<(lat: Double, lng: Double), Never>()
  
    override init() {
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
      
        DispatchQueue.main.async {
            self.latitude = location.coordinate.latitude
            self.longitude = location.coordinate.longitude
        }
        if let last = lastNotifiedLocation {
            let distance = last.distance(from: location)
            if distance < 1000 { // 1km 미만이면 무시
                return
            }
        }
        
        lastNotifiedLocation = location
        cityLevelLocationChanged.send((lat: roundedLat, lng: roundedLng))
    }

    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        print("위치 업데이트 실패: \(error.localizedDescription)")
    }
  
}
