import { FaUser } from "react-icons/fa";
import React, { useState, useRef, useEffect } from "react";
import {
    Container,
    Row,
    Col,
    Form,
    Button,
    Card,
    InputGroup,
    Spinner,
    Alert,
    Badge,
} from "react-bootstrap";
import { Send, Robot, User, Lightbulb, BarChart } from "react-bootstrap-icons";
// import {
//     BsSend,
//     BsRobot,
//     BsPerson,
//     BsLightbulb,
//     BsBarChart,
// } from "react-icons/bs";
import axios from "axios";
import SummaryCard from "./SummaryCard";
import ChartDisplay from "./ChartDisplay";
import DataTable from "./DataTable";

const API_URL = "http://localhost:8000/api";

const ChatInterface = () => {
    const [query, setQuery] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [responseData, setResponseData] = useState(null);
    const [availableAreas, setAvailableAreas] = useState([]);
    const messagesEndRef = useRef(null);

    // Fetch available areas on component mount
    useEffect(() => {
        fetchAreas();
    }, []);

    // Auto-scroll to latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const fetchAreas = async () => {
        try {
            const response = await axios.get(`${API_URL}/areas/`);
            setAvailableAreas(response.data.areas || []);
        } catch (error) {
            console.error("Error fetching areas:", error);
            setAvailableAreas([
                "Wakad",
                "Aundh",
                "Akurdi",
                "Baner",
                "Hinjewadi",
            ]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!query.trim() || loading) return;

        // Add user message
        const userMsg = {
            id: Date.now(),
            text: query,
            sender: "user",
            time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
        };
        setMessages((prev) => [...prev, userMsg]);
        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/query/`, { query });

            const botMsg = {
                id: Date.now() + 1,
                text: response.data.summary || "Analysis complete",
                sender: "bot",
                time: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
                data: response.data,
            };

            setMessages((prev) => [...prev, botMsg]);
            setResponseData(response.data);
            setQuery("");
        } catch (error) {
            const errorMsg = {
                id: Date.now() + 1,
                text: "Sorry, there was an error processing your request.",
                sender: "bot",
                time: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            };
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    const handleSuggestion = (suggestion) => {
        setQuery(suggestion);
    };

    const clearChat = () => {
        setMessages([]);
        setResponseData(null);
    };

    // Quick suggestions
    const suggestions = [
        "Analyze Wakad",
        "Compare Aundh and Baner",
        "Show price growth for Akurdi over the last 3 years",
        "Analyze Hinjewadi",
        "Compare Wakad and Akurdi",
    ];

    return (
        <Container fluid className="p-0">
            <Row className="g-0">
                {/* Left Panel - Chat */}
                <Col lg={6} className="p-3">
                    <Card className="h-100 shadow border-0">
                        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                                <Robot size={24} className="me-2" />
                                <h5 className="mb-0">Real Estate Assistant</h5>
                            </div>
                            <Button
                                variant="outline-light"
                                size="sm"
                                onClick={clearChat}
                                disabled={messages.length === 0}
                            >
                                Clear Chat
                            </Button>
                        </Card.Header>

                        <Card.Body
                            className="d-flex flex-column"
                            style={{ minHeight: "500px" }}
                        >
                            {/* Welcome message */}
                            {messages.length === 0 && (
                                <div className="text-center my-auto py-4">
                                    <div className="mb-4">
                                        <BarChart
                                            size={48}
                                            className="text-primary mb-3"
                                        />
                                        <h4>Welcome! 👋</h4>
                                        <p className="text-muted">
                                            I can help you analyze real estate
                                            data. Try asking about:
                                        </p>
                                    </div>

                                    <div className="suggestions mb-4">
                                        {suggestions.map((suggestion, idx) => (
                                            <Button
                                                key={idx}
                                                variant="outline-primary"
                                                size="sm"
                                                className="m-1"
                                                onClick={() =>
                                                    handleSuggestion(suggestion)
                                                }
                                            >
                                                {suggestion}
                                            </Button>
                                        ))}
                                    </div>

                                    <div className="mt-4">
                                        <small className="text-muted">
                                            <Lightbulb className="me-1" />
                                            Available areas:{" "}
                                            {availableAreas.join(", ")}
                                        </small>
                                    </div>
                                </div>
                            )}

                            {/* Messages */}
                            <div className="flex-grow-1 overflow-auto mb-3">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`d-flex mb-3 ${
                                            msg.sender === "user"
                                                ? "justify-content-end"
                                                : "justify-content-start"
                                        }`}
                                    >
                                        <div
                                            className={`message-bubble ${
                                                msg.sender === "user"
                                                    ? "user-message"
                                                    : "bot-message"
                                            }`}
                                            style={{ maxWidth: "70%" }}
                                        >
                                            <div className="d-flex align-items-center mb-1">
                                                {msg.sender === "user" ? (
                                                    <User
                                                        size={14}
                                                        className="me-1"
                                                    />
                                                ) : (
                                                    <Robot
                                                        size={14}
                                                        className="me-1"
                                                    />
                                                )}
                                                <small className="text-muted">
                                                    {msg.time}
                                                </small>
                                            </div>
                                            <div>{msg.text}</div>
                                        </div>
                                    </div>
                                ))}
                                {loading && (
                                    <div className="d-flex justify-content-start mb-3">
                                        <div className="message-bubble bot-message">
                                            <Spinner
                                                animation="border"
                                                size="sm"
                                                className="me-2"
                                            />
                                            Analyzing your query...
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Form */}
                            <Form onSubmit={handleSubmit} className="mt-auto">
                                <InputGroup>
                                    <Form.Control
                                        type="text"
                                        value={query}
                                        onChange={(e) =>
                                            setQuery(e.target.value)
                                        }
                                        placeholder="Type your query here... (e.g., Analyze Wakad)"
                                        disabled={loading}
                                        className="border-primary"
                                    />
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        disabled={!query.trim() || loading}
                                    >
                                        {loading ? (
                                            <Spinner
                                                animation="border"
                                                size="sm"
                                            />
                                        ) : (
                                            <Send />
                                        )}
                                    </Button>
                                </InputGroup>
                                <Form.Text className="text-muted">
                                    Examples: "Analyze [Area]", "Compare [Area1]
                                    and [Area2]", "Price growth for [Area]"
                                </Form.Text>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Right Panel - Results */}
                <Col lg={6} className="p-3">
                    <Card className="h-100 shadow border-0">
                        <Card.Header className="bg-light">
                            <h5 className="mb-0">📊 Analysis Results</h5>
                        </Card.Header>

                        <Card.Body className="overflow-auto">
                            {responseData ? (
                                <>
                                    {responseData.summary && (
                                        <SummaryCard
                                            summary={responseData.summary}
                                            queryType={responseData.type}
                                            area={
                                                responseData.area ||
                                                responseData.areas
                                            }
                                            years={responseData.years}
                                        />
                                    )}

                                    {responseData.chart_data && (
                                        <ChartDisplay
                                            chartData={responseData.chart_data}
                                            queryType={responseData.type}
                                            area={
                                                responseData.area ||
                                                responseData.areas
                                            }
                                            years={responseData.years}
                                        />
                                    )}

                                    {responseData.table_data && (
                                        <DataTable
                                            data={responseData.table_data}
                                            queryType={responseData.type}
                                        />
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-5">
                                    <div className="display-1 text-muted mb-3">
                                        📈
                                    </div>
                                    <h5>No Analysis Yet</h5>
                                    <p className="text-muted">
                                        Submit a query to see analysis results,
                                        charts, and data tables here.
                                    </p>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ChatInterface;
