import { queryStaffList, requestDeleteStaff, requestCreateStaff, requestUpdateStaff } from '@/services/staff';

export default {
  namespace: 'mStaff',

  state: {
    list: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryStaffList, payload);
      console.log('[mStaff fetch]: ', payload, response);
      if (response.status === 'ok') {
        yield put({
          type: 'save',
          payload: response.data,
        });
      }
    },
    *createStaff({ payload }, { call, put }) {
      const response = yield call(requestCreateStaff, payload);
      console.log('[mStaff create]: ', payload, response);
      if (response.status === 'ok') {
        yield put({
          type: 'fetch',
        })
      }
    },
    *updateStaff({ payload }, { call, put }) {
      const response = yield call(requestUpdateStaff, payload);
      console.log('[mStaff update]: ', payload, response);
      if (response.status === 'ok') {
        yield put({
          type: 'fetch',
        })
      }
    },
    *delete({ payload }, { call, put }) {
      const response = yield call(requestDeleteStaff, payload);
      console.log('[mStaff delete]: ', payload, response);
      if (response.status === 'ok') {
        yield put({
          type: 'fetch',
        })
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload || [],
      };
    },
  }
}
