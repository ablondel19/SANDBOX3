import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {Link} from "react-router-dom";
import React from "react";
import { FaUserAlt, FaRunning } from 'react-icons/fa'
import { GiPodium, GiRadarSweep } from 'react-icons/gi'
import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'

import axios from 'axios';
import { useEffect, useState } from 'react';


const navigation = [
  { name: 'Game', href: '/HomePage', current: true },
  { name: 'Lobby', href: '/Lobby', current: false },
  { name: 'LeaderBoard', href: '/leaderboard', current: false },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function ColorSchemesExample() {
  const [avatar, setAvatar] = useState<string>();
  const [errors, setErrors] = useState();

  useEffect(() => {
    const fetchAvatar = async () => {
      await axios
        .get(
          `http://localhost:3001/app/users/profile/${sessionStorage.getItem(
            'currentUser',
          )}`,
        )
        .then((res) => {
          setAvatar(res.data.avatar);
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



  return (
    <>
    
      {/* <Navbar bg="primary" variant="dark">
        <Container fluid>
          <Navbar.Brand as={Link} to ="/HomePage">Ping Pong :)</Navbar.Brand>
          <Nav>
              <Nav.Link as={Link} to="/Lobby"><GiRadarSweep/></Nav.Link>
              <Nav.Link as={Link} to="/leaderboard"><GiPodium/></Nav.Link>
              <Nav.Link as={Link} to="/Profile"><FaUserAlt/></Nav.Link>
              <Nav.Link as={Link} to="/"><FaRunning/></Nav.Link>
          </Nav>
        </Container>
      </Navbar> */}
      <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <a href='/HomePage'>

                    <img
                      className="block h-8 w-auto lg:hidden logo"
                      src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/11a10a01-ac23-4fea-ad5a-b51f53084159/d8opy2w-d1837851-b90d-4702-ab3b-2521d77a58f6.png/v1/fill/w_1219,h_362,strp/pong_logo_by_ringostarr39_d8opy2w-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MzYyIiwicGF0aCI6IlwvZlwvMTFhMTBhMDEtYWMyMy00ZmVhLWFkNWEtYjUxZjUzMDg0MTU5XC9kOG9weTJ3LWQxODM3ODUxLWI5MGQtNDcwMi1hYjNiLTI1MjFkNzdhNThmNi5wbmciLCJ3aWR0aCI6Ijw9MTIxOSJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.rlfRzGERmwCP7bAyTAykjN-ei1IYDQsFxUCGWKt2ulg"
                      alt="Pong"
                    />
                    <img
                      className="hidden h-8 w-auto lg:block logo"
                      src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/11a10a01-ac23-4fea-ad5a-b51f53084159/d8opy2w-d1837851-b90d-4702-ab3b-2521d77a58f6.png/v1/fill/w_1219,h_362,strp/pong_logo_by_ringostarr39_d8opy2w-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MzYyIiwicGF0aCI6IlwvZlwvMTFhMTBhMDEtYWMyMy00ZmVhLWFkNWEtYjUxZjUzMDg0MTU5XC9kOG9weTJ3LWQxODM3ODUxLWI5MGQtNDcwMi1hYjNiLTI1MjFkNzdhNThmNi5wbmciLCJ3aWR0aCI6Ijw9MTIxOSJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.rlfRzGERmwCP7bAyTAykjN-ei1IYDQsFxUCGWKt2ulg"
                      alt="Pong"
                    />

                  </a>
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'px-3 py-2 rounded-md text-sm font-medium'
                        )}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <button
                  type="button"
                  className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src={`data:image/jpeg;base64,${avatar}`}
                        alt=""
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="/Profile"
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Your Profile
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="/"
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Settings
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="/"
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Sign out
                          </a>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block px-3 py-2 rounded-md text-base font-medium'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
    </>
  );
}

export default ColorSchemesExample;