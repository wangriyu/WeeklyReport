import { queryStaffList } from '@/services/staff';
import { queryFinanceMonthly } from '@/services/monthly';

export default {
  namespace: 'financeDaily',

  state: {
    list: [],
    modalList: []
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(queryStaffList, payload);
      console.log('[financeDaily fetchList]: ', payload, response);
      if (response.status === 'ok') {
        yield put({
          type: 'saveList',
          payload: response.data,
        });
      }
    },

    *fetchModalList({ payload }, { call, put }) {
      const response = yield call(queryFinanceMonthly, payload);
      console.log('[financeDaily fetchModalList]: ', payload, response);
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
