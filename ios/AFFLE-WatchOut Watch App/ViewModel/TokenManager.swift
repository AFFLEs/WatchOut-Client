import Foundation

class TokenManager {
    static let shared = TokenManager()
    private init() {}
    var accessToken: String? {
        didSet {
            if accessToken != nil {
                NotificationCenter.default.post(name: .didReceiveAccessToken, object: nil)
            }
        }
    }
}
extension Notification.Name {
    static let didReceiveAccessToken = Notification.Name("didReceiveAccessToken")
    static let emergencyDetected = Notification.Name("emergencyDetected")
}

