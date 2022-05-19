import React from "react";
import { Avatar, Popover } from "antd";
import { useHistory } from "react-router-dom"

import IntlMessages from "../../util/IntlMessages";
import tokenHolder from "../../util/tokenHolder";
import config from '../../util/config';

const UserInfo = () => {
  const history = useHistory();
  const handleLogout = () => {
    tokenHolder.remove()
    history.replace(`${config.baseName}/login`)
  }

  const userMenuOptions = (
    <ul className="gx-user-popover">
      <li onClick={handleLogout}>{<IntlMessages id='buttons.logout' />}</li>
    </ul>
  );

  return (
    <Popover overlayClassName="gx-popover-horizantal" placement="bottomRight" content={userMenuOptions}
      trigger="click">
      <Avatar src={"https://via.placeholder.com/150"}
        className="gx-avatar gx-pointer" alt="" />
    </Popover>
  );
};

export default UserInfo;
