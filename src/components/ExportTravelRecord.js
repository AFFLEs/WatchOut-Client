import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
// import FileViewer from 'react-native-file-viewer';
import Share from 'react-native-share';
import ModalCard from './ModalCard';
import ModalButton from './ModalButton';
import { formatTime } from '../utils/timeUtils';

export default function ExportTravelRecord({ scheduleByDate }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleExport = async () => {
    // HTML 생성
    let html = '<h1>여행 기록</h1>';
    
    // 날짜로 정렬
    const sortedDates = Object.keys(scheduleByDate).sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateA - dateB;
    });

    sortedDates.forEach(date => {
      const schedules = scheduleByDate[date];
      html += `<h2>${date}</h2><ul>`;
      schedules.forEach(sch => {
        const timeDisplay = sch.spotTime ? `${formatTime(sch.spotTime)} -` : '예정 -';
        html += `<li>${timeDisplay} ${sch.spotName} (${sch.spotDetail})</li>`;
      });
      html += '</ul>';
    });

    // PDF 생성
    try {
      const options = {
        html,
        fileName: 'travel-record',
        directory: 'Documents',
        base64: false,
      };
      const file = await RNHTMLtoPDF.convert(options);

      await Share.open({
        url: 'file://' + file.filePath,
        type: 'application/pdf',
        title: '여행 기록 PDF 내보내기',
      });

    } catch (e) {
      setModalMessage(e.message || 'PDF 생성/공유 중 오류가 발생했습니다.');
      setModalVisible(true);
    }
  };

  return (
    <>
      <TouchableOpacity style={styles.button} onPress={handleExport}>
        <Text style={styles.text}>여행 기록 내보내기</Text>
      </TouchableOpacity>
      <ModalCard
        visible={modalVisible}
        title="오류가 발생했습니다."
        onRequestClose={() => setModalVisible(false)}
        width={260}
        buttons={[
          <ModalButton key="close" title="닫기" onPress={() => setModalVisible(false)} />
        ]}
      >
        <Text style={{ color: '#222B3A', fontSize: 14, textAlign: 'center',  marginBottom:10 }}>{modalMessage}</Text>
      </ModalCard>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
