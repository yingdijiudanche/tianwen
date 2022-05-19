import { echo } from "zx/experimental";
import { $, chalk, fs, cd, fetch } from "zx";
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

main()
  .then((e) => {
    console.log(chalk.green("deployed!"));
  })
  .catch((e) => {
    console.log(chalk.red(String(e)));
  });

async function main() {
  const [, , , ...args] = process.argv;
  const { params, flags } = parseOptionalArguments(args);
  if ("h" in params) {
    showHelp();
    return;
  }
  startDeploy(flags, params);
}

function showHelp() {
  echo`
     Acceptable input:
      -p        project relative path on server. eg: -p '/PPMS/build'
      -m        commit message. eg: -m 'some thing changed'
      --web     build and deploy web too. eg: --web
    `;
}

/**
 *
 * @param {Flags} flags
 * @param {Params} params
 */
async function startDeploy(flags, params) {
  if (!params.m) {
    throw chalk.red('Please add commit message eg: -m "bug fix"');
  }
  await $`pnpm build`;
  // await $`cp -r ./env ../build`
  // await handleDependence()
  if (flags.web) {
    cd("../web");
    await $`pnpm build`;
    //xcopy
    await $`xcopy ./dist/ ../build /s /e /y`;
  }
  cd("../build");
  await $`svn cleanup`;
  await addNewFiles();
  await $`svn ci -m ${params.m}`;
  await notifyServer(params);
}

async function notifyServer(params) {
  /**@type {Paload} */
  const payload = {
    projectRelativePath: params.p,
    svnAuth: mySvnAuth,
  };
  // const relativeUri = await getUri()
  // const res = await fetch(`http://${ip}:4396/api/healthy`)
  const res = await postData(`http://${ip}:4396/api/deploy`, payload);
  console.log(res);
  if (res.code) {
    throw chalk.red(res.msg);
  }
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

async function handleDependence() {
  const content = await fs.readFile("./package.json");
  const json = JSON.parse(content.toString());
  const { devDependencies, scripts, ...rest } = json;
  await fs.writeFile("../build/package.json", JSON.stringify(rest, null, 2));
}

/**
 * @param {string} url
 * @param {object<string,any>} data
 * @see [https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch]
 */
async function postData(url = "", data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
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
 * @property {string} h view help
 */

/**
 *
 * @typedef {object} Flags 输入方式 双横线前缀 如：``` --web ```
 * @property {boolean} [web] 连同web 一起打包
 */
