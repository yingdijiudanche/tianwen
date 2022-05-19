import React, { useEffect, useMemo, useState } from 'react';
import { Table, Tag, Select, Card, Divider, } from 'antd';

import api from '../../api/admin';
import roleApi from '../../api/role';
import useListPage from '../../hook/useListPage';
import useSearchColumn from '../../hook/useSearchColumn';
import { buildFilter } from '../../components/Table/tableHelp';
import { AddBtn, DangerBtn, ModifyBtn } from '../../components/styled/operateBtns';
import IntlMessages from "../../util/IntlMessages";

/**@return {import('../../../components/tableHelp').buildDrodown} */
const buildRoleSelect =
  defo =>
    ({ selectedKeys, setSelectedKeys, confirm }) => {
      return (
        <Select
          options={defo}
          style={{ width: '100%' }}
          value={selectedKeys}
          onSelect={v => {
            setSelectedKeys([v]);
            confirm();
          }}
          placeholder='Click to select'
        />
      );
    };

const Admin = () => {
  const { dataState, handleTableChange, deleOne, cachedParams } = useListPage(api);
  const [roleOptions, setRoleOptions] = useState([]);
  useEffect(() => {
    roleApi.getOptions().then(res => {
      setRoleOptions(res.data);
    });
  }, [])

  /**@type {import('antd/lib/table').ColumnsType} */
  const columns = [
    {
      title: <IntlMessages id='table.operation' />,
      dataIndex: 'sort',
      key: 'operation',
      render: (_, data) => {
        return (
          <div style={{ display: 'flex' }}>
            <ModifyBtn carry={{ editData: data }} />
            <DangerBtn onConfirm={deleOne(data._id)} />
          </div>
        );
      },
    },
    {
      title: <IntlMessages id='admin.account' />,
      dataIndex: 'account',
      key: '~account',
      filteredValue: cachedParams['~account'],
      ...useSearchColumn('Account'),
    },
    {
      title: <IntlMessages id='admin.name' />,
      dataIndex: 'name',
      key: '~name',
      filteredValue: cachedParams['~name'],
      ...useSearchColumn('User Name'),
    },
    {
      title: <IntlMessages id='admin.email' />,
      dataIndex: 'email',
      key: '~email',
      filteredValue: cachedParams['~email'],
      ...useSearchColumn('Email'),
    },
    {
      title: <IntlMessages id='admin.roleName' />,
      dataIndex: 'roleName',
      key: 'roleId',
      render: v => <Tag>{v}</Tag>,
      filteredValue: cachedParams.roleId,
      ...buildFilter(buildRoleSelect(roleOptions)),
    },
  ];

  return (
    <Card title={<IntlMessages id='table.list' values={{ menu: 'Account' }} />}>
      <AddBtn />
      <Table
        {...dataState}
        className="gx-table-responsive"
        columns={columns}
        rowKey='_id'
        onChange={handleTableChange}
      />
    </Card>
  );
}

export default Admin;