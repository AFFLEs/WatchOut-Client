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

