import { ActionIcon, Avatar, Button, Divider, Group, ScrollArea, Stack, TextInput, Text, Popover, Space, Loader } from "@mantine/core";
import { getHotkeyHandler, useScrollIntoView } from "@mantine/hooks";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import ChatBox from "./box";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { CHATLOG_SUBSCRIPTION, GET_MESSAGES } from "../query/query";
import { IoIosArrowBack } from "react-icons/io";
import { FaUserFriends } from "react-icons/fa"
import { MemberList } from "./member_list";
import { BiBlock } from 'react-icons/bi';
import { IoMdClose, IoMdExit } from 'react-icons/io';
import { GrUpgrade } from "react-icons/gr";
import { MUTE, UPDATE_CHAT, KICK, ADMIN } from '../query/query';
import { AiOutlineUserAdd } from "react-icons/ai";
import { ClassNames } from "@emotion/react";
import Messages from "./messages";


const ListMsg = ({... props}) => {
    const { dataChat, setShowMessages, login, avatar} = props;
    const [showMembers, setShowMembers] = useState(false);

    
    /* -------------------------------------------------------------------------- */
    /*                             Mutation and query                             */
    /* -------------------------------------------------------------------------- */
    
    
    const { loading, error, data, subscribeToMore, refetch } = useQuery(GET_MESSAGES, {
        variables: {
            uuid: dataChat.uuid,
        },
        fetchPolicy: 'network-only',
    });
    
    // ─────────────────────────────────────────────────────────────────────────────

    function toggleShowMembers() {
        if (showMembers)
            setShowMembers(false);
        else
            setShowMembers(true);
    }





    //   useEffect(() => {
    //     const unsubscribe = subscribeToNewMessage({
    //       document: CHATLOG_SUBSCRIPTION,
    //     });
    //     return () => {
    //       unsubscribe();
    //     };
    //   }, [subscribeToNewMessage]);
      
    //   if (listmsg.loading) {
    //     return <>Loading...</>;
    //   }
    //   if (listmsg.error) {
    //     return <>ERROR</>;
    //   }


    // ─────────────────────────────────────────────────────────────────────

    
    const scrollRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [data]);


    if(loading) return <Loader></Loader>;
    if(error) return <p className="error">Error : {error.message}</p>;


    const chatMsg = data.getMessages.map((item) => {
        const createdDate = new Date(item.createdAt);
        const hour = createdDate.getHours();
        const min = createdDate.getMinutes() < 10 ? '0' + createdDate.getMinutes() : createdDate.getMinutes();
        const messageCreatedTime = `${hour}:${min}`;
        return {
          ...item,
          createdAt: messageCreatedTime,
        };
      });



    const subscribeToNewMessage = () => {
        return subscribeToMore({
          document: CHATLOG_SUBSCRIPTION,
          variables: { uuid: data.uuid },
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) {
              return prev;
            }
            const newFeedItem = subscriptionData.data.chatMsgAdded;
            const res = Object.assign({}, prev, {
              chat: {
                chatMsg: [...prev.chat.chatMsg, newFeedItem],
              },
            });
            return res;
          },
        });
      };

    //   useEffect(() => {
    //     const unsubscribe = subscribeToNewMessage();
    //     return () => {
    //       unsubscribe();
    //     };
    //   }, [subscribeToNewMessage]);
    //   if (loading) {
    //     return <>Loading...</>;
    //   }
    //   if (error) {
    //     return <>ERROR</>;
    //   }


    return (
        <>
            <div>
                <div>
                    <Group>
                        <ActionIcon onClick={() => setShowMessages(false)}>
                            <IoIosArrowBack>
                            </IoIosArrowBack>
                        </ActionIcon>
                        <Space w="xl" />
                        <h4>{dataChat.name}</h4>
                        <Space w="xl" />
                        <ActionIcon
                            onClick={() => toggleShowMembers()}
                        >
                            <AiOutlineUserAdd>
                            </AiOutlineUserAdd>
                        </ActionIcon>
                    </Group>
                    <Divider style={{marginBottom: "10px"}}></Divider>
                </div>

                {
                    showMembers ?
                        <MemberList subscribeToNewMessage={subscribeToNewMessage} data={dataChat} avatar={avatar}></MemberList>

                        :
                        
                        <>
                        {
                            chatMsg && chatMsg[0] ?
                                <>
                                    <ScrollArea style={{ height: 480 }} scrollbarSize={0}>
                                        <Messages
                                            chatMsg={chatMsg}
                                            subscribeToNewMessage={subscribeToNewMessage}
                                            login={login}
                                            avatar={avatar}
                                        ></Messages>
                                        <div ref={scrollRef} />
                                    </ScrollArea>
                                </>

                                :
                                <>
                                    <Text
                                        c="dimmed"
                                        size={15}
                                    >No messages have been send.</Text>
                                </>
                            }
                            <ChatBox uuid={dataChat.uuid} refetch={refetch} login={login}></ChatBox>
                        </>
                }
            </div>
        </>
    );
};

export default ListMsg;