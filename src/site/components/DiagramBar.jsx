import { useState, useRef, useEffect } from "react";

function ItemField({ value, onCommit,style }) {
  const [draft, setDraft] = useState(String(value));
  // sync if the committed value changes externally
  useEffect(() => setDraft(String(value)), [value]);
  return (
    <input
      value={draft}
      onChange={e => setDraft(e.target.value)}
      onBlur={() => onCommit(draft)}
      style={style}
    />
  );
}



export default function DiagramBar({onItemsChange}) {
    let counter = useRef(0);
    const [items, setItems] = useState([]);
    const [openId, setOpenId] = useState(null);
    const [err, setErr] = useState({});

    function makeItem() {
        counter.current++;
        const id = counter.current;
        const next = [...items, {id, name: `Component ${id}`, type: "Init", scale: 1.0, rotation: 0.0, translation: [0.0,0.0], data: null, rawdata: "", color: "darkseagreen", rawoptions: "", options: {}}]
        setItems(next);
        onItemsChange(next, err);
    }
    function removeItem(id) {
        const next = items.filter((i) => i.id !== id);
        setItems(next);
        onItemsChange(next, err);
        if (openId == id) setOpenId(null);
    }

    function updateItem(id, field, value) {
        setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));
        if (field == "rawdata") {
          let part_re = /^ *\[ *(?:\d+ *, *)*\d+ *\] *$/;
          let skew_re = /^ *(\[ *(?:\d+ *, *)*\d+ *\]) *\\ *(\[ *(?:\d+ *, *)*\d+ *\]) *$/;
          let path_re = /^ *(\( *[\d\.-]+ *, *[\d\.-]+ *\) *-- *)+(\( *[\d\.-]+ *, *[\d\.-]+ *\))? *$/;
          let invalid_nonneg = (x => Number.isNaN(x) || x <= 0);
          let invalid_part = (x => x.slice(0,-1).some((p, i) => p < x[i+1]));
          let error = null;
          if (part_re.test(value)) {
            let part = JSON.parse(value).map(s => parseInt(s));
            if (part.some(invalid_nonneg) || invalid_part(part)) {
              part = [];
              error = "Invalid partition given.";
            }
            setErr(prev => ({...prev, [`${id}.${field}`]: error}));
            const next = items.map(i => i.id === id ? { ...i, ["type"]: "Part", ["data"]: {"part": part}, [field]: value } : i);
            setItems(next);
            onItemsChange(next);
            // setItems(prev => prev.map(i => i.id === id ? { ...i, ["type"]: "Part", ["data"]: {"part": part}, [field]: value } : i));
            return
          }
          if (skew_re.test(value)) {
            let matches = value.match(skew_re);
            let original = JSON.parse(matches[1]).map(s => parseInt(s));
            let removed = JSON.parse(matches[2]).map(s => parseInt(s));
            if (original.some(invalid_nonneg) || removed.some(invalid_nonneg) 
                  || invalid_part(original) || invalid_part(removed)) {
              original = [];
              removed = [];
              error = "Invalid partition given."
            }
            if (original.length < removed.length || removed.some((x,i) => x > original[i])) {
              original = [];
              removed = [];
              error = "First partition must entirely contain second partition for skew partitions."
            }
            setErr(prev => ({...prev, [`${id}.${field}`]: error}));
            const next = items.map(i => i.id === id ? { ...i, ["type"]: "Skew", ["data"]: {"part": original, "skew": removed}, [field]: value } : i);
            setItems(next);
            onItemsChange(next);
            // setItems(prev => prev.map(i => i.id === id ? { ...i, ["type"]: "Skew", ["data"]: {"part": original, "skew": removed}, [field]: value } : i));
            return
          }

          if (path_re.test(value)) {
            let stripped = value.replace(/\s/g, '');
            let closed = stripped[stripped.length-1] == "-";
            let pairs = stripped.split("--");
            if (closed) {
              pairs[pairs.length-1] = pairs[0]
            }
            pairs = pairs.map(s => s.replace(/[\(\)]/g, '').split(","));
            pairs = pairs.map(arr => [parseFloat(arr[0]),parseFloat(arr[1])]);
            if (pairs.some(arr => Number.isNaN(arr[0]) || Number.isNaN(arr[1]))) {
              pairs = [];
              error = "Invalid path given.";
            }
            setErr(prev => ({...prev, [`${id}.${field}`]: error}));
            const next = items.map(i => i.id === id ? { ...i, ["type"]: "Path", ["data"]: {"points": pairs}, [field]: value } : i);
            setItems(next);
            onItemsChange(next);
            // setItems(prev => prev.map(i => i.id === id ? { ...i, ["type"]: "Path", ["data"]: {"points": pairs}, [field]: value } : i));
            return
          }
          setErr(prev => ({...prev, [`${id}.${field}`]: "Unknown data given."}));


        }
        
        if (field == "rotation" || field == "scale") {
          value = parseFloat(value);
          if (Number.isNaN(value)) {
            setErr(prev => ({...prev, [`${id}.${field}`]: "Invalid float value."}));
            value = field == "rotation" ? 0 : 1;
          }
          if (field == "scale" && value <= 0) {
            setErr(prev => ({...prev, [`${id}.${field}`]: "Scale should be a positive number."}));
            value = 1;
          }
        }

        if (field == "translation") {
          let pair_re = "^ *[\d\.-]+ *, *[\d\.-]+ *$";
          let stripped = value.replace(/\s/g, '');
          let pair = stripped.split(',').map(s => parseFloat(s));
          if (pair.some(x => Number.isNaN(x))) {
            setErr(prev => ({...prev, [`${id}.${field}`]: "Field should be pair of floats."}));
            pair = [0,0];
          }
          value = [pair[0],pair[1]];

        }

        if (field == "color") {
          const s = new Option().style;
          s.color = value
          s.color = s.color ? s.color : "lightcoral";
        }

        if (field == "rawoptions") {
          let opts = {};
          try {
            opts = Function(`"use strict"; return ({${value}})`)();
          } catch {
            opts = {};
          }
          console.log(opts);
          const next = items.map(i => i.id === id ? { ...i, ["options"]: opts, [field]: value } : i);
          setItems(next);
          onItemsChange(next);
          return;
        }

        const next = items.map(i => i.id === id ? { ...i, [field]: value } : i);
        setItems(next);
        onItemsChange(next);

        // setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));
    }

    function handleDragStart(e, id) {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("id", id);
    }

    function handleDrop(e, targetId) {
      e.preventDefault();
      const draggedId = Number(e.dataTransfer.getData("id"));
      if (draggedId === targetId) return;

      const from = items.findIndex((i) => i.id === draggedId);
      const to = items.findIndex((i) => i.id === targetId);
      const next = [...items];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);

      setItems(next);
      onItemsChange(next, err);
    }

    const selected = items.find((i) => i.id === openId) ?? null;

