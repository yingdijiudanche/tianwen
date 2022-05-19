import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Route, Switch, Redirect } from "react-router-dom";

// import asyncComponent from "../util/asyncComponent";
import lazyPagesKeyValue from "./lazy";

const App = () => {
  const menus = useSelector(s => s.menu.menus);

  const menusMemo = useMemo(() => {
    if (menus.length === 0) return [];
    const parent = menus.filter(f => !f.pid);
    return menus.filter(f => f.component).map((menu) => {
      let path = menu.path;
      if (menu.pid) (path = parent.find(f => f._id === menu.pid).path + path)
      return <Route key={menu._id} path={path} component={lazyPagesKeyValue[menu.component]} />;
    })
  }, [menus])

  return (<div className="gx-main-content-wrapper">
    <React.Suspense fallback={<p>loading...</p>}>
      <Switch>
        {/* <Route path={`/dashboard`} component={asyncComponent(() => import('./dashboard'))} />
        <Route path={`/table`} component={asyncComponent(() => import('./table'))} /> */}
        {menusMemo}
        <Redirect from='/' exact to="dashboard" />
      </Switch>
    </React.Suspense>
  </div>)
};

export default App;
