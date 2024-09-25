import React from "react";
import "../style/Main.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClockRotateLeft } from "@fortawesome/free-solid-svg-icons";

function LeftSidebar({ isOpen, toggleSidebar }) {
  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <button className="toggle-button" onClick={toggleSidebar}>
        <FontAwesomeIcon icon={faClockRotateLeft} />
      </button>
      {isOpen && (
        <div className="sidebar-content">
          <p>여기에 사이드바 내용이 들어갑니다.</p>
        </div>
      )}
    </div>
  );
}

export default LeftSidebar;