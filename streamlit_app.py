import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import random
from backend.app.bracket_data import get_real_bracket, get_match_analytics
from datetime import datetime

# Page config
st.set_page_config(page_title="FIFA AI Predictor", layout="wide", initial_sidebar_state="expanded")

# CSS Styling to mimic the modern dark theme
st.markdown("""
<style>
    .reportview-container {
        background: #0f1219;
        color: white;
    }
    .sidebar .sidebar-content {
        background: #151821;
    }
    h1, h2, h3, h4 {
        color: #ffffff;
    }
    .stMetric {
        background-color: #1a1e28;
        padding: 15px;
        border-radius: 10px;
        border: 1px solid #333;
    }
</style>
""", unsafe_allow_html=True)

# Sidebar Navigation
st.sidebar.title("🏆 FIFA AI Predictor")
st.sidebar.markdown("---")
page = st.sidebar.radio("Navigation", ["Dashboard", "Knockout Stage"])

st.sidebar.markdown("---")
st.sidebar.info("Model: Live-Elo-v5.0")
st.sidebar.info("Status: Live Data (July 10, 2026)")

if page == "Dashboard":
    st.title("World Cup AI Dashboard")
    st.markdown("Real-time predictive analytics and tournament state.")
    
    # Top Metrics
    col1, col2, col3, col4 = st.columns(4)
    col1.metric("Tournament Stage", "Quarter-finals")
    col2.metric("Completed Matches", "57 / 64")
    col3.metric("Simulations Run", "250,000")
    col4.metric("Live Accuracy", "88.5%")
    
    st.markdown("---")
    
    st.subheader("Tournament Contenders (Win Probability)")
    
    # Mock Champion Probs
    teams = ["Argentina", "France", "England", "Spain", "Belgium", "Switzerland", "Morocco", "Norway"]
    probs = [31.5, 24.2, 18.1, 12.5, 6.8, 3.4, 2.2, 1.3]
    
    df = pd.DataFrame({"Team": teams, "Probability (%)": probs})
    df = df.sort_values(by="Probability (%)", ascending=True)
    
    fig = px.bar(df, x="Probability (%)", y="Team", orientation='h', 
                 title="AI Predicted Winner", color="Probability (%)",
                 color_continuous_scale="Blues")
    fig.update_layout(plot_bgcolor="rgba(0,0,0,0)", paper_bgcolor="rgba(0,0,0,0)", font_color="white")
    
    st.plotly_chart(fig, use_container_width=True)
    
elif page == "Knockout Stage":
    st.title("Knockout Stage Predictions")
    
    bracket_data = get_real_bracket()
    
    st.markdown("### Quarter-finals")
    qf_cols = st.columns(4)
    
    for i, match in enumerate(bracket_data["quarterfinals"]):
        with qf_cols[i]:
            st.markdown(f"**{match['home']} vs {match['away']}**")
            if match["status"] == "completed":
                st.success(f"Score: {match['home_score']} - {match['away_score']}")
            else:
                st.info(f"Upcoming")
                st.write(f"Home Win: {match['home_win_prob']}%")
                st.write(f"Away Win: {match['away_win_prob']}%")
            
            if st.button(f"Analyze Match {i+1}", key=match['id']):
                st.session_state['selected_match'] = match['id']
                
    if 'selected_match' in st.session_state:
        st.markdown("---")
        analytics = get_match_analytics(st.session_state['selected_match'])
        st.subheader("Match AI Analytics")
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.markdown("#### Team Strengths (Radar)")
            # Radar chart
            categories = [r['metric'] for r in analytics['radar']]
            home_vals = [r['home'] for r in analytics['radar']]
            away_vals = [r['away'] for r in analytics['radar']]
            
            fig_radar = go.Figure()
            fig_radar.add_trace(go.Scatterpolar(r=home_vals, theta=categories, fill='toself', name='Home'))
            fig_radar.add_trace(go.Scatterpolar(r=away_vals, theta=categories, fill='toself', name='Away'))
            fig_radar.update_layout(polar=dict(radialaxis=dict(visible=True, range=[0, 100])),
                                    plot_bgcolor="rgba(0,0,0,0)", paper_bgcolor="rgba(0,0,0,0)", font_color="white")
            st.plotly_chart(fig_radar, use_container_width=True)
            
        with col2:
            st.markdown("#### SHAP Feature Importance")
            shap_data = analytics['shap']
            df_shap = pd.DataFrame(shap_data)
            fig_shap = px.bar(df_shap, x="value", y="feature", orientation='h', color="value",
                              color_continuous_scale="RdBu", title="Impact on Prediction")
            fig_shap.update_layout(plot_bgcolor="rgba(0,0,0,0)", paper_bgcolor="rgba(0,0,0,0)", font_color="white")
            st.plotly_chart(fig_shap, use_container_width=True)
