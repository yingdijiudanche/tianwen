import React, { useState, useEffect } from "react";
import { message, Form, Input, Button, Divider, Card, Checkbox } from 'antd';
import { injectIntl } from "react-intl";
import styled from "styled-components"

import api from '../../api/role';
import menuApi from '../../api/menu';

const Item = Form.Item;

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 12 },
};
const tailLayout = {
  wrapperCol: { span: 8, offset: 4 },
};

const CheckboxGroup = styled(Checkbox.Group)`
    padding-left: 23px;
    &>label{
        margin-right:20px;
        margin-top:5px
    }
`;
const Expand = styled.div`
    flex:1;
    margin: 24px;
    &>div+div{
        margin-top:15px;
    }
`

const extra = function (allChildren, children) {
  let checkList = []
  children.forEach(c => {
    let child = allChildren.find(f => f._id === c);
    if (!child) return
    checkList.push(child.name)
  })
  let curLen = checkList.length,
    allLen = allChildren.length,
    indeterminate = curLen < allLen,
    checkedAll = curLen === allLen,
    cur = { checkedAll, checkList, indeterminate };
  return cur
}

/**
 * 
 * @param {menuIds} ids 
 * @param {Route[]} routes 
 */
const extraDefalutValue = (ids = [], routes = []) => {
  let checked = new Map()
  const parent = routes.filter(f => ids.includes(f._id) && !f.pid);
  parent.forEach(item => {
    let allChildren = routes.filter(v => v.pid === item._id);
    let chidren = ids.filter(f => routes.find(r => f === r._id && r.pid === item._id));
    let checkState = extra(allChildren, chidren);
    checked.set(item._id, checkState)
  })
  return checked;
}

const Modify = ({ location, history, intl }) => {
  const { editData } = location.state || {};
  const isEdit = editData !== undefined;
  const [form] = Form.useForm();
  const [menus, setMenus] = useState([]);
  const [checkStateMap, setCheckState] = useState()

  useEffect(() => {
    const initMenus = async () => {
      let res = await menuApi.getAll();
      if (res.code) return message.error(res.msg);
      const defaulState = extraDefalutValue(isEdit ? editData.menuIds : [], res.data);
      setCheckState(defaulState)
      setMenus(res.data);
    };
    initMenus();
    if (isEdit) {
      form.setFieldsValue(editData);
    }
    //eslint-disable-next-line
  }, []);

  const allCheck = (route, children) => ({ target: { checked } }) => {
    let cur = checked
      ? {
        checkedAll: true,
        checkList: children.map(c => c.name),
        indeterminate: false
      }
      : { checkedAll: false, checkList: [], indeterminate: false };

    if (checked) {
      checkStateMap.set(route._id, cur)
    } else {
      checkStateMap.delete(route._id)
    }

    setCheckState(new Map(checkStateMap))
  }

  const singleCheck = (route, children) => (values) => {
    let checkList = values,
      curLen = checkList.length,
      allLen = children.length,
      indeterminate = curLen < allLen,
      checkedAll = curLen === allLen,
      cur = { checkedAll, checkList, indeterminate };
    if (!curLen && indeterminate) {
      checkStateMap.delete(route._id)
    } else {
      checkStateMap.set(route._id, cur)
    }

    setCheckState(new Map(checkStateMap))
  }

  const buildCheckbox = route => {
    let {
      checkedAll = false,
      checkList = [],
      indeterminate = false
    } = checkStateMap.get(route._id) || {};

    const children = menus.filter(f => f.pid === route._id);

    return (
      <div key={route._id} >
        <Checkbox
          indeterminate={indeterminate}
          onChange={allCheck(route, children)}
          checked={checkedAll}
        >{route.name}</Checkbox>
        <div></div>
        <CheckboxGroup
          options={children.map(c => c.name)}
          value={checkList}
          onChange={singleCheck(route, children)}
        ></CheckboxGroup>
      </div>
    )
  }

  const onFinish = async values => {
    let menuIds = [];
    checkStateMap.forEach(({ checkList }, id) => {
      let childrenIds = checkList.map(v => menus.find(c => c.name === v)._id)
      menuIds.push(id)
      return menuIds.push(...childrenIds);
    })
    let res = isEdit ? await api.edit(editData._id, { ...values, menuIds }) : await api.add({ ...values, menuIds });
    if (res.code) return message.error(res.msg);
    message.success(res.msg);
    history.goBack();
  };

  return (<Card className="gx-card" title={intl.formatMessage({ id: 'role.form' }, { control: isEdit ? "Edit" : "Create" })}>
    <Form {...layout} form={form} name='role' onFinish={onFinish}>
      <Item label={intl.formatMessage({ id: 'role.name' })} name='name' rules={[{ required: true }]}>
        <Input />
      </Item>
      <Divider orientation="left">{intl.formatMessage({ id: 'role.assign' })}</Divider>
      <Expand {...layout}>
        {menus.filter(f => !f.pid).map(buildCheckbox)}
      </Expand>
      <Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          {intl.formatMessage({ id: 'buttons.submit' })}
        </Button>
      </Item>
    </Form>
  </Card>)
}

export default injectIntl(Modify);