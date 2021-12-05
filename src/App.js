// Import dependencies
import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
// 1. TODO - Import required model here
// e.g. import * as tfmodel from "@tensorflow-models/mmodel";
import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import "./App.css";
// 2. TODO - Import drawing utility here
// e.g. import { drawRect } from "./utilities";
import { drawRect } from "./utilities";
import './App.css'
// import Timer from "./components/timer.js";
import ding from "./ding.mp3";
import "./check.scss";
import $ from "jquery";


function App() {

let is_moving = false;
let count = 0;

const move = () => {
  if (is_moving) {
    return;
  }
  is_moving = true;
  if (count > 0) {
    $('.circle-loader').toggleClass('load-complete');
    $('.checkmark').toggle();
  }
  document.getElementById("cl").style.visibility = "visible";
  var elem = document.getElementById("myBar");  
  var audio = new Audio(ding); 
  var width = 0;
  var id = setInterval(frame, 10);
  function frame() {
    if (width >= 100) {
      audio.play();
      clearInterval(id);
      $('.circle-loader').toggleClass('load-complete');
      $('.checkmark').toggle();
      is_moving = false;
      count++;
    } else {
      width++; 
      elem.style.width = width + '%'; 
      elem.innerHTML = width * 1  + '%';
    }
  }
}


  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // Main function
  const runCoco = async () => {
    // 3. TODO - Load network 
    // e.g. const net = await cocossd.load();
    const net = await cocossd.load();
    
    //  Loop and detect hands
    setInterval(() => {
      detect(net);
    }, 10);
  };

  const detect = async (net) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // 4. TODO - Make Detections
      // e.g. const obj = await net.detect(video);
      const obj = await net.detect(video);
      // console.log(obj);

      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");

      // 5. TODO - Update drawing utility
      // drawSomething(obj, ctx)  
      drawRect(obj, ctx);
    }
  };

  useEffect(()=>{runCoco()},[]);

  return (
    <div className="App">
      <div style={{display: "flex", background: "#282C34", height: "100vh"}}>
        {/* <Timer /> */}
        <div style={{flex: 1, marginTop: "25vh"}}>
        <Webcam
          ref={webcamRef}
          muted={true} 
          style={{
            position: "absolute",
            // marginLeft: "auto",
            // marginRight: "auto",
            marginLeft: "100px",
            // marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            // marginLeft: "auto",
            // marginRight: "auto",
            marginLeft: "100px",
            // marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 8,
            width: 640,
            height: 480,
          }}
        />
        </div>
        <div style={{flex:1, marginTop: "30vh", marginRight: "10rem"}}>
          <h2 style={{color: "white"}}>Prueba de Amor Verdadero</h2>
        <div className="w3-light-grey" style={{margin: "0 3rem 0 3rem"}}>
          <div id="myBar" className="w3-container w3-green" style={{width: '0%'}}>0%</div>
        </div>
        <br />
        <button className="w3-button w3-green" onClick={move}>Escanear Ahora</button>
        <br /><br />
        <div id="cl" className="circle-loader" style={{visibility: "hidden"}}>
        <div className="checkmark draw"></div>
        </div>
      </div>
      </div>
    </div>

    
  );

  
}

export default App;
