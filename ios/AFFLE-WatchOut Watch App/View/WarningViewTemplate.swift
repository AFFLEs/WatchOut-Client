//
//  WarningViewTemplate.swift
//  AFFLE-WatchOut Watch App
//
//  Created by 김지민 on 5/31/25.
//

import SwiftUI

struct WarningViewTemplate: View {
    let backgroundColor: Color
    let iconName: String
    let title: String
    let subtitle: String
    let buttonAction: () -> Void
    
    init(
        //dummy
        backgroundColor: Color = .orange,
        iconName: String = "exclamationmark.triangle.fill",
        title: String = "탈수 위험 경고",
        subtitle: String = "물을 마신 후,\n휴식을 취하세요",
        buttonAction: @escaping () -> Void = {}
    ) {
        self.backgroundColor = backgroundColor
        self.iconName = iconName
        self.title = title
        self.subtitle = subtitle
        self.buttonAction = buttonAction
    }
    
    var body: some View {
        ZStack {
            Rectangle()
                .fill(backgroundColor)
                .ignoresSafeArea()
            
            VStack(spacing: 5) {
                Image(systemName: iconName)
                    .font(.system(size: 25, weight: .bold))
                    .foregroundColor(.white)
                
                Text(title)
                    .font(.system(size: 15, weight: .bold))
                    .foregroundColor(.white)
                    .multilineTextAlignment(.center)
                
                ScrollView {
                    Text(subtitle)
                        .font(.system(size: 10, weight: .medium))
                        .foregroundColor(.white)
                        .multilineTextAlignment(.center)
                        .fixedSize(horizontal: false, vertical: true)
                        .padding(.horizontal, 8)
                }.frame(maxHeight: 100)
                
                Button(action: buttonAction) {
                    ZStack {
                        Circle()
                            .fill(Color.white)
                            .frame(width: 30, height: 30)
                        
                        Image(systemName: "checkmark")
                            .font(.system(size: 20, weight: .bold))
                            .foregroundColor(backgroundColor)
                    }
                }.buttonStyle(.plain)
                .padding(.vertical,10)
            }
            .padding(.top,10)
            .padding(.horizontal, 20)
        }.ignoresSafeArea()
    }
}

#Preview {
    WarningViewTemplate()
}
