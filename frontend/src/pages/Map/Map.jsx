import React, { useState, useEffect, useRef } from "react";
import { YMaps, Map as YMap, Placemark } from '@pbe/react-yandex-maps';
import "./Map.css";

const Map = () => {
    const [center, setCenter] = useState([61.104872, 127.357230]);
    const [zoom, setZoom] = useState(5);
    const [userLocation, setUserLocation] = useState(null);

    const mapRef = useRef(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    console.log(`Широта: ${latitude}, Долгота: ${longitude}`);
                    setUserLocation([latitude, longitude]);
                    setCenter([latitude, longitude]);
                    setZoom(12);
                },
                (error) => {
                    console.error("Ошибка получения геолокации:", error.message);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 60000
                }
            );
        } else {
            console.log("Geolocation не поддерживается браузером.");
        }
    }, []);

    const handleCurrentPosition = () => {
        if (userLocation && mapRef.current) {
            mapRef.current.setCenter(userLocation);
            mapRef.current.setZoom(12);
        } else {
            alert("Current location not available yet.");
        }
    };


    const handleZoomIn = () => {
        setZoom((z) => Math.min(z + 1, 20));
    };

    const handleZoomOut = () => {
        setZoom((z) => Math.max(z - 1, 1));
    };

    return (
        <div className="Map--Container" style={{ height: "100vh" }}>
            <YMaps>
                <YMap
                    instanceRef={mapRef}
                    state={{ center, zoom }}
                    width="100%"
                    height="90%"
                >
                    {userLocation && <Placemark geometry={userLocation} />}
                </YMap>
            </YMaps>

            <div className="Nav--Bar" style={{ display: "flex", justifyContent: "center", padding: "10px" }}>
                <button onClick={handleCurrentPosition}>Current position</button>
                <button className="Nav--Bar__btn" onClick={handleZoomIn}>+</button>
                <button className="Nav--Bar__btn" onClick={handleZoomOut}>-</button>
            </div>
        </div>
    );
};

export default Map;
