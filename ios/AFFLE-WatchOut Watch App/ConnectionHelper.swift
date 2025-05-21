//
//  ConnectionHelper.swift
//  AFFLE-WatchOut Watch App
//
//  Created by 김지민 on 5/20/25.
//

import Foundation
import WatchConnectivity
import SwiftUI

class ConnectionHelper: NSObject, ObservableObject {
    @Published var receivedMessage: String = ""
    @Published var isConnected: Bool = false
    
    var session: WCSession
    
    init(session: WCSession = .default) {
        self.session = session
        super.init()
        if WCSession.isSupported() {
            session.delegate = self
            session.activate()
        }
    }
}

extension ConnectionHelper: WCSessionDelegate {
    func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {
        DispatchQueue.main.async {
            self.isConnected = activationState == .activated
        }
    }
    
    func session(_ session: WCSession, didReceiveMessage message: [String : Any], replyHandler: @escaping ([String : Any]) -> Void) {
        DispatchQueue.main.async {
            if let messageText = message["message"] as? String {
                self.receivedMessage = messageText
            }
            // 응답 메시지 전송
            replyHandler(["status": "received"])
        }
    }
}
