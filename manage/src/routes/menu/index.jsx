import React from 'react';
import { Table, Card } from 'antd';

import api from '../../api/menu';
import useListPage from '../../hook/useListPage';
import useSearchColumn from '../../hook/useSearchColumn';
import IntlMessages from "../../util/IntlMessages";
import { AddBtn, DangerBtn, ModifyBtn } from '../../components/styled/operateBtns';

const Menu = () => {
  const { dataState, handleTableChange, deleOne, cachedParams } = useListPage(api);

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
      title: <IntlMessages id='menu.name' />,
      dataIndex: 'name',
      key: '~name',
      filteredValue: cachedParams['~name'],
      ...useSearchColumn('Name'),
    },
    {
      title: <IntlMessages id='menu.path' />,
      dataIndex: 'path',
      key: '~path',
      filteredValue: cachedParams['~path'],
      ...useSearchColumn('Path'),
    },
    {
      title: <IntlMessages id='menu.component' />,
      dataIndex: 'component',
      key: '~component',
      filteredValue: cachedParams['~component'],
      ...useSearchColumn('Component'),
    },
    {
      title: <IntlMessages id='menu.sort' />,
      dataIndex: 'sort',
      key: '~sort',
    },
    {
      title: <IntlMessages id='menu.hidden' />,
      dataIndex: 'hidden',
      render: (hidden) => {
        return (
          <p>
            {hidden ? 'Yes': 'No'}
          </p>
        );
      },
    },
  ];

  return <Card title={<IntlMessages id='table.list' values={{ menu: 'Menu' }} />}>
    <AddBtn />
    <Table
      {...dataState}
      className="gx-table-responsive"
      columns={columns}
      rowKey='_id'
      onChange={handleTableChange}
    />
  </Card>
}

export default Menu;