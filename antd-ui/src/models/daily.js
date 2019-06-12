import {
  marketingDaily,
  techSupportDaily,
  afterSaleDaily,
  developDaily,
  productDaily,
  officeDaily,
  financeDaily,
} from '@/services/daily';
import { notification } from 'antd';

export default {
  namespace: 'daily',

  state: {},

  effects: {
    *addMarketingDaily({ payload }, { call, select }) {
      const currentUser = yield select(state => state.user.currentUser);
      const response = yield call(marketingDaily, { ...payload, id: currentUser.id });
      console.log('[addMarketingDaily]: ', payload, response);
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
    *addTechSupportDaily({ payload }, { call, select }) {
      const currentUser = yield select(state => state.user.currentUser);
      const response = yield call(techSupportDaily, { ...payload, id: currentUser.id });
      console.log('[addTechSupportDaily]: ', payload, response);
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
    *addAfterSaleDaily({ payload }, { call, select }) {
      const currentUser = yield select(state => state.user.currentUser);
      const response = yield call(afterSaleDaily, { ...payload, id: currentUser.id });
      console.log('[addAfterSaleDaily]: ', payload, response);
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
    *addDevelopDaily({ payload }, { call, select }) {
      const currentUser = yield select(state => state.user.currentUser);
      const response = yield call(developDaily, { ...payload, id: currentUser.id });
      console.log('[addDevelopDaily]: ', payload, response);
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
    *addProductDaily({ payload }, { call, select }) {
      const currentUser = yield select(state => state.user.currentUser);
      const response = yield call(productDaily, { ...payload, id: currentUser.id });
      console.log('[addProductDaily]: ', payload, response);
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
    *addOfficeDaily({ payload }, { call, select }) {
      const currentUser = yield select(state => state.user.currentUser);
      const response = yield call(officeDaily, { ...payload, id: currentUser.id });
      console.log('[addOfficeDaily]: ', payload, response);
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
    *addFinanceDaily({ payload }, { call, select }) {
      const currentUser = yield select(state => state.user.currentUser);
      const response = yield call(financeDaily, { ...payload, id: currentUser.id });
      console.log('[addFinanceDaily]: ', payload, response);
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
  },

  reducers: {},
};
