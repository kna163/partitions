import streamlit as st
from bokeh.plotting import figure
from bokeh.models import ColumnDataSource
from streamlit_bokeh import streamlit_bokeh_events

# 1. Define your states (each with its own grid size or any content)
STATES = [
    {"title": "Slide 1: 5×4 Grid", "m": 5, "n": 4},
    {"title": "Slide 2: 3×6 Grid", "m": 3, "n": 6},
    {"title": "Slide 3: 4×4 Grid", "m": 4, "n": 4},
]

# 2. Initialize page index
if "page" not in st.session_state:
    st.session_state.page = 0

# 3. Navigation buttons
left_col, center_col, right_col = st.columns([1, 6, 1])
with left_col:
    if st.button("←", key="prev") and st.session_state.page > 0:
        st.session_state.page -= 1

with right_col:
    if st.button("→", key="next") and st.session_state.page < len(STATES) - 1:
        st.session_state.page += 1

# 4. Pull current state
state = STATES[st.session_state.page]
st.markdown(f"## {state['title']}")

# 5. Build Bokeh grid plot
def make_grid_plot(m, n):
    xs = [i for i in range(m) for _ in range(n)]
    ys = [j for j in range(n) for _ in range(m)]
    src = ColumnDataSource(data=dict(x=xs, y=ys))
    p = figure(
        width=400, height=400,
        tools="tap", title=f"{m}×{n} Grid"
    )
    p.circle("x", "y", size=15, source=src)
    return p

plot = make_grid_plot(state["m"], state["n"])
st.bokeh_chart(plot, use_container_width=True)

# 6. Handle clicks in Python
res = streamlit_bokeh_events(
    plot, events="tap", key=f"grid_{st.session_state.page}",
    refresh_on_update=True, debounce_time=0
)

if res and "tap" in res:
    x = res["tap"]["x"]
    y = res["tap"]["y"]
    total = x + y
    st.write(f"Clicked dot at ({x}, {y}) → Sum: {total}")