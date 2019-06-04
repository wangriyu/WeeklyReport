import { queryStaffList } from '@/services/staff';
import {
  queryMarketingMonthlyByID,
  queryTechSupportMonthly,
  queryAfterSaleMonthly,
  queryDevelopMonthly,
  queryProductMonthly,
  queryOfficeMonthly,
  queryFinanceMonthly,
} from '@/services/monthly';

export default {
  namespace: 'leaderMonthly',

  state: {
    list: [],
    modalList: []
  },

  effects: {
    *fetch({ payload }, { call, put, select }) {
      const currentUser = yield select((state)=> state.user.currentUser);
      payload.department = currentUser.department;
      const response = yield call(queryStaffList, payload);
      console.log('[leaderMonthly fetch]: ', payload, response);
      if (response.status === 'ok') {
        yield put({
          type: 'saveList',
          payload: response.data,
        });
      }
    },
    *fetchModalList({ payload }, { call, put, select }) {
      const currentUser = yield select((state)=> state.user.currentUser);
      let response = {};
      switch (currentUser.department) {
        case 'marketing':
          response = yield call(queryMarketingMonthlyByID, payload);
          break;
        case 'techSupport':
          response = yield call(queryTechSupportMonthly, payload);
          break;
        case 'afterSale':
          response = yield call(queryAfterSaleMonthly, payload);
          break;
        case 'develop':
          response = yield call(queryDevelopMonthly, payload);
          break;
        case 'product':
          response = yield call(queryProductMonthly, payload);
          break;
        case 'office':
          response = yield call(queryOfficeMonthly, payload);
          break;
        case 'finance':
          response = yield call(queryFinanceMonthly, payload);
          break;
      }
      console.log('[leaderMonthly fetchModalList]: ', currentUser.department, payload, response);
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
