import React, { useState, useEffect } from "react";
import { message, Form, Input, Button, Select, Card, Switch, Row, Col } from 'antd';
import { injectIntl } from "react-intl";

import api from '../../api/vehicle';
import vehicleTypeApi from '../../api/vehicleType';

const Item = Form.Item;
const layout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
};


const Modify = ({ location, history, intl }) => {
  const { editData } = location.state || {};

  const isEdit = editData !== undefined;
  const [form] = Form.useForm();
  const [types, setTypes] = useState([]);

  useEffect(() => {
    const initTypes = async () => {
      let res = await vehicleTypeApi.getOptions();
      if (res.code) return message.error(res.msg);
      setTypes(res.data);
    };
    initTypes();
    if (isEdit) {
      const data = {
        ...editData,
        typeOfCleaningServices: editData.typeOfCleaningServices === "YES" ? true : false,
      }
      form.setFieldsValue(data);
    }
    //eslint-disable-next-line
  }, []);

  const onFinish = async values => {
    let data = values;
    if (!data.VRDBodyType) (data.VRDBodyType = types.find(f => f.value === data.type).label);
    let res = isEdit ? await api.edit(editData._id, data) : await api.add(data);
    if (res.code) return message.error(res.msg);
    message.success(res.msg);
    history.goBack();
  };

  return <Card className="gx-card" title={intl.formatMessage({ id: 'vehicle.form' }, { control: isEdit ? "Edit" : "Create" })}>
    <Form form={form}
      {...layout}
      name='vehicle'
      onFinish={onFinish}
      autoComplete="off"
      labelAlign='left'
    >
      <Row gutter={24} style={{ width: '95%' }}>
        <Col span={8}>
          <Item label={intl.formatMessage({ id: 'vehicle.assetNo' })} name='assetNo'>
            <Input />
          </Item>
        </Col>
        <Col span={8}>
          <Item label={intl.formatMessage({ id: 'vehicle.renewalMonth' })} name='renewalMonth'>
            <Input />
          </Item>
        </Col>
        <Col span={8}>
          <Item label={intl.formatMessage({ id: 'vehicle.projectNo' })} name='projectNo'>
            <Input />
          </Item>
        </Col>
        <Col span={8}>
          <Item label={intl.formatMessage({ id: 'vehicle.licenceNumber' })} name='licenceNumber' rules={[{ required: true }]}>
            <Input />
          </Item>
        </Col>
        <Col span={8}>
          <Item label={intl.formatMessage({ id: 'vehicle.gearbox' })} name='gearbox' rules={[{ required: true }]}>
            <Select options={[{ label: 'Manual', value: 1 }, { label: 'Automatic', value: 2 }]} />
          </Item>
        </Col>
        <Col span={8}>
          <Item label={intl.formatMessage({ id: 'vehicle.licenseRenewal' })} name='licenseRenewal'>
            <Input />
          </Item>
        </Col>
        <Col span={8}>
          <Item label={intl.formatMessage({ id: 'vehicle.company' })} name='company'>
            <Input />
          </Item>
        </Col>
        <Col span={8}>
          <Item label={intl.formatMessage({ id: 'vehicle.VRDClass' })} name='VRDClass'>
            <Input />
          </Item>
        </Col>
        <Col span={8}>
          <Item label={intl.formatMessage({ id: 'vehicle.purposeOfVehicle' })} name='purposeOfVehicle'>
            <Input />
          </Item>
        </Col>
        <Col span={8}>
          <Item label={intl.formatMessage({ id: 'vehicle.department' })} name='department'>
            <Select placeholder={intl.formatMessage({ id: 'placeholder.selector' })} options={[
              { label: 'BAF', value: 'BAF' },
              { label: 'BPD', value: 'BPD' },
              { label: 'CAF', value: 'CAF' },
            ]}>
            </Select>
          </Item>
        </Col>
        <Col span={8}>
          <Item label={intl.formatMessage({ id: 'vehicle.VRDMake' })} name='VRDMake'>
            <Input />
          </Item>
        </Col>
        <Col span={8}>
          <Item label={intl.formatMessage({ id: 'vehicle.cab' })} name='cab'>
            <Input />
          </Item>
        </Col>
        <Col span={8}>
          <Item label={intl.formatMessage({ id: 'vehicle.marketFunction' })} name='marketFunction'>
            <Input />
          </Item>
        </Col>
        <Col span={8}>
          <Item label={intl.formatMessage({ id: 'vehicle.carModel' })} name='carModel'>
            <Input />
          </Item>
        </Col>
        <Col span={8}>
          <Item label={intl.formatMessage({ id: 'vehicle.bodyBuild' })} name='bodyBuild'>
            <Input />
          </Item>
        </Col>
        <Col span={8}>
          <Item label={intl.formatMessage({ id: 'vehicle.branchLocation' })} name='branchLocation'>
            <Input />
          </Item>
        </Col>
        <Col span={8}>
          <Item label={intl.formatMessage({ id: 'vehicle.chassisNumber' })} name='chassisNumber'>
            <Input />
          </Item>
        </Col>
        <Col span={8}>
          <Item label={intl.formatMessage({ id: 'vehicle.groupLogo' })} name='groupLogo' valuePropName='checked' initialValue={true}>
            <Switch checkedChildren='Yes' unCheckedChildren='No' />
          </Item>
        </Col>
        <Col span={8}>
          <Item label={intl.formatMessage({ id: 'vehicle.customerCode' })} name='customerCode'>
            <Input />
          </Item>
        </Col>
        <Col span={8}>
          <Item label={intl.formatMessage({ id: 'vehicle.engineNo' })} name='engineNo'>
            <Input />
          </Item>
        </Col>
        <Col span={8}>
          <Item label={intl.formatMessage({ id: 'vehicle.autotollAccount' })} name='autotollAccount'>
            <Input />
          </Item>
        </Col>
        <Col span={8}>
          <Item label={intl.formatMessage({ id: 'vehicle.subcontractorCode' })} name='subcontractorCode'>
            <Input />
          </Item>
        </Col>
        <Col span={8}>
          <Item label={intl.formatMessage({ id: 'vehicle.VRDCylinderCapacity' })} name='VRDCylinderCapacity'>
            <Input />
          </Item>
        </Col>
        <Col span={8}>
          <Item label={intl.formatMessage({ id: 'vehicle.autotollCode' })} name='autotollCode'>
            <Input />
          </Item>
        </Col>
        <Col span={8}>
          <Item label={intl.formatMessage({ id: 'vehicle.autotollCode' })} name='autotollCode'>
            <Input />
          </Item>
        </Col>
        <Col span={8}>
          <Item label={intl.formatMessage({ id: 'vehicle.activityCode' })} name='activityCode'>
            <Input />
          </Item>
        </Col>
        <Col span={8}>
          <Item label={intl.formatMessage({ id: 'vehicle.VRDColor' })} name='VRDColor'>
            <Input />
          </Item>
        </Col>
        <Col span={8}>
          <Item label={intl.formatMessage({ id: 'vehicle.GPSUnitNo' })} name='GPSUnitNo'>
            <Input />
          </Item>
        </Col>
        <Col span={8}>
          <Item label={intl.formatMessage({ id: 'vehicle.contractingBusinessDept' })} name='contractingBusinessDept'>
            <Select placeholder={intl.formatMessage({ id: 'placeholder.selector' })} options={[
              { label: 'CBD', value: 'CBD' },
              { label: 'CCF', value: 'CCF' },
              { label: 'CSF', value: 'CSF' },
            ]}>
            </Select>
          </Item>
        </Col>
        <Col span={8}>
          <Item label={intl.formatMessage({ id: 'vehicle.VRDBodyType' })} name='VRDBodyType'>
            <Input />
          </Item>
        </Col>
        <Col span={8}>
          <Item label={intl.formatMessage({ id: 'vehicle.GPSInstallation' })} name='GPSInstallation' valuePropName='checked' initialValue={true}>
            <Switch checkedChildren='Yes' unCheckedChildren='No' />
          </Item>
        </Col>
        <Col span={8}>
          <Item label={intl.formatMessage({ id: 'vehicle.nonOfficeHrAuth' })} name='nonOfficeHrAuth'>
            <Input />
          </Item>
        </Col>
        <Col span={8}>
          <Item label={intl.formatMessage({ id: 'vehicle.VRDGrossWeight' })} name='VRDGrossWeight'>
            <Input />
          </Item>
        </Col>
        <Col span={8}>
          <Item label={intl.formatMessage({ id: 'vehicle.gasCardNo' })} name='gasCardNo'>
            <Input />
          </Item>
        </Col>
        <Col span={8}>
          <Item label={intl.formatMessage({ id: 'vehicle.typeOfParkingReinbursement' })} name='typeOfParkingReinbursement' initialValue="Normal">
            <Select placeholder={intl.formatMessage({ id: 'placeholder.selector' })} options={[
              { label: 'Normal', value: 'Normal' },
              { label: 'Special', value: 'Special' },
            ]}>
            </Select>
          </Item>
        </Col>
        <Col span={8}>
          <Item label={intl.formatMessage({ id: 'vehicle.VRDYearOfManufacture' })} name='VRDYearOfManufacture'>
            <Input />
          </Item>
        </Col>
        <Col span={8}>
          <Item label={intl.formatMessage({ id: 'vehicle.driverName' })} name='driverName'>
            <Input />
          </Item>
        </Col>
        <Col span={8}>
          <Item label={intl.formatMessage({ id: 'vehicle.vehicleParkingLocation' })} name='vehicleParkingLocation'>
            <Input />
          </Item>
        </Col>
        <Col span={8}>
          <Item label={intl.formatMessage({ id: 'vehicle.dateOfFirstRegistration' })} name='dateOfFirstRegistration'>
            <Input />
          </Item>
        </Col>
        <Col span={8}>
          <Item label={intl.formatMessage({ id: 'vehicle.mainDriverStaffId' })} name='mainDriverStaffId'>
            <Input />
          </Item>
        </Col>
        <Col span={8}>
          <Item label={intl.formatMessage({ id: 'vehicle.typeOfCleaningServices' })} name='typeOfCleaningServices' valuePropName='checked'>
            <Switch checkedChildren='Yes' unCheckedChildren='No' />
          </Item>
        </Col>
        <Col span={8}>
          <Item label={intl.formatMessage({ id: 'vehicle.VRDRegisteredOwner' })} name='VRDRegisteredOwner'>
            <Input />
          </Item>
        </Col>
        <Col span={8}>
          <Item label={intl.formatMessage({ id: 'vehicle.userGrading' })} name='userGrading'>
            <Input />
          </Item>
        </Col>
        <Col span={8}>
          <Item label={intl.formatMessage({ id: 'vehicle.emissionStandard' })} name='emissionStandard'>
            <Input />
          </Item>
        </Col>
        <Col span={8}>
          <Item label={intl.formatMessage({ id: 'vehicle.type' })} name='type' rules={[{ required: true }]}>
            <Select placeholder={intl.formatMessage({ id: 'placeholder.selector' })} options={types}>
            </Select>
          </Item>
        </Col>
        <Col span={8}>
          <Item label={intl.formatMessage({ id: 'vehicle.patronageRidership' })} name='patronageRidership' rules={[{ required: true }]}>
            <Input />
          </Item>
        </Col>
        <Col span={8}>
          <Item label={intl.formatMessage({ id: 'vehicle.charge' })} name='charge' valuePropName='checked' initialValue={false}>
            <Switch checkedChildren='Yes' unCheckedChildren='No' />
          </Item>
        </Col>
        <Col span={8}>
          <Item label={intl.formatMessage({ id: 'vehicle.isSpare' })} name='isSpare' valuePropName='checked' initialValue={false}>
            <Switch checkedChildren='Yes' unCheckedChildren='No' />
          </Item>
        </Col>
        <Col span={8}>
          <Item label={intl.formatMessage({ id: 'vehicle.isPoolCar' })} name='isPoolCar' valuePropName='checked'>
            <Switch checkedChildren='Yes' unCheckedChildren='No' />
          </Item>
        </Col>
        <Col span={8}>
          <Item label={intl.formatMessage({ id: 'vehicle.maintenanceMileageDiff' })} name='maintenanceMileageDiff'>
            <Input />
          </Item>
        </Col>
        <Col span={8}>
          <Item label={intl.formatMessage({ id: 'vehicle.roadPermitNo' })} name='roadPermitNo'>
            <Input />
          </Item>
        </Col>
        <Col span={8}>
          <Item label={intl.formatMessage({ id: 'vehicle.vehicleFunction' })} name='vehicleFunction'>
            <Input />
          </Item>
        </Col>
        <Col span={8}>
          <Item label={intl.formatMessage({ id: 'vehicle.status' })} name='status' initialValue="In Use">
            <Select placeholder={intl.formatMessage({ id: 'placeholder.selector' })} options={[
              { label: 'In Use', value: 'In Use' },
              { label: 'History', value: 'History' },
              { label: 'Scrapped', value: 'Scrapped' }
            ]}>
            </Select>
          </Item>
        </Col>
        <Col span={8}>
          <Item label={intl.formatMessage({ id: 'vehicle.allocationCoding' })} name='allocationCoding'>
            <Input />
          </Item>
        </Col>
        <Col span={8}>
          <Item label={intl.formatMessage({ id: 'vehicle.roundedMonthlyRate' })} name='roundedMonthlyRate'>
            <Input />
          </Item>
        </Col>
        <Col span={8}>
          <Item label={intl.formatMessage({ id: 'vehicle.vehicleValue' })} name='vehicleValue'>
            <Input />
          </Item>
        </Col>
      </Row>
      <Item>
        <Button type="primary" htmlType="submit">
          {intl.formatMessage({ id: 'buttons.submit' })}
        </Button>
      </Item>
    </Form>
  </Card>
}

export default injectIntl(Modify);