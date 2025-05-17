import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
// import FileViewer from 'react-native-file-viewer';
import Share from 'react-native-share';


export default function ExportTravelRecord({ scheduleByDate }) {
  const handleExport = async () => {
    // HTML 생성
    let html = '<h1>여행 기록</h1>';
    Object.entries(scheduleByDate).forEach(([date, schedules]) => {
      html += `<h2>${date}</h2><ul>`;
      schedules.forEach(sch => {
        html += `<li>${sch.time} - ${sch.place} (${sch.address})</li>`;
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
      Alert.alert('PDF 생성/열기 실패', e.message);
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleExport}>
      <Text style={styles.text}>여행 기록 내보내기</Text>
    </TouchableOpacity>
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
