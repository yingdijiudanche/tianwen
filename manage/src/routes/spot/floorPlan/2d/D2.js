import * as PIXI from "pixi.js";
import { OutlineFilter } from "pixi-filters";

//不输出pixi版权
PIXI.utils.skipHello();

var appContainer;
var app;
//对象列表
var resources = [];
var objects = [];
//其他属性
var loading;

//销毁
export const destroyD2View = () => {
  //TODO objects destroy
  objects.forEach((o) => (o = null));
  resources.forEach((r) => (r = null));
  objects = null;
  resources = null;
  objects = [];
  resources = [];

  // objects.forEach(o => o && o.destroy && o.destroy());
  // resources.forEach(r => r && r.resource && r.resource.destroy && r.resource.destroy());

  app && app.destroy();
  app = null;
};

//创建2D视图
export const createD2View = (divContainer) => {
  if (!divContainer) throw new Error("no div container");
  appContainer = divContainer;

  appContainer.childNodes.length > 0 &&
    appContainer.childNodes.forEach((e) => appContainer.removeChild(e));
  app && destroyD2View();

  let width = appContainer.clientWidth;
  let height = appContainer.clientHeight;
  //创建pixi app
  app = new PIXI.Application({
    width: width,
    height: height,
    backgroundColor: 0x000000,
    backgroundAlpha: 0.2,
    antialias: true,
  });
  app.renderer.autoResize = true;
  app.resizeTo = appContainer;
  app.stage.sortableChildren = true;
  appContainer.appendChild(app.view);
};

//获取场景宽度
export const getSceneWidth = () => {
  return (app && app.renderer && app.renderer.width) || 0;
};
//获取场景高度
export const getSceneHeight = () => {
  return (app && app.renderer && app.renderer.height) || 0;
};

//加载资源
export const loadResource = async (name, path) => {
  if (!app) return;
  //检查资源是否存在
  let id = `${name}_${path}`;
  let response = null;
  resources.every((item, i) => {
    if (id === item.id) {
      response = item.resource || null;
      return false;
    }
    return true;
  });
  if (response) return response;

  return new Promise((resolve, reject) => {
    app.loader.add(name, path).load((loader, result) => {
      let resource = result && result[name];
      if (!resource) reject("load fail");
      else {
        //添加到资源列表
        resources.push({ id: `${name}_${path}`, resource: resource });
        resolve(resource);
      }
    });
  });
};

//创建Sprite
export const createSprite = (texture) => {
  if (!texture) return null;
  return new PIXI.Sprite(texture);
};

//把对象添加到场景中
export const addToScene = (object) => {
  if (!object) return null;
  //添加到列表
  objects.push(object);
  //添加到尝场景
  let o = app.stage.addChild(object);
  // Listen for frame updates
  o.tick && app.ticker && app.ticker.add(o.tick);

  return o;
};

//把对象从场景中移除
export const removeFromScene = (object) => {
  if (!object) return;
  object.tick && app.ticker.remove(object.tick);
  app.stage.removeChild(object);
  // object.destroy && object.destroy();
};

//设置loading
export const createLoading = async (
  loadingName = "loading",
  loadingSpritePath = "loading.png"
) => {
  //loading
  let trLoading = await loadResource(loadingName, loadingSpritePath);
  if (trLoading && trLoading.texture) {
    let sprite = createSprite(trLoading.texture);
    if (sprite) {
      sprite.width = 50;
      sprite.height = 50;
      sprite.x = getSceneWidth() / 2;
      sprite.y = getSceneHeight() / 2;
      sprite.anchor.x = 0.5;
      sprite.anchor.y = 0.5;

      sprite.tick = () => (sprite.rotation += 0.07);

      let o = sprite && addToScene(sprite);
      loading = o;
    }
  }
};

//移除loading
export const removeLoading = () => {
  loading && removeFromScene(loading);
};

//创建图形
export const createLine = (
  points = [],
  lineWidth = 1,
  lineColor = 0xff0000,
  lineAlpha = 1
) => {
  if (!points || points.length < 2) return null;

  let line = new PIXI.Graphics();
  line.x = 0;
  line.y = 0;

  let startPoint = points[0];
  line.lineStyle(lineWidth, lineColor, lineAlpha);
  points.forEach((item, index) => {
    if (index === 0) line.moveTo(startPoint.x, startPoint.y);
    else line.lineTo(item.x, item.y);
  });

  return line;
};

//创建矩形
export const createReactangle = (
  x,
  y,
  width,
  height,
  lineWidth = 1,
  lineColor = 0xff0000,
  fillColor
) => {
  let rectangle = new PIXI.Graphics();
  rectangle.lineStyle(lineWidth, lineColor, 1);
  fillColor && rectangle.beginFill(fillColor);
  rectangle.drawRect(0, 0, width, height);
  rectangle.endFill();
  rectangle.x = x;
  rectangle.y = y;
  return rectangle;
};

//创建实心圆
export const createSolidCircle = (x, y, r, color = 0xff0000) => {
  let circle = new PIXI.Graphics();
  circle.beginFill(color);
  circle.drawCircle(0, 0, r);
  circle.endFill();
  circle.x = x;
  circle.y = y;
  return circle;
};

//创建多边形
export const createPolygon = (
  points,
  lineWidth = 1,
  lineColor = 0xff0000,
  fillColor,
  alpha
) => {
  let a = alpha !== undefined ? alpha : 1;
  let rectangle = new PIXI.Graphics();
  rectangle.lineStyle(lineWidth, lineColor, a);
  fillColor && rectangle.beginFill(fillColor, a);
  rectangle.drawPolygon(points);
  fillColor && rectangle.endFill();
  return rectangle;
};

//创建富文本
export const createRichText = (text = "", x = 0, y = 0, textStyle = {}) => {
  let opts = {
    fontFamily: textStyle.fontFamily || "Arial",
    fontSize: textStyle.fontSize || 36,
    fontStyle: textStyle.fontStyle || "italic",
    fontWeight: textStyle.fontWeight || "bold",
    fill: textStyle.fill || ["#0099ff", "#336699"], // gradient
    stroke: textStyle.stroke || "#ffffff",
    strokeThickness: textStyle.strokeThickness || 3,
    dropShadow:
      textStyle.dropShadow !== undefined ? textStyle.dropShadow : true,
    dropShadowColor: textStyle.dropShadowColor || "#0099ff",
    dropShadowBlur: textStyle.dropShadowBlur || 2,
    dropShadowAngle: textStyle.dropShadowAngle || Math.PI / 6,
    dropShadowDistance: textStyle.dropShadowDistance || 16,
    wordWrap: textStyle.wordWrap !== undefined ? textStyle.wordWrap : true,
    wordWrapWidth: textStyle.wordWrapWidth || 1920,
    lineJoin: textStyle.lineJoin || "round",
  };
  textStyle.wordWrapWidth && (opts.wordWrapWidth = textStyle.wordWrapWidth);

  let style = new PIXI.TextStyle(opts);
  let richText = new PIXI.Text(text, style);
  richText.x = x;
  richText.y = y;
  return richText;
};

//创建描边效果
export const createOutlineFilter = (
  thickness = 1,
  color = 0x99ff99,
  quality
) => {
  let outlineFilter = new OutlineFilter(thickness, color);
  return outlineFilter;
};
