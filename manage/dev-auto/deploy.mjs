import axios from "axios";
import { cd, $, chalk } from "zx";
import { echo } from "zx/experimental";
import mySvnAuth from "./.my-svn.mjs";

/**
 * 使用前提
 * 0. 在 @see {@link mySvnAuth } 输入个人的 svn 账号密码
 *
 * 1.package.json添加script
 *  假如項目在服务器上的路径 是 c:/svn/PPMS/build
 *  "deploy": "node ./dev-auto/deploy.mjs -p '/PPMS/build'",
 *
 * 2. 根据自己的情况(系统，路径)，修改 执行脚本 @see {@link startDeploy}
 *
 *
 */

// 使用方式 可用 yarn 或者 npm run
// yarn deploy -m 'some change'

main()
  .then(() => {
    console.log(chalk.green("web deployed!"));
  })
  .catch((e) => {
    console.log(chalk.red(String(e)));
  });

async function main() {
  const [, , ...args] = process.argv;

  const { flags, params } = parseOptionalArguments(args);
  if (flags.h || "h" in params) {
    showHelp();
    return;
  }
  if (!params.m) {
    throw "Please add commit message.\n eg: pnpm deploy  -m 'some thing change'";
  }
  await startDeploy(params);
}

async function startDeploy(params) {
  // await $`pnpm build`;
  // copy files to server by windows cmd

  await $`xcopy  .\\dist ..\\server\\build /E /Y`;
  cd("../server");
  await $`svn cleanup`;
  await addNewFiles();
  await $`svn ci -m ${params.m}`;
  console.log(chalk.green("svn ci success!"));
  await notifyServer(params);
}

async function addNewFiles() {
  //https://www.jkurlandski.com/jkurlandskiWebsite/Index/Professional/Misc/svnCommands.html
  const output = await $`svn st`;
  const newFiles = output.stdout
    .split("\n")
    .slice(0, -1)
    .filter((v) => /^\?/.test(v))
    .map((v) => v.replace(/.\s+/, ""));
  await Promise.all(newFiles.map((v) => $`svn add ${v}`));
}

/**
 * @param {Params} params
 */
async function notifyServer(params) {
  /**@type {Paload} */
  const data = {
    projectRelativePath: params.p,
    svnAuth: mySvnAuth,
  };
  // const res = await axios.get(`http://${ip}:4396/api/healthy`)
  const res = await axios
    .post(`http://172.16.0.252:4396/api/deploy`, data)
    .then((r) => r.data);
  if (res.code) {
    throw res.msg;
  }
}

function showHelp() {
  echo`
     Acceptable input:
      -p        project relative path on server. eg: -p '/PPMS/build'
      -m        commit message. eg: -m 'some thing changed'
    `;
}

/**
 * @param {string[]} args
 * @returns {{flags:Flags,params:Params}}
 */
function parseOptionalArguments(args) {
  const { isFlags, cutFlagSymbol, isParams, cutParamsSymbol } =
    prepareToolFns();
  const flags = {};
  const params = {};
  for (let i = 0; i < args.length; i++) {
    const str = args[i];
    if (isFlags(str)) {
      flags[cutFlagSymbol(str)] = true;
      continue;
    }
    if (isParams(str)) {
      params[cutParamsSymbol(str)] = args[i + 1];
      i += 1;
      continue;
    }
    console.log(chalk.yellow(`Not recognized input: ${str}`));
  }
  return { flags, params };
}

function prepareToolFns() {
  /**
   * @param {RegExp} reg
   * @returns {(str:string)=>boolean}
   */
  const isMatch = (reg) => (str) => reg.test(str);
  /**
   * @param {number} begin
   * @returns {(str:string)=>str}
   */
  const cutStart = (begin) => (str) => str.slice(begin);
  const isFlags = isMatch(/^--\w+/);
  const isParams = isMatch(/^-\w+/);
  const cutFlagSymbol = cutStart(2);
  const cutParamsSymbol = cutStart(1);
  return { isFlags, cutFlagSymbol, isParams, cutParamsSymbol };
}

/**
 * @typedef {object} Paload
 * @property {string} projectRelativePath
 * @property {SvnAuth} svnAuth
 *
 * @typedef {object} SvnAuth
 * @property {string} username
 * @property {string} password
 *
 */

/**
 * 输入方式 单横线+空格+值\
 * 如 ```-m 'some change' ```\
 * -h 不需要值，唯一功能现实帮助信息
 * @typedef {object} Params
 * @property {string} m commit message
 * @property {string} p project relative path
 * @property {string} wf local web folder
 */
