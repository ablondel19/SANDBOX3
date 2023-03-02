import { ActionIcon, Box, Card, CloseButton, Switch, Text } from '@mantine/core';
import { CreateChat } from "./createChat"
import { ListChat } from './listChat';
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_CHATS } from "./query/query";
import { AskPassword } from "./askPassword";
import { MoodHappy, Send } from "tabler-icons-react";
import { Fade, FormControlLabel, Modal } from "@mui/material";
import Popup from "reactjs-popup";
import axios from 'axios';
import { Spinner } from 'flowbite-react';


export const Chat = () => {
    const [showCreateChat, setShowCreateChat] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [errors, setErrors] = useState();
    const [avatar, setAvatar] = useState<string>();
    const [login, setLogin] = useState<string>();


    useEffect(() => {
        const fetchAvatar = async () => {
            await axios
                .get(
                    `http://localhost:3001/app/users/profile/${sessionStorage.getItem('currentUser')}`,
                )
                .then((res) => {
                    setAvatar(res.data.avatar);
                    setLogin(res.data.login);
                })
                .catch((err) => {
                    console.error(err.response.data);
                    setErrors(err.response.data);
                });
        };

        if (!avatar) {
            fetchAvatar();
        }
    }, []);


    function toggleShowChat() {
        if (showChat)
            setShowChat(false);
        else
            setShowChat(true)
    }

    function toggleShowCreate() {
        if (showCreateChat)
            setShowCreateChat(false);
        else
            setShowCreateChat(true)
    }


    const chat_list = useQuery(GET_CHATS, {
        variables: { userID: login },
        nextFetchPolicy: 'network-only',
    });



    // ─────────────────────────────────────────────────────────────────────
    // effects

    useEffect(() => {
        if (chat_list.loading || chat_list.error) return;
        if (chat_list.data !== undefined && chat_list.data.aliveChats.lenght === 0) {
            chat_list.refetch({});
        }
    }, [chat_list.data, chat_list.loading, chat_list.error, chat_list.refetch, toggleShowChat])


    if(chat_list.loading) return <Spinner></Spinner>
    if(chat_list.error) return <p className='error'>Error : {chat_list.error.message}</p>
    return (
        <>
            {
                showChat ?
                    <Fade in={showChat}>
                        <Card
                            withBorder
                            sx={(theme) => ({
                                width: 300,
                                height: 600,
                                backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                                borderRadius: 10,
                                position: "absolute",
                                bottom: 40,
                                right: 40,
                                zIndex: 100,
                            })}
                        >
                            <CloseButton
                                size={20}
                                onClick={() => toggleShowChat()}
                                style={{
                                    top: 25,
                                    right: 25,
                                    position: 'absolute'
                                }} />

                            <div>



                                <Popup
                                    open={showCreateChat}
                                    onClose={() => setShowCreateChat(false)}
                                    position="top center"
                                    nested
                                    modal
                                >
                                    <CreateChat toggleShowCreate={toggleShowCreate} chat_list={chat_list} login={login}></CreateChat>
                                </Popup>

                                <ListChat toggleShowCreate={toggleShowCreate} chat_list={chat_list} login={login} avatar={avatar}><AskPassword></AskPassword></ListChat>
                            </div>

                        </Card>
                    </Fade>

                    :

                    <ActionIcon
                        onClick={() => toggleShowChat()}
                        style={{
                            height: 80,
                            width: 80,
                            position: "absolute",
                            alignItems: "center",
                            bottom: 40,
                            right: 40,
                            zIndex: 100,
                        }} color="teal" radius="xl" variant="filled">
                        <Send size={30} />
                    </ActionIcon>
            }
        </>
    )
}
