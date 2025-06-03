import Foundation

class TokenManager {
    static let shared = TokenManager()
    private init() {}
    var accessToken: String?
}
