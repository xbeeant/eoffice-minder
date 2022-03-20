import { message } from 'antd';
import { history } from 'umi';
import { RequestConfig } from '@@/plugin-request/request';

const loginPath = '/user/login';
const errorHandler = (error: { response: any }) => {
  const { response } = error;
  if (response && response.status) {
    const { status, url } = response;

    message.error(`请求错误 ${status}: ${url}`);
    return { success: false, msg: '网络异常' };
  }

  if (response) {
    if (response.code === 401) {
      history.push(loginPath);
    }

    if (!response.success) {
      message.error(response.msg);
    }
  } else {
    message.error('网络异常');
  }

  return response;
};

export const request: RequestConfig = {
  errorHandler,
  errorConfig: {
    adaptor: (resData) => {
      return {
        ...resData,
        errorMessage: resData.msg,
        errorCode: resData.code,
      };
    },
  },
};

export const qiankun = {
  // 应用加载之前
  async bootstrap(props) {
    console.log('minder bootstrap', props);
  },
  // 应用 render 之前触发
  async mount(props) {
    console.log('minder mount', props);
  },
  // 应用卸载之后触发
  async unmount(props) {
    console.log('minder unmount', props);
  },
};
