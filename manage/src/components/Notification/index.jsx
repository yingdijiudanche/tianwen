import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { notification, Space } from 'antd';

import { closeSnackbar } from '../../appRedux/actions/ui';

export default function Notification() {
  const { type, content, title, timeOut, onClick, show } = useSelector(
    s => s.ui.snackbars
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (show) {
      notification[type]({
        message: title,
        description: content,
        duration: timeOut,
        onClick: onClick,
      });
    }
    dispatch(closeSnackbar());
  }, [show])

  return (<Space />);
}
