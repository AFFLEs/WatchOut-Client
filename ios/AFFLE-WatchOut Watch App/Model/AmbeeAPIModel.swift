//
//  AmbeeAPIModel.swift
//  AFFLE-WatchOut Watch App
//
//  Created by 김지민 on 5/31/25.
//

import Foundation

// Response 받을 애들
struct DisasterResponse: Decodable {
    let status: String?
    let message: String?
    let code: Int?
    let data: [FromBackend]?
}

struct FromBackend: Decodable {
    let title: String?
    let contents: String?
}



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
            guard let data = data, error == nil else {
                print("백엔드 API 오류:", error ?? "데이터 없음")
                completion(nil)
                return
            }
            do {
              let decoded = try JSONDecoder().decode(DisasterResponse.self, from: data)
                completion(decoded.data?.first)
            } catch {
                print("디코딩 오류:", error)
                completion(nil)
            }
        }.resume()
    }
}
