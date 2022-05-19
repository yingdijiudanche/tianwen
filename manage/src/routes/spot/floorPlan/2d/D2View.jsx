import * as turf from "@turf/turf";
import React, { useEffect, useRef, useState } from "react";
import { Popover, Button } from "antd";

import IntlMessages from "../../../../util/IntlMessages";

import {
  addToScene,
  createD2View,
  createLine,
  createLoading,
  createOutlineFilter,
  createPolygon,
  createRichText,
  createSolidCircle,
  createSprite,
  destroyD2View,
  getSceneHeight,
  getSceneWidth,
  loadResource,
  removeLoading,
} from "./D2";

import loadingPngSrc from "../../../../assets/images/loader.svg";
import teslaPngSrc from "../../../../assets/floorplan/tesla.png";
import styled from "styled-components";

const FIXED_WIDTH = 80;
var OFFSET_X = 0;
var OFFSET_Y = 0;
var SCENE_SCALE = 1;

//存储已经绘制的car
var carCache = {};

//获取坐标中点
const getCoordinatesCenter = (linePos) => {
  let line = turf.lineString(linePos);
  let bbox = turf.bbox(line);
  let bboxPolygon = turf.bboxPolygon(bbox);
  // minX, minY, maxX, maxY
  return bboxPolygon.bbox;
};
//绘制场景
const drawBuilding = (shapes, lots) => {
  if (!shapes || !shapes.features) return;

  let width = getSceneWidth();
  let height = getSceneHeight();

  SCENE_SCALE = width / FIXED_WIDTH;

  //先循环所有坐标，找到外包矩形
  let linePos = [];
  for (let i = 0; i < shapes.features.length; i++) {
    let feature = shapes.features[i];
    let coordinates = feature.geometry.coordinates;
    let fName = feature.properties.name;
    if (fName === "ground") continue;
    coordinates.forEach((cord) => {
      if (
        cord &&
        cord.length === 2 &&
        cord[0] !== undefined &&
        cord[1] !== undefined
      ) {
        linePos.push(cord);
      }
    });
  }
  //得出中心点，计算offset
  let centerArr = getCoordinatesCenter(linePos);
  if (centerArr) {
    let x = ((centerArr[0] + centerArr[2]) / 2) * SCENE_SCALE;
    let y = ((centerArr[1] + centerArr[3]) / 2) * SCENE_SCALE;
    OFFSET_X = width / 2 - x;
    OFFSET_Y = height / 2 - y;
  }

  //调整车位中点位置
  lots.forEach((lot) => {
    lot.x = lot.x * SCENE_SCALE + OFFSET_X;
    lot.y = height - lot.y * SCENE_SCALE - OFFSET_Y;
    // let c = createSolidCircle(lot.x, lot.y, 5, 0xff0000);
    // c.zIndex = 99;
    // addToScene(c);
  });

  //开始画
  for (let i = 0; i < shapes.features.length; i++) {
    let feature = shapes.features[i];
    let fName = feature.properties.name;
    let coordinates = feature.geometry.coordinates;

    let points = [];
    let firstCord;
    for (let j = 0; j < coordinates.length; j++) {
      let cord = coordinates[j];
      if (
        cord &&
        cord.length === 2 &&
        cord[0] !== undefined &&
        cord[1] !== undefined
      ) {
        // let item = {
        //   x: cord[0] * 15,
        //   y: cord[1] * 15,
        // };
        let item = {
          x: cord[0] * SCENE_SCALE + OFFSET_X,
          y: height - cord[1] * SCENE_SCALE - OFFSET_Y,
        };
        points.push(item);
        if (!firstCord) firstCord = item;
      }
    }
    firstCord && points.push(firstCord);

    let shape = null;
    let lineWidth = 1;
    let lineColor = 0xffffff;
    let solidColor = 0x666666;
    let click = null;
    let hover = null;
    let hout = null;
    switch (fName) {
      //墙
      case "wall":
        lineColor = 0x666666;
        shape = createPolygon(points, lineWidth, lineColor, solidColor);
        shape.zIndex = 1;
        break;
      //地面
      case "ground":
        // shape.zIndex = 2;
        continue;
      //行车线
      case "car_line":
        lineColor = 0x666666;
        solidColor = 0x666666;
        lineWidth = 0;
        shape = createPolygon(points, lineWidth, lineColor, solidColor);
        shape.zIndex = 3;
        break;
      //维护区
      case "maintain":
        lineColor = 0x00ff00;
        solidColor = 0x009900;
        lineWidth = 0;
        shape = createPolygon(points, lineWidth, lineColor, solidColor, 0.3);
        shape.zIndex = 4;
        // click = (event) => {};
        break;
      //行车线指引标志
      case "leaders":
        lineColor = 0xffffff;
        solidColor = 0xffffff;
        lineWidth = 0;
        shape = createPolygon(points, lineWidth, lineColor, solidColor);
        shape.zIndex = 5;
        break;
      //车位底层
      case "lot_container":
        lineColor = 0x999999;
        solidColor = 0x999999;
        lineWidth = 0;
        shape = createPolygon(points, lineWidth, lineColor, solidColor);
        shape.zIndex = 6;
        break;
      //车位
      case "lot":
        lineColor = 0x006600;
        solidColor = 0x006600;
        lineWidth = 0;
        shape = createPolygon(points, lineWidth, lineColor, solidColor);
        shape.zIndex = 7;
        // click = (event) => {};
        break;
      //不可充电
      case "lot_ev_no":
        lineColor = 0x666666;
        solidColor = 0x666666;
        lineWidth = 0;
        shape = createPolygon(points, lineWidth, lineColor, solidColor);
        shape.zIndex = 8;
        // click = (event) => {};
        break;
      //快充
      case "lot_ev_30":
        lineColor = 0x00ff00;
        solidColor = 0x00ff00;
        lineWidth = 0;
        shape = createPolygon(points, lineWidth, lineColor, solidColor);
        shape.zIndex = 9;
        // click = (event) => {};
        break;
      //特殊车位
      case "lot_special":
        lineColor = 0x336699;
        solidColor = 0x336699;
        lineWidth = 0;
        shape = createPolygon(points, lineWidth, lineColor, solidColor);
        shape.zIndex = 10;
        break;
      //不可停车区域
      // case "park_no":
      //   lineColor = 0x666600;
      //   solidColor = 0x666600;
      //   shape = createLine(points, lineWidth, lineColor, solidColor);
      //   shape.zIndex = 11;
      //   break;
      //车位数字
      case "leader":
        lineColor = 0x0099ff;
        solidColor = 0x0099ff;
        lineWidth = 0;
        shape = createPolygon(points, lineWidth, lineColor, solidColor);
        shape.zIndex = 12;
        break;
      //其他
      default:
        // shape = createLine(points, lineWidth, lineColor);
        break;
    }
    if (click) {
      shape.tint = 0xbbbbbb;
      shape.interactive = true; //响应交互
      shape.buttonMode = true; //鼠标变手型
      shape.on("pointerover", (e) => {
        hover && hover();
        shape.tint = 0xffffff;
      });
      shape.on("pointerout", (e) => {
        hout && hout();
        shape.tint = 0xbbbbbb;
      });
      shape.on("pointerdown", (e) => {
        click && click();
      });
    }
    addToScene(shape);
  }
};

