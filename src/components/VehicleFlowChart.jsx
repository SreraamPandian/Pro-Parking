import React from 'react';
import ReactECharts from 'echarts-for-react';

const VehicleFlowChart = ({ data }) => {
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['Entries', 'Exits']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: hours
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Entries',
        type: 'bar',
        stack: 'total',
        data: data.entries,
        color: '#4C9AFF'
      },
      {
        name: 'Exits',
        type: 'bar',
        stack: 'total',
        data: data.exits,
        color: '#FF5630'
      }
    ]
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Vehicle Flow Today</h3>
      <ReactECharts option={option} style={{ height: '300px' }} />
    </div>
  );
};

export default VehicleFlowChart;
