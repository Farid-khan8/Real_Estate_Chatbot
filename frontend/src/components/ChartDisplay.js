import React, { useState, useEffect } from "react";
import { Card, Tabs, Tab, Badge, Alert } from "react-bootstrap";
// import {
//     RiBarChartFill,
//     RiLineChartFill,
//     RiPieChartFill,
//     RiTrendingUpFill,
// } from "react-icons/ri";
import { RiLineChartLine } from "react-icons/ri";
import { FiTrendingUp } from "react-icons/fi";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Colors,
    ArcElement,
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Colors
);

const ChartDisplay = ({ chartData, queryType, area, years }) => {
    const [activeTab, setActiveTab] = useState("price");
    const [chartOptions, setChartOptions] = useState({});
    const [formattedData, setFormattedData] = useState({});

    useEffect(() => {
        if (chartData && Object.keys(chartData).length > 0) {
            formatChartData();
            setChartOptions(getChartOptions());
        }
    }, [chartData, queryType, area]);

    const formatChartData = () => {
        if (!chartData || Object.keys(chartData).length === 0) {
            setFormattedData({});
            return;
        }

        const formatAreaName = (areaName) => {
            if (!areaName) return "";
            if (Array.isArray(areaName)) {
                return areaName.map((a) =>
                    a
                        .split(" ")
                        .map(
                            (word) =>
                                word.charAt(0).toUpperCase() +
                                word.slice(1).toLowerCase()
                        )
                        .join(" ")
                );
            }
            return areaName
                .split(" ")
                .map(
                    (word) =>
                        word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase()
                )
                .join(" ");
        };

        const areaNames = formatAreaName(area);

        // Price Chart Data
        const priceChart = {
            labels: chartData.labels || [],
            datasets:
                queryType === "comparison"
                    ? [
                          {
                              label: Array.isArray(areaNames)
                                  ? areaNames[0]
                                  : "Area 1",
                              data:
                                  chartData.area1_data ||
                                  chartData.price_data ||
                                  [],
                              borderColor: "rgb(53, 162, 235)",
                              backgroundColor: "rgba(53, 162, 235, 0.2)",
                              borderWidth: 2,
                              tension: 0.4,
                              fill: true,
                          },
                          {
                              label: Array.isArray(areaNames)
                                  ? areaNames[1]
                                  : "Area 2",
                              data: chartData.area2_data || [],
                              borderColor: "rgb(255, 99, 132)",
                              backgroundColor: "rgba(255, 99, 132, 0.2)",
                              borderWidth: 2,
                              tension: 0.4,
                              fill: true,
                          },
                      ]
                    : [
                          {
                              label: "Price per Sq.Ft (₹)",
                              data: chartData.price_data || [],
                              borderColor: "rgb(53, 162, 235)",
                              backgroundColor: "rgba(53, 162, 235, 0.5)",
                              borderWidth: 2,
                              tension: 0.4,
                              fill: true,
                          },
                      ],
        };

        // Demand Chart Data
        const demandChart = {
            labels: chartData.labels || [],
            datasets: [
                {
                    label: "Demand Index",
                    data: chartData.demand_data || [],
                    borderColor: "rgb(255, 159, 64)",
                    backgroundColor: "rgba(255, 159, 64, 0.2)",
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true,
                },
            ],
        };

        // Units Chart Data
        const unitsChart = {
            labels: chartData.labels || [],
            datasets: [
                {
                    label: "Total Units",
                    data: chartData.units_data || [],
                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                    borderColor: "rgb(75, 192, 192)",
                    borderWidth: 1,
                },
            ],
        };

        // Comparison Pie Chart (for comparison queries)
        const pieChartData =
            queryType === "comparison" &&
            chartData.area1_data &&
            chartData.area2_data
                ? {
                      labels: Array.isArray(areaNames)
                          ? areaNames
                          : ["Area 1", "Area 2"],
                      datasets: [
                          {
                              label: "Current Year Comparison",
                              data: [
                                  chartData.area1_data[
                                      chartData.area1_data.length - 1
                                  ] || 0,
                                  chartData.area2_data[
                                      chartData.area2_data.length - 1
                                  ] || 0,
                              ],
                              backgroundColor: [
                                  "rgba(53, 162, 235, 0.8)",
                                  "rgba(255, 99, 132, 0.8)",
                              ],
                              borderColor: [
                                  "rgb(53, 162, 235)",
                                  "rgb(255, 99, 132)",
                              ],
                              borderWidth: 1,
                          },
                      ],
                  }
                : null;

        // Growth Trend Chart (calculate percentage growth)
        const calculateGrowth = (data) => {
            if (!data || data.length < 2) return [];
            return data.map((value, index, array) => {
                if (index === 0) return 0;
                const prevValue = array[index - 1];
                return prevValue
                    ? (((value - prevValue) / prevValue) * 100).toFixed(1)
                    : 0;
            });
        };

        const growthChart = {
            labels: chartData.labels || [],
            datasets:
                queryType === "comparison"
                    ? [
                          {
                              label: Array.isArray(areaNames)
                                  ? `${areaNames[0]} Growth %`
                                  : "Area 1 Growth",
                              data: calculateGrowth(chartData.area1_data || []),
                              borderColor: "rgb(53, 162, 235)",
                              backgroundColor: "rgba(53, 162, 235, 0.2)",
                              borderWidth: 2,
                              tension: 0.4,
                              borderDash: [5, 5],
                          },
                          {
                              label: Array.isArray(areaNames)
                                  ? `${areaNames[1]} Growth %`
                                  : "Area 2 Growth",
                              data: calculateGrowth(chartData.area2_data || []),
                              borderColor: "rgb(255, 99, 132)",
                              backgroundColor: "rgba(255, 99, 132, 0.2)",
                              borderWidth: 2,
                              tension: 0.4,
                              borderDash: [5, 5],
                          },
                      ]
                    : [
                          {
                              label: "Annual Growth %",
                              data: calculateGrowth(chartData.price_data || []),
                              borderColor: "rgb(153, 102, 255)",
                              backgroundColor: "rgba(153, 102, 255, 0.2)",
                              borderWidth: 2,
                              tension: 0.4,
                              fill: true,
                          },
                      ],
        };

        setFormattedData({
            price: priceChart,
            demand: demandChart,
            units: unitsChart,
            pie: pieChartData,
            growth: growthChart,
        });
    };

    const getChartOptions = () => {
        const commonOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "top",
                    labels: {
                        font: {
                            size: 12,
                            family: "'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif",
                        },
                        padding: 20,
                    },
                },
                tooltip: {
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    titleFont: {
                        size: 14,
                    },
                    bodyFont: {
                        size: 13,
                    },
                    padding: 12,
                    cornerRadius: 6,
                },
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: "rgba(0, 0, 0, 0.1)",
                    },
                    ticks: {
                        font: {
                            size: 11,
                        },
                        callback: function (value) {
                            return value >= 1000
                                ? "₹" + (value / 1000).toFixed(1) + "k"
                                : "₹" + value;
                        },
                    },
                },
                x: {
                    grid: {
                        color: "rgba(0, 0, 0, 0.05)",
                    },
                    ticks: {
                        font: {
                            size: 11,
                        },
                    },
                },
            },
        };

        const growthOptions = {
            ...commonOptions,
            scales: {
                ...commonOptions.scales,
                y: {
                    ...commonOptions.scales.y,
                    ticks: {
                        ...commonOptions.scales.y.ticks,
                        callback: function (value) {
                            return value + "%";
                        },
                    },
                },
            },
        };

        const pieOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "right",
                    labels: {
                        font: {
                            size: 12,
                        },
                        padding: 20,
                    },
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            let label = context.label || "";
                            if (label) {
                                label += ": ";
                            }
                            label += "₹" + context.raw.toLocaleString();
                            return label;
                        },
                    },
                },
            },
        };

        return {
            price: commonOptions,
            demand: commonOptions,
            units: commonOptions,
            pie: pieOptions,
            growth: growthOptions,
        };
    };

    const getChartTitle = () => {
        const formatArea = (areaName) => {
            if (!areaName) return "";
            if (Array.isArray(areaName)) {
                return areaName
                    .map((a) =>
                        a
                            .split(" ")
                            .map(
                                (word) =>
                                    word.charAt(0).toUpperCase() +
                                    word.slice(1).toLowerCase()
                            )
                            .join(" ")
                    )
                    .join(" vs ");
            }
            return areaName
                .split(" ")
                .map(
                    (word) =>
                        word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase()
                )
                .join(" ");
        };

        const areaName = formatArea(area);

        switch (queryType) {
            case "analysis":
                return `${areaName} Real Estate Analysis`;
            case "comparison":
                return `${areaName} Comparison`;
            case "trend":
                return `${areaName} - ${years} Year Trend Analysis`;
            default:
                return "Data Visualization";
        }
    };

    const getAvailableTabs = () => {
        const tabs = [];

        if (
            formattedData.price &&
            formattedData.price.datasets[0].data.length > 0
        ) {
            tabs.push({
                key: "price",
                label: "Price Trends",
                icon: <LineChart />,
            });
        }

        if (
            formattedData.demand &&
            formattedData.demand.datasets[0].data.length > 0
        ) {
            tabs.push({
                key: "demand",
                label: "Demand Trends",
                icon: <TrendingUp />,
            });
        }

        if (
            formattedData.units &&
            formattedData.units.datasets[0].data.length > 0
        ) {
            tabs.push({
                key: "units",
                label: "Units Analysis",
                icon: <BarChart />,
            });
        }

        if (
            formattedData.growth &&
            formattedData.growth.datasets[0].data.length > 0
        ) {
            tabs.push({
                key: "growth",
                label: "Growth Rate",
                icon: <TrendingUp />,
            });
        }

        if (formattedData.pie && queryType === "comparison") {
            tabs.push({ key: "pie", label: "Comparison", icon: <PieChart /> });
        }

        return tabs;
    };

    const renderChart = () => {
        const chart = formattedData[activeTab];
        const options = chartOptions[activeTab];

        if (!chart || !options) {
            return (
                <Alert variant="info" className="text-center m-4">
                    No chart data available for this view.
                </Alert>
            );
        }

        switch (activeTab) {
            case "price":
            case "demand":
            case "growth":
                return (
                    <div style={{ height: "400px", position: "relative" }}>
                        <Line data={chart} options={options} />
                    </div>
                );
            case "units":
                return (
                    <div style={{ height: "400px", position: "relative" }}>
                        <Bar data={chart} options={options} />
                    </div>
                );
            case "pie":
                return (
                    <div style={{ height: "400px", position: "relative" }}>
                        <Pie data={chart} options={options} />
                    </div>
                );
            default:
                return null;
        }
    };

    const renderChartStats = () => {
        if (!formattedData[activeTab]) return null;

        const data = formattedData[activeTab].datasets[0].data;
        if (!data || data.length === 0) return null;

        const latestValue = data[data.length - 1];
        const firstValue = data[0];
        const growth = (
            ((latestValue - firstValue) / firstValue) *
            100
        ).toFixed(1);

        return (
            <div className="chart-stats d-flex justify-content-between align-items-center mt-3 p-3 bg-light rounded">
                <div className="text-center">
                    <small className="text-muted d-block">Current Value</small>
                    <h4 className="mb-0">
                        {activeTab === "growth"
                            ? `${latestValue}%`
                            : `₹${latestValue.toLocaleString()}`}
                    </h4>
                </div>
                <div className="text-center">
                    <small className="text-muted d-block">Period Growth</small>
                    <h4
                        className={`mb-0 ${
                            parseFloat(growth) >= 0
                                ? "text-success"
                                : "text-danger"
                        }`}
                    >
                        {growth}%
                    </h4>
                </div>
                <div className="text-center">
                    <small className="text-muted d-block">Data Points</small>
                    <h4 className="mb-0">{data.length}</h4>
                </div>
            </div>
        );
    };

    if (!chartData || Object.keys(chartData).length === 0) {
        return (
            <Card className="mb-4 shadow-sm">
                <Card.Header className="bg-light">
                    <h5 className="mb-0">Chart Visualization</h5>
                </Card.Header>
                <Card.Body className="text-center py-5">
                    <BarChart size={48} className="text-muted mb-3" />
                    <p className="text-muted mb-0">
                        Submit a query to visualize real estate data
                    </p>
                </Card.Body>
            </Card>
        );
    }

    const availableTabs = getAvailableTabs();

    return (
        <Card className="mb-4 shadow-sm">
            <Card.Header className="d-flex justify-content-between align-items-center">
                <div>
                    <h5 className="mb-0">{getChartTitle()}</h5>
                    {years && (
                        <Badge bg="info" className="ms-2">
                            {years} Year Analysis
                        </Badge>
                    )}
                    <Badge
                        bg={queryType === "comparison" ? "success" : "primary"}
                        className="ms-2"
                    >
                        {queryType?.toUpperCase() || "ANALYSIS"}
                    </Badge>
                </div>
                <div className="text-muted small">
                    {chartData.labels?.length || 0} Data Points
                </div>
            </Card.Header>

            <Card.Body>
                {availableTabs.length > 0 ? (
                    <>
                        <Tabs
                            activeKey={activeTab}
                            onSelect={(k) => setActiveTab(k)}
                            className="mb-3"
                            fill
                        >
                            {availableTabs.map((tab) => (
                                <Tab
                                    key={tab.key}
                                    eventKey={tab.key}
                                    title={
                                        <span className="d-flex align-items-center">
                                            {tab.icon}
                                            <span className="ms-2">
                                                {tab.label}
                                            </span>
                                        </span>
                                    }
                                />
                            ))}
                        </Tabs>

                        {renderChart()}
                        {renderChartStats()}

                        {/* Chart Description */}
                        <div className="mt-3 pt-3 border-top">
                            <small className="text-muted">
                                {activeTab === "price" &&
                                    "Shows price per square foot trends over time."}
                                {activeTab === "demand" &&
                                    "Demand index indicates market interest and activity levels."}
                                {activeTab === "units" &&
                                    "Total number of property units available in the market."}
                                {activeTab === "growth" &&
                                    "Percentage growth calculated year-over-year."}
                                {activeTab === "pie" &&
                                    "Comparative analysis of current year prices between areas."}
                            </small>
                        </div>
                    </>
                ) : (
                    <Alert variant="warning" className="text-center">
                        No chart data available for this query.
                    </Alert>
                )}
            </Card.Body>
        </Card>
    );
};

// Default props
ChartDisplay.defaultProps = {
    chartData: {},
    queryType: "analysis",
    area: "",
    years: 3,
};

export default ChartDisplay;
