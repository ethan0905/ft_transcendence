import React from 'react';
import './achievements.css';

const Achievements = () => {
	return (
		<div className='Achievements'>
				<div className='Achiev_list'>
						<div className="tooltip">
								<img className='Achiev_image' src='/sharingan.png' alt='Achiev'/>
								<span className="tooltiptext">1st Game</span>
						</div>
						<div className="tooltip">
								<img className='Achiev_image' src='/rinnegan.png' alt='Achiev'/>
								<span className="tooltiptext">1st Win</span>
						</div>
						<div className="tooltip">
								<img className='Achiev_image' src='/Mangekyou.png' alt='Achiev'/>
								<span className="tooltiptext">1st Friend</span>
						</div>
				</div>
		</div>
	)
};

export default Achievements;