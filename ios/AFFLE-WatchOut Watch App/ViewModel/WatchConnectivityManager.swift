import Foundation
import WatchConnectivity

class WatchConnectivityManager: NSObject, ObservableObject {
    static let shared = WatchConnectivityManager()
    private let apiService = APIservice.shared
    
    @Published var isConnected: Bool = false
    @Published var receivedMessage: String = ""
    
    override init() {
        super.init()
        if WCSession.isSupported() {
            let session = WCSession.default
            session.delegate = self
            session.activate()
        }
    }
}

extension WatchConnectivityManager: WCSessionDelegate {
    func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {
        DispatchQueue.main.async {
            self.isConnected = activationState == .activated
            if let error = error {
                print("❌ WCSession 활성화 실패: \(error.localizedDescription)")
            } else {
                print("✅ WCSession 활성화 성공")
            }
        }
    }
    
    func session(_ session: WCSession, didReceiveMessage message: [String : Any], replyHandler: @escaping ([String : Any]) -> Void) {
        DispatchQueue.main.async {
          if let accessToken = message["accessToken"] as? String {
              TokenManager.shared.accessToken = accessToken
              print("✅ 액세스 토큰 수신 & memory에 저장 완료")
              LocationManager.shared.resetAPICallState() //새로 들어온 경우 토큰 초기화
              LocationManager.shared.requestCurrentLocationAndCallAPI()
           } else {
              print("앱에서부터 토큰이 오지 않았음")
           }
        }
    }

    
    #if os(iOS)
    func sessionDidBecomeInactive(_ session: WCSession) {}
    func sessionDidDeactivate(_ session: WCSession) {
        session.activate()
    }
    #endif
} 
