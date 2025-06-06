import 'react-native-get-random-values';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import GooglePlacesSDK from 'react-native-google-places-sdk';
import ModalCard from './ModalCard';
import ModalButton from './ModalButton';
import { GOOGLE_MAPS_API_KEY } from '../config/keys';
import { travelAPI } from '../apis/travelAPI';


function parseDate(dateStr) {
  if (!dateStr) return null;
  const match = dateStr.match(/(\d{4})년 (\d{1,2})월 (\d{1,2})일/);
  if (!match) return null;
  const [_, yearStr, monthStr, dayStr] = match;
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1;
  const day = parseInt(dayStr, 10);

  try {
    const date = new Date(year, month, day);
    if (isNaN(date.getTime())) return null;
    return date;
  } catch {
    return null;
  }
}

function formatDate(date) {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return '날짜 없음';
  }
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 (${days[date.getDay()]})`;
}

function formatDateForAPI(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getDateRange(from, to) {
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
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({});
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [processedData, setProcessedData] = useState(null);
  const [updateSummary, setUpdateSummary] = useState(null);

  // ────────────────────────────────────────────────────────────────────────────
  // ① SDK 초기화 + 메서드 리스트 로그
  // ────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    GooglePlacesSDK.initialize(GOOGLE_MAPS_API_KEY);
  }, []);

  // ────────────────────────────────────────────────────────────────────────────
  // ② departureDate~returnDate 사이 날짜 배열 생성
  // ────────────────────────────────────────────────────────────────────────────
  const { dateList, dateObjs } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dep = parseDate(departureDate);
    const ret = parseDate(returnDate);
    if (!dep || !ret) {
      return { dateList: [], dateObjs: [] };
    }

    const start = today > dep ? today : dep;
    const dateObjs = getDateRange(start, ret);
    const dateList = dateObjs.map(formatDate);
    return { dateList, dateObjs };
  }, [departureDate, returnDate]);

  // ────────────────────────────────────────────────────────────────────────────
  // ③ form 초기화 함수
  // ────────────────────────────────────────────────────────────────────────────
  const initializeForm = useCallback(() => {
    const obj = {};
    if (dateList.length > 0) {
      dateList.forEach(date => {
        obj[date] = initialData[date]
          ? initialData[date].map(item => ({
              place: item.place || '',
              details: item.details || null,
            }))
          : [{ place: '', details: null }];
      });
    }
    return obj;
  }, [dateList, initialData]);

  // ────────────────────────────────────────────────────────────────────────────
  // ④ 장소 검색: fetchPredictions({ query })
  // ────────────────────────────────────────────────────────────────────────────
  const searchPlace = async (query) => {
    try {
      const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(query)}&inputtype=textquery&fields=place_id,name,formatted_address,geometry&language=en&key=${GOOGLE_MAPS_API_KEY}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === 'OK') {
        return data.candidates;
      }

      return [];
    } catch (error) {
      return [];
    }
  };

  // ────────────────────────────────────────────────────────────────────────────
  // ⑤ Place ID → 세부 정보 조회: fetchPlaceByID(placeID, { fields })
  // ────────────────────────────────────────────────────────────────────────────
  const fetchPlaceDetails = async (placeId) => {
    try {
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&language=en&key=${GOOGLE_MAPS_API_KEY}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === 'OK') {
        return data.result;
      }


      return null;
    } catch (error) {
      return null;
    }
  };

  // ────────────────────────────────────────────────────────────────────────────
  // ⑥ 일정 추가/수정/삭제 핸들러
  // ────────────────────────────────────────────────────────────────────────────
  const addSchedule = useCallback(date => {
    setForm(prev => ({
      ...prev,
      [date]: [...prev[date], { place: '', details: null }],
    }));
  }, []);

  const updateSchedule = useCallback((date, idx, value) => {
    setForm(prev => {
      const arr = [...prev[date]];
      arr[idx] = { place: value, details: null };
      return { ...prev, [date]: arr };
    });
  }, []);

  const removeSchedule = useCallback((date, idx) => {
    setForm(prev => {
      const arr = [...prev[date]];
      arr.splice(idx, 1);
      return { ...prev, [date]: arr.length ? arr : [{ place: '', details: null }] };
    });
  }, []);

  // ────────────────────────────────────────────────────────────────────────────
  // ⑦ 저장 버튼 클릭 시 동작: "장소명 → fetchPredictions → placeID → fetchPlaceByID" 순서
  // ────────────────────────────────────────────────────────────────────────────
  const handleSave = useCallback(async () => {
    try {
      // Reset states at the start
      setUpdateSummary(null);
      setProcessedData(null);
      setConfirmationVisible(false);
      
      // 1) 유효성 검사
      const placesToFetch = [];
      const updates = { added: 0, modified: 0, unchanged: 0 };
      
      Object.entries(form).forEach(([dateStr, places]) => {
        places.forEach((placeItem, idx) => {
          if (placeItem.place.trim() && !placeItem.details) {
            placesToFetch.push({
              dateStr,
              idx,
              placeName: placeItem.place.trim(),
            });
            
            // Track if this is a new or modified place
            const initialPlaces = initialData[dateStr] || [];
            if (initialPlaces[idx]?.place !== placeItem.place) {
              updates.modified++;
            } else {
              updates.unchanged++;
            }
          }
        });
      });


      // 2) 검색이 필요한 장소가 있으면 확인
      if (placesToFetch.length > 0) {
        const userConfirmed = await new Promise(resolve => {
          Alert.alert(
            '장소 정보 가져오기',
            `${placesToFetch.length}개의 장소 정보를 가져오시겠습니까?`,
            [
              { text: '취소', onPress: () => resolve(false), style: 'cancel' },
              { text: '확인', onPress: () => resolve(true) },
            ],
            { cancelable: false }
          );
        });
        if (!userConfirmed) {
          return;
        }
      }

      // 3) 확인 모달에 보여줄 데이터 준비
      setLoading(true);
      const updatedForm = { ...form };
      
      // 4) 장소 검색 및 상세 정보 가져오기
      if (placesToFetch.length > 0) {
        await Promise.all(
          placesToFetch.map(async ({ dateStr, idx, placeName }) => {
            try {
              const searchResult = await searchPlace(placeName);
              if (!searchResult || searchResult.length === 0) return;

              const firstPlace = searchResult[0];
              const detailInfo = await fetchPlaceDetails(firstPlace.place_id);
              if (!detailInfo) return;

              updatedForm[dateStr][idx] = {
                place: detailInfo.name,
                details: {
                  name: detailInfo.name,
                  formatted_address: detailInfo.formatted_address,
                  geometry: detailInfo.geometry,
                  address_components: detailInfo.address_components,
                },
              };
            } catch (err) {
            }
          })
        );
      }

      // 5) API 호출용 데이터 형식으로 변환
      const formattedData = {};
      let totalNewPlaces = 0;
      let totalModifiedPlaces = 0;

      Object.entries(updatedForm).forEach(([dateStr, places]) => {
        const dateObj = parseDate(dateStr);
        if (!dateObj) return;
        const apiDate = formatDateForAPI(dateObj);

        const validPlaces = places
          .filter(p => p.place.trim() && p.details)
          .map(p => {
            const isNew = !initialData[dateStr]?.some(
              initial => initial.place === p.place
            );
            if (isNew) totalNewPlaces++;
            else totalModifiedPlaces++;

            return {
              spotDate: apiDate,
              spotTime: null, // null 고정
              spotName: p.place,
              spotDetail: p.details.formatted_address,
              latitude: p.details.geometry.location.lat,
              longitude: p.details.geometry.location.lng,
              city: p.details.address_components.find(c => c.types.includes('administrative_area_level_1'))?.long_name || 'Not Found',
              country: p.details.address_components.find(c => c.types.includes('country'))?.long_name || 'Not Found',
              isPlan: true,
            };
          });

        if (validPlaces.length > 0) {
          formattedData[apiDate] = validPlaces;
        }
      });

      // 6) 저장할 데이터가 있는지 확인
      const totalCount = Object.values(formattedData).reduce(
        (sum, arr) => sum + arr.length,
        0
      );

      if (totalCount === 0) {
        Alert.alert('알림', '저장할 유효한 장소가 없습니다.');
        return;
      }

      // Update summary before showing modal
      const summary = {
        totalPlaces: totalCount,
        newPlaces: totalNewPlaces,
        modifiedPlaces: totalModifiedPlaces,
        dates: Object.keys(formattedData).length
      };
      
      setUpdateSummary(summary);
      setProcessedData(formattedData);
      onRequestClose(); // 첫 번째 모달 닫기
      setConfirmationVisible(true);
    } catch (error) {
      Alert.alert('오류', '데이터 준비 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [form, initialData]);

  const handleConfirm = useCallback(async () => {
    setConfirmationVisible(false);
    if (processedData) {
      try {
        setLoading(true);
        // API 호출하여 데이터 저장
        await Promise.all(
          Object.values(processedData).flat().map(spot => 
            travelAPI.postTravelSpot(spot)
          )
        );
        
        // 최신 데이터 가져오기
        const latestData = await travelAPI.getLatestTravelSpot();
        
        // 성공 알림
        Alert.alert('성공', '일정이 성공적으로 저장되었습니다.');
        
        // 부모 컴포넌트에 최신 데이터 전달
        onSave(latestData.data);
      } catch (error) {
        Alert.alert('오류', '일정 저장 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }
  }, [processedData, onSave]);

  // ────────────────────────────────────────────────────────────────────────────
  // ⑧ visible이 바뀌면 form 초기화
  // ────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (visible) {      
      setForm(initializeForm());
    }
  }, [visible, initializeForm]);

  // ────────────────────────────────────────────────────────────────────────────
  // ⑨ dateList가 비어 있으면 에러 UI
  // ────────────────────────────────────────────────────────────────────────────
  if (dateList.length === 0) {
    return (
      <ModalCard
        visible={visible}
        title="일정 등록/수정"
        onRequestClose={onRequestClose}
        width={340}
        buttons={[<ModalButton key="cancel" title="취소" onPress={onRequestClose} />]}
      >
        <View style={{ padding: 16 }}>
          <Text style={{ color: '#EF4444' }}>날짜 형식이 올바르지 않습니다.</Text>
        </View>
      </ModalCard>
    );
  }

  // ────────────────────────────────────────────────────────────────────────────
  // ⑩ 실제 화면 렌더링
  // ────────────────────────────────────────────────────────────────────────────
  return (
    <>
      <ModalCard
        visible={visible}
        title="일정 등록/수정"
        onRequestClose={onRequestClose}
        width={340}
        buttons={[
          <ModalButton key="cancel" title="취소" onPress={onRequestClose} />,
          <ModalButton key="save" title="저장" onPress={handleSave} disabled={loading} />,
        ]}
      >
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={styles.loadingText}>처리 중...</Text>
          </View>
        )}
        <ScrollView style={{ maxHeight: 420, paddingHorizontal: 16 }}>
          {dateList.map(date => (
            <View key={date} style={{ marginBottom: 18 }}>
              <Text style={styles.dateLabel}>{date}</Text>
              {form[date]?.map((item, idx) => (
                <View key={idx} style={styles.row}>
                  <TextInput
                    style={[styles.input, item.details && styles.inputSuccess]}
                    placeholder="장소 검색"
                    value={item.place}
                    onChangeText={text => updateSchedule(date, idx, text)}
                  />
                  <ModalButton
                    title="삭제"
                    onPress={() => removeSchedule(date, idx)}
                    style={styles.Btn}
                    textStyle={{ color: '#2563EB' }}
                  />
                </View>
              ))}
              <ModalButton
                title="추가"
                onPress={() => addSchedule(date)}
                style={[styles.Btn, { marginTop: 4 }]}
                textStyle={{ color: '#2563EB' }}
              />
            </View>
          ))}
        </ScrollView>
      </ModalCard>

      <ModalCard
        visible={confirmationVisible}
        title="일정 확인"
        onRequestClose={() => setConfirmationVisible(false)}
        width={340}
        buttons={[
          <ModalButton 
            key="cancel" 
            title="취소" 
            onPress={() => setConfirmationVisible(false)} 
          />,
          <ModalButton 
            key="confirm" 
            title="저장" 
            onPress={handleConfirm}
            style={{ backgroundColor: '#2563EB' }}
            textStyle={{ color: '#FFFFFF' }}
          />,
        ]}
      >
        <ScrollView style={styles.confirmationContainer}>
          {updateSummary && (
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryTitle}>변경 사항</Text>
              <Text style={styles.summaryText}>• 총 {updateSummary.dates}일의 일정</Text>
              <Text style={styles.summaryText}>• 전체 {updateSummary.totalPlaces}개의 장소</Text>
              <Text style={styles.summaryText}>• 추가: {updateSummary.newPlaces}개</Text>
            </View>
          )}
          {processedData && Object.entries(processedData).map(([date, places]) => (
            <View key={date} style={styles.dateSection}>
              <Text style={styles.dateTitle}>
                {formatDate(new Date(date)) || date}
              </Text>
              {places.map((place, idx) => (
                <View key={idx} style={styles.placeItem}>
                  <Text style={styles.placeName}>{place.spotName || '이름 없음'}</Text>
                  <Text style={styles.placeDetail}>{place.spotDetail || '상세 정보 없음'}</Text>
                  <Text style={styles.locationInfo}>
                    {place.city || ''}{(place.city && place.country) ? ', ' : ''}{place.country || ''}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      </ModalCard>
    </>
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
  inputSuccess: {
    borderColor: '#10B981',
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
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 12,
    color: '#2563EB',
    fontSize: 14,
  },
  confirmationContainer: {
    padding: 16,
  },
  dateSection: {
    marginBottom: 24,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
  },
  dateTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 8,
  },
  placeItem: {
    marginBottom: 12,
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#2563EB',
  },
  placeName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  placeDetail: {
    fontSize: 13,
    color: '#4B5563',
    marginBottom: 2,
  },
  locationInfo: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  summaryContainer: {
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 13,
    color: '#4B5563',
    marginBottom: 4,
  },
});
