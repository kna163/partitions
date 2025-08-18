from bokeh.plotting import figure
from bokeh.models import ColumnDataSource
from streamlit_bokeh_events import streamlit_bokeh_events
import streamlit as st

def make_grid_plot(m: int, n: int) -> figure:
    xs = [i for i in range(m) for _ in range(n)]
    ys = [j for _ in range(n) for _ in range(m)]
    src = ColumnDataSource(data=dict(x=xs, y=ys))

    p = figure(
        width=400, height=400,
        title=f"{m}×{n} Grid – Click a dot",
        tools="tap"
    )
    p.circle('x', 'y', size=15, source=src)
    return p

def handle_click_event(key: str, plot: figure):
    result = streamlit_bokeh_events(
        plot,
        events="tap",
        key=key,
        refresh_on_update=True,
        debounce_time=0,
        override_height=420
    )
    if result and "tap" in result:
        x = result["tap"]["x"]
        y = result["tap"]["y"]
        total = x + y
        st.write(f"Clicked: ({x}, {y}) → Sum: {total}")