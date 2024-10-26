import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, LineChart, Line } from 'recharts';
import './Dashboard.css';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    state: '',
    modelYear: '',
    make: '',
    city: '',
  });
  const [selectedMetric, setSelectedMetric] = useState('Electric Vehicle Type'); 
  const [selectedChartType, setSelectedChartType] = useState('All');

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  useEffect(() => {
    Papa.parse('/data/Electric_Vehicle_Population_Data.csv', {
      download: true,
      header: true,
      complete: (results) => {
        if (results.data && results.data.length) {
          setData(results.data);
          setFilteredData(results.data);
        }
      },
    });
  }, []);

  useEffect(() => {
    if (data.length === 0) return;

    const filtered = data.filter((item) => {
      return (
        (filters.state === '' || item.State === filters.state) &&
        (filters.modelYear === '' || item['Model Year'] === filters.modelYear) &&
        (filters.make === '' || item.Make === filters.make) &&
        (filters.city === '' || item.City === filters.city)
      );
    });
    setFilteredData(filtered);
  }, [filters, data]);

  const getUniqueValues = (key) => [...new Set(data.map(item => item[key]))];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleMetricChange = (e) => {
    setSelectedMetric(e.target.value);
  };

  const handleChartTypeChange = (e) => {
    setSelectedChartType(e.target.value);
  };

  const prepareChartData = () => {
    const distribution = filteredData.reduce((acc, curr) => {
      const metricValue = curr[selectedMetric];
      if (metricValue) { 
        acc[metricValue] = (acc[metricValue] || 0) + 1;
      }
      return acc;
    }, {});
    return Object.entries(distribution).map(([name, value]) => ({ name, value }));
  };
  

  const chartData = prepareChartData();

  return (
    <div className="dashboard">
      <div className="filters">
        <select name="state" onChange={handleFilterChange} value={filters.state}>
          <option value="">All States</option>
          {getUniqueValues("State").map((state) => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>

        <select name="modelYear" onChange={handleFilterChange} value={filters.modelYear}>
          <option value="">All Model Years</option>
          {getUniqueValues("Model Year").map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        <select name="make" onChange={handleFilterChange} value={filters.make}>
          <option value="">All Makes</option>
          {getUniqueValues("Make").map((make) => (
            <option key={make} value={make}>{make}</option>
          ))}
        </select>

        <select name="city" onChange={handleFilterChange} value={filters.city}>
          <option value="">All Cities</option>
          {getUniqueValues("City").map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      <div className="metric-selector">
        <label htmlFor="metric">Select Metric:</label>
        <select id="metric" onChange={handleMetricChange} value={selectedMetric}>
          <option value="Electric Vehicle Type">Electric Vehicle Type</option>
          <option value="Model Year">Model Year</option>
        </select>

        <label htmlFor="chartType">Select Chart Type:</label>
        <select id="chartType" onChange={handleChartTypeChange} value={selectedChartType}>
          <option value="All">All</option>
          <option value="Pie">Pie Chart</option>
          <option value="Bar">Bar Chart</option>
          <option value="Line">Line Chart</option>
        </select>
      </div>

      <div className="chart-container">
        {selectedChartType === 'All' && (
          <>
            <div className="chart">
              <h2>Electric Vehicle Type Distribution</h2>
              <PieChart width={400} height={400}>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>

            <div className="chart">
              <h2>Electric Vehicle Type Distribution (Bar)</h2>
              <BarChart width={400} height={300} data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
            </div>

            <div className="chart">
              <h2>Electric Vehicle Type Distribution (Line)</h2>
              <LineChart width={400} height={300} data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
              </LineChart>
            </div>
          </>
        )}

        {selectedChartType === 'Pie' && (
          <div className="chart">
            <h2>Electric Vehicle Type Distribution</h2>
            <PieChart width={400} height={400}>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        )}

        {selectedChartType === 'Bar' && (
          <div className="chart">
            <h2>Electric Vehicle Type Distribution (Bar)</h2>
            <BarChart width={400} height={300} data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </div>
        )}

        {selectedChartType === 'Line' && (
          <div className="chart">
            <h2>Electric Vehicle Type Distribution (Line)</h2>
            <LineChart width={400} height={300} data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
