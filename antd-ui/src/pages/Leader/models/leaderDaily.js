import {
  marketingDaily,
  techSupportDaily,
  afterSaleDaily,
  developDaily,
  productDaily,
  officeDaily,
  financeDaily,
}                       from '@/services/daily';
import { notification } from 'antd';

export default {
  namespace: 'leaderDaily',

  state: {
    list: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      console.log('audit fetch: ', payload);
      const response = yield call(queryAuditList, payload);
      if (response.status === 'ok') {
        yield put({
          type: 'save',
          payload: response,
        });
      }
    },
    *addMarketingDaily({ payload }, { call, put, select }) {
      const currentUser = yield select((state)=> state.user.currentUser);
      payload.id = currentUser.id;
      const response = yield call(marketingDaily, payload);
      console.log('[addMarketingDaily]: ', payload, response);
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
    *addTechSupportDaily({ payload }, { call, put, select }) {
      const currentUser = yield select((state)=> state.user.currentUser);
      payload.id = currentUser.id;
      const response = yield call(techSupportDaily, payload);
      console.log('[addTechSupportDaily]: ', payload, response);
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
    *addAfterSaleDaily({ payload }, { call, put, select }) {
      const currentUser = yield select((state)=> state.user.currentUser);
      payload.id = currentUser.id;
      const response = yield call(afterSaleDaily, payload);
      console.log('[addAfterSaleDaily]: ', payload, response);
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
    *addDevelopDaily({ payload }, { call, put, select }) {
      const currentUser = yield select((state)=> state.user.currentUser);
      payload.id = currentUser.id;
      const response = yield call(developDaily, payload);
      console.log('[addDevelopDaily]: ', payload, response);
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
    *addProductDaily({ payload }, { call, put, select }) {
      const currentUser = yield select((state)=> state.user.currentUser);
      payload.id = currentUser.id;
      const response = yield call(productDaily, payload);
      console.log('[addProductDaily]: ', payload, response);
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
    *addOfficeDaily({ payload }, { call, put, select }) {
      const currentUser = yield select((state)=> state.user.currentUser);
      payload.id = currentUser.id;
      const response = yield call(officeDaily, payload);
      console.log('[addOfficeDaily]: ', payload, response);
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
    *addFinanceDaily({ payload }, { call, put, select }) {
      const currentUser = yield select((state)=> state.user.currentUser);
      payload.id = currentUser.id;
      const response = yield call(financeDaily, payload);
      console.log('[addFinanceDaily]: ', payload, response);
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
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
  }
}
