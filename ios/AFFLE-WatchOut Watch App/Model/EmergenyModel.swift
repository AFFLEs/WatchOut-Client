struct EmergencyRequest: Codable {
    let reason: String
    let latitude: Double
    let longitude: Double
}

struct EmergencyResponse: Codable {
    let status: String
    let message: String
    let code: Int
    let data: ResponseData
    
    struct ResponseData: Codable {
        let userName: String
        let reason: String
        let latitude: Double
        let longitude: Double
        let spot: [String]
    }
}
