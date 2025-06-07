import Foundation
import Security

class APIservice: ObservableObject {
    static let shared = APIservice()
    private let backendBaseURL = "https://port-0-watchout-server-mb69k3yc7cb6dc71.sel4.cloudtype.app/api/disasters"
    
    private init() {
    }

    func fetchDisasterAlert(lat: Double, lng: Double, completion: @escaping (FromBackend?) -> Void) {
        let urlString = "\(backendBaseURL)?lat=\(lat)&lng=\(lng)"
        guard let url = URL(string: urlString) else {
            print("❌ [API Error] 잘못된 URL: \(urlString)")
            completion(nil)
            return
        }

        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        
        if let token = TokenManager.shared.accessToken {
            print("✅ API 호출에 사용할 토큰: \(token)")
            print("🔑 최종 토큰: '\(token)'")
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        } else {
            print("❌ API 호출 실패: 토큰이 없습니다")
            completion(nil)
            return
        }

        print("🌐 API 요청 시작: \(urlString)")
        URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                print("❌ [API Error] 네트워크 오류: \(error.localizedDescription)")
                completion(nil)
                return
            }
            guard let httpResponse = response as? HTTPURLResponse else {
                print("❌ [API Error] HTTP 응답이 아님")
                completion(nil)
                return
            }
            print("📡 API 응답 상태 코드: \(httpResponse.statusCode)")
            guard (200...299).contains(httpResponse.statusCode) else {
                print("❌ [API Error] 상태코드: \(httpResponse.statusCode)")
                completion(nil)
                return
            }
            guard let data = data else {
                print("❌ [API Error] 데이터 없음")
                completion(nil)
                return
            }
            do {
                let decoded = try JSONDecoder().decode(DisasterResponse.self, from: data)
                print("✅ [API Success] 디코딩 성공: \(decoded)")
                completion(decoded.data?.first)
            } catch {
                print("❌ [API Error] 디코딩 오류: \(error)")
                completion(nil)
            }
        }.resume()
    }
}


extension APIservice {
    func sendEmergencyAlert(
        reason: String,
        latitude: Double,
        longitude: Double,
        completion: @escaping (Result<EmergencyResponse, Error>) -> Void
    ) {
        let endpoint = "https://port-0-watchout-server-mb69k3yc7cb6dc71.sel4.cloudtype.app/api/emergency"
        print("🚀 [Emergency API] 시작 - URL: \(endpoint)")
        
        guard let url = URL(string: endpoint) else {
            print("‼️ [Emergency API] URL 생성 실패")
            completion(.failure(NSError(domain: "Invalid URL", code: 0)))
            return
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        // 토큰 로깅
        if let token = TokenManager.shared.accessToken {
            print("🔐 [Emergency API] 사용된 토큰: \(token)")
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        } else {
            print("🔴 [Emergency API] 토큰 없음 - 요청 중단")
            completion(.failure(NSError(domain: "No Token", code: 401)))
            return
        }
        
        // 요청 바디 로깅
        let requestBody = EmergencyRequest(
            reason: reason,
            latitude: latitude,
            longitude: longitude
        )
        do {
            let jsonData = try JSONEncoder().encode(requestBody)
            request.httpBody = jsonData
            if let jsonString = String(data: jsonData, encoding: .utf8) {
                print("📤 [Emergency API] 요청 바디:\n\(jsonString)")
            }
        } catch {
            print("‼️ [Emergency API] JSON 인코딩 실패: \(error)")
            completion(.failure(error))
            return
        }
        
        print("🌍 [Emergency API] 요청 시작 - Method: \(request.httpMethod ?? "N/A")")
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            // 네트워크 에러 처리
            if let error = error {
                print("🔴 [Emergency API] 네트워크 에러: \(error.localizedDescription)")
                DispatchQueue.main.async {
                    completion(.failure(error))
                }
                return
            }
            
            // HTTP 응답 검증
            guard let httpResponse = response as? HTTPURLResponse else {
                print("🔴 [Emergency API] 유효하지 않은 응답 형식")
                DispatchQueue.main.async {
                    completion(.failure(NSError(domain: "Invalid Response", code: 0)))
                }
                return
            }
            
            let statusCode = httpResponse.statusCode
            print("📮 [Emergency API] 응답 상태 코드: \(statusCode)")
            
            // 상태 코드 에러 처리
            guard (200...299).contains(statusCode) else {
                var errorMessage = "서버 오류"
                if let data = data, let serverMsg = String(data: data, encoding: .utf8) {
                    errorMessage = serverMsg
                }
                print("🔴 [Emergency API] 서버 오류 - 코드: \(statusCode), 메시지: \(errorMessage)")
                DispatchQueue.main.async {
                    completion(.failure(NSError(domain: errorMessage, code: statusCode)))
                }
                return
            }
            
            // 데이터 존재 여부 확인
            guard let data = data else {
                print("🔴 [Emergency API] 응답 데이터 없음")
                DispatchQueue.main.async {
                    completion(.failure(NSError(domain: "No Data", code: 0)))
                }
                return
            }
            
            // Raw 데이터 로깅 (디버깅용)
            if let rawResponse = String(data: data, encoding: .utf8) {
                print("📥 [Emergency API] 원시 응답 데이터:\n\(rawResponse)")
            }
            
            // 디코딩 시도
            do {
                let decoded = try JSONDecoder().decode(EmergencyResponse.self, from: data)
                print("✅ [Emergency API] 디코딩 성공 - 사용자: \(decoded.data.userName)")
                DispatchQueue.main.async {
                    completion(.success(decoded))
                }
            } catch {
                print("🔴 [Emergency API] 디코딩 실패 - 오류: \(error)")
                if let decodingError = error as? DecodingError {
                    switch decodingError {
                    case .dataCorrupted(let context):
                        print("📦 데이터 손상: \(context)")
                    case .keyNotFound(let key, let context):
                        print("🔑 키 누락: \(key.stringValue), 컨텍스트: \(context)")
                    case .typeMismatch(let type, let context):
                        print("⚡️ 타입 불일치: \(type), 컨텍스트: \(context)")
                    case .valueNotFound(let type, let context):
                        print("❎ 값 누락: \(type), 컨텍스트: \(context)")
                    @unknown default:
                        print("⚠️ 알 수 없는 디코딩 오류")
                    }
                }
                DispatchQueue.main.async {
                    completion(.failure(error))
                }
            }
        }.resume()
    }
}
