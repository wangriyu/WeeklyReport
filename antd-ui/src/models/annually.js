import {
  queryAnnuallyList,
  queryAnnuallyItem,
  updateAnnuallyPlan,
  createAnnuallyPlan,
  createAnnuallyItem,
  updateAnnuallyItem,
  deleteAnnuallyItem,
} from '@/services/annually';
import { notification } from 'antd';

export default {
  namespace: 'annually',

  state: {
    planList: [],
    workList: [],
  },

  effects: {
    *fetchPlanList({ _ }, { call, put }) {
      const response = yield call(queryAnnuallyList);
      console.log('annually fetchPlanList: ', response);
      if (response.status === 'ok') {
        yield put({
          type: 'savePlanList',
          payload: response.data,
        });
      } else {
        notification.error({
          message: '获取计划列表失败',
          description: response.msg,
        });
      }
    },
    *updatePlan({ payload }, { call, put }) {
      const response = yield call(updateAnnuallyPlan, payload);
      console.log('annually updatePlan: ', payload, response);
      if (response.status === 'ok') {
        yield put({
          type: 'fetchPlanList',
        });
      } else {
        notification.error({
          message: '更新计划失败',
          description: response.msg,
        });
      }
    },
    *createPlan({ payload }, { call, put }) {
      const response = yield call(createAnnuallyPlan, payload);
      console.log('annually createPlan: ', response);
      if (response.status === 'ok') {
        yield put({
          type: 'fetchPlanList',
        });
      } else {
        notification.error({
          message: '创建计划失败',
          description: response.msg,
        });
      }
    },
    *createItem({ payload }, { call, put }) {
      const response = yield call(createAnnuallyItem, payload.params);
      console.log('annually createItem: ', payload, response);
      if (response.status === 'ok') {
        if (payload.expand) {
          yield put({
            type: 'fetchWorkList',
            payload: {
              id: payload.params.pid,
            },
          });
        }
      } else {
        notification.error({
          message: '创建项目失败',
          description: response.msg,
        });
      }
    },
    *updateItem({ payload }, { call, put }) {
      const response = yield call(updateAnnuallyItem, payload.params);
      console.log('annually updateItem: ', payload, response);
      if (response.status === 'ok') {
        yield put({
          type: 'fetchWorkList',
          payload: {
            id: payload.pid,
          },
        });
      } else {
        notification.error({
          message: '更新项目失败',
          description: response.msg,
        });
      }
    },
    *fetchWorkList({ payload }, { call, put }) {
      const response = yield call(queryAnnuallyItem, payload);
      console.log('annually fetchWorkList: ', payload, response);
      if (response.status === 'ok') {
        yield put({
          type: 'saveWorkList',
          payload: response.data,
        });
      } else {
        notification.error({
          message: '获取项目列表失败',
          description: response.msg,
        });
      }
    },
    *deleteItem({ payload }, { call, put }) {
      const response = yield call(deleteAnnuallyItem, payload);
      console.log('annually deleteItem: ', payload, response);
      if (response.status === 'ok') {
        yield put({
          type: 'fetchWorkList',
          payload: {
            id: payload.pid,
          },
        });
      } else {
        notification.error({
          message: '删除项目失败',
          description: response.msg,
        });
      }
    },
  },

  reducers: {
    savePlanList(state, action) {
      return {
        ...state,
        planList: action.payload || [],
      };
    },
    saveWorkList(state, action) {
      return {
        ...state,
        workList: action.payload || [],
      };
    },
  },
};