return (
    <div>
      {/* Horizontal button row */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        <button
          onClick={makeItem}
          style={{
            padding: "7px 14px",
            fontSize: 13,
            fontWeight: 600,
            border: "1px dashed #aaa",
            borderRadius: 6,
            background: "#fff",
            cursor: "pointer",
            color: "#555",
          }}
        >
          + New
        </button>
 
        {items.map((item) => (
          <button
            draggable
            onDragStart={(e) => handleDragStart(e, item.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, item.id)}
            key={item.id}
            onClick={() => setOpenId(openId === item.id ? null : item.id)}
            style={{
              padding: "7px 14px",
              fontSize: 13,
              fontWeight: 500,
              border: "1px solid",
              borderColor: openId === item.id ? "#378ADD" : "#ddd",
              borderRadius: 6,
              background: openId === item.id ? "#EBF4FF" : "#fff",
              color: openId === item.id ? "#185FA5" : "#333",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {item.name}
          </button>
        ))}
      </div>
 
      {/* Single editor panel below the row */}
      {selected && (
        <div
        key={selected.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 16,
            background: "#fafafa",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 , width: "100%"}}>
            <label style={{ fontSize: 12, color: "#666" }}>
            Label
            <input
              value={selected.name}
              onChange={(e) => updateItem(selected.id, "name", e.target.value)}
              style={{
                display: "block",
                width: "50%",
                marginTop: 4,
                padding: "6px 10px",
                fontSize: 13,
                border: "1px solid #ddd",
                borderRadius: 6,
              }}
            />
          </label>
              <label style={{ fontSize: 12, color: "#666" }}>
              Rotation Angle
              <ItemField
                  value={selected.rotation}
                  onCommit={v => updateItem(selected.id, "rotation", v)}
                  style={{display: "block",
                  width: "30%",
                  marginTop: 4,
                  padding: "6px 10px",
                  fontSize: 13,
                  border: "1px solid #ddd",
                  borderRadius: 6,}}
                />
            </label>
            <label style={{ fontSize: 12, color: "#666" }}>
              Scale
              <ItemField
                  value={selected.scale}
                  onCommit={v => updateItem(selected.id, "scale", v)}
                  style={{ display: "block",
                  width: "20%",
                  marginTop: 4,
                  padding: "6px 10px",
                  fontSize: 13,
                  border: "1px solid #ddd",
                  borderRadius: 6,}}
                />
            </label>
            <label style={{ fontSize: 12, color: "#666" }}>
              Offset
              <ItemField
                  value={selected.translation}
                  onCommit={v => updateItem(selected.id, "translation", v)}
                  style={{display: "block",
                  width: "40%",
                  marginTop: 4,
                  padding: "6px 10px",
                  fontSize: 13,
                  border: "1px solid #ddd",
                  borderRadius: 6,}}
                />
            </label>

          </div>

          <label style={{ fontSize: 12, color: "#666" }}>
            Data
            <input
              value={selected.rawdata}
              onChange={(e) => updateItem(selected.id, "rawdata", e.target.value)}
              style={{
                display: "block",
                width: "60%",
                marginTop: 4,
                padding: "6px 10px",
                fontSize: 13,
                border: "1px solid #ddd",
                borderRadius: 6,
              }}
            />
          </label>

          <label style={{ fontSize: 12, color: "#666" }}>
              Color
              <ItemField
                  value={selected.color}
                  onCommit={v => updateItem(selected.id, "color", v)}
                  style={{ display: "block",
                  width: "30%",
                  marginTop: 4,
                  padding: "6px 10px",
                  fontSize: 13,
                  border: "1px solid #ddd",
                  borderRadius: 6,}}
                />
            </label>

          <label style={{ fontSize: 12, color: "#666" }}>
              Adv. Options
              <ItemField
                  value={selected.rawoptions}
                  onCommit={v => updateItem(selected.id, "rawoptions", v)}
                  style={{ display: "block",
                  width: "30%",
                  marginTop: 4,
                  padding: "6px 10px",
                  fontSize: 13,
                  border: "1px solid #ddd",
                  borderRadius: 6,}}
                />
            </label>
 
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={() => removeItem(selected.id)}
              style={{
                padding: "5px 12px",
                fontSize: 12,
                border: "1px solid #fca5a5",
                borderRadius: 6,
                background: "none",
                color: "#dc2626",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
          {Object.entries(err).filter(([, msg]) => msg).map(([key, msg]) => {
  const [id, field] = key.split(".");
  const name = items.find(i => i.id === Number(id))?.name ?? id;
  return <div key={key} style={{ color: "#dc2626", fontSize: 11 }}>{name} — {field}: {msg}</div>;
})}
        </div>
      )}
    </div>
  );
}