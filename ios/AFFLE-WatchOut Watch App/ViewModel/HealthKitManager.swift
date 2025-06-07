//
//  HealthKitManager.swift
//  AFFLE-WatchOut Watch App
//
//  Created by 김지민 on 5/31/25.
//

import Foundation
import HealthKit

class HealthKitManager: ObservableObject {
    private var healthKitTimer: Timer?
    private let healthStore = HKHealthStore()
    
    @Published var steps: Int = 0
    @Published var heartRate: Int = 0
    @Published var activeEnergyBurned: Double = 0
    
    func requestAuthorization(completion: @escaping (Bool) -> Void) {
        let typesToRead: Set = [
            HKQuantityType.quantityType(forIdentifier: .stepCount)!,
            HKQuantityType.quantityType(forIdentifier: .heartRate)!,
            HKQuantityType.quantityType(forIdentifier: .activeEnergyBurned)!
        ]
        healthStore.requestAuthorization(toShare: nil, read: typesToRead) { success, _ in
            completion(success)
        }
    }
    
    func fetchSteps() {
        guard let type = HKQuantityType.quantityType(forIdentifier: .stepCount) else { return }
        let now = Date()
        let startOfDay = Calendar.current.startOfDay(for: now)
        let predicate = HKQuery.predicateForSamples(withStart: startOfDay, end: now, options: .strictStartDate)
        let query = HKStatisticsQuery(quantityType: type, quantitySamplePredicate: predicate, options: .cumulativeSum) { [weak self] _, result, _ in
            let count = result?.sumQuantity()?.doubleValue(for: .count()) ?? 0
            DispatchQueue.main.async {
                self?.steps = Int(count)
            }
        }
        healthStore.execute(query)
    }
    
    func fetchHeartRate() {
        guard let type = HKQuantityType.quantityType(forIdentifier: .heartRate) else { return }
        let sort = NSSortDescriptor(key: HKSampleSortIdentifierEndDate, ascending: false)
        let query = HKSampleQuery(sampleType: type, predicate: nil, limit: 1, sortDescriptors: [sort]) { [weak self] _, samples, _ in
            if let sample = samples?.first as? HKQuantitySample {
                let value = sample.quantity.doubleValue(for: HKUnit(from: "count/min"))
                print("심박수2 : \(Int(value)) bpm") //디버깅용
                DispatchQueue.main.async {
                    self?.heartRate = Int(value)
                }
            }
        }
        healthStore.execute(query)
    }
    
    func fetchActiveEnergyBurned() {
        guard let type = HKQuantityType.quantityType(forIdentifier: .activeEnergyBurned) else { return }
        let calendar = Calendar.current
        let startOfDay = calendar.startOfDay(for: Date())
        let now = Date()

        let predicate = HKQuery.predicateForSamples(withStart: startOfDay, end: now, options: .strictStartDate)

        let query = HKStatisticsQuery(quantityType: type, quantitySamplePredicate: predicate, options: .cumulativeSum) { [weak self] _, result, _ in
            if let sum = result?.sumQuantity() {
                let value = sum.doubleValue(for: HKUnit.kilocalorie())
                print("🔥 오늘 하루 소모한 칼로리 양: \(value) kcal") //디버깅용
                DispatchQueue.main.async {
                    self?.activeEnergyBurned = value
                }
            } else {
                print("오늘 축적된 칼로리 데이터 없음")
            }
        }

        healthStore.execute(query)
    }

    func startHealthMonitoring() {
        healthKitTimer?.invalidate()
        healthKitTimer = Timer.scheduledTimer(withTimeInterval: 60, repeats: true) { _ in
          print("⏰ Timer 동작 - 60초마다 체크")
          self.fetchHeartRate()
          self.fetchSteps()
          self.checkAndSendEmergency()
        }
        self.fetchHeartRate()
        self.fetchSteps()
        self.checkAndSendEmergency()
    }

}


extension HealthKitManager {
    func checkAndSendEmergency() {
        print("🔥 checkAndSendEmergency 호출됨")
        print("🫀 현재 heartRate 값: \(heartRate)")
        let currentLocation = LocationManager.shared.currentLocation
        print("📍 현재 위치: \(currentLocation)")
        // 위험 상황 판단
        let isEmergency = heartRate > 30
        print("🚨 응급상황 여부: \(isEmergency) (heartRate: \(heartRate) > 30)")

        if isEmergency {
            let userInfo: [String: Any] = [
                "reason": "심박수가 너무 높습니다: \(heartRate) BPM",
                "latitude": currentLocation.latitude,
                "longitude": currentLocation.longitude
            ]
            NotificationCenter.default.post(
                name: .emergencyDetected,
                object: nil,
                userInfo: userInfo
            )
        }else{
            print("❌ 응급상황 아님 - API 호출 안함")
        }
    }
}

