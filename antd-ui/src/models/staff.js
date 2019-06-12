import {
  queryStaffList,
  requestDeleteStaff,
  requestCreateStaff,
  requestUpdateStaff,
  queryAuditList,
  requestSetRole,
} from '@/services/staff';
import { notification } from 'antd';

export default {
  namespace: 'staff',

  state: {
    list: [],
  },

  effects: {
    *fetchStaffList({ payload }, { call, put }) {
      const response = yield call(queryStaffList, payload);
      console.log('[staff fetchStaffList]: ', payload, response);
      if (response.status === 'ok') {
        yield put({
          type: 'saveList',
          payload: response.data,
        });
      } else {
        notification.error({
          message: '获取员工列表失败',
          description: response.msg,
        });
      }
    },
    *fetchAuditList({ payload }, { call, put }) {
      const response = yield call(queryAuditList, payload);
      console.log('audit fetchAuditList: ', payload, response);
      if (response.status === 'ok') {
        yield put({
          type: 'saveList',
          payload: response.data,
        });
      } else {
        notification.error({
          message: '获取注册列表失败',
          description: response.msg,
        });
      }
    },
    *setRole({ payload }, { call, put }) {
      const response = yield call(requestSetRole, payload);
      console.log('[staff setRole]: ', payload, response);
      if (response.status === 'ok') {
        yield put({
          type: 'fetchAuditList',
        });
      } else {
        notification.error({
          message: '设置角色失败',
          description: response.msg,
        });
      }
    },
    *createStaff({ payload }, { call, put }) {
      const response = yield call(requestCreateStaff, payload);
      console.log('[staff create]: ', payload, response);
      if (response.status === 'ok') {
        yield put({
          type: 'fetchStaffList',
        });
      } else {
        notification.error({
          message: '创建员工失败',
          description: response.msg,
        });
      }
    },
    *updateStaff({ payload }, { call, put }) {
      const response = yield call(requestUpdateStaff, payload);
      console.log('[staff update]: ', payload, response);
      if (response.status === 'ok') {
        yield put({
          type: 'fetchStaffList',
        });
      } else {
        notification.error({
          message: '更新员工信息失败',
          description: response.msg,
        });
      }
    },
    *deleteStaff({ payload }, { call, put }) {
      const response = yield call(requestDeleteStaff, payload);
      console.log('[staff delete]: ', payload, response);
      if (response.status === 'ok') {
        yield put({
          type: 'fetchStaffList',
        });
      } else {
        notification.error({
          message: '删除员工失败',
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
