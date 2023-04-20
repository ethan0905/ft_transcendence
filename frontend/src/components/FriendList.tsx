import CSS from 'csstype';

interface TableProps {
	data: {
	  name: string;
	  status: string;
	}[];
  }

const FriendList = (props: TableProps) => {
	const { data } = props;

	const titleTable: CSS.Properties = {
		backgroundColor: 'black', 
		color: 'white', 
		textAlign: 'center', 
		paddingTop: '8px' ,
		fontFamily: 'Kocak',
		fontSize: '30px',
	}

	const titleCol: CSS.Properties = {
		backgroundColor: 'black',
		color: 'white', 
		borderBottom: '1px solid #ddd', 
		textAlign: 'left',
		padding: '10px'
	}

	const lineTable: CSS.Properties = {
		borderBottom: '1px solid #ddd',
		padding: '10px',
		backgroundColor: '#fff9f955',
	}

return (
	<div style={{ overflowY: 'scroll', minWidth: '35%',height: '100%',}}>
		<table style={{borderCollapse: 'collapse', width: '100%', height:'20%' }}>
			
			<thead style={{ position: 'sticky', top: '0' }}>
				<tr><th colSpan={3} style={titleTable}>Friends</th></tr>
				<tr>
					<th style={titleCol}>#</th>
					<th style={titleCol}>Name</th>
					<th style={titleCol}>Status</th>
				</tr>
			</thead>

			<tbody>
			{data.map((item, index) => (
				<tr key={index}>
					<td style={lineTable}>{index + 1}</td>
					<td style={lineTable}>{item.name}</td>
					<td style={lineTable}>{item.status}</td>
				</tr>))}
			</tbody>
			
		</table>
	</div>
);
};

export default FriendList;