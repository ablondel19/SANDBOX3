import { ApolloClient, InMemoryCache, split, makeVar } from '@apollo/client';
// import { getMainDefinition } from '@apollo/client/utilities';
// import { WebSocketLink } from '@apollo/client/link/ws';
// import { GRAPHQL_URL, SUBSCRIPTION_URL } from '../utils/constants';
// // import { getCookies, bearerAuthorization } from '../utils/test';
// import { createUploadLink } from 'apollo-upload-client';



// const getCookies = (key: string) => {
//   const cookie = document.cookie.split(';').filter((x) => x.trim().split('=')[0] === key)[0];
//   if (!cookie) {
//     return '';
//   }
//   return cookie.split('=')[1];
// };

// const bearerAuthorization = (token: string) => {
//   return token ? `bearer ${token}` : '';
// };

// const httpLink = createUploadLink({
//   uri: GRAPHQL_URL,
//   headers: {
//     authorization: bearerAuthorization(getCookies('access_token')),
//     'keep-alive': 'true',
//   },
// });

// const wsLink = new WebSocketLink({
//   uri: SUBSCRIPTION_URL,
//   options: {
//     reconnect: true,
//     connectionParams: {
//       authorization: bearerAuthorization(getCookies('access_token')),
//     },
//   },
// });

// const splitLink = split(
//   ({ query }) => {
//     const definition = getMainDefinition(query);
//     return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
//   },
//   wsLink,
//   httpLink,
// );

// export const currentChatVar = makeVar('');
// export const currentLoginIDVar = makeVar('');

// export const client = new ApolloClient({
//   link: splitLink,
//   cache: new InMemoryCache({
//     typePolicies: {
//       Query: {
//         fields: {
//           aliveChats: {
//             merge(existing = [], incoming) {
//               return [...incoming];
//             },
//           },
//           chat: {
//             merge(existing, incoming) {
//               const res = {};
//               if (existing !== undefined) {
//                 Object.assign(res, existing);
//               }
//               if (incoming !== undefined) {
//                 Object.assign(res, incoming);
//               }
//               return res;
//             },
//           },
//         },
//       },
//     },
//   }),
// });

export const client = new ApolloClient({
    uri : 'http://localhost:3001/graphql',
    cache: new InMemoryCache(),
  })

