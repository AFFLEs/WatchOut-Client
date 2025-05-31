import moment from 'moment-timezone';

export const getLocationTimes = (timezone) => {
  if (!timezone) return { localTime: '--:--', homeTime: '--:--' };
  
  const now = moment();
  return {
    localTime: now.tz(timezone).format('HH:mm'),
    homeTime: now.tz('Asia/Seoul').format('HH:mm')
  };
}; 



export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const weekDay = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
    return `${month}월 ${day}일 (${weekDay})`;
};