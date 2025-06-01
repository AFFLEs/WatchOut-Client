
export const formatPhoneNumberForDisplay = (phone) => {
  if (!phone) return '';
  
  // 숫자만 추출
  const cleaned = phone.replace(/[^0-9]/g, '');
  
  // 길이가 11자리가 아니면 원래 값 반환
  if (cleaned.length !== 11) return phone;
  
  // 010-0000-0000 형식으로 변환
  return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
};


export const formatPhoneNumberForAPI = (phone) => {
  if (!phone) return '';
  return phone.replace(/[^0-9]/g, '');
};
