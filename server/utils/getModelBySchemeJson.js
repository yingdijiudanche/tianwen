//get vehicle.json file then parse it
const fs = require('fs');
const { parse } = require('path');
// const fileName = 'mongooseScheme/vehicleEditHistory.json';
// const fileName = 'mongooseScheme/vehicleMaintenance.json';
// const fileName = 'mongooseScheme/vehicleType.json';
// const fileName = 'mongooseScheme/dep.json';
// const fileName = './mongooseScheme/vehicle.json';
const fileName = './mongooseScheme/contractingBusinessDept.json';

parseJson = fileName => {
  let json = fs.readFileSync(fileName, 'utf8');
  let jsonObj = JSON.parse(json);
  return jsonObj;
};

getFileName = file => {
  let fileName = file.split('.')[0];
  //首字母大写
  fileName = fileName.replace(/\b\w+\b/g, function (word) {
    return word.substring(0, 1).toUpperCase() + word.substring(1);
  });
  return fileName;
};
const modelName = getFileName(fileName);
const json = parseJson(fileName, './');
var jsonField = json.fields;
// console.log(jsonField[0]);
var jsonFields = [];
//jsonFields  format:
// name: '_id',
// path: '_id',
// count: 1000,
// types: [
//     {
//       name: 'ObjectID',
//       bsonType: 'ObjectID',
//       path: '_id',
//       count: 1000,
//       values: [Array],
//       total_count: 0,
//       probability: 1,
//       unique: 1000,
//       has_duplicates: false
//     }
//   ],
//   total_count: 1000,
//   type: 'ObjectID',
//   has_duplicates: false,
//   probability: 1
var jsonFields = {};
jsonField.forEach(item => {
  let type = item.type;
  let name = item.name;
  if (name == '_id') return;
  console.log(type);
  if (type == 'ObjectID') {
    type = 'Schema.Types.ObjectId,required: true';
  }
  //check if type is array
  if (type && Array.isArray(type)) {
    type.forEach(item => {
      if (item == 'Null') return;
      type = item;
    });
  }
  if (type == 'Int32' || type == 'Int64' || type == 'Int16' || type == 'Int8' || type == 'Int') {
    type = 'Number';
  }
  if (type == 'Decimal128') {
    type = 'Number';
  }
  jsonFields[name] = `{type: ${type} }`;
});

jsonFields = JSON.stringify(jsonFields);
//remove jsonFields:"
jsonFields = jsonFields.replace(/"/g, '');
console.log(jsonFields);
