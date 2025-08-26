import React, { useState } from "react";

const docs = [
  {
    name: "Function A",
    description: "This function does X.",
    examples: ["Example 1", "Example 2"],
  },
  {
    name: "Function B",
    description: "This function does Y.",
    examples: ["Example 1"],
  },
];

const CollapsibleItem = ({ item }) => {
  const [openDesc, setOpenDesc] = useState(false);
  const [openExamples, setOpenExamples] = useState(false);

  return (
    <div style={{ marginBottom: "8px" }}>
      <div
        onClick={() => setOpenDesc(!openDesc)}
        style={{ cursor: "pointer", fontWeight: "bold" }}
      >
        {item.name}
      </div>
      {openDesc && (
        <div style={{ paddingLeft: "16px", marginTop: "4px" }}>
          <div>{item.description}</div>
          {item.examples?.length > 0 && (
            <div
              onClick={() => setOpenExamples(!openExamples)}
              style={{ cursor: "pointer", color: "blue", marginTop: "4px" }}
            >
              {openExamples ? "Hide Examples" : "Show Examples"}
            </div>
          )}
          {openExamples &&
            item.examples.map((ex, idx) => (
              <div key={idx} style={{ paddingLeft: "16px" }}>
                {ex}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      style={{
        width: collapsed ? "50px" : "250px",
        transition: "width 0.2s",
        borderLeft: "1px solid #ddd",
        background: "#f9f9f9",
        padding: "8px",
        overflowY: "auto", // independent scroll
      }}
    >
      <button onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? "←" : "→"}
      </button>
      {!collapsed &&
        docs.map((item, idx) => <CollapsibleItem key={idx} item={item} />)}
    </div>
  );
}