import { queryStaffList } from '@/services/staff';
import { queryWeeklyPlan, queryWeeklySummary } from '@/services/weekly';

export default {
  namespace: 'manageWeekly',

  state: {
    list: [],
    weeklyPlan: {},
    weeklySummary: {}
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryStaffList, payload);
      console.log('[manageWeekly fetch]: ', payload, response);
      if (response.status === 'ok') {
        yield put({
          type: 'save',
          payload: response.data,
        });
      }
    },
    *fetchWeeklyPlan({ payload }, { call, put }) {
      const response = yield call(queryWeeklyPlan, payload);
      console.log('[manageWeekly fetchWeeklyPlan]: ', payload, response);
      if (response.status === 'ok' && response.data) {
        yield put({
          type: 'savePlan',
          payload: response.data,
        });
      } else {
        yield put({
          type: 'savePlan',
          payload: {},
        });
      }
    },
    *fetchWeeklySummary({ payload }, { call, put }) {
      const response = yield call(queryWeeklySummary, payload);
      console.log('[manageWeekly fetchWeeklySummary]: ', payload, response);
      if (response.status === 'ok' && response.data) {
        yield put({
          type: 'saveSummary',
          payload: response.data,
        });
      } else {
        yield put({
          type: 'saveSummary',
          payload: {},
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
    savePlan(state, action) {
      return {
        ...state,
        weeklyPlan: action.payload,
      };
    },
    saveSummary(state, action) {
      return {
        ...state,
        weeklySummary: action.payload,
      };
    },
  }
}
