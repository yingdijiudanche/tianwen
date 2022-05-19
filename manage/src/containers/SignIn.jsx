import React, { useEffect } from "react";
import { Button, Form, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { parse } from 'querystring';

import { login } from '../appRedux/actions/admin';
import { showAlertSnackbar } from '../appRedux/actions/ui';
import tokenHolder from '../util/tokenHolder';
import IntlMessages from "../util/IntlMessages";
import CircularProgress from "../components/CircularProgress";
import logo from "../assets/images/logo.png";
import FacebookOutlined from "@ant-design/icons/lib/icons/FacebookOutlined";
import GoogleOutlined from "@ant-design/icons/lib/icons/GoogleOutlined";

const afterLogin = p => {
  let { redirect } = parse(p.location.search.slice(1));
  if (redirect) {
    const urlParams = new URL(window.location.href);
    const redirectUrlParams = new URL(redirect);
    if (redirectUrlParams.origin === urlParams.origin) {
      redirect = redirect.substr(urlParams.origin.length);
      if (redirect.match(/^\/.*#/)) {
        redirect = redirect.substr(redirect.indexOf('#') + 1);
      }
    } else {
      window.location.href = '/dashboard';
    }
  }
  p.history.replace(redirect || '/dashboard');
};

const SignIn = (p) => {
  const dispatch = useDispatch();

  const { loading } = useSelector(s => s.admin);

  useEffect(() => {
    let token = tokenHolder.get();
    if (token) {
      afterLogin(p);
    }
    // eslint-disable-next-line
  }, [loading]);

  const onFinishFailed = errorInfo => {
    dispatch(showAlertSnackbar('error',
      errorInfo.errorFields[0].errors[0],
      'Error',
      4.5,
      null))
  };

  const onFinish = values => {
    if (!loading) {
      dispatch(login(values));
    }
  };

  return (
    <div className="gx-app-login-wrap">
      <div className="gx-app-login-container">
        <div className="gx-app-login-main-content">
          <div className="gx-app-logo-content">
            <div className="gx-app-logo-content-bg">
              <img src={"https://via.placeholder.com/272x395"} alt='Neature' />
            </div>
            <div className="gx-app-logo-wid">
              <h1><IntlMessages id="app.userAuth.signIn" /></h1>
              <p><IntlMessages id="app.userAuth.bySigning" /></p>
              <p><IntlMessages id="app.userAuth.getAccount" /></p>
            </div>
            <div className="gx-app-logo">
              <img alt="example" src={logo} />
            </div>
          </div>
          <div className="gx-app-login-content">
            <Form
              initialValues={{ remember: true }}
              name="basic"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              className="gx-signin-form gx-form-row0">
              <Form.Item
                initialValue="admin"
                rules={[{ required: true, message: 'Please input your Account!' }]} name="userName">
                <Input placeholder="admin" />
              </Form.Item>
              <Form.Item
                initialValue="123"
                rules={[{ required: true, message: 'Please input your Password!' }]} name="password">
                <Input type="password" placeholder="Password" />
              </Form.Item>
              {/* <Form.Item>
                <Checkbox><IntlMessages id="appModule.iAccept" /></Checkbox>
                <span className="gx-signup-form-forgot gx-link"><IntlMessages
                  id="appModule.termAndCondition" /></span>
              </Form.Item> */}
              <Form.Item>
                <Button type="primary" className="gx-mb-0" htmlType="submit">
                  <IntlMessages id="app.userAuth.signIn" />
                </Button>
                <span><IntlMessages id="app.userAuth.or" /></span> <Link to="/signup"><IntlMessages
                  id="app.userAuth.signUp" /></Link>
              </Form.Item>
              <div className="gx-flex-row gx-justify-content-between">
                <span>or connect with</span>
                <ul className="gx-social-link">
                  <li>
                    <GoogleOutlined />
                  </li>
                  <li>
                    <FacebookOutlined />
                  </li>
                </ul>
              </div>
              {/* <span
                className="gx-text-light gx-fs-sm"> demo user email: 'demo@example.com' and password: 'demo#123'</span> */}
            </Form>
          </div>

          {loading ?
            <div className="gx-loader-view">
              <CircularProgress className="gx-loader-400" />
            </div> : null}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
