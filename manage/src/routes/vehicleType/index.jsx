import React from 'react';
import { Table, Card } from 'antd';
import dayjs from 'dayjs';

import api from '../../api/vehicleType';
import useListPage from '../../hook/useListPage';
import IntlMessages from "../../util/IntlMessages";
import { AddBtn, DangerBtn, ModifyBtn } from '../../components/styled/operateBtns';

const VehicleType = () => {
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
      title: <IntlMessages id='vehicleType.type' />,
      dataIndex: 'type',
      key: '~type',
      filteredValue: cachedParams['~type'],
    },
    {
      title: <IntlMessages id='vehicleType.mileagePerMonth' />,
      dataIndex: 'mileagePerMonth',
      key: '~mileagePerMonth',
      sorter: true,
      sortOrder: cachedParams["sort"]?.mileagePerMonth,
      filteredValue: cachedParams['~mileagePerMonth'],
    },
    {
      title: <IntlMessages id='vehicleType.averageMileage' />,
      dataIndex: 'averageMileage',
      key: '~averageMileage',
      sorter: true,
      sortOrder: cachedParams["sort"]?.averageMileage,
      filteredValue: cachedParams['~averageMileage'],
    },
    {
      title: <IntlMessages id='vehicleType.minMoneyPerKM' />,
      dataIndex: 'minMoneyPerKM',
      key: '~minMoneyPerKM',
      sorter: true,
      sortOrder: cachedParams["sort"]?.minMoneyPerKM,
    },
    {
      title: <IntlMessages id='vehicleType.maxMoneyPerKM' />,
      dataIndex: 'maxMoneyPerKM',
      key: '~maxMoneyPerKM',
      sorter: true,
      sortOrder: cachedParams["sort"]?.maxMoneyPerKM,
    },
    {
      title: <IntlMessages id='vehicleType.lastUpdateBy' />,
      dataIndex: 'lastUpdateBy',
      key: '~lastUpdateBy',
    },
    {
      title: <IntlMessages id='vehicleType.lastUpdateDate' />,
      dataIndex: 'lastUpdateDate',
      key: '~lastUpdateDate',
      render: (lastUpdateDate) => dayjs(lastUpdateDate).format('YYYY-MM-DD'),
      sorter: true,
      sortOrder: cachedParams["sort"]?.lastUpdateDate,
    },
  ];

  return <Card title={<IntlMessages id='table.list' values={{ menu: 'Vehicle Type' }} />}>
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

export default VehicleType;