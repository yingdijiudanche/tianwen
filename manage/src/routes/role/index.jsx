import React, { useEffect, useState } from "react";
import { Table, Card, message } from 'antd';
import { useDispatch } from "react-redux";
import dayjs from 'dayjs';

import { showAlertSnackbar } from '../../appRedux/actions/ui';
import api from '../../api/role';
import IntlMessages from "../../util/IntlMessages";
import { AddBtn, DangerBtn, ModifyBtn } from '../../components/styled/operateBtns';

const Role = () => {
  const [roles, setRoles] = useState([]);
  const dispatch = useDispatch();

  const deleOne = id => async () => {
    let res = await api.dele(id);
    if (res.code) return message.error(res.msg);
    message.success(res.msg);

    getData();
  };
  const getData = async () => {
    let res = await api.getAll();
    if (res.code) {
      return dispatch(showAlertSnackbar('error',
        res.msg,
        'Error',
        4.5,
        null));
    }
    setRoles(res.data);
  };
  useEffect(() => {
    getData();
  }, []);

  const columns = [
    {
      title: <IntlMessages id='table.operation' />,
      dataIndex: 'sort',
      key: 'operation',
      render: (_, data) => {
        return (
          <div style={{ display: 'flex' }}>
            <ModifyBtn carry={{ editData: data }} />
            {/* <StyledLink to={{ pathname: 'assign', state: { data } }}>
              <PartitionOutlined />
            </StyledLink> */}
            <DangerBtn onConfirm={deleOne(data._id)} />
          </div>
        );
      },
    },
    {
      title: <IntlMessages id='role.name' />,
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: <IntlMessages id='role.menuIds' />,
      align: 'center',
      dataIndex: 'menuIds',
      key: 'menuIds',
      render: v => (v.length ? v.length : <IntlMessages id='role.all' />),
    },
    {
      title: <IntlMessages id='role.addTime' />,
      dataIndex: 'addTime',
      key: 'addTime',
      render: t => dayjs(t).format('YYYY-MM-DD HH:mm:ss'),
    },
  ];

  return <Card title={<IntlMessages id='table.list' values={{ menu: 'Role' }} />}>
    <AddBtn />
    <Table
      className="gx-table-responsive"
      columns={columns}
      dataSource={roles}
      rowKey='_id'
    />
  </Card>
}

export default Role;