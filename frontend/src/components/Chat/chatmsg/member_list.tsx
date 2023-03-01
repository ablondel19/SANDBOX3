

import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { useQuery } from '@apollo/react-hooks';
import { Alert, Avatar, Divider, Group, UnstyledButton, Text, ScrollArea, ActionIcon, Button, TextInput, Loader, Navbar, Card } from "@mantine/core";
import { useState, useEffect } from 'react';
import { AiFillSetting, AiOutlineAudioMuted, AiOutlineDelete, AiOutlineSetting } from 'react-icons/ai';
import { GrUpgrade } from 'react-icons/gr';
import { ImBlocked } from 'react-icons/im';
import { IoMdClose, IoMdExit } from 'react-icons/io';
import { BiBlock } from 'react-icons/bi';
import Popup from 'reactjs-popup';
import { MUTE, UPDATE_CHAT, KICK, ADMIN, ADDTOCHAT } from '../query/query';


export const MemberList = ({ data, avatar }: any) => {
    const [showAddUser, setShowAddUser] = useState(false);
    const [input, setInput] = useState('');


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

    const [add] = useMutation(ADDTOCHAT, {
        onCompleted: () => {
            // chat_list.refetch()
        },
    });

    return (
        <>
            <Popup
                open={showAddUser}
                onClose={() => setShowAddUser(false)}
                position="top center"
                nested
                modal
            >
                <Card
                    withBorder
                    sx={{
                        borderRadius: 15,
                    }}
                    style={{
                        padding: 15,
                        position: 'absolute',
                        height: 120,
                        width: 250,
                    }}
                >
                    <form>
                        <ActionIcon
                            onClick={() => setShowAddUser(false)}
                            style={{
                                position: 'absolute',
                                top: 5,
                                right: 5,
                            }}
                        ><IoMdClose size={15}></IoMdClose>
                        </ActionIcon>

                        <TextInput
                            label="Password :"
                            placeholder="your password.."
                            onChange={e => setInput(e.target.value)}
                        >

                        </TextInput>

                        <Button onClick={() => add({
                            variables: {
                                uuid: data.uuid,
                                userID: input,
                            }
                        })}

                        >Confirm</Button>
                    </form>

                </Card>
            </Popup>
            <ScrollArea style={{ height: 450 }} scrollbarSize={8}>

                {
                    data.userID && data.userID.map((elem: string) => {
                        return (
                            <div style={{ padding: "5px" }}>
                                <Group>
                                    <Avatar src={`data:image/jpeg;base64,${avatar}`}></Avatar>
                                    <Text>{elem}</Text>
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
                            </div>
                        )
                    })
                }

            </ScrollArea>
            <Button
                style={{
                    bottom: 25,
                    left: 15,
                    position: 'absolute',

                }}
                onClick={() => {
                    setShowAddUser(true);
                }}
                radius="lg">
                Add User
            </Button>
        </>
    )
}