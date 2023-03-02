import { gql } from '@apollo/client';

export const GET_CHATS = gql`
query GetChats($userID: String) {
  aliveChats(userID: $userID) {
    uuid
    name
    type
    ownerID
    userID
  }
}
`;
export const UPDATE_CHAT = gql`
mutation	UpdateChat($newinfo : UpdateChatInput!) {
  updateChat(updateChatInput: $newinfo) {
    uuid
  }
}
`;
export const CREATE_CHAT = gql`
mutation CreateChat($newChat: AddChatInput!) {
    addChat(addChatInput: $newChat) {
      uuid
      name
      type
      ownerID
      userID
    }
  }
`;
export const ADD_MESSAGE = gql`
mutation AddMessages($newMessage: AddMessageInput!) {
  addMessage(addMessageInput: $newMessage) {
    userID
    chatUUID
  }
}
`;
export const REMOVE_CHAT = gql`
mutation	RemoveChat($uuid : String!) {
  removeChat(uuid: $uuid) {
    uuid
  }
}
`;
export const GET_MESSAGES = gql`
  query GetMessages($uuid: String!) {
    getMessages(uuid: $uuid) {
      message
      userID
      createdAt
    }
  }
`;
export const CHECK_PASSWORD = gql`
query checkPassword($uuid : String!, $pass: String!) {
  checkChatPassword(uuid: $uuid, password: $pass)
}
`;
export const MUTE = gql`
mutation ToggleMute($uuid : String!, $userID: String!) {
  toggleMute(uuid: $uuid, userID: $userID) {
    muteID
  }
}
`;
export const KICK = gql`
mutation ForcedOut($uuid : String!, $userID: String!) {
  forcedOut(uuid: $uuid, userID: $userID) {
    userID
  }
}
`;
export const ADMIN = gql`
mutation ToggleAdmin($uuid : String!, $userID: String!) {
  toggleAdmin(uuid: $uuid, userID: $userID) {
    adminID
  }
}
`;

export const CHATLOG_SUBSCRIPTION = gql`
  subscription onChatLogAdded($uuid: String!) {
    chatLogAdded(uuid: $uuid) {
      index
      userID
      message
      type
      createdAt
    }
  }
`;