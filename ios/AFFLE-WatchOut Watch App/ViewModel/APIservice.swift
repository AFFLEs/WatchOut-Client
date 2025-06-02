import Foundation

class APIservice {
    private let backendBaseURL = "https://port-0-watchout-server-mb69k3yc7cb6dc71.sel4.cloudtype.app/api/disasters"

    func fetchDisasterAlert(lat: Double, lng: Double, completion: @escaping (FromBackend?) -> Void) {
        let urlString = "\(backendBaseURL)?lat=\(lat)&lng=\(lng)"
        guard let url = URL(string: urlString) else {
            completion(nil)
            return
        }
        //디버깅ㅇ용
        let token = "디버깅용 하드코딩"
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")

        URLSession.shared.dataTask(with: request) { data, response, error in
            // 여기서 print로 로그 남김!
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
