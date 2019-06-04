import { queryAuditList, requestSetRole } from '@/services/audit';

export default {
  namespace: 'audit',

  state: {
    list: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryAuditList, payload);
      console.log('audit fetch: ', payload, response);
      if (response.status === 'ok') {
        yield put({
          type: 'save',
          payload: response.data
        });
      }
    },
    *setRole({ payload }, { call, put }) {
      const response = yield call(requestSetRole, payload);
      console.log('[setRole]: ', payload, response);
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