//绘制多个车辆
const drawCars = async (lots, cars, outlinePass, fns) => {
  //加载车子模型
  let resource = await loadResource("car", teslaPngSrc);
  cars.forEach((car) => {
    let status = car.status;
    let haCar = status.toLowerCase() === "in";
    car.show = haCar;
    car.spotNo = Number(car.spotNo);
    drawCar(car, lots, resource.texture, outlinePass, fns);
  });
};

//绘制单个车辆
const drawCar = async (carInfo, lots, texture, outlinePass, fns) => {
  //获取车子车位号
  let spotNo = carInfo.spotNo || 0;
  if (spotNo < 0) return;

  //创建car sprite,先检查缓存
  let sprite = carCache[spotNo];
  if (!sprite) {
    sprite = createSprite(texture);

    sprite.height = 3 * SCENE_SCALE;
    sprite.width = sprite.height * 0.41;

    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;
    sprite.zIndex = 99;

    let hover = async (event) => {
      let pos = event.data.global;
      fns.setSelectCar && fns.setSelectCar(event.target);
      fns.setShowInfoWindowX && fns.setShowInfoWindowX(pos.x);
      fns.setShowInfoWindowY && fns.setShowInfoWindowY(pos.y);
      fns.setShowInfoWindow && fns.setShowInfoWindow(true);
    };
    let hout = (event) => {
      fns.setShowInfoWindow && fns.setShowInfoWindow(false);
    };
    let click = (event) => {};
    if (click) {
      sprite.tint = 0xbbbbbb;
      sprite.interactive = true; //响应交互
      sprite.buttonMode = true; //鼠标变手型
      sprite.on("pointerover", (e) => {
        sprite.filters = [outlinePass];
        sprite.tint = 0xffffff;
        hover && hover(e);
      });
      sprite.on("pointerout", (e) => {
        sprite.filters = [];
        sprite.tint = 0xbbbbbb;
        hout && hout(e);
      });
      sprite.on("pointerdown", click);
    }
    //设置车位
    let lot = lots[spotNo - 1] || { x: 0, y: 0 };
    sprite.x = lot.x;
    sprite.y = lot.y;
    sprite.rotation = lot.rotation || 0;
    addToScene(sprite);

    //保存到缓存中
    carCache[spotNo] = sprite;
  }
  sprite.info = carInfo;
  sprite.visible = carInfo.show;
};

