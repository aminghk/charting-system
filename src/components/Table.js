import React from 'react';

// TODO: Must have pagination this is just a simple table

const Table = ({ data }) => {

    return (
        <table className="table-auto">
            <thead>
                <tr>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Country</th>
                    <th className="px-4 py-2">App</th>
                    <th className="px-4 py-2">Platform</th>
                    <th className="px-4 py-2">Ad Network</th>
                    <th className="px-4 py-2">Daily Users </th>
                </tr>
            </thead>
            <tbody>
                {data.map((item, index) => (
                    <tr key={index}
                    >
                        <td className="border px-4 py-2">{item['Date']}</td>
                        <td className="border px-4 py-2">{item['Country']}</td>
                        <td className="border px-4 py-2">{item['App']}</td>
                        <td className="border px-4 py-2">{item['Platform']}</td>
                        <td className="border px-4 py-2">{item['Ad Network']}</td>
                        <td className="border px-4 py-2">{item['Daily Users']}</td>

                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default Table;