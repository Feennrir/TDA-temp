import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import '../styles/chartOverlay.css';


const ChartOverlay = ({ isVisible }) => {
	const dummyData = [
		{ name: 'Jan', value: 30 },
		{ name: 'Feb', value: 45 },
		{ name: 'Mar', value: 28 },
		{ name: 'Apr', value: 60 },
		{ name: 'May', value: 50 },
	];

	return (
		<div className={`chart-overlay ${isVisible ? 'visible' : ''}`}>
			<div className="chart-container">
				<LineChart
					width={window.innerWidth - 150}
					height={window.innerHeight - 250}
					data={dummyData}
					margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
				>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="name" />
					<YAxis />
					<Tooltip />
					<Legend />
					<Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
				</LineChart>
			</div>
		</div>
	);
};

export default ChartOverlay;
