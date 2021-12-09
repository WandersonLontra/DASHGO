import { useState } from 'react';
import NextLink from 'next/link';

import { Flex, Heading, Box, Text, Button, Icon, Table, Thead, Tbody, Tr, Th, Td, Checkbox, useBreakpointValue, Spinner, Link } from "@chakra-ui/react";
import { RiAddLine, RiPencilLine } from "react-icons/ri";

import { useUsers } from '../../services/hooks/useUsers';

import { queryClient } from '../../services/queryClient';
import { api } from '../../services/api';

import Header from "../../components/Header";
import Pagination from "../../components/Pagination";
import Sidebar from "../../components/Sidebar";



export default function UserList(){
    const [page, setPage] = useState(1);
    const { data, isLoading, isFetching, error } = useUsers(page);

    const isWideVersion = useBreakpointValue({
        base: false,
        lg: true
    });

    async function handlePrefetchUser(userId: string){
        await queryClient.prefetchQuery(['user', userId], async () => {
            const { data } = await api.get(`users/${userId}`);

            return data
        },{
            staleTime: 1000 * 60 * 10, //10min
        });
    }

    return(
        <Box>
            <Header />

            <Flex w="100%" maxW={1480} my="6" mx="auto" px="6">
                <Sidebar />

                <Box flex="1" borderRadius={8} bg="gray.800" p={["4","8"]} >
                    <Flex mb="8" justify="space-between" align="center">
                        <Heading size="lg" fontWeight="normal">
                            Usuários
                            {!isLoading && isFetching && <Spinner size="sm" color="gray.500" ml="4" />}
                        </Heading>

                        <NextLink href="/users/create" passHref>
                            <Button
                                as="a"
                                size="sm"
                                fontSize="sm"
                                colorScheme="pink"
                                cursor="pointer"
                                leftIcon={isWideVersion && <Icon as={RiAddLine} fontSize="20" />}
                            >
                                {isWideVersion ? "Criar novo" : <Icon as={RiAddLine} fontSize="20" />}
                            </Button>
                        </NextLink>
                    </Flex>

                    {isLoading ? (
                        <Flex justify="center">
                            <Spinner />
                        </Flex>
                    ): error ? (
                        <Flex>
                            <Text>Falha ao obter dados dos usuários</Text>
                        </Flex>
                    ): (
                        <>
                            <Table colorScheme="whiteAlpha">
                                <Thead>
                                    <Tr>
                                        <Th px={["4","4","6"]} color="gray.300" w="8" >
                                            <Checkbox colorScheme="pink" />
                                        </Th>
                                        <Th>Usuário</Th>
                                        {isWideVersion &&  <Th>Data de cadastro</Th>}
                                        <Th w="8"></Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {data.users.map(user => (
                                        <Tr key={user.id}>
                                            <Td px={["4","4","6"]}>
                                                <Checkbox colorScheme="pink" />
                                            </Td>
                                            <Td>
                                                <Box>
                                                    <Link color="purple.400" onMouseEnter={() => handlePrefetchUser(user.id)} >
                                                        <Text fontWeight="bold">{user.name}</Text> 
                                                    </Link>
                                                    <Text fontSize="small" color="gray.300">{user.email}</Text>
                                                </Box>
                                            </Td>
                                            {isWideVersion && <Td>{user.createdAt}</Td>}
                                            <Td px={["4","4","6"]}>                                  
                                                <Button
                                                    as="a"
                                                    size="sm"
                                                    fontSize="sm"
                                                    colorScheme="purple"
                                                    cursor="pointer"
                                                    leftIcon={isWideVersion && <Icon as={RiPencilLine} fontSize="16"/>}
                                                >
                                                    {isWideVersion ? "Editar" : <Icon as={RiPencilLine} fontSize="16"/>}
                                                </Button>
                                            </Td>
                                        </Tr>

                                    ))}
                                </Tbody>
                            </Table>

                            <Pagination
                                totalCountOfRegisters={data.totalCount}
                                currentPage={page}
                                onPageChange={setPage}
                            />
                        </>
                    )}

                </Box>
            </Flex>
        </Box>
    )
}

// export const getServerSideProps: GetServerSideProps = async () => {
//     const { users, totalCount } = await getUsers(1);

//     return {
//         props: {
//             users
//         }
//     }
// }