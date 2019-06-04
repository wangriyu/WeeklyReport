import {
  queryAnnuallyList,
  queryAnnuallyItem,
  updateAnnuallyPlan,
  createAnnuallyPlan,
  createAnnuallyItem,
  updateAnnuallyItem,
  deleteAnnuallyItem,
} from '@/services/annually';

export default {
  namespace: 'manageAnnually',

  state: {
    planList: [],
    workList: []
  },

  effects: {
    *fetchPlan({ _ }, { call, put }) {
      const response = yield call(queryAnnuallyList);
      console.log('manageAnnually fetchPlan: ', response);
      if (response.status === 'ok') {
        yield put({
          type: 'savePlan',
          payload: response.data,
        });
      }
    },
    *updatePlan({ payload }, { call, put }) {
      const response = yield call(updateAnnuallyPlan, payload);
      console.log('manageAnnually updatePlan: ', payload, response);
      if (response.status === 'ok') {
        yield put({
          type: 'fetchPlan',
        });
      }
    },
    *createPlan({ payload }, { call, put }) {
      const response = yield call(createAnnuallyPlan, payload);
      console.log('manageAnnually createPlan: ', response);
      if (response.status === 'ok') {
        yield put({
          type: 'fetchPlan',
        });
      }
    },
    *createItem({ payload }, { call, put }) {
      const response = yield call(createAnnuallyItem, payload.params);
      console.log('manageAnnually createItem: ', payload, response);
      if (response.status === 'ok' && payload.expand) {
        yield put({
          type: 'fetchItem',
          payload: {
            id: payload.params.pid
          }
        });
      }
    },
    *updateItem({ payload }, { call, put }) {
      const response = yield call(updateAnnuallyItem, payload.params);
      console.log('manageAnnually updateItem: ', payload, response);
      if (response.status === 'ok') {
        yield put({
          type: 'fetchItem',
          payload: {
            id: payload.pid
          }
        });
      }
    },
    *fetchItem({ payload }, { call, put }) {
      const response = yield call(queryAnnuallyItem, payload);
      console.log('manageAnnually fetchItem: ', payload, response);
      if (response.status === 'ok') {
        yield put({
          type: 'saveItem',
          payload: response.data,
        });
      }
    },
    *deleteItem({ payload }, { call, put }) {
      const response = yield call(deleteAnnuallyItem, payload);
      console.log('manageAnnually deleteItem: ', payload, response);
      if (response.status === 'ok') {
        yield put({
          type: 'fetchItem',
          payload: {
            id: payload.pid
          },
        });
      }
    },
  },

  reducers: {
    savePlan(state, action) {
      return {
        ...state,
        planList: action.payload || [],
      };
    },
    saveItem(state, action) {
      return {
        ...state,
        workList: action.payload || [],
      };
    },
  }
}