//d2 container
const D2ViewContainer = styled.div`
  width: 100%;
  height: 100%;
  > canvas {
    border-radius: 5px;
  }
`;

//组件
export default function D2View(props) {
  const [once, setOnce] = useState(false);
  const divContainer = useRef();

  const buildingData = useRef();
  const lotData = useRef();
  const carData = useRef();

  const [readToDraw, setReadToDraw] = useState(false);

  const [selectCar, setSelectCar] = useState();
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const [showInfoWindowX, setShowInfoWindowX] = useState(0);
  const [showInfoWindowY, setShowInfoWindowY] = useState(0);

  useEffect(() => {
    //初始化
    const initD2View = async (r) => {
      createD2View(r);
      //loading
      !once && createLoading("loading", loadingPngSrc);
      setOnce(true);
    };
    initD2View(divContainer.current);

    //return => 组件卸载销毁
    return () => {
      destroyD2View();
      carCache = {};
    };
  }, []);

  //绘制场景
  useEffect(() => {
    if (props.building && props.lots) {
      //初始化缩放为1
      SCENE_SCALE = 1;
      //接收数据
      buildingData.current = props.building;
      lotData.current = props.lots.data || [];

      //绘制标题
      // let txt = createRichText(
      //   "KumShing Smart Fleet System Floor Plan",
      //   getSceneWidth() / 6,
      //   30,
      //   {
      //     fontSize: 40,
      //     fontStyle: "normal",
      //     dropShadow: false,
      //     stroke: "#ffffff",
      //     strokeThickness: 2,
      //     wordWrap: false,
      //   }
      // );
      // addToScene(txt);

      //绘制图形
      drawBuilding(buildingData.current, lotData.current);

      //数据加载完成
      removeLoading();

      setReadToDraw(true);
    }
  }, [props.building, props.lots]);

  //绘制车子
  useEffect(() => {
    if (props.cars) carData.current = props.cars.data || [];

    if (props.cars && readToDraw) {
      let outlinePass = createOutlineFilter(3);
      drawCars(lotData.current, carData.current, outlinePass, {
        setShowInfoWindow,
        setShowInfoWindowX,
        setShowInfoWindowY,
        setSelectCar,
      });
    }
  }, [props.cars, readToDraw]);

  //info box
  const InfoWindow = (props) => {
    return props.data && props.data.info && props.data.info.licenceNumber ? (
      <Popover
        placement="top"
        visible={props.show}
        content={
          <div>
            <IntlMessages id="vehicle.licenceNumber" />:
            {props.data.info.licenceNumber}
          </div>
        }
      >
        <div
          style={{
            position: "absolute",
            left: props.x || 0,
            top: props.y || 0,
          }}
        ></div>
      </Popover>
    ) : null;
  };

  return (
    <>
      <D2ViewContainer ref={divContainer}></D2ViewContainer>
      <InfoWindow
        show={showInfoWindow}
        x={showInfoWindowX}
        y={showInfoWindowY}
        data={selectCar}
      ></InfoWindow>
    </>
  );
}
