/* eslint no-underscore-dangle: 0 */
import callApi from '../utils/call-api';
import { redirect } from './services';
import * as types from '../constants/chats';

export function fetchAllChats() {
  return (dispatch, getState) => {
    const {
      services: { isFetching },
      auth: { token },
    } = getState();

    if (isFetching.allChats) {
      return Promise.resolve();
    }

    dispatch({
      type: types.FETCH_ALL_CHATS_REQUEST,
    });

    return callApi('/chats', token)
      .then(json => dispatch({
        type: types.FETCH_ALL_CHATS_SUCCESS,
        payload: json,
      }))
      .catch(reason => dispatch({
        type: types.FETCH_ALL_CHATS_FAILURE,
        payload: reason,
      }));
  };
}

export function fetchMyChats() {
  return (dispatch, getState) => {
    const {
      services: { isFetching },
      auth: { token },
    } = getState();

    if (isFetching.myChats) {
      return Promise.resolve();
    }

    dispatch({
      type: types.FETCH_MY_CHATS_REQUEST,
    });

    return callApi('/chats/my', token)
      .then(json => dispatch({
        type: types.FETCH_MY_CHATS_SUCCESS,
        payload: json,
      }))
      .catch(reason => dispatch({
        type: types.FETCH_MY_CHATS_FAILURE,
        payload: reason,
      }));
  };
}

export function fetchChat(chatId) {
  return (dispatch, getState) => {
    const {
      auth: { token },
    } = getState();

    const abortController = new AbortController();

    dispatch({
      type: types.FETCH_CHAT_REQUEST,
      payload: { chatId },
    });

    const { signal } = abortController;

    callApi(`/chats/${chatId}`, token, { signal })
      .then((data) => {
        dispatch({
          type: types.FETCH_CHAT_SUCCESS,
          payload: data,
        });

        return data;
      })
      .catch((reason) => {
        dispatch({
          type: types.FETCH_CHAT_FAILURE,
          payload: reason,
        });
        return reason;
      });

    return Promise.resolve(abortController);
  };
}

export function setActiveChat(chatId) {
  return (dispatch) => {
    if (!chatId) {
      dispatch(redirect('/chat'));

      return dispatch({
        type: types.UNSET_ACTIVE_CHAT,
        payload: chatId,
      });
    }

    return dispatch({
      type: types.SET_ACTIVE_CHAT,
      payload: chatId,
    });
  };
}

export function createChat(newChat) {
  return (dispatch, getState) => {
    const {
      services: { isFetching },
      auth: { token },
    } = getState();

    if (isFetching.createChat) {
      return Promise.resolve();
    }

    dispatch({
      type: types.CREATE_CHAT_REQUEST,
      payload: newChat,
    });

    return callApi('/chats', token, { method: 'POST' }, { data: { title: newChat } })
      .then((data) => {
        dispatch({
          type: types.CREATE_CHAT_SUCCESS,
          payload: data,
        });

        dispatch({
          type: types.SET_ACTIVE_CHAT,
          payload: data,
        });
        dispatch(redirect(`/chat/${data.chat._id}`));

        return data;
      })
      .catch(reason => dispatch({
        type: types.CREATE_CHAT_FAILURE,
        payload: reason,
      }));
  };
}

export function joinChat(chatId) {
  return (dispatch, getState) => {
    const {
      services: { isFetching },
      auth: { token },
    } = getState();

    if (isFetching.joinChat) {
      return Promise.resolve();
    }

    dispatch({
      type: types.JOIN_CHAT_REQUEST,
      payload: chatId,
    });

    return callApi(`/chats/${chatId}/join`, token)
      .then((data) => {
        dispatch({
          type: types.JOIN_CHAT_SUCCESS,
          payload: data,
        });

        return data;
      })
      .catch(reason => dispatch({
        type: types.JOIN_CHAT_FAILURE,
        payload: reason,
      }));
  };
}

export function leaveChat(chatId) {
  return (dispatch, getState) => {
    const {
      services: { isFetching },
      auth: { token },
    } = getState();

    if (isFetching.leaveChat) {
      return Promise.resolve();
    }

    dispatch({
      type: types.LEAVE_CHAT_REQUEST,
      payload: chatId,
    });

    return callApi(`/chats/${chatId}/leave`, token)
      .then((data) => {
        dispatch({
          type: types.LEAVE_CHAT_SUCCESS,
          payload: data,
        });

        return dispatch(redirect('/chat'));
      })
      .catch(reason => dispatch({
        type: types.LEAVE_CHAT_FAILURE,
        payload: reason,
      }));
  };
}

export function deleteChat(chatId) {
  return (dispatch, getState) => {
    const {
      services: { isFetching },
      auth: { token },
    } = getState();

    if (isFetching.deleteChat) {
      return Promise.resolve();
    }

    dispatch({
      type: types.DELETE_CHAT_REQUEST,
      payload: chatId,
    });

    return callApi(`/chats/${chatId}`, token, { method: 'DELETE' })
      .then((data) => {
        dispatch({
          type: types.DELETE_CHAT_SUCCESS,
          payload: data,
        });

        dispatch(redirect('/chat'));

        dispatch({
          type: types.UNSET_ACTIVE_CHAT,
        });

        return data;
      })
      .catch(reason => dispatch({
        type: types.DELETE_CHAT_FAILURE,
        payload: reason,
      }));
  };
}
