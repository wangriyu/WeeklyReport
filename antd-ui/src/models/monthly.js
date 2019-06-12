import {
  queryAfterSaleMonthly,
  queryDevelopMonthly,
  queryFinanceMonthly,
  queryMarketingMonthly,
  queryMarketingMonthlyByID,
  queryOfficeMonthly,
  queryProductMonthly,
  queryTechSupportMonthly,
} from '@/services/monthly';
import { notification } from 'antd';

export default {
  namespace: 'monthly',

  state: {
    list: [],
  },

  effects: {
    *fetchAfterSaleMonthly({ payload }, { call, put }) {
      const response = yield call(queryAfterSaleMonthly, payload);
      console.log('[fetchAfterSaleMonthly]: ', payload, response);
      if (response.status === 'ok') {
        yield put({
          type: 'saveList',
          payload: response.data,
        });
      } else {
        notification.error({
          message: '获取失败',
          description: response.msg,
        });
      }
    },
    *fetchDevelopMonthly({ payload }, { call, put }) {
      const response = yield call(queryDevelopMonthly, payload);
      console.log('[fetchDevelopMonthly]: ', payload, response);
      if (response.status === 'ok') {
        yield put({
          type: 'saveList',
          payload: response.data,
        });
      } else {
        notification.error({
          message: '获取失败',
          description: response.msg,
        });
      }
    },
    *fetchFinanceMonthly({ payload }, { call, put }) {
      const response = yield call(queryFinanceMonthly, payload);
      console.log('[fetchFinanceMonthly]: ', payload, response);
      if (response.status === 'ok') {
        yield put({
          type: 'saveList',
          payload: response.data,
        });
      } else {
        notification.error({
          message: '获取失败',
          description: response.msg,
        });
      }
    },
    *fetchMarketingMonthly({ payload }, { call, put }) {
      const response = yield call(queryMarketingMonthly, payload);
      console.log('[fetchMarketingMonthly]: ', payload, response);
      if (response.status === 'ok') {
        yield put({
          type: 'saveList',
          payload: response.data,
        });
      } else {
        notification.error({
          message: '获取失败',
          description: response.msg,
        });
      }
    },
    *fetchMarketingMonthlyByID({ payload }, { call, put }) {
      const response = yield call(queryMarketingMonthlyByID, payload);
      console.log('[fetchMarketingMonthlyByID]: ', payload, response);
      if (response.status === 'ok') {
        yield put({
          type: 'saveList',
          payload: response.data,
        });
      } else {
        notification.error({
          message: '获取失败',
          description: response.msg,
        });
      }
    },
    *fetchOfficeMonthly({ payload }, { call, put }) {
      const response = yield call(queryOfficeMonthly, payload);
      console.log('[fetchOfficeMonthly]: ', payload, response);
      if (response.status === 'ok') {
        yield put({
          type: 'saveList',
          payload: response.data,
        });
      } else {
        notification.error({
          message: '获取失败',
          description: response.msg,
        });
      }
    },
    *fetchProductMonthly({ payload }, { call, put }) {
      const response = yield call(queryProductMonthly, payload);
      console.log('[fetchProductMonthly]: ', payload, response);
      if (response.status === 'ok') {
        yield put({
          type: 'saveList',
          payload: response.data,
        });
      } else {
        notification.error({
          message: '获取失败',
          description: response.msg,
        });
      }
    },
    *fetchTechSupportMonthly({ payload }, { call, put }) {
      const response = yield call(queryTechSupportMonthly, payload);
      console.log('[fetchTechSupportMonthly]: ', payload, response);
      if (response.status === 'ok') {
        yield put({
          type: 'saveList',
          payload: response.data,
        });
      } else {
        notification.error({
          message: '获取失败',
          description: response.msg,
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
  },
};
