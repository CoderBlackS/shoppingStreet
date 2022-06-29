import axios from 'axios'
import nprogress from 'nprogress';
import  "nprogress/nprogress.css";
// export function request(options){
//   return new Promise((resolve, reject)=>{
//   //  1、创建axios的实例对象
//     const instance = axios.create({
//       baseURL:'http://152.136.185.210:7878/api/hy66',
//       timeout:5000
//     })
//
//     //过滤器
//     instance.interceptors.response.use(res=>{
//       return res.data
//     })
//
//   //  通过实例发送网络请求
//      instance(options).then(res=>{
//        resolve(res)
//      }).catch(err=>{
//        reject(err)
//      })
//   })
// }

// 封装第二种写法
// export function requeste(options,success,failing){
//   const instance = axios.create({
//     baseURL:'http://152.136.185.210:7878/api/hy66',
//     timeout:5000
//   })
//
//   instance(options).then(res=>{
//     success(res);
//   }).catch(
//     err=>{
//       failing(err)
//     })
// }

/*
封装第三种写法 return这个实例返回的就是promise然后我调用这个函数传入url可能直接执行.then
 */
 // new Promise((resolve,reject)=>{
 //   //请求
 //   resolve(1);
 // }).then(res=>{
 //   console.log(res);
 //   return Promise.resolve(2)
 // }).then(res=>{
 //   console.log(res);
 // })

export function request(options){
    //  1、创建axios的实例对象
    const instance = axios.create({
      baseURL:'http://152.136.185.210:7878/api/hy66',
      timeout:5000
    })
  //请求拦截器：在发送请求之前，请求拦截器可以检测迟到，在发送请求之前做一些事
    instance.interceptors.request.use(config=>{
      nprogress.start();
      return config;
    })
    //过滤器
    instance.interceptors.response.use(res=>{
      nprogress.done();
      return res.data
    })


    //  通过实例发送网络请求
    return instance(options);
}

