import React from "react";
import { Avatar, Popover } from "antd";
import { useHistory } from "react-router-dom"

import IntlMessages from "../../util/IntlMessages";
import tokenHolder from "../../util/tokenHolder";
import { useSelector } from "react-redux";
import config from '../../util/config';

const UserProfile = () => {
  const history = useHistory();
  const handleLogout = () => {
    tokenHolder.remove()
    history.replace(`${config.baseName}/login`)
  }
  const { user } = useSelector(s => s.admin);

  const userMenuOptions = (
    <ul className="gx-user-popover">
      <li onClick={handleLogout}>{<IntlMessages id='buttons.logout' />}</li>
    </ul>
  );

  return (
    <div className="gx-flex-row gx-align-items-center gx-mb-4 gx-avatar-row">
      <Popover placement="bottomRight" content={userMenuOptions} trigger="click">
        <Avatar src={"https://via.placeholder.com/150"} className="gx-size-40 gx-pointer gx-mr-3" alt="" />
        <span className="gx-avatar-name">{user && user.name}<i className="icon icon-chevron-down gx-fs-xxs gx-ml-2" /></span>
      </Popover>
    </div>
  )
};

export default UserProfile;
