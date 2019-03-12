import React, { Component } from 'react';
import { BrowserRouter as Router, Link } from "react-router-dom";

import Nav from "./Nav";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";

import './App.css';

const AppRouter = ({ apiClient }) => (
  <Router>
    <div className="dashboard">
      <Header />
      <Nav />
      <Main apiClient={apiClient} />
      <Footer />
    </div>
  </Router>
);

export default AppRouter;
