import React, { useEffect, useState } from 'react';
import Chart from './components/Chart';
import sampleCSV from './data/sample.csv'
import { readString } from 'react-papaparse';
import Table from './components/Table';


const App = () => {
  // #region States

  const [data, setData] = useState([]);
  const [dataForChart, setDataForChart] = useState([]);
  const [selectableCountries, setSelectableCountries] = useState([]);
  const [selectableDevices, setSelectableDevices] = useState([]);
  const [selectableAddNetworks, setSelectableAddNetworks] = useState([]);
  const [selectableApp, setSelectableApp] = useState([]);

  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedAddNetwork, setSelectedAddNetwork] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);

  const [targetLine, setTargetLine] = useState(null);

  const [showType, setShowType] = useState('chart'); // can be 'chart' or 'table'

  // #endregion

  const arrangeArrayByDate = (array) => {
    const sortedArray = array.sort((a, b) => {
      const dateA = new Date(formatDateString(a.Date));
      const dateB = new Date(formatDateString(b.Date));
      return dateA - dateB;
    });
    return sortedArray;
  };


  const papaConfig = {
    header: true,
    dynamicTyping: true,
    complete: (results, file) => {

      setData(arrangeArrayByDate(results.data));
      setDataForChart(arrangeArrayByDate(results.data));
      const countries = results.data.map((item) => item.Country);
      const devices = results.data.map((item) => item.Platform);
      const addNetworks = results.data.map((item) => item['Ad Network']);
      const apps = results.data.map((item) => item.App);
      setSelectableCountries([...new Set(countries)]);
      setSelectableDevices([...new Set(devices)]);
      setSelectableAddNetworks([...new Set(addNetworks)]);
      setSelectableApp([...new Set(apps)]);
      console.log('Parsing complete:', results, file);
    },
    download: true,
    error: (error, file) => {
      console.log('Error while parsing:', error, file);
    },
  };

  const fetchData = async () => {
    readString(sampleCSV, papaConfig);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetFilters = () => {
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    setSelectedCountry(null);
    setSelectedDevice(null);
    setSelectedAddNetwork(null);
    setSelectedApp(null);
    setDataForChart(data);
  };

  const formatDateString = (dateString) => {
    // format string from dd/mm/yyyy to mm/dd/yyyy
    const dateArray = dateString.split('/');
    const formatedDate = `${dateArray[1]}/${dateArray[0]}/${dateArray[2]}`;
    return formatedDate;
  };

  const formatDateStringyyyymmdd = (dateString) => {
    // format string from dd/mm/yyyy to yyyy-mm-dd
    const dateArray = dateString.split('/');
    const formatedDate = `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`;
    return formatedDate;
  };

  const filterData = () => {
    let filteredData = data;
    if (selectedStartDate) {

      filteredData = filteredData.filter((item) => {
        const itemDate = new Date(formatDateString(item.Date));
        const formatedSelectedStartDate = new Date(selectedStartDate);
        return itemDate >= formatedSelectedStartDate;
      });
    }
    if (selectedEndDate) {
      filteredData = filteredData.filter((item) => {
        const itemDate = new Date(formatDateString(item.Date));
        const formatedSelectedEndDate = new Date(selectedEndDate);
        return itemDate <= formatedSelectedEndDate;
      });
    }
    if (selectedCountry) {
      filteredData = filteredData.filter((item) => item.Country === selectedCountry);
    }
    if (selectedDevice) {
      filteredData = filteredData.filter((item) => item.Platform === selectedDevice);
    }
    if (selectedAddNetwork) {
      filteredData = filteredData.filter((item) => item['Ad Network'] === selectedAddNetwork);
    }
    if (selectedApp) {
      filteredData = filteredData.filter((item) => item.App === selectedApp);
    }
    setDataForChart(filteredData);
  };

  // #region handlers
  const handleStartDateChange = (e) => {
    const date = new Date(e.target.value);
    console.log(date.toISOString());
    setSelectedStartDate(date);
  };

  const handleEndDateChange = (e) => {
    const date = new Date(e.target.value);
    setSelectedEndDate(date);
  };

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
  };

  const handleDeviceChange = (e) => {
    setSelectedDevice(e.target.value);
  };

  const handleAddNetworkChange = (e) => {
    setSelectedAddNetwork(e.target.value);
  };

  const handleAppChange = (e) => {
    setSelectedApp(e.target.value);
  };

  const handleTargetLineChange = (e) => {
    setTargetLine(e.target.value);
  };
  // #endregion

  useEffect(() => {
    filterData();
  }, [selectedStartDate, selectedEndDate, selectedCountry, selectedDevice, selectedAddNetwork, selectedApp]);


  const renderData = () => {
    switch (showType) {
      case 'chart':
        return < Chart data={dataForChart} targetLine={targetLine} />;
      case 'table':
        return (
          <div className='pl-8 pr-8'>
          < Table data={dataForChart} />
          </div>
        )
      default:
        return < Chart data={dataForChart} targetLine={targetLine} />;
    }

  }


  return (
    <div className="container mx-auto p-4">

      {/* header */}
      <h1 className="text-2xl font-bold mb-4">Analytics Chart</h1>
      {/* content */}
      <div className='flex flex-col'>
        <div className="flex flex-row ">
          {/* side bar */}
          <div className="flex flex-col sm:w-1/4 w-full ">
            {/* switch data view  chart or table */}
            <div className="flex flex-row mb-4">
              <button
                onClick={() => setShowType('chart')}
                className={`flex-1 p-2 rounded-l-lg ${showType === 'chart' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'
                  }`}
              >
                Chart
              </button>
              <button
                onClick={() => setShowType('table')}
                className={`flex-1 p-2 rounded-r-lg ${showType === 'table' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'
                  }`}
              >
                Table
              </button>
            </div>
            {/* filters */}
            <h2 className="text-xl font-bold mb-4">Filters</h2>
            {/* start date input */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="startDate">
                Start Date
              </label>

              <input
                value={selectedStartDate ? selectedStartDate.toISOString().split('T')[0] : ''}
                onChange={handleStartDateChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="startDate"
                type="date"
                min={data[0] ? formatDateStringyyyymmdd(data[0].Date) : ''}
                max={data[data.length - 1] ? formatDateStringyyyymmdd(data[data.length - 1].Date) : ''}
              />
            </div>
            {/* end date input */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endDate">
                End Date
              </label>
              <input
                value={selectedEndDate ? selectedEndDate.toISOString().split('T')[0] : ''}
                onChange={handleEndDateChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="endDate"
                type="date"
                min={data[0] ? formatDateStringyyyymmdd(data[0].Date) : ''}
                max={data[data.length - 1] ? formatDateStringyyyymmdd(data[data.length - 1].Date) : ''}
              />
            </div>
            {/* country input */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="country">
                Country
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="country"
                onChange={handleCountryChange}
                value={selectedCountry ? selectedCountry : 'all'}
              >
                <option value="all">All</option>
                {selectableCountries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
            {/* device input */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="device">
                Device
              </label>
              <select
                onChange={handleDeviceChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="device"
                value={selectedDevice ? selectedDevice : 'all'}
              >
                <option value="all">All</option>
                {selectableDevices.map((device) => (
                  <option key={device} value={device}>
                    {device}
                  </option>
                ))}
              </select>
            </div>
            {/* App input */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="app">
                App
              </label>
              <select
                onChange={handleAppChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="app"
                value={selectedApp ? selectedApp : 'all'}
              >
                <option value="all">All</option>
                {selectableApp.map((app) => (
                  <option key={app} value={app}>
                    {app}
                  </option>
                ))}
              </select>
            </div>
            {/* Add newtwork input */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="addNetwork">
                Add Network
              </label>
              <select
                id="addNetwork"
                value={selectedAddNetwork ? selectedAddNetwork : 'all'}
                onChange={handleAddNetworkChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="all">All</option>
                {selectableAddNetworks.map((addNetwork) => (
                  <option key={addNetwork} value={addNetwork}>
                    {addNetwork}
                  </option>
                ))}
              </select>
            </div>

            {/* reset filters */}
            <button
              onClick={resetFilters}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
            >
              Reset Filters
            </button>

            {/* divider */}
            <hr className="my-4" />

            {/* target line input */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="targetLine">
                Target Line
              </label>
              <input
                onChange={handleTargetLineChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="targetLine"
                type="number"
              />
            </div>

          </div>
          {/* data */}
          <div className=" hidden sm:flex flex-col w-3/4 ">
            {
              dataForChart.length === 0 ?
                <div className="flex flex-col items-center justify-center h-full">
                  <h2 className="text-xl font-bold mb-4">No Data</h2>
                  <p className="text-gray-700 text-sm font-bold mb-2">
                    Please select a date range, country, device, app, and add network
                  </p>
                </div>
                :
                renderData()

            }

          </div>

        </div>
        {/* data for mobile */}
        <div className="sm:hidden flex flex-row ">
          {
            dataForChart.length === 0 ?
              <div className="flex flex-col items-center justify-center h-full">
                <h2 className="text-xl font-bold mb-4">No Data</h2>
                <p className="text-gray-700 text-sm font-bold mb-2">
                  Please select a date range, country, device, app, and add network
                </p>
              </div>
              :
              renderData()

          }
        </div>
      </div>
    
    </div>
  );
};

export default App;