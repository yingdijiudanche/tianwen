const request = require('./request');
const readline = require('readline');
const os = require('os');
const readlineInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const DeployType = ['server', 'web', 'all'];
// new function that promises to ask a question and
// resolve to its answer
function ask(questionText) {
  return new Promise((resolve, reject) => {
    readlineInterface.question(questionText, input => resolve(input));
  });
}
async function deploy() {
  var deployMessage;
  var type;
  //console.log('\x1b[36m', 'Deploy-------------------------Config', '\x1b[0m');
  while (true) {
    type = await ask(
      '\nPlease enter number to deploy:\n' +
        DeployType.map((item, index) => `[${index}] ${item}`).join('\n') +
        '\nNumber:'
    );
    var isRigthInput;
    type === '0' || type === '1' || type === '2' ? (isRigthInput = true) : (isRigthInput = false);
    if (isRigthInput) break;
    //console.log('\x1b[31m', 'Please enter the number that matches', '\x1b[0m');
  }
  deployMessage = await ask('Deploy Message:');
  await deploy_api(DeployType[type], deployMessage);
  process.exit();
}
async function deploy_api(type, deployMessage) {
  var projectName = 'GreenFacility';
  //console.log('\x1b[36m', `Deploy ProjectName:${projectName}`, '\x1b[0m');
  //console.log('\x1b[36m', `Deploy Type:${type}`, '\x1b[0m');
  //console.log('\x1b[36m', `Deploy Message:${deployMessage}`, '\x1b[0m');
  //console.log('\x1b[36m', 'Start Deploy Please wait---------------\n', '\x1b[0m');
  let res = await request.post('/back/deploy/deployByType', {
    projectName: projectName,
    deployMsg: deployMessage,
    hostName: os.hostname(),
    type: type,
  });
  if (res.code != 0) {
    console.log('\x1b[31m', `res.code::${res.code}`, '\x1b[0m');
    console.log('\x1b[31m', `res.msg::${res.msg}`, '\x1b[0m');
  } else {
    console.log('res.code:', res.code);
    console.log('res.msg:', res.msg);
  }
  console.log('res.data:', res.data);
}
deploy();
