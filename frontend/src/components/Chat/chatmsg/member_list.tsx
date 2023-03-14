

import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { useQuery } from '@apollo/react-hooks';
import { Alert, Avatar, Divider, Group, UnstyledButton, Text, ScrollArea, ActionIcon, Button, TextInput, Loader, Navbar, Card, Popover } from "@mantine/core";
import { useState, useEffect } from 'react';
import { AiFillSetting, AiOutlineAudioMuted, AiOutlineDelete, AiOutlineSetting } from 'react-icons/ai';
import { GrUpgrade } from 'react-icons/gr';
import { ImBlocked } from 'react-icons/im';
import { IoMdClose, IoMdExit } from 'react-icons/io';
import { BiBlock } from 'react-icons/bi';
import { RiVipCrownFill } from 'react-icons/ri';
import Popup from 'reactjs-popup';
import { MUTE, UPDATE_CHAT, KICK, ADMIN, ADDTOCHAT, GET_USERS } from '../query/query';
import axios from 'axios';


export const MemberList = ({ data, login }: any) => {
    const [usersInfo, setUsersInfo] = useState([]);

    useQuery(GET_USERS, {
        onCompleted: async (data) => {
            const users = data.user;
            const usersInfo = [];

            for (let i = 0; i < users.length; i++) {
                const user = users[i];
                const userInfo = {
                    login: user.login,
                    avatar: null,
                };

                try {
                    const response = await axios.get(`http://localhost:3001/app/users/avatar/${user.login}`);
                    userInfo.avatar = response.data.avatar;
                } catch (error) {
                    console.log(error);
                }

                usersInfo.push(userInfo);
            }

            setUsersInfo(usersInfo);
        },
    });


    const [mute] = useMutation(MUTE, {
        onCompleted: () => {
            // chat_list.refetch()
        },
    });


    const [promote] = useMutation(ADMIN, {
        onCompleted: () => {
            // chat_list.refetch()
        },
    });

    return (
        <>
            <ScrollArea style={{ height: 450 }} scrollbarSize={8}>

                {
                    usersInfo.map((userInfo) => {
                        return (
                                <Group style={{ padding: "5px" }}>
                                    <Popover position="bottom" withArrow shadow="md">
                                        <Popover.Target>
                                            <Group>
                                                <Avatar src={`data:image/jpeg;base64,${userInfo.avatar}`}></Avatar>
                                                <Text>{userInfo.login}</Text>
                                                {
                                                    userInfo.login === data.ownerID &&
                                                    <RiVipCrownFill color='orange'></RiVipCrownFill>

                                                    
                                                }
                                                {
                                                    data.adminID.includes(userInfo.login) &&
                                                    <RiVipCrownFill color='orange'></RiVipCrownFill>

                                                    
                                                }
                                            </Group>
                                        </Popover.Target>

                                            {
                                                userInfo.login !== data.ownerID &&
                                                    <Popover.Dropdown>
                                                            <div>
                                                                <Group>
                                                                    <ActionIcon
                                                                        onClick={() => promote({
                                                                            variables: {
                                                                                uuid: data.uuid,
                                                                                userID: userInfo.login,
                                                                            }
                                                                        })}
                                                                    ><GrUpgrade size={20} color="blue"></GrUpgrade></ActionIcon>
                                                                    <Text>Promote</Text>
                                                                </Group>
                                                                <Group>

                                                                <ActionIcon
                                                                    onClick={() => mute({
                                                                        variables: {
                                                                            uuid: data.uuid,
                                                                            userID: userInfo.login,
                                                                        }
                                                                    })}
                                                                ><BiBlock size={20} color="red"></BiBlock></ActionIcon>
                                                                    <Text>Block</Text>
                                                                </Group>
                                                            </div>
                                                    </Popover.Dropdown>
                                            }


                                    </Popover>

                                </Group>
                        )
                    })
                }
            </ScrollArea>
        </>
    )
}