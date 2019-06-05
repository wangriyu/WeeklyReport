import { decryptAES } from '../utils/utils';
import { routerRedux } from 'dva/router';
import { reloadAuthorized } from '@/utils/Authorized';
import { setAuthority } from '@/utils/authority';
import { query as queryUsers, queryCurrent, changeInfo, changePass } from '@/services/user';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {
      id: 0,
      name: 'default',
      nickname: 'default',
      mail: 'default@qq.com',
      mobile: '18812345678',
      joinDate: '2019-05-16',
      department: 'default',
      role: 'guest',
      avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    },
  },

  subscriptions: {
    setup({ dispatch }) {
      dispatch({
        type: 'fetchCurrent',
      });
    },
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const data = localStorage.getItem('authority');
      let payload;
      if (data) {
        payload = JSON.parse(decryptAES(data));
      }
      if (payload && payload.id) {
        const response = yield call(queryCurrent, payload.id);
        console.log('[queryCurrent]: ', payload, response);
        if (response.status === 'ok') {
          setAuthority(response.data);
          yield put({
            type: 'saveCurrentUser',
            payload: response.data,
          });
          reloadAuthorized();
          return;
        }
      }
      routerRedux.push('/user/login');
    },
    *changeInfo({ payload }, { call, put, select }) {
      const currentUser = yield select(state => state.user.currentUser);
      const response = yield call(changeInfo, { id: currentUser.id, ...payload });
      console.log('[changeInfo]: ', currentUser.id, payload, response);
      if (response.status === 'ok') {
        yield put({
          type: 'login/logout',
        });
      }
    },
    *changePass({ payload }, { call, put, select }) {
      const currentUser = yield select(state => state.user.currentUser);
      const response = yield call(changePass, { id: currentUser.id, ...payload });
      console.log('[changePass]: ', currentUser.id, response);
      if (response.status === 'ok') {
        yield put({
          type: 'login/logout',
        });
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
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
