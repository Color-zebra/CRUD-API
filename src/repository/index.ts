// import { DB, User } from '../DB/index';
// import cluster from 'cluster';

// export enum Operations {
//   CREATE = 'create',
//   READ = 'read',
//   UPDATE = 'update',
//   DELETE = 'delete',
// }

// export class Repository {
//   async [Operations.CREATE](user: User) {
//     if (cluster.isPrimary) {
//       console.log('=====================create primary====================');
//       DB.push(user);
//       return user;
//     }

//     if (cluster.isWorker && process.send) {
//       return new Promise((res) => {
//         console.log('=====================create children====================');
//         process.send({ cmd: Operations.CREATE, payload: user }, () => {
//           process.on('message', (msg: User) => {
//             process.removeAllListeners();
//             console.log('response msg', msg);
//             res(msg);
//           });
//         });
//       });
//     }
//   }

//   async [Operations.READ](id?: string | undefined) {
//     if (cluster.isPrimary) {
//       console.log('=====================read primary========================');

//       const res = id ? DB.find((user) => user.id === id) : DB;
//       return res;
//     }

//     // if (cluster.isWorker && process.send) {
//     //   console.log('=====================read children========================');
//     //   return new Promise((res) => {
//     //     process.send({ cmd: Operations.READ, payload: id }, () => {
//     //       process.on('message', (msg: User | User[]) => {
//     //         console.log('response msg', msg);
//     //         process.removeAllListeners();
//     //         res(msg);
//     //         return msg;
//     //       });
//     //     });
//     //   });
//     // }
//   }
// }
