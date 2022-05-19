import React from "react";
import { Menu } from "antd";
import {
  CarOutlined
} from '@ant-design/icons';
import { Link } from "react-router-dom";

import CustomScrollbars from "../../util/CustomScrollbars";
import SidebarLogo from "./SidebarLogo";
import UserProfile from "./UserProfile";
import AppsNavigation from "./AppsNavigation";
import {
  NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR,
  NAV_STYLE_NO_HEADER_MINI_SIDEBAR,
  THEME_TYPE_LITE
} from "../../constants/ThemeSetting";
import IntlMessages from "../../util/IntlMessages";
import { useSelector } from "react-redux";

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const SidebarContent = ({ sidebarCollapsed, setSidebarCollapsed }) => {
  const { navStyle, themeType } = useSelector(({ settings }) => settings);
  const pathname = useSelector(({ common }) => common.pathname);
  const menus = useSelector(s => s.menu.menus);

  const getNavStyleSubMenuClass = (navStyle) => {
    if (navStyle === NAV_STYLE_NO_HEADER_MINI_SIDEBAR) {
      return "gx-no-header-submenu-popup";
    }
    return "";
  };

  const getLeftMenu = (route, parentPath = '') => {
    const children = menus.filter(f => f.pid === route._id && !f.hidden).sort((a, b) => (a.sort - b.sort));
    if (children.length) {
      const key = route.path.replace("/", "");
      return <SubMenu key={key} popupClassName={getNavStyleSubMenuClass(navStyle)}
        title={<span> {route.icon === 'vehicle' ? <CarOutlined style={{ fontSize: '20px', margin: 'auto 20px auto 0' }} /> : <i className={route.icon} />}
          <span><IntlMessages id={route.path} /></span></span>}>
        {children.map(child => {
          return getLeftMenu(child, `${key}/`);
        })}
      </SubMenu>
    } else {
      return (<Menu.Item key={parentPath + route.path.replace("/", "")}>
        <Link to={`/${parentPath}${route.path.replace('/', '')}`}><i className={route.icon} />
          <span><IntlMessages id={route.path} /></span></Link>
      </Menu.Item>)
    }
  }

  const menusMemo = () => {
    if (menus.length === 0) return [];
    let routes = menus.filter(f => !f.pid && !f.hidden);
    return routes.map((route) => {
      return getLeftMenu(route);
    })
  }

  const getNoHeaderClass = (navStyle) => {
    if (navStyle === NAV_STYLE_NO_HEADER_MINI_SIDEBAR || navStyle === NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR) {
      return "gx-no-header-notifications";
    }
    return "";
  };

  const selectedKeys = pathname.substr(1);
  const defaultOpenKeys = selectedKeys.split('/')[1];

  return (
    <>
      <SidebarLogo sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed} />
      <div className="gx-sidebar-content">
        <div className={`gx-sidebar-notifications ${getNoHeaderClass(navStyle)}`}>
          <UserProfile />
          <AppsNavigation />
        </div>
        <CustomScrollbars className="gx-layout-sider-scrollbar">
          <Menu
            defaultOpenKeys={[defaultOpenKeys]}
            selectedKeys={[selectedKeys]}
            theme={themeType === THEME_TYPE_LITE ? 'lite' : 'dark'}
            mode="inline">

            {/* <Menu.Item key="dashboard">
              <Link to="/dashboard"><i className="icon icon-widgets" />
                <span><IntlMessages id="sidebar.dashboard" /></span>
              </Link>
            </Menu.Item>

            <SubMenu key='backstage' popupClassName=''
              title={<span> <i className="icon icon-dasbhoard" />
                <span><IntlMessages id='/backstage' /></span></span>}>
              <Menu.Item key='backstage/admin/index'>
                <Link to='/admin/index'><i className="icon icon-widgets" />
                  <span><IntlMessages id='/admin/index' /></span></Link>
              </Menu.Item>,<Menu.Item key='backstage/menu/index'>
                <Link to='/menu/index'><i className="icon icon-widgets" />
                  <span><IntlMessages id='/menu/index' /></span></Link>
              </Menu.Item>,<Menu.Item key='backstage/role/index'>
                <Link to='/role/index'><i className="icon icon-widgets" />
                  <span><IntlMessages id='/role/index' /></span></Link>
              </Menu.Item>
            </SubMenu> */}
            {menusMemo()}
          </Menu>
        </CustomScrollbars>
      </div>
    </>
  );
};

export default React.memo(SidebarContent);

