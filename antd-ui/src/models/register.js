import { register } from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'register',

  state: {
    status: undefined,
  },

  subscriptions: {
    setup ({ dispatch }) {
    }
  },

  effects: {
    *submit({ payload }, { call, put }) {
      console.log("register req", payload)
      const response = yield call(register, payload);
      console.log("register res", response);
      if (response.status === 'ok') {
        yield put({
          type: 'registerHandle',
          payload: {
            data: payload,
            res: response
          },
        });
      }
    },
  },

  reducers: {
    registerHandle(state, { payload }) {
      let data = payload.data;
      data.id = payload.res.data;
      data.role = 'guest';
      delete data.password;
      delete data.confirm;

      setAuthority(data);
      reloadAuthorized();

      return {
        ...state,
        status: payload.res.status,
      };
    },
    updateStatus(state, { payload }) {
      return {
        ...state,
        status: payload
      }
    }
  },
};
