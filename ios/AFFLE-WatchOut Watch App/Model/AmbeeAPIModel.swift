//
//  AmbeeAPIModel.swift
//  AFFLE-WatchOut Watch App
//
//  Created by 김지민 on 5/31/25.
//

import Foundation

// Response 받을 애들
struct FromBackend: Decodable {
  let title: String?
  let contents: String?
}


class APIservice {
    private let backendBaseURL = "벡엔드uri 나중에 넣을 예정"

    func fetchDisasterAlert(lat: Double, lng: Double, completion: @escaping (FromBackend?) -> Void) {
        let urlString = "\(backendBaseURL)?lat=\(lat)&lng=\(lng)"
        guard let url = URL(string: urlString) else {
            completion(nil)
            return
        }
        var request = URLRequest(url: url)
        request.httpMethod = "GET"

        URLSession.shared.dataTask(with: request) { data, response, error in
            guard let data = data, error == nil else {
                print("백엔드 API 오류:", error ?? "데이터 없음")
                completion(nil)
                return
            }
            do {
                let decoded = try JSONDecoder().decode(FromBackend.self, from: data)
                completion(decoded)
            } catch {
                print("디코딩 오류:", error)
                completion(nil)
            }
        }.resume()
    }
}
