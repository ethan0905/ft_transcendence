import React, { useState } from 'react';

interface TableProps {
	data: {
	  name: string;
	  status: string;
	}[];
  }
  
const FriendList = (props: TableProps) => {
	const { data } = props;
  
	return (
	  <div style={{ overflowY: 'scroll', minWidth: '35%',height: '100%',}}>
		<table style={{ borderCollapse: 'collapse', width: '100%', height:'100%' }}>
		  <thead style={{ position: 'sticky', top: '0' }}>
		  <tr>
            <th colSpan={3} style={{ backgroundColor: 'black', color: 'white', textAlign: 'center', padding: '10px' }}>Friends</th>
          </tr>
			<tr>
			<th style={{ backgroundColor: 'black', color: 'white', borderBottom: '1px solid #ddd', textAlign: 'left'}}>#</th>
			<th style={{ backgroundColor: 'black', color: 'white', borderBottom: '1px solid #ddd', textAlign: 'left'}}>Name</th>
		  <th style={{ backgroundColor: 'black', color: 'white', borderBottom: '1px solid #ddd',textAlign: 'left'}}>Status</th>
			</tr>
		  </thead>
		  <tbody>
			{data.map((item, index) => (
			  <tr key={index}>
				  <td style={{ borderBottom: '1px solid #ddd' }}>{index + 1}</td>
				<td style={{ borderBottom: '1px solid #ddd' }}>{item.name}</td>
				<td style={{ borderBottom: '1px solid #ddd' }}>{item.status}</td>
			  </tr>
			))}
		  </tbody>
		</table>
	  </div>
	);
  };

export default FriendList;