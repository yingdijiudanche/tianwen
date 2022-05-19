import React, { useEffect, useRef, useState } from "react";
import IntlMessages from "../../../util/IntlMessages";
import D2View from "./2d/D2View";
import spotApi from "../../../api/spot/index";
import buildingData from "../../../assets/floorplan/kumshing.json";
import styled from "styled-components";
import { ReloadOutlined } from "@ant-design/icons";
import { Button, message } from "antd";

import "./index.css";

const getParkingCars = async () => {
  let result = await spotApi.getAll();
  return result;
};

const getCarLots = async () => {
  return {
    code: 1,
    msg: "succeed",
    data: [
      //=============================================1~11 rotation: -Math.PI / 2
      { x: 88.33, y: 31.4, rotation: -Math.PI / 2 },
      { x: 88.47, y: 33.8, rotation: -Math.PI / 2 },
      { x: 88.53, y: 36.07, rotation: -Math.PI / 2 },
      { x: 88.53, y: 39.47, rotation: -Math.PI / 2 },
      { x: 88.67, y: 42.8, rotation: -Math.PI / 2 },
      { x: 88.53, y: 46.13, rotation: -Math.PI / 2 },
      { x: 88.6, y: 48.33, rotation: -Math.PI / 2 },
      { x: 88.6, y: 50.67, rotation: -Math.PI / 2 },
      { x: 88.47, y: 53.6, rotation: -Math.PI / 2 },
      { x: 88.47, y: 55.8, rotation: -Math.PI / 2 },
      { x: 88.6, y: 58.07, rotation: -Math.PI / 2 },
      //=============================================12~25 rotation: -Math.PI
      { x: 79.13, y: 60.6, rotation: -Math.PI },
      { x: 76.93, y: 60.6, rotation: -Math.PI },
      { x: 74.53, y: 60.53, rotation: -Math.PI },
      { x: 54.73, y: 56.8, rotation: -Math.PI },
      { x: 52.07, y: 56.73, rotation: -Math.PI },
      { x: 49.13, y: 56.93, rotation: -Math.PI },
      { x: 47, y: 56.67, rotation: -Math.PI },
      { x: 44.73, y: 56.6, rotation: -Math.PI },
      { x: 41.73, y: 56.8, rotation: -Math.PI },
      { x: 39.47, y: 56.87, rotation: -Math.PI },
      { x: 37.27, y: 56.87, rotation: -Math.PI },
      { x: 34.47, y: 56.73, rotation: -Math.PI },
      { x: 32.13, y: 56.73, rotation: -Math.PI },
      { x: 29.93, y: 56.73, rotation: -Math.PI },
      //=============================================26~66 rotation: 0
      { x: 17.73, y: 40.2 },
      { x: 19.8, y: 40.07 },
      { x: 24.33, y: 40.2 },
      { x: 27, y: 40.2 },
      { x: 30.07, y: 40.2 },
      { x: 32.33, y: 40.07 },
      { x: 34.47, y: 40.27 },
      { x: 37.33, y: 40.27 },
      { x: 39.53, y: 40 },
      { x: 41.93, y: 40.33 },
      { x: 44.67, y: 40.33 },
      { x: 46.93, y: 40.07 },
      { x: 49.2, y: 40.27 },
      { x: 52.13, y: 40.13 },
      { x: 54.4, y: 40.27 },
      { x: 56.67, y: 40.27 },
      { x: 62.27, y: 40.13 },
      { x: 64.53, y: 40 },
      { x: 67.33, y: 40 },
      { x: 67.27, y: 32.53 },
      { x: 67.27, y: 27 },
      { x: 73.27, y: 32.87 },
      { x: 73.2, y: 26.93 },
      { x: 24.47, y: 45.33 },
      { x: 27, y: 45.33 },
      { x: 29.93, y: 45.27 },
      { x: 32.13, y: 45.27 },
      { x: 34.47, y: 45.27 },
      { x: 37.27, y: 45.27 },
      { x: 39.53, y: 45.13 },
      { x: 41.8, y: 45.27 },
      { x: 44.73, y: 45.33 },
      { x: 47, y: 45.33 },
      { x: 49.2, y: 45.2 },
      { x: 52.2, y: 45.2 },
      { x: 54.47, y: 45.13 },
      { x: 56.6, y: 45.27 },
      { x: 62.2, y: 45.2 },
      { x: 64.6, y: 45.13 },
      { x: 67.4, y: 45.13 },
      { x: 69.67, y: 45.2 },
      //=============================================67~69 rotation: -Math.PI / 2
      { x: 74.67, y: 55.53, rotation: -Math.PI },
      { x: 77, y: 55.4, rotation: -Math.PI },
      { x: 79.27, y: 55.47, rotation: -Math.PI },
    ],
  };
};

//load parking lot building data
const loadParkingLotGeoJson = async () => {
  await new Promise((resolve, reject) => setTimeout(() => resolve(), 200));
  return buildingData;
};

//out container
const DivContainer = styled.div`
  height: calc(100% - 5px);
  position: relative;
`;

//2d view parent component
const floorPlan = () => {
  //show view
  const [building, setBuilding] = useState();
  const [lots, setLots] = useState();
  const [cars, setCars] = useState();
  const [reloadData, setReloadData] = useState(false);
  const reloadButton = useRef();

  const getDatas = () => {
    loadParkingLotGeoJson().then((data) => setBuilding(data));
    getCarLots().then((data) => setLots(data));
    getParkingCars().then((data) => setCars(data));
  };

  useEffect(() => {
    //load data to show view
    getDatas();
    return () => {};
  }, []);

  useEffect(() => {
    reloadData &&
      getParkingCars()
        .then((data) => {
          message.success("Reload Successfully");
          setCars(data);
          setReloadData(false);
          //清除按钮的focus状态
          reloadButton.current &&
            reloadButton.current.blur &&
            reloadButton.current.blur();
        })
        .catch(() => message.error("Reload Failed"));
  }, [reloadData]);

  return (
    <DivContainer>
      <Button
        className={reloadData ? "btnReloadCar" : ""}
        shape="circle"
        icon={<ReloadOutlined style={{ fontSize: "1.2em" }} />}
        style={{
          position: "absolute",
          backgroundColor: "transparent",
          border: "none",
        }}
        ref={reloadButton}
        loading={reloadData}
        onClick={() => setReloadData(true)}
      ></Button>
      <D2View building={building} lots={lots} cars={cars} />
    </DivContainer>
  );
};

export default floorPlan;
