import {
  addWeeklySummary,
  addWeeklyPlan,
  queryWeeklyPlan,
  queryWeeklySummary,
} from '@/services/weekly';
import { notification } from 'antd';

export default {
  namespace: 'weekly',

  state: {
    weeklyPlan: {},
    weeklySummary: {},
  },

  effects: {
    *addWeeklySummary({ payload }, { call, select }) {
      const currentUser = yield select(state => state.user.currentUser);
      const response = yield call(addWeeklySummary, { ...payload, id: currentUser.id });
      console.log('[weekly addWeeklySummary]: ', payload, response);
      if (response.status === 'ok') {
        notification.success({
          message: '提交成功',
        });
      } else {
        notification.error({
          message: '提交失败',
          description: response.msg,
        });
      }
    },
    *addWeeklyPlan({ payload }, { call, select }) {
      const currentUser = yield select(state => state.user.currentUser);
      const response = yield call(addWeeklyPlan, { ...payload, id: currentUser.id });
      console.log('[weekly addWeeklyPlan]: ', payload, response);
      if (response.status === 'ok') {
        notification.success({
          message: '提交成功',
        });
      } else {
        notification.error({
          message: '提交失败',
          description: response.msg,
        });
      }
    },
    *fetchWeeklyPlan({ payload }, { call, put }) {
      const response = yield call(queryWeeklyPlan, payload);
      console.log('[weekly fetchWeeklyPlan]: ', payload, response);
      if (response.status === 'ok') {
        yield put({
          type: 'savePlan',
          payload: response.data,
        });
      } else {
        yield put({
          type: 'savePlan',
          payload: {},
        });
        if (response.msg !== '<QuerySeter> no row found') {
          notification.error({
            message: '获取周计划失败',
            description: response.msg,
          });
        }
      }
    },
    *fetchWeeklySummary({ payload }, { call, put }) {
      const response = yield call(queryWeeklySummary, payload);
      console.log('[weekly fetchWeeklySummary]: ', payload, response);
      if (response.status === 'ok') {
        yield put({
          type: 'saveSummary',
          payload: response.data,
        });
      } else {
        yield put({
          type: 'saveSummary',
          payload: {},
        });
        if (response.msg !== '<QuerySeter> no row found') {
          notification.error({
            message: '获取周总结失败',
            description: response.msg,
          });
        }
      }
    },
  },

  reducers: {
    savePlan(state, action) {
      return {
        ...state,
        weeklyPlan: action.payload || {},
      };
    },
    saveSummary(state, action) {
      return {
        ...state,
        weeklySummary: action.payload || {},
      };
    },
  },
};
