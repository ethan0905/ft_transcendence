import styled from "styled-components";
import { Avatar, Button, IconButton } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";


function Sidebar() {
	return (
		<Container>
			<Header>
				<UserAvatar />

				<IconsContainer>
					<IconButton>
						<ChatIcon />
					</IconButton>
					<IconButton>
						<MoreVertIcon />
					</IconButton>
				</IconsContainer>
			</Header>
			
			<Search>
				<SearchIcon />
				<SearchInput placeholder="Search in chats" />
			</Search>

			<SidebarButton onClick={createChat}>Start a new chat</SidebarButton>

		</Container>
	);
}

export default Sidebar;

const SidebarButton = styled(Button)`
	width: 100%;
`;

const Container = styled.div`
	background-color: white;
`;

const IconsContainer = styled.div`
`;

const Search = styled.div`
	display: flex;
	align-items: center;
	padding: 20px;
	border-radius: 2px;
`;

const SearchInput = styled.input`
	outline-width: 0;
	border: none;
	flex: 1;
`;

const Header = styled.div`
	display: flex;
	position: sticky;
	top: 0;
	background-color: white;
	z-index: 1;
	justify-content: space-between;
	align-items: center;
	height: 80px;
	border-bottom: 1px solid whitesmoke;
`;

const UserAvatar = styled(Avatar)`
	cursor: pointer;
	:hover {opacity: 0.8;}
`;