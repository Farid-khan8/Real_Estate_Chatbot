import React from "react";
import { Card, Badge } from "react-bootstrap";
import { BarChart, CompareArrows, TrendingUp } from "react-bootstrap-icons";
import { MdCompareArrows } from "react-icons/md";
import { FiTrendingUp } from "react-icons/fi";

const SummaryCard = ({ summary, queryType, area, years }) => {
    const getIcon = () => {
        switch (queryType) {
            case "analysis":
                return <BarChart className="me-2" />;
            case "comparison":
                return <CompareArrows className="me-2" />;
            case "trend":
                return <TrendingUp className="me-2" />;
            default:
                return <BarChart className="me-2" />;
        }
    };

    const getBadgeColor = () => {
        switch (queryType) {
            case "analysis":
                return "primary";
            case "comparison":
                return "success";
            case "trend":
                return "warning";
            default:
                return "secondary";
        }
    };

    return (
        <Card className="mb-4 border-0 shadow-sm">
            <Card.Header className="bg-white border-0">
                <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                        {getIcon()}
                        <h5 className="mb-0">Analysis Summary</h5>
                    </div>
                    <div>
                        <Badge bg={getBadgeColor()} className="me-2">
                            {queryType?.toUpperCase() || "ANALYSIS"}
                        </Badge>
                        {years && <Badge bg="info">{years} Years</Badge>}
                    </div>
                </div>
            </Card.Header>
            <Card.Body>
                <div className="summary-content">
                    {summary?.split("\n").map((line, idx) => (
                        <p
                            key={idx}
                            className={
                                line.trim().startsWith("•")
                                    ? "mb-2 ps-3"
                                    : "mb-3"
                            }
                            style={{ lineHeight: "1.6" }}
                        >
                            {line.trim()}
                        </p>
                    ))}
                </div>
            </Card.Body>
        </Card>
    );
};

export default SummaryCard;
