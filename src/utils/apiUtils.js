// API 응답 상태 코드
export const API_STATUS = {
  SUCCESS: 'success',
  FAIL: 'fail',
  ERROR: 'error'
};

// API 응답 타입
export const API_CODE = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500
};

// API 응답 처리 함수
export function handleApiResponse(response) {
  if (response.data?.status === API_STATUS.SUCCESS) {
    return response.data;
  } else {
    throw new APIError(
      response.data?.message || '요청 처리 중 오류가 발생했습니다.',
      response.data?.code || API_CODE.INTERNAL_ERROR,
      response.data?.status || API_STATUS.FAIL
    );
  }
}

// API 에러 처리 함수
export function handleApiError(error) {
  const apiError = APIError.fromAxiosError(error);
  return apiError;
}


// API 에러 클래스
export class APIError extends Error {
  constructor(message, code, status) {
    super(message);
    this.name = 'APIError';
    this.code = code;
    this.status = status;
  }

  static fromAxiosError(error) {
    // API 응답이 있는 경우 
    if (error.response) {
      const { status, message, code } = error.response.data;
      return new APIError(
        message || '서버 에러가 발생했습니다.',
        code || error.response.status,
        status || API_STATUS.ERROR
      );
    }

    // 요청은 보냈지만 응답을 받지 못한 경우 
    if (error.request) {
      return new APIError(
        '네트워크 연결 오류가 발생했습니다.',
        API_CODE.INTERNAL_ERROR,
        API_STATUS.ERROR
      );
    }

    // 요청 자체를 보내지 못한 경우
    return new APIError(
      '알 수 없는 오류가 발생했습니다.',
      API_CODE.INTERNAL_ERROR,
      API_STATUS.ERROR
    );
  }
}