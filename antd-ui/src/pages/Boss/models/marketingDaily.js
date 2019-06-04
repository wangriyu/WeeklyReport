import { queryMarketingMonthly } from '@/services/monthly';

export default {
  namespace: 'marketingDaily',

  state: {
    list: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryMarketingMonthly, payload);
      console.log(payload, response);
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
