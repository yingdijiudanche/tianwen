import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Table, Card, Select } from 'antd';
import dayjs from 'dayjs';

import api from '../../api/visitor';
import adminApi from '../../api/admin';

import useListPage from '../../hook/useListPage';
import { buildFilter, buildTimeRangeFilter } from '../../components/Table/tableHelp';
import useSearchColumn from '../../hook/useSearchColumn';
import IntlMessages from "../../util/IntlMessages";
import { AddBtn, ModifyBtn, DangerBtn } from '../../components/styled/operateBtns';

const PermitStatus = {
  2: 'Waiting', // 等待入場
  5: 'In', //车辆已入场
};

/**@return {import('../../../components/tableHelp').buildDrodown} */
const buildAdminSelect =
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

/**@return {import('../../../components/tableHelp').buildDrodown} */
const buildStatusSelect =
  () =>
    ({ selectedKeys, setSelectedKeys, confirm }) => {
      return (
        <Select
          options={[{ label: "Waiting", value: "2" }, { label: "In", value: "5" }]}
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

const Visitor = () => {
  const { user } = useSelector(state => state.admin);
  const { dataState, handleTableChange, deleOne, cachedParams } = useListPage(api);
  const [adminOptions, setAdminOptions] = useState([]);
  useEffect(() => {
    adminApi
      .getOptions()
      .then(res => setAdminOptions(res))
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
      title: <IntlMessages id='visitor.companyName' />,
      dataIndex: 'companyName',
      key: '~companyName',
      filteredValue: cachedParams['~companyName'],
      ...useSearchColumn('companyName'),
    },
    user ? (user.roleName === 'System Admin' || user.roleName.includes('Fleet')) ? {
      title: <IntlMessages id='visitor.applicant' />,
      dataIndex: 'applicant',
      key: 'applicantId',
      filteredValue: cachedParams.applicantId,
      ...buildFilter(buildAdminSelect(adminOptions)),
    } : {} : {},
    // {
    //   title: <IntlMessages id='visitor.approver' />,
    //   dataIndex: 'approver',
    //   key: 'approverId',
    //   // render: v => <Tag>{v}</Tag>,
    //   filteredValue: cachedParams.approverId,
    //   ...buildFilter(buildAdminSelect(adminOptions)),
    // },
    {
      title: <IntlMessages id='visitor.fullName' />,
      dataIndex: 'fullName',
      key: '~fullName',
      filteredValue: cachedParams['~fullName'],
      ...useSearchColumn('fullName'),
    },
    {
      title: <IntlMessages id='visitor.contactPerson' />,
      dataIndex: 'contactPerson',
      key: '~contactPerson',
      filteredValue: cachedParams['~contactPerson'],
      ...useSearchColumn('contactPerson'),
    },
    {
      title: <IntlMessages id='visitor.contactingDepartment' />,
      dataIndex: 'deptName',
      key: '~deptName'
    },
    {
      title: <IntlMessages id='visitor.status' />,
      dataIndex: 'permit',
      key: 'status',
      render: permit => PermitStatus[permit.status],
      filteredValue: cachedParams['status'],
      ...buildFilter(buildStatusSelect()),
    },
    {
      title: <IntlMessages id='visitor.visitDate' />,
      dataIndex: 'visitDate',
      key: '#visitDate',
      sorter: true,
      sortOrder: cachedParams["sort"]?.visitDate,
      render: (visitDate) => dayjs(visitDate).format('YYYY-MM-DD'),
      filteredValue: cachedParams['#visitDate'],
      ...buildTimeRangeFilter(),
    },
    {
      title: <IntlMessages id='visitor.timeEst' />,
      dataIndex: 'timeEst',
      key: '#visitDate',
      render: t => t.map(v => dayjs(v).format('HH:mm')).join(' - '),
    },
    {
      title: <IntlMessages id='visitor.carPlateNos' />,
      dataIndex: 'carPlateNos',
      render: v => v.map(m => m.licenceNumber).join(', '),
    },
    {
      title: <IntlMessages id='visitor.email' />,
      dataIndex: 'carPlateNos',
      render: v => v.map(m => m.email).join(', '),
    },
  ];

  return <Card title={<IntlMessages id='table.list' values={{ menu: 'Visitor' }} />}>
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

export default Visitor;