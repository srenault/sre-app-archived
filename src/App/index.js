import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import Nav from "./Nav";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";

import './App.css';

const AppRouter = () => (
  <Router>
    <div className="dashboard">
      <Header />
      <Nav />
      <Main />
      <Footer />
    </div>
  </Router>
);

export default AppRouter;
