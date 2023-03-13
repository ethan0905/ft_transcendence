import { Avatar, Button, IconButton } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import styled from "styled-components";

export default function Sidebar() {
	const createChat = () => {
		const input = prompt("Enter the username to chat with");
		if (!input)
			return null;
	};

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
				<SearchInput placeholder="Search rooms" />
			</Search>

			<SidebarButton onClick={createChat}>Create a room</SidebarButton>

		</Container>
	);
}

const SidebarButton = styled(Button)`
	width: 100%;
`;

const Container = styled.div`
	background-color: #706363;
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
	background-color: #5c5c5c;
`;

const Header = styled.div`
	display: flex;
	position: sticky;
	top: 0;
	background-color: #646161;
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