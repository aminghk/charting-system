import React from 'react';

import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {

    if (active && payload && payload.length) {
        return (
            // show all information in tooltip
            <div className='flex flex-col bg-slate-100 rounded-lg p-4'>
                <p className='text-md'>{`${label}`}</p>
                <p className='text-md'>{` User count : ${payload[0].value}`}</p>
                <p className='text-md'>{`country : ${payload[0].payload.Country}`}</p>
                <p className='text-md'>{`platform : ${payload[0].payload.Platform}`}</p>
                <p className='text-md'>{`ad network : ${payload[0].payload['Ad Network']}`}</p>
                <p className='text-md'>{`app : ${payload[0].payload.App}`}</p>
            </div>
        );
    }

    return null;
};




const Chart = ({ data, targetLine }) => {
    const lastValue = data[data.length - 1]['Daily Users'];
    const targetValue = targetLine;
    const targetLineColor = lastValue > targetValue ? '#00ff00' : lastValue === targetValue ? '#ffff00' : '#ff0000';
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                width={500}
                height={400}
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="Date" />
                <YAxis type="number" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="Daily Users" fill="#8884d8" />
                <ReferenceLine y={targetValue} stroke={targetLineColor} />
            </BarChart>
        </ResponsiveContainer>

    );
};

export default Chart;