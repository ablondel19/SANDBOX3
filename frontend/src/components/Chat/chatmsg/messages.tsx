import { ActionIcon, Avatar, Button, Divider, Group, ScrollArea, Stack, TextInput, Text, Popover, Space, Loader } from "@mantine/core";
import { getHotkeyHandler, useScrollIntoView } from "@mantine/hooks";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { MoodHappy, Send, Separator } from "tabler-icons-react";
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


const Messages = ({ ...props }) => {
    const { chatMsg, subscribeToNewMessage, login, avatar } = props;


    /* -------------------------------------------------------------------------- */
    /*                             Mutation and query                             */
    /* -------------------------------------------------------------------------- */



    // ─────────────────────────────────────────────────────────────────────────────



    useEffect(() => {
        const unsubscribe = subscribeToNewMessage({
          document: CHATLOG_SUBSCRIPTION,
        });
        return () => {
          unsubscribe();
        };
      }, [subscribeToNewMessage]);
    //   if (loading) {
    //     return <>Loading...</>;
    //   }
    //   if (error) {
    //     return <>ERROR</>;
    //   }

    return (
        <>
            {
                chatMsg && chatMsg.map((elem: { message: string, userID: string, createdAt: Date }) => {
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
                                                <p className="font-bold italic">{elem.userID}</p>
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

        </>
    );
};

export default Messages;