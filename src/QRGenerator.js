import React, { useState, useRef } from "react";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";

const QRGenerator = () => {
  const [text, setText] = useState("");
  // Valeurs par défaut pour le QR code
  const [fgColor] = useState("#ffffff");
  const [bgColor] = useState("#121212");
  const [size] = useState(256);
  const [renderAs] = useState("canvas");

  // Référence pour l'élément contenant le QR code (pour le téléchargement)
  const qrRef = useRef(null);

  const handleDownload = () => {
    if (renderAs === "canvas" && qrRef.current) {
      const canvas = qrRef.current.querySelector("canvas");
      if (canvas) {
        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = "qrcode.png";
        link.click();
      } else {
        console.error("Canvas introuvable.");
      }
    } else if (renderAs === "svg") {
      const svgElement = document.getElementById("qr-svg");
      if (svgElement) {
        const serializer = new XMLSerializer();
        const source = serializer.serializeToString(svgElement);
        const blob = new Blob([source], {
          type: "image/svg+xml;charset=utf-8",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "qrcode.svg";
        link.click();
        URL.revokeObjectURL(url);
      }
    }
  };

  return (
    <div
      className="qr-generator-container"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem",
        padding: "1rem",
      }}
    >
      {/* En-tête avec logo et titre */}
      <header className="header" style={{ textAlign: "center" }}>
        <h1>QRCode Generator</h1>
      </header>

      {/* Barre de saisie d'URL */}
      <div
        className="url-input-bar"
        style={{ width: "100%", maxWidth: "500px" }}
      >
        {" "}
        <input
          id="url-input"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Entrez votre texte ou lien ici"
          style={{
            width: "100%",
            padding: "0.75rem",
            fontSize: "1.2rem",
            border: "1px solid #444",
            borderRadius: "8px",
            textAlign: "center",
          }}
        />
      </div>

      {/* Affichage du QR Code */}
      <div className="qr-display" ref={qrRef} style={{ textAlign: "center" }}>
        {renderAs === "canvas" ? (
          <QRCodeCanvas
            value={text}
            size={size}
            bgColor={bgColor}
            fgColor={fgColor}
            level="L"
            includeMargin={true}
          />
        ) : (
          <QRCodeSVG
            id="qr-svg"
            value={text}
            size={size}
            bgColor={bgColor}
            fgColor={fgColor}
            level="L"
            includeMargin={true}
          />
        )}
        <div>
          <button
            onClick={handleDownload}
            style={{
              marginTop: "1rem",
              padding: "1rem 1.5rem",
              fontSize: "1rem",
              border: "none",
              borderRadius: "8px",
              backgroundColor: "#fefefe",
              color: "#000",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Télécharger le QRCode
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRGenerator;
