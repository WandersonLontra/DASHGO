import { Flex, useBreakpointValue, IconButton, Icon } from "@chakra-ui/react";
import { RiMenuLine } from "react-icons/ri";

import { useSidebarDrawer } from "../../context/SidebarDrawerContext";

import Logo from "./Logo";
import NotificationsNav from "./NotificationsNav";
import Profile from "./Profile";
import SearchBox from "./SearchBox";

export default function Header() {
    const { onOpen } = useSidebarDrawer();

    const isWideVersion = useBreakpointValue({
        base: false,
        lg: true
    });

    return (
        <Flex
            as="header"
            w="100%"
            maxW={1480}
            h="20"
            mx="auto"
            mt="4"
            px="6"
            align="center"
        >
            {!isWideVersion && (
                <IconButton
                    display="flex"
                    aria-label="Open Sidebar Navigation"
                    icon={<Icon as={RiMenuLine} />}
                    fontSize="28"
                    variant="unstyled"
                    onClick={onOpen}
                    mr="2"
                />
            )}
            <Logo />

            {isWideVersion && <SearchBox />}

            <Flex align="center" ml="auto">
                <NotificationsNav />

                <Profile name="Wanderson Lontra" email="wanderson@lontra.com" showProfileData={isWideVersion} />
            </Flex>
        </Flex>
    )
}