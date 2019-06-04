import {
  addWeeklySummary,
  addWeeklyPlan,
  queryWeeklyPlan,
  queryWeeklySummary,
}                         from '@/services/weekly';
import { queryStaffList } from '@/services/staff';
import { notification }   from 'antd';

export default {
  namespace: 'leaderWeekly',

  state: {
    list: [],
    weeklyPlan: {},
    weeklySummary: {},
  },

  effects: {
    *fetch({ payload }, { call, put, select }) {
      const currentUser = yield select((state)=> state.user.currentUser);
      payload.department = currentUser.department;
      const response = yield call(queryStaffList, payload);
      console.log('[leaderWeekly fetch]: ', payload, response);
      if (response.status === 'ok') {
        yield put({
          type: 'save',
          payload: response.data,
        });
      }
    },
    *addWeeklySummary({ payload }, { call, put, select }) {
      const currentUser = yield select((state)=> state.user.currentUser);
      payload.id = currentUser.id;
      const response = yield call(addWeeklySummary, payload);
      console.log('[leaderWeekly addWeeklySummary]: ', payload, response);
      if (response.status === 'ok') {
        notification.success({
          message: '提交成功'
        })
      } else {
        notification.error({
          message: '提交失败',
          description: response.msg
        })
      }
    },
    *addWeeklyPlan({ payload }, { call, put, select }) {
      const currentUser = yield select((state)=> state.user.currentUser);
      payload.id = currentUser.id;
      const response = yield call(addWeeklyPlan, payload);
      console.log('[leaderWeekly addWeeklyPlan]: ', payload, response);
      if (response.status === 'ok') {
        notification.success({
          message: '提交成功'
        })
      } else {
        notification.error({
          message: '提交失败',
          description: response.msg
        })
      }
    },
    *fetchWeeklyPlan({ payload }, { call, put }) {
      const response = yield call(queryWeeklyPlan, payload);
      console.log('[leaderWeekly fetchWeeklyPlan]: ', payload, response);
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
      console.log('[leaderWeekly fetchWeeklySummary]: ', payload, response);
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
