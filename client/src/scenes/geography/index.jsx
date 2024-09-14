import React, { useState, useRef } from "react";
import { MapContainer, TileLayer, Polygon, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { statesData } from "state/geoData"; 
import { dataUser } from "data"; 
import { Card, CardContent, CardHeader, Typography, Box, Button, Collapse } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import FlexBetween from "components/FlexBetween";
import Header from "components/Header"; 


const getUserDataByCity = (cityName) => {
  return dataUser.find(user => user.city === cityName) || {};
};

const center = [36.715252, 10.416049];
const defaultZoom = 10;

export default function App() {
  const [hoveredCity, setHoveredCity] = useState(null);
  const [showTransactions, setShowTransactions] = useState(false);
  const theme = useTheme();
  const userData = getUserDataByCity(hoveredCity);

  // Create a reference for the map instance
  const mapRef = useRef();

  // Debugging: check user data
  console.log('User Data:', userData);
  console.log('Show Transactions:', showTransactions);

  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <Header title="Map" subtitle="Map your Datacenters" />
      </FlexBetween>

      <MapContainer
        center={center}
        zoom={defaultZoom}
        style={{ width: '100vw', height: '100vh' }}
        ref={mapRef} 
      >
        <TileLayer
          url="https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=0qb0gu3aqvCK4DMGof9d"
          attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
        />
        {
          statesData.features.map((state) => {
            const coordinates = state.geometry.coordinates.map((item) => [item[1], item[0]]);
            const cityName = state.properties.name;

            return (
              <Polygon
                key={cityName}
                pathOptions={{
                  fillColor: '#FD8D3C',
                  fillOpacity: 0.7,
                  weight: 2,
                  opacity: 1,
                  dashArray: 3,
                  color: 'white'
                }}
                positions={coordinates}
                eventHandlers={{
                  mouseover: (e) => {
                    const layer = e.target;
                    layer.setStyle({
                      dashArray: "",
                      fillColor: "#BD0026",
                      fillOpacity: 0.7,
                      weight: 2,
                      opacity: 1,
                      color: "white",
                    });
                    setHoveredCity(cityName);
                  },
                  mouseout: (e) => {
                    const layer = e.target;
                    layer.setStyle({
                      fillOpacity: 0.7,
                      weight: 2,
                      dashArray: "3",
                      color: 'white',
                      fillColor: '#FD8D3C'
                    });
                    setHoveredCity(null);
                  },
                  click: () => {
                    if (mapRef.current) {
                      // Programmatically set the view to the city's center and zoom in
                      const latLngBounds = e.target.getBounds();
                      mapRef.current.setView(latLngBounds.getCenter(), 13); 
                    }
                  }
                }}
              />
            );
          })
        }
        {/* Example Polyline */}
        <Polyline
          pathOptions={{ color: 'blue' }}
          positions={[
            [40.63463151377654, -97.89969605983609],
            [40.73463151377654, -97.99969605983609]
          ]}
        />
      </MapContainer>

      {/* Card Display */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          zIndex: 1000,
          width: '300px', // Adjust width
          backgroundColor: 'white',
          boxShadow: 3,
          borderRadius: 2
        }}
      >
        {hoveredCity && (
          <Card>
            <CardHeader
              title={hoveredCity}
              sx={{ backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText }}
            />
            <CardContent>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Id:</strong> {userData.id || 'N/A'}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Name:</strong> {userData.name || 'N/A'}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>IP Address:</strong> {userData.email || 'N/A'} {/* Assuming IP is in email field */}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Occupation:</strong> {userData.occupation || 'N/A'}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setShowTransactions(!showTransactions)}
                sx={{ mt: 2 }}
              >
                {showTransactions ? 'Hide Transactions' : 'Show Transactions'}
              </Button>
              <Collapse in={showTransactions}>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>Transactions:</strong>
                  </Typography>
                  {/* Display transactions here */}
                  {userData.transactions && userData.transactions.length > 0 ? (
                    <ul>
                      {userData.transactions.map((transaction, index) => (
                        <li key={index}>
                          {`ID: ${transaction.id}, Amount: ${transaction.amount}, Date: ${transaction.date}`}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <Typography variant="body2">No transactions available.</Typography>
                  )}
                </Box>
              </Collapse>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
}
