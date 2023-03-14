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
        if(showChat)
            setShowChat(false);
        else
            setShowChat(true)
    }

    function toggleShowCreate() {
        if(showCreateChat)
            setShowCreateChat(false);
        else
            setShowCreateChat(true)
    }


    const chat_list = useQuery(GET_CHATS, {
        variables: { userID: login}
      });


      
    return (
        <>
            {
                showChat ? 
                <Fade in={showChat}>
                    <Card
                    withBorder
                        sx={(theme) => ({
                            minWidth: 300,
                            maxWidth: 500,
                            height: 600,
                            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                            borderRadius: 15,
                            position: "absolute",
                            bottom: 40,
                            right: 40,
                        })}
                    >
                        <CloseButton
                        size={20}
                        onClick={() => toggleShowChat()}
                        style={{
                            top: 25,
                            right: 25,
                            position: 'absolute'
                        }}/>

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
                }} color="teal" radius="xl" variant="filled">
                    <Send size={30} />
                </ActionIcon>
            }
            </>
    )
}
