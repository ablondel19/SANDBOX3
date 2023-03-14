import { ActionIcon, Avatar, Button, Group, ScrollArea, Text } from "@mantine/core";
import { getHotkeyHandler, useScrollIntoView } from "@mantine/hooks";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { MoodHappy, Send } from "tabler-icons-react";
import ChatBox from "./chatBox";
import { useLazyQuery, useQuery, useSubscription } from "@apollo/client";
import { GET_MESSAGES, MESSAGE_ADDED_SUBSCRIPTION } from "../query/query";
import { IoIosArrowBack } from "react-icons/io";
import { FaUserFriends } from "react-icons/fa"
import { MemberList } from "./member_list";

const ListMsg = ({ data, setShowMessages, login, avatar }: any) => {
    const [showMembers, setShowMembers] = useState(false);


    function toggleShowMembers() {
        if (showMembers)
            setShowMembers(false);
        else
            setShowMembers(true);
    }

    /* -------------------------------------------------------------------------- */
    /*                             Mutation and query                             */
    /* -------------------------------------------------------------------------- */

    const listmsg = useQuery(GET_MESSAGES, {
        variables: {
            uuid: data.uuid
        }
    });


    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }



    const [messages, setMessages] = useState([]);

    // Use the subscription to add new messages to the message list
    useSubscription(MESSAGE_ADDED_SUBSCRIPTION, {
        variables: { chatId: data.uuid },
        onSubscriptionData: ({ subscriptionData }) => {
            const newMessage = subscriptionData.data.messageAdded;
            setMessages([...messages, newMessage]);
            scrollToBottom();
        }
    });

    useEffect(() => {
        if (listmsg.data) {
            setMessages(listmsg.data.getMessages);
            scrollToBottom();
        }
    }, [listmsg]);

    return (
        <>
            <div className="">
                <div className="top-bar">
                    <ActionIcon onClick={() => setShowMessages(false)}>
                        <IoIosArrowBack />
                    </ActionIcon>
                    <h4 className="title">{data.name}</h4>
                    <ActionIcon onClick={() => toggleShowMembers()}>
                        <FaUserFriends />
                    </ActionIcon>
                </div>


                {
                    showMembers ?
                        <MemberList data={data} avatar={avatar} login={login}></MemberList>
                        :
                        <>
                            {

                                listmsg.data && listmsg.data.getMessages[0] ?
                                    <>
                                        <ScrollArea style={{ height: 450 }} scrollbarSize={0}>

                                            {
                                                listmsg.data && listmsg.data.getMessages.map((elem: { message: string, userID: string, createdAt: Date }) => {
                                                    {
                                                        return (
                                                            <div className="message">
                                                                {
                                                                    elem.userID === login ?
                                                                        <>
                                                                            <Avatar size={40} color="blue" src={`data:image/jpeg;base64,${avatar}`}></Avatar>
                                                                            <div className="text">
                                                                                <p>{elem.message}</p>
                                                                            </div>

                                                                        </>

                                                                        :

                                                                        <>
                                                                            <div className="text">
                                                                                <p>{elem.message}</p>
                                                                            </div>
                                                                            <Avatar size={40} color="blue" src={`data:image/jpeg;base64,${avatar}`}></Avatar>

                                                                        </>

                                                                }
                                                            </div>
                                                        )
                                                    }
                                                })
                                            }
                                            <div ref={messagesEndRef} />
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
                            <ChatBox uuid={data.uuid} refetch={listmsg.refetch} login={login}></ChatBox>

                        </>


                }
            </div>
        </>
    );
};

export default ListMsg;