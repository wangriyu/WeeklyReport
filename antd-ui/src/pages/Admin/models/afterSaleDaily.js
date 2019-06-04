import { queryStaffList } from '@/services/staff';
import { queryAfterSaleMonthly } from '@/services/monthly';

export default {
  namespace: 'afterSaleDaily',

  state: {
    list: [],
    modalList: []
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(queryStaffList, payload);
      console.log('[afterSaleDaily fetchList]: ', payload, response);
      if (response.status === 'ok') {
        yield put({
          type: 'saveList',
          payload: response.data,
        });
      }
    },

    *fetchModalList({ payload }, { call, put }) {
      const response = yield call(queryAfterSaleMonthly, payload);
      console.log('[afterSaleDaily fetchModalList]: ', payload, response);
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
