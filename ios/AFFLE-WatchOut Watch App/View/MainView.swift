import SwiftUI
import Foundation

struct MainView: View {
    @StateObject private var healthManager = HealthKitManager()
    @State private var healthAuthorized = false
    @EnvironmentObject var connectionHelper: ConnectionHelper
    @Environment(\.scenePhase) var scenePhase
    @State private var now = Date()
    //재난정보
    @State private var alertTitle: String = ""
    @State private var alertContents: String = ""
    @State private var showAlert = false
    let apiService = APIservice()
  
    //위치 정보 추출
    @StateObject private var locationManager = LocationManager()
    @State private var lastAPICallLocation: GPSLocationModel? = nil



    var currentLocation: GPSLocationModel? {
        if let lat = locationManager.latitude, let lng = locationManager.longitude {
            return GPSLocationModel(lat: lat, lng: lng)
        }
        return nil
    }

  
    var localTime: String {
        let formatter = DateFormatter()
        formatter.locale = Locale.current
        formatter.dateFormat = "HH:mm"
        return formatter.string(from: now)
    }
    
    var localDate: String {
        let formatter = DateFormatter()
        formatter.locale = Locale(identifier: "ko_KR")
        formatter.dateFormat = "M월 d일 (E)"
        return formatter.string(from: now)
    }
    
    var koreaTime: String {
        let formatter = DateFormatter()
        formatter.locale = Locale(identifier: "ko_KR")
        formatter.timeZone = TimeZone(identifier: "Asia/Seoul")
        formatter.dateFormat = "HH:mm"
        return formatter.string(from: now)
    }
    
    var koreaDate: String {
        let formatter = DateFormatter()
        formatter.locale = Locale(identifier: "ko_KR")
        formatter.timeZone = TimeZone(identifier: "Asia/Seoul")
        formatter.dateFormat = "M월 d일 (E)"
        return formatter.string(from: now)
    }
    
    var body: some View {
        ZStack {
            Rectangle()
                .fill(Color(red: 0/255, green: 32/255, blue: 158/255))
                .edgesIgnoringSafeArea(.all)
            if connectionHelper.isConnected {
                VStack(spacing: 8) {
                    LogoHeaderView()
                    TimeInfoView(
                        localTime: localTime,
                        localDate: localDate,
                        koreaTime: koreaTime,
                        koreaDate: koreaDate
                    )
                    
                    LineDivider()
                        .padding(.vertical, 8)
                    
                    BottomStatsView(
                        steps: healthManager.steps,
                        heartRate: healthManager.heartRate,
                        activeEnergy: healthManager.activeEnergyBurned
                    )
                    
                    MessageView(message: connectionHelper.receivedMessage)
                }
                .padding(12)
            } else {
                VStack(alignment: .center) {
                    LogoHeaderView()
                    Spacer().frame(height: 30)
                    
                    Text("워치와 휴대폰이 연결되지 않았어요")
                        .foregroundColor(.yellow)
                        .font(.system(size: 15, weight: .bold))
                        .multilineTextAlignment(.center)
                    
                    Spacer()
                }
            }
        }
        .fullScreenCover(isPresented: $showAlert) {
            WarningViewTemplate(
                backgroundColor: .blue,
                iconName: "exclamationmark.triangle.fill",
                title: alertTitle,
                subtitle: alertContents,
                buttonAction: { showAlert = false }
            )
            .navigationBarHidden(true)
          
        }
        .onAppear {
          Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { _ in
              self.now = Date()
          }
          
          healthManager.requestAuthorization { success in
              if success {
                  fetchAllHealthData()
              }
          }
      
          fetchAllHealthData()
          if locationManager.authorizationStatus == .denied {
              print("위치 권한이 거부되었습니다.\n워치 설정에서 위치 권한을 허용해주세요.")
          }
          
        }
        .onChange(of: scenePhase) { newPhase in
            if newPhase == .active {
                fetchAllHealthData()
            }
        }
        .onReceive(locationManager.cityLevelLocationChanged) { (lat, lng) in
            apiService.fetchDisasterAlert(lat: lat, lng: lng) { result in
                if let result = result {
                    DispatchQueue.main.async {
                        alertTitle = result.title ?? ""
                        alertContents = result.contents ?? ""
                        showAlert = true
                    }
                }
            }
        }

    }
    
    private func fetchAllHealthData() {
        healthManager.fetchSteps()
        healthManager.fetchHeartRate()
        healthManager.fetchActiveEnergyBurned()
    }
  
}

struct LogoHeaderView: View {
    var body: some View {
        HStack(spacing: 8) {
            Image("watchoutLogo")
            Text("WatchOut")
                .foregroundColor(.white)
                .font(.system(size: 15, weight: .bold))
        }
        .padding(.top, 8)
    }
}

struct TimeInfoView: View {
    let localTime: String
    let localDate: String
    let koreaTime: String
    let koreaDate: String

    var body: some View {
        HStack(alignment: .top, spacing: 13) {
            VStack(alignment: .center, spacing: 5) {
                Text("현지 시간")
                    .font(.system(size: 15, weight: .bold))
                    .foregroundColor(.white)
                Text(localTime)
                    .font(.system(size: 20, weight: .bold))
                    .foregroundColor(.white)
                Text(localDate)
                    .font(.system(size: 10, weight: .bold))
                    .foregroundColor(.white)
            }

            VStack(alignment: .center, spacing: 5) {
                Text("한국 시각")
                    .font(.system(size: 15, weight: .bold))
                    .foregroundColor(.white)
                Text(koreaTime)
                    .font(.system(size: 20, weight: .bold))
                    .foregroundColor(.white)
                Text(koreaDate)
                    .font(.system(size: 10, weight: .bold))
                    .foregroundColor(.white)
            }
        }
        .padding(.horizontal, 5)
        .padding(.top, 8)
    }
}

struct LineDivider: View {
    var body: some View {
        Divider()
            .background(Color.white)
            .overlay(
                Rectangle()
                    .frame(height: 1)
                    .foregroundColor(.white)
                    .opacity(0.5)
                    .mask(
                        HStack {
                            ForEach(0..<20) { _ in
                                Rectangle()
                                    .frame(width: 4, height: 1)
                                    .opacity(0.5)
                                Spacer(minLength: 2)
                            }
                        }
                    )
            )
    }
}

struct BottomStatsView: View {
    let steps: Int
    let heartRate: Double
    let activeEnergy: Double

    var body: some View {
        HStack(spacing: 20) {
            StatItemView(icon: "stepIcon", value: "\(steps)")
            StatItemView(icon: "heartIcon",  value: String(format: "%.0f", heartRate))
            StatItemView(icon: "kcalIcon", value: String(format: "%.0f", activeEnergy))
        }
        .padding(.bottom, 8)
    }
}

struct StatItemView: View {
    let icon: String
    let value: String

    var body: some View {
      VStack(alignment:.center, spacing: 6) {
            Image(icon)
                .foregroundColor(.white)
                .frame(width: 11.79, height: 11.79)
            Text(value)
                .foregroundColor(.white)
                .font(.system(size: 13, weight: .bold))
        }
    }
}

struct MessageView: View {
    let message: String

    var body: some View {
        if !message.isEmpty {
            Text(message)
                .font(.system(size: 14))
                .multilineTextAlignment(.center)
                .padding(6)
                .foregroundColor(.white)
                .background(Color.black.opacity(0.3))
                .cornerRadius(8)
        } else {
            Text("메시지 대기 중...")
                .font(.system(size: 12))
                .foregroundColor(.gray)
                .padding(.top, 4)
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
      MainView()
            .environmentObject(ConnectionHelper())
    }
}
