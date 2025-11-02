import React, { useRef } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";

/**
 * Pannellum 360° Panorama Viewer
 *
 * @param {Object} props
 * @param {string} props.imageUrl - URL or local path to 360° image
 * @param {boolean} props.autoRotate - Auto rotate the panorama (default: false)
 * @param {number} props.autoRotateSpeed - Rotation speed (default: 2)
 * @param {number} props.initialYaw - Starting horizontal angle (default: 0)
 * @param {number} props.initialPitch - Starting vertical angle (default: 0)
 */
export default function PannellumViewer({
  imageUrl,
  autoRotate = false,
  autoRotateSpeed = 2,
  initialYaw = 0,
  initialPitch = 0,
}) {
  const webViewRef = useRef(null);

  // Generate HTML with Pannellum
  const generateHTML = () => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <title>360° Panorama</title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css"/>
      <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js"></script>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        html, body {
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        #panorama {
          width: 100%;
          height: 100%;
        }
        .pnlm-load-box {
          background-color: rgba(0, 0, 0, 0.8);
          border-radius: 8px;
        }
        .pnlm-load-box p {
          color: #fff;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
      </style>
    </head>
    <body>
      <div id="panorama"></div>
      <script>
        pannellum.viewer('panorama', {
          "type": "equirectangular",
          "panorama": "${imageUrl}",
          "autoLoad": true,
          "autoRotate": ${autoRotate ? autoRotateSpeed : 0},
          "showControls": true,
          "showFullscreenCtrl": false,
          "showZoomCtrl": true,
          "mouseZoom": true,
          "draggable": true,
          "keyboardZoom": false,
          "friction": 0.15,
          "hfov": 100,
          "yaw": ${initialYaw},
          "pitch": ${initialPitch},
          "minHfov": 50,
          "maxHfov": 120,
          "compass": false,
          "hotSpotDebug": false
        });
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ html: generateHTML() }}
        style={styles.webview}
        originWhitelist={["*"]}
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}
        mixedContentMode="always"
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#6366F1" />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  webview: {
    flex: 1,
    backgroundColor: "transparent",
  },
  loading: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
});
