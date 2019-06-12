import { register } from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';
import { notification } from 'antd';

export default {
  namespace: 'register',

  state: {
    status: undefined,
  },

  effects: {
    *submit({ payload }, { call, put }) {
      const response = yield call(register, payload);
      console.log('register submit', payload, response);
      if (response.status === 'ok') {
        yield put({
          type: 'registerHandle',
          payload: {
            data: payload,
            res: response,
          },
        });
      } else {
        notification.error({
          message: '注册失败',
          description: response.msg,
        });
      }
    },
  },

  reducers: {
    registerHandle(state, { payload }) {
      const { data, res } = payload;
      data.id = res.data;
      data.role = 'guest';
      delete data.password;
      delete data.confirm;

      setAuthority(data);
      reloadAuthorized();

      return {
        ...state,
        status: res.status,
      };
    },
    updateStatus(state, { payload }) {
      return {
        ...state,
        status: payload,
      };
    },
  },
};
