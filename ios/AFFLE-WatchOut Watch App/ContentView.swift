//
//  ContentView.swift
//  AFFLE-WatchOut Watch App
//
//  Created by 김지민 on 5/20/25.
//

import SwiftUI

struct ContentView: View {
    @EnvironmentObject var connectionHelper: ConnectionHelper
    
    var body: some View {
        VStack {
            if connectionHelper.isConnected {
                Text("연결됨")
                    .foregroundColor(.green)
                    .font(.caption2)
            } else {
                Text("연결 안됨")
                    .foregroundColor(.red)
                    .font(.caption2)
            }
            
            if !connectionHelper.receivedMessage.isEmpty {
                Text(connectionHelper.receivedMessage)
                    .font(.system(size: 16))
                    .multilineTextAlignment(.center)
                    .padding()
            } else {
                Text("메시지 대기 중...")
                    .font(.system(size: 14))
                    .foregroundColor(.gray)
            }
        }.foregroundColor(.white)
    }
}


#Preview {
    ContentView()
}
