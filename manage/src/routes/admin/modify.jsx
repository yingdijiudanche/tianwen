import React, { useState, useEffect } from "react";
import { message, Form, Input, Button, Select, Card } from 'antd';
import { injectIntl } from "react-intl";

import api from '../../api/admin';
import roleApi from '../../api/role';

const Item = Form.Item;

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 12 },
};
const tailLayout = {
  wrapperCol: { span: 8, offset: 4 },
};

const Modify = ({ location, history, intl }) => {
  const { editData } = location.state || {};
  const isEdit = editData !== undefined;
  const [form] = Form.useForm();
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const initRoles = async () => {
      let res = await roleApi.getOptions();
      if (res.code) return message.error(res.msg);
      setRoles(res.data);
    };
    initRoles();
    if (isEdit) {
      form.setFieldsValue(editData);
    }
    //eslint-disable-next-line
  }, []);

  const onFinish = async values => {
    let res = isEdit ? await api.edit(editData._id, values) : await api.add(values);
    if (res.code) return message.error(res.msg);
    message.success(res.msg);
    history.goBack();
  };

  return (
    <Card className="gx-card" title={intl.formatMessage({ id: 'admin.form' }, { control: isEdit ? "Edit" : "Create" })}>
      <Form {...layout} form={form} name='admin' onFinish={onFinish} autoComplete="off">
        <Item label={intl.formatMessage({ id: 'admin.roleName' })} name='roleId' rules={[{ required: true }]}>
          <Select placeholder={intl.formatMessage({ id: 'placeholder.selector' })} options={roles}>
          </Select>
        </Item>
        <Item label={intl.formatMessage({ id: 'admin.account' })} name='account' rules={[{ required: true }]}>
          <Input />
        </Item>
        {isEdit ? (<Item label={intl.formatMessage({ id: 'admin.password' })} name='password'>
          <Input />
        </Item>) : (
          <>
            <Item label={intl.formatMessage({ id: 'admin.password' })} name='password' rules={[{ required: true }]} hasFeedback>
              <Input.Password />
            </Item>
            <Form.Item
              name='confirm'
              label={intl.formatMessage({ id: 'admin.confirmPassword' })}
              dependencies={['password']}
              hasFeedback
              rules={[
                {
                  required: true,
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error(intl.formatMessage({ id: 'admin.confirmError' })));
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
          </>
        )}

        <Item label={intl.formatMessage({ id: 'admin.name' })} name='name' rules={[{ required: true }]}>
          <Input />
        </Item>
        <Item label={intl.formatMessage({ id: 'admin.email' })} name='email'>
          <Input />
        </Item>
        <Item label={intl.formatMessage({ id: 'admin.staffNo' })} name='staffNo'>
          <Input />
        </Item>

        <Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            {intl.formatMessage({ id: 'buttons.submit' })}
          </Button>
        </Item>
      </Form>
    </Card>)
}

export default injectIntl(Modify);