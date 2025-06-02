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
