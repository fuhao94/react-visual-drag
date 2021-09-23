import { message } from 'antd';

// 编辑器自定义事件
export const events = {
  redirect(url: string) {
    if (url) {
      window.location.href = url;
    }
  },

  message(msg: string) {
    if (msg) {
      message.info(msg);
    }
  }
};

export const mixins = {
  methods: events
};

export const eventList = [
  {
    key: 'message',
    label: '消息提醒',
    event: events.message,
    param: ''
  },
  {
    key: 'redirect',
    label: '跳转事件',
    event: events.redirect,
    param: ''
  }
];
