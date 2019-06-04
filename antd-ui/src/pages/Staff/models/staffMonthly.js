import {
  queryMarketingMonthlyByID,
  queryTechSupportMonthly,
  queryAfterSaleMonthly,
  queryOfficeMonthly,
  queryDevelopMonthly,
  queryProductMonthly,
  queryFinanceMonthly,
} from '@/services/monthly';

export default {
  namespace: 'staffMonthly',

  state: {
    list: [],
  },

  effects: {
    *fetchList({ payload }, { call, put, select }) {
      const currentUser = yield select((state)=> state.user.currentUser);
      payload.id = currentUser.id;
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
      console.log('staffMonthly fetchList: ', currentUser.department, payload, response);
      if (response.status === 'ok') {
        yield put({
          type: 'save',
          payload: response.data,
        });
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
