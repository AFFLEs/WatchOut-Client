//
//  Extension.swift
//  AFFLE-WatchOut Watch App
//
//  Created by 김지민 on 6/1/25.
//

import Foundation

extension Double {
    func rounded(toPlaces places: Int) -> Double {
        let divisor = pow(10.0, Double(places))
        return (self * divisor).rounded() / divisor
    }
}
