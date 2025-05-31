import moment from 'moment-timezone';

export const getFormattedTimes = (timezone) => {
  if (!timezone) return { localTime: '--:--', homeTime: '--:--' };
  
  const now = moment();
  return {
    localTime: now.tz(timezone).format('HH:mm'),
    homeTime: now.tz('Asia/Seoul').format('HH:mm')
  };
}; 