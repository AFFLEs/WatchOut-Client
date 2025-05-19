import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import ModalCard from './ModalCard';
import ModalButton from './ModalButton';

function parseDate(dateStr) {
  // '2025년 5월 4일 (일)' → Date 객체
  const match = dateStr.match(/(\d{4})년 (\d{1,2})월 (\d{1,2})일/);
  if (!match) return null;
  const [_, y, m, d] = match;
  return new Date(Number(y), Number(m) - 1, Number(d));
}

function formatDate(date) {
  // Date 객체 → 'YYYY년 M월 D일 (요일)'
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 (${days[date.getDay()]})`;
}

function getDateRange(from, to) {
  // from, to: Date 객체
  const arr = [];
  let d = new Date(from);
  while (d <= to) {
    arr.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return arr;
}

export default function ScheduleInputModal({
  visible,
  onRequestClose,
  onSave,
  initialData = {},
  departureDate,
  returnDate,
}) {
  // 오늘~returnDate 사이의 날짜만
  const today = new Date();
  today.setHours(0,0,0,0);
  const dep = parseDate(departureDate);
  const ret = parseDate(returnDate);
  const start = today > dep ? today : dep;
  const dateObjs = getDateRange(start, ret);
  const dateList = dateObjs.map(formatDate);

  // 날짜별로 [{place}] 배열을 관리
  const [form, setForm] = useState(() => {
    const obj = {};
    dateList.forEach(date => {
      obj[date] = initialData[date] ? initialData[date].map(item => ({ place: item.place || '' })) : [{ place: '' }];
    });
    return obj;
  });

  useEffect(() => {
    // 날짜/초기데이터 바뀌면 form 재생성
    const obj = {};
    dateList.forEach(date => {
      obj[date] = initialData[date] ? initialData[date].map(item => ({ place: item.place || '' })) : [{ place: '' }];
    });
    setForm(obj);
  }, [visible, initialData, departureDate, returnDate]);

  const addSchedule = (date) => {
    setForm(prev => ({
      ...prev,
      [date]: [...prev[date], { place: '' }]
    }));
  };

  const updateSchedule = (date, idx, value) => {
    setForm(prev => {
      const arr = [...prev[date]];
      arr[idx].place = value;
      return { ...prev, [date]: arr };
    });
  };

  const removeSchedule = (date, idx) => {
    setForm(prev => {
      const arr = [...prev[date]];
      arr.splice(idx, 1);
      return { ...prev, [date]: arr.length ? arr : [{ place: '' }] };
    });
  };

  return (
    <ModalCard
      visible={visible}
      title="일정 등록/수정"
      onRequestClose={onRequestClose}
      width={340}
      buttons={[
        <ModalButton key="cancel" title="취소" onPress={onRequestClose} />,
        <ModalButton key="save" title="저장" onPress={() => onSave(form)} />,
      ]}
    >
      <ScrollView style={{ maxHeight: 420, paddingHorizontal: 16 }}>
        {dateList.map(date => (
          <View key={date} style={{ marginBottom: 18 }}>
            <Text style={styles.dateLabel}>{date}</Text>
            {form[date].map((item, idx) => (
              <View key={idx} style={styles.row}>
                <TextInput
                  style={styles.input}
                  placeholder="장소"
                  value={item.place}
                  onChangeText={text => updateSchedule(date, idx, text)}
                />
                <ModalButton title="삭제" onPress={() => removeSchedule(date, idx)} style={styles.Btn} textStyle={{ color: '#2563EB' }} />
              </View>
            ))}
            <ModalButton title="추가" onPress={() => addSchedule(date)} style={[styles.Btn, { marginTop: 4 }]} textStyle={{ color: '#2563EB' }} />
          </View>
        ))}
      </ScrollView>
    </ModalCard>
  );
}

const styles = StyleSheet.create({
  dateLabel: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 6,
    color: '#1F2937',
    width: 260,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 6,
    fontSize: 13,
    marginRight: 8,
    flex: 1,
    minWidth: 0,
  },
  Btn: {
    backgroundColor: '#fff',
    borderColor: '#2563EB',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    minWidth: 60,
  },
});