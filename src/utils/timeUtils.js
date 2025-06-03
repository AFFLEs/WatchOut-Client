import moment from 'moment-timezone';

export const getLocationTimes = (timezone) => {
  if (!timezone) return { localTime: '--:--', homeTime: '--:--' };
  
  const now = moment();
  return {
    localTime: now.tz(timezone).format('HH:mm'),
    homeTime: now.tz('Asia/Seoul').format('HH:mm')
  };
}; 

// 14:00:00 -> 14:00
export const formatTime = (timeString) => {
  if (!timeString) return null;
  
  // 입력값이 유효한 시간 문자열인지 확인
  const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
  if (!timeRegex.test(timeString)) {
    console.error('Invalid time format:', timeString);
    return null;
  }

  try {
    return moment(timeString, 'HH:mm:ss').format('HH:mm');
  } catch (error) {
    console.error('Error formatting time:', error);
    return null;
  }
};



export const formatDate = (dateString) => {
    if (!dateString) return null;
    
    try {
        const date = new Date(dateString);
        
        // 유효하지 않은 날짜인 경우
        if (isNaN(date.getTime())) {
            console.error('Invalid date string:', dateString);
            return null;
        }
        
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const weekDay = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
        return `${month}월 ${day}일 (${weekDay})`;
    } catch (error) {
        console.error('Error formatting date:', error);
        return null;
    }
};


export const formatDatewithYear = (dateString) => {
  if (!dateString) return null;
  
  try {
      const date = new Date(dateString);
      
      // 유효하지 않은 날짜인 경우
      if (isNaN(date.getTime())) {
          console.error('Invalid date string:', dateString);
          return "2025-00-00";
      }
      
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const weekDay = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
      return `${date.getFullYear()}년 ${month}월 ${day}일 (${weekDay})`;
  } catch (error) {
      console.error('Error formatting date:', error);
      return null;
  }
};