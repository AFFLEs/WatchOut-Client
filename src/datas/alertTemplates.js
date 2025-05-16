export const alertTemplates = {
  earthquake: {
    title: '지진 발생',
    getDescription: ({ magnitude = 0, distance = 0 }) =>
      `현재 위치에서 ${distance}km 떨어진 지역에서 규모 ${magnitude}의 지진이 감지되었습니다. 여진에 주의하세요.`,
    backgroundColor: '#FFEAEA',
    iconColor: '#D32F2F',
  },
  dehydration: {
    title: '탈수 위험',
    getDescription: () =>
      '고온이 감지되었습니다. 수분을 충분히 섭취하고 그늘에서 휴식을 취하세요.',
    backgroundColor: '#E3F6F8',
    iconColor: '#0288D1',
  },
  heatwave: {
    title: '폭염 경보',
    getDescription: () =>
      '폭염이 예상됩니다. 외출을 자제하고 시원한 실내에 머무르세요.',
    backgroundColor: '#FFF3E0',
    iconColor: '#FF9800',
  },
  rainstorm: {
    title: '폭우 경보',
    getDescription: () =>
      '집중 호우가 예상됩니다. 저지대 침수에 대비하고 외출을 삼가세요.',
    backgroundColor: '#E3F2FD',
    iconColor: '#1565C0',
  },
};
