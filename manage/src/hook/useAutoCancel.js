import Axios from 'axios';
import { useEffect, useRef } from 'react';

const CancelMsg = 'canceled';
const isCanceled = msg => msg === CancelMsg;
/**
 * 创建一个自动取消的请求函数
 *
 * (cancelToken,isCanceled),会通过参数传入 ```fn```
 *
 * 第三个参数开始，是你调用返回的函数时 传入的参数
 * @param {(
 * cancelToken:import('axios').CancelToken,
 * isCanceled:(msg:string)=>boolean,
 * ...args)=>Promise} fn
 */
export default function useAutoCancel(fn) {
  /**@type {import('react').MutableRefObject<import('axios').CancelTokenSource>} */
  const cancelTokenRef = useRef(null);

  useEffect(() => {
    return () => {
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel(CancelMsg);
      }
    }; // 防止快速轉頁時報錯
  }, []);

  const fetchDatas = async (...args) => {
    if (cancelTokenRef.current === null) {
      cancelTokenRef.current = Axios.CancelToken.source();
    } else {
      cancelTokenRef.current.cancel();
      cancelTokenRef.current = Axios.CancelToken.source();
    }

    return fn.call(fn, cancelTokenRef.current.token, isCanceled, ...args);
  };

  return fetchDatas;
}
