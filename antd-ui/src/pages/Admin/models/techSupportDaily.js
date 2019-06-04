import { queryTechSupportMonthly } from '@/services/monthly';
import { queryStaffList } from '@/services/staff';

export default {
  namespace: 'techSupportDaily',

  state: {
    list: [],
    modalList: []
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(queryStaffList, payload);
      console.log('[techSupportDaily fetchList]: ', payload, response);
      if (response.status === 'ok') {
        yield put({
          type: 'saveList',
          payload: response.data,
        });
      }
    },

    *fetchModalList({ payload }, { call, put }) {
      const response = yield call(queryTechSupportMonthly, { start: payload.start, end: payload.end, id: payload.id });
      console.log('[techSupportDaily fetchModalList]: ', payload, response);
      if (response.status === 'ok') {
        yield put({
          type: 'saveModalList',
          payload: response.data,
        });
      }
    },
  },

  reducers: {
    saveList(state, action) {
      return {
        ...state,
        list: action.payload || [],
      };
    },
    saveModalList(state, action) {
      return {
        ...state,
        modalList: action.payload || []
      }
    }
  }
}
