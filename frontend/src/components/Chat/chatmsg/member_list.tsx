

import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { useQuery } from '@apollo/react-hooks';
import { Alert, Avatar, Divider, Group, UnstyledButton, Text, ScrollArea, ActionIcon, Button, TextInput, Loader, Navbar, Card, Popover } from "@mantine/core";
import { useState, useEffect } from 'react';
import { AiFillSetting, AiOutlineAudioMuted, AiOutlineDelete, AiOutlineSetting } from 'react-icons/ai';
import { GrUpgrade } from 'react-icons/gr';
import { ImBlocked } from 'react-icons/im';
import { IoMdClose, IoMdExit } from 'react-icons/io';
import { BiBlock } from 'react-icons/bi';
import Popup from 'reactjs-popup';
import { MUTE, UPDATE_CHAT, KICK, ADMIN, CHATLOG_SUBSCRIPTION } from '../query/query';


export const MemberList = ({ ...props }) => {
    const { data, avatar, subscribeToNewMessage } = props;

    /* -------------------------------------------------------------------------- */
    /*                             Mutation and query                             */
    /* -------------------------------------------------------------------------- */


    const [mute] = useMutation(MUTE, {
        onCompleted: () => {
            // chat_list.refetch()
        },
    });

    const [kick] = useMutation(KICK, {
        onCompleted: () => {
            // chat_list.refetch()
        },
    });

    const [promote] = useMutation(ADMIN, {
        onCompleted: () => {
            // chat_list.refetch()
        },
    });

    useEffect(() => {
        const unsubscribe = subscribeToNewMessage({
          document: CHATLOG_SUBSCRIPTION,
        });
        return () => {
          unsubscribe();
        };
      }, [subscribeToNewMessage]);

    return (
        <>
            <ScrollArea style={{ height: 450 }} scrollbarSize={8}>

                {
                    data.userID && data.userID.map((elem: string) => {
                        return (
                            <div style={{ padding: "5px" }}>
                                <Popover position="bottom" withArrow shadow="md">
                                    <Popover.Target>
                                        <Group>
                                            <Avatar src={`data:image/jpeg;base64,${avatar}`}></Avatar>
                                            <Text>{elem}</Text>
                                        </Group>
                                    </Popover.Target>
                                    <Popover.Dropdown>
                                        <Group>
                                            <ActionIcon
                                                onClick={() => mute({
                                                    variables: {
                                                        uuid: data.uuid,
                                                        userID: elem,
                                                    }
                                                })}
                                            ><GrUpgrade size={20} color="green"></GrUpgrade></ActionIcon>
                                            <ActionIcon
                                                onClick={() => kick({
                                                    variables: {
                                                        uuid: data.uuid,
                                                        userID: elem,
                                                    }
                                                })}
                                            ><BiBlock size={20} color="red"></BiBlock></ActionIcon>
                                            <ActionIcon
                                                onClick={() => promote({
                                                    variables: {
                                                        uuid: data.uuid,
                                                        userID: elem,
                                                    }
                                                })}
                                            ><IoMdExit size={20} color="red"></IoMdExit></ActionIcon>
                                        </Group>
                                    </Popover.Dropdown>
                                </Popover>
                            </div>
                        )
                    })
                }

            </ScrollArea>

        </>
    )
}