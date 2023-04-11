import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';

export default function UserPage() {
	let { id } = useParams();

	return (
		<>
			<Sidebar />
			<div className='ProfilePage'>
				<h1>Profile of {id}</h1>
			</div>
		</>
	);
}
