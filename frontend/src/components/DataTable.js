import React, { useState } from "react";
import { Card, Table, Badge, Form } from "react-bootstrap";
import { Table as TableIcon } from "react-bootstrap-icons";

const DataTable = ({ data, queryType }) => {
    const [sortField, setSortField] = useState("year");
    const [sortDirection, setSortDirection] = useState("desc");

    if (!data || (Array.isArray(data) && data.length === 0)) {
        return null;
    }

    // Handle different data structures
    let tableData = [];
    let columns = [];

    if (Array.isArray(data)) {
        // Single area analysis
        tableData = data;
        if (data.length > 0) {
            columns = Object.keys(data[0]).filter((key) => key !== "area");
        }
    } else if (typeof data === "object") {
        // Comparison data
        if (data.area1 && data.area2) {
            tableData = [...data.area1, ...data.area2];
            if (data.area1.length > 0) {
                columns = Object.keys(data.area1[0]);
            }
        }
    }

    if (tableData.length === 0) {
        return (
            <Card className="mb-4 border-0 shadow-sm">
                <Card.Body className="text-center py-4">
                    <TableIcon size={32} className="text-muted mb-2" />
                    <p className="text-muted mb-0">No table data available</p>
                </Card.Body>
            </Card>
        );
    }

    // Sort data
    const sortedData = [...tableData].sort((a, b) => {
        let aVal = a[sortField];
        let bVal = b[sortField];

        if (typeof aVal === "string") aVal = aVal.toLowerCase();
        if (typeof bVal === "string") bVal = bVal.toLowerCase();

        if (sortDirection === "asc") {
            return aVal > bVal ? 1 : -1;
        } else {
            return aVal < bVal ? 1 : -1;
        }
    });

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    const formatValue = (key, value) => {
        if (key.includes("price")) {
            return `₹${value.toLocaleString()}`;
        }
        if (key.includes("size")) {
            return `${value.toLocaleString()} sq.ft`;
        }
        return value;
    };

    const getSortIcon = (field) => {
        if (sortField !== field) return null;
        return sortDirection === "asc" ? "↑" : "↓";
    };

    return (
        <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0">
                <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                        <TableIcon className="me-2" />
                        <h5 className="mb-0">Data Table</h5>
                    </div>
                    <Badge bg="light" text="dark">
                        {sortedData.length} Records
                    </Badge>
                </div>
            </Card.Header>

            <Card.Body className="p-0">
                <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                    <Table striped hover className="mb-0">
                        <thead
                            style={{
                                position: "sticky",
                                top: 0,
                                backgroundColor: "white",
                            }}
                        >
                            <tr>
                                {columns.map((col) => (
                                    <th
                                        key={col}
                                        onClick={() => handleSort(col)}
                                        style={{ cursor: "pointer" }}
                                        className="border-bottom-0"
                                    >
                                        <div className="d-flex align-items-center">
                                            {col
                                                .replace(/_/g, " ")
                                                .toUpperCase()}
                                            <span className="ms-1">
                                                {getSortIcon(col)}
                                            </span>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {sortedData.map((row, idx) => (
                                <tr key={idx}>
                                    {columns.map((col) => (
                                        <td key={col}>
                                            {formatValue(col, row[col])}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>

                <div className="p-3 border-top bg-light">
                    <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                            Click column headers to sort
                        </small>
                        <Form.Select
                            size="sm"
                            style={{ width: "auto" }}
                            value={sortField}
                            onChange={(e) => handleSort(e.target.value)}
                        >
                            {columns.map((col) => (
                                <option key={col} value={col}>
                                    Sort by {col.replace(/_/g, " ")}
                                </option>
                            ))}
                        </Form.Select>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};

export default DataTable;
