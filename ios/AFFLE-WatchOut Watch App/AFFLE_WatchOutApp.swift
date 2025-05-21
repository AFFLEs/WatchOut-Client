//
//  AFFLE_WatchOutApp.swift
//  AFFLE-WatchOut Watch App
//
//  Created by 김지민 on 5/20/25.
//

import SwiftUI
import WatchConnectivity

@main
struct AFFLE_WatchOut_Watch_AppApp: App {
    @StateObject private var connectionHelper = ConnectionHelper()
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(connectionHelper)
        }
    }
}

