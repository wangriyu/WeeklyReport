import { queryStaffList } from '@/services/staff';
import { queryProductMonthly } from '@/services/monthly';

export default {
  namespace: 'productDaily',

  state: {
    list: [],
    modalList: []
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(queryStaffList, payload);
      console.log('[productDaily fetchList]: ', payload, response);
      if (response.status === 'ok') {
        yield put({
          type: 'saveList',
          payload: response.data,
        });
      }
    },

    *fetchModalList({ payload }, { call, put }) {
      const response = yield call(queryProductMonthly, payload);
      console.log('[productDaily fetchModalList]: ', payload, response);
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
