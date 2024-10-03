import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Tooltip,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ButtonSolid from '../components/ButtonSolid';
import BackArrowSvg from '../assets/back_arrow.svg';
import StopMkrIcon from '../assets/stopmkr.svg';
import IdleMkrIcon from '../assets/idlemkr.svg';
import { Icon } from 'leaflet';
import axios from 'axios';
import { BackendUrl } from '../config';
import { Trip } from '../types';
import DistanceIcon from '../assets/distanceIcon.svg';
import DurationIcon from '../assets/durationIcon.svg';
import OverDisIcon from '../assets/overdisicon.svg';
import OverDurIcon from '../assets/overDurIcon.svg';
import StopDurIcon from '../assets/stopduricon.svg';
import IdleDurIcon from '../assets/idledur.svg';

const Map = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [tripIndexes, setTripIndexes] = useState<string[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [allTrips, setAllTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<number>(0);

  const userid = localStorage.getItem('userid');
  const authToken = localStorage.getItem('token');

  const IdleMarker = new Icon({
    iconUrl: IdleMkrIcon,
    iconAnchor: [10, 10],
  });

  const StopMarker = new Icon({
    iconUrl: StopMkrIcon,
    iconAnchor: [10, 10],
  });

  const getTripsByIndex = async () => {
    const t: Trip[] = [];
    for (let i = 0; i < tripIndexes.length; i++) {
      await axios
        .post(
          `${BackendUrl}/trip/getTripByUserIndex`,
          {
            tripIndex: tripIndexes[i],
          },
          { headers: { Authorization: `Bearer ${authToken}` } }
        )
        .then((res) => {
          if (res.status === 200) {
            t.push(res.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    setTrips(t);
    setAllTrips(t);
    if (t.length === 1) {
      setSelectedTrip(t[0].tripIndex);
    }
  };

  const selectTrip = (index: number) => {
    setSelectedTrip(index);
    if (index === 0) setTrips(allTrips);
    else setTrips(allTrips.filter((trip) => trip.tripIndex === index));
  };

  useEffect(() => {
    if (!userid || !authToken) return navigate('/');
    const tripIndexesParam = searchParams.get('trips');
    if (tripIndexesParam) {
      const tripIndexArray = tripIndexesParam.split(',');
      setTripIndexes(tripIndexArray);
    } else navigate('/trips');
  }, []);

  useEffect(() => {
    getTripsByIndex();
  }, [tripIndexes]);

  return (
    <div className="w-screen flex justify-center items-center flex-col">
      <Navbar />
      <div className="flex flex-col max-w-7xl py-6 w-full gap-4 px-4">
        <button
          className="w-fit"
          onClick={() => {
            navigate('/trips');
          }}>
          <img src={BackArrowSvg} alt="backshot" />
        </button>
        <div className="w-full px-6 py-4 rounded-2xl border border-[rgba(169,169,169,1)] flex justify-between items-center gap-4">
          <span className="text-2xl font-[500]">
            {selectedTrip === 0 ? 'All Trips' : trips[0].name}
          </span>
          {/* <ButtonSolid width="8.5rem" text="New" onClick={() => {}} /> */}
        </div>
        <div className="gap-6 flex">
          <div className="flex gap-1.5 items-center">
            <span className="bg-[#0038FF] size-6 rounded-full"></span>
            Stopped
          </div>

          <div className="flex gap-1.5 items-center">
            <span className="bg-[#FF00B8] size-6 rounded-full"></span>
            Idle
          </div>

          <div className="flex gap-1.5 items-center">
            <span className="bg-[#00FFD1] size-6 rounded-full"></span>
            Over speeding
          </div>
        </div>
        <div className="w-full h-[40rem]">
          {trips?.length > 0 ? (
            <MapContainer
              center={trips[0].tripRoute[0]}
              zoom={15}
              minZoom={14}
              maxZoom={16}
              scrollWheelZoom={false}
              className="h-full w-full">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              {trips.map((trip) => {
                return (
                  <Polyline
                    key={`route-${trip._id}`}
                    positions={trip.tripRoute}
                    weight={7}
                    color="#00B2FF"
                  />
                );
              })}
              {trips.map((trip) => {
                return trip?.overspeeds?.map((overspeed, i) => {
                  return (
                    <Polyline
                      key={`overspeed-${trip._id + i}`}
                      positions={overspeed}
                      weight={7}
                      color="#00FFD1"
                    />
                  );
                });
              })}

              {trips.map((trip) => {
                return (
                  <Marker
                    key={`start-${trip._id}`}
                    position={trip.tripRoute[0]}>
                    <Tooltip permanent>Start</Tooltip>
                  </Marker>
                );
              })}

              {trips.map((trip) => {
                return (
                  <Marker
                    key={`end-${trip._id}`}
                    position={trip.tripRoute[trip.tripRoute.length - 1]}>
                    <Tooltip permanent>End</Tooltip>
                  </Marker>
                );
              })}

              {trips.map((trip) => {
                return trip.stoppages.map((stop, i) => (
                  <Marker
                    key={`stoppage-${i}-${trip._id}`}
                    position={[stop.latitude, stop.longitude]}
                    icon={StopMarker}>
                    <Tooltip>Stopped for {stop.duration} Seconds</Tooltip>
                  </Marker>
                ));
              })}

              {trips.map((trip) => {
                return trip.idles.map((idle, i) => (
                  <Marker
                    key={`idle-${i}-${trip._id}`}
                    position={[idle.latitude, idle.longitude]}
                    icon={IdleMarker}>
                    <Tooltip>Idle for {idle.duration} Seconds</Tooltip>
                  </Marker>
                ));
              })}
            </MapContainer>
          ) : (
            'Loading...'
          )}
        </div>

        {allTrips.length > 1 && (
          <div className="w-full flex gap-5 border-b border-opacity-25">
            <span
              onClick={() => {
                selectTrip(0);
              }}
              className={`text-sm cursor-pointer py-2 border-b ${
                selectedTrip === 0
                  ? 'text-[#1890FF] border-[#1890FF]'
                  : 'opacity-25'
              }`}>
              All
            </span>
            {allTrips.map((trip) => {
              return (
                <span
                  onClick={() => {
                    selectTrip(trip.tripIndex);
                  }}
                  key={trip.name}
                  className={`text-sm cursor-pointer py-2 border-b ${
                    selectedTrip === trip.tripIndex
                      ? 'text-[#1890FF] border-[#1890FF]'
                      : 'opacity-25'
                  }`}>
                  {trip.name}
                </span>
              );
            })}
          </div>
        )}

        {selectedTrip === 0 ? (
          <div className="text-2xl font-semibold w-full text-center my-4">
            Please Select a specific trip to view details
          </div>
        ) : (
          <>
            <div className="flex gap-3 overflow-y-auto w-full max-w-7xl">
              <div className="min-w-[14.5rem] max-w-[14.5rem] h-[7.5rem] rounded-lg border border-[#A9A9A9] p-4">
                <img src={DistanceIcon} alt="DistanceIcon" />
                <div className="mt-1 w-full text-center text-2xl font-[500]">
                  {trips[0].distance && trips[0].distance / 1000} KM
                </div>
                <div className="text-center">Total Distanced Travelled</div>
              </div>
              <div className="min-w-[14.5rem] max-w-[14.5rem] h-[7.5rem] rounded-lg border border-[#A9A9A9] p-4">
                <img src={DurationIcon} alt="DurationIcon" />
                <div className="mt-1 w-full text-center text-2xl font-[500]">
                  {trips[0].duration && Math.floor(trips[0].duration / 60)} Min
                </div>
                <div className="text-center">Total Travelled Duration</div>
              </div>
              <div className="min-w-[14.5rem] max-w-[14.5rem] h-[7.5rem] rounded-lg border border-[#A9A9A9] p-4">
                <img src={OverDisIcon} alt="OverDisIcon" />
                <div className="mt-1 w-full text-center text-2xl font-[500]">
                  {trips[0].overspeeddistance &&
                    trips[0].overspeeddistance / 1000}{' '}
                  KM
                </div>
                <div className="text-center">Over Speeding Distance</div>
              </div>
              <div className="min-w-[14.5rem] max-w-[14.5rem] h-[7.5rem] rounded-lg border border-[#A9A9A9] p-4">
                <img src={OverDurIcon} alt="OverDurIcon" />
                <div className="mt-1 w-full text-center text-2xl font-[500]">
                  {trips[0].overspeedduration &&
                    Math.floor(trips[0].overspeedduration / 60)}{' '}
                  Min
                </div>
                <div className="text-center">Over Speeding Duration</div>
              </div>
              <div className="min-w-[14.5rem] max-w-[14.5rem] h-[7.5rem] rounded-lg border border-[#A9A9A9] p-4">
                <img src={StopDurIcon} alt="StopDurIcon" />
                <div className="mt-1 w-full text-center text-2xl font-[500]">
                  {trips[0].stopduration &&
                    Math.floor(trips[0].stopduration / 60)}{' '}
                  Min
                </div>
                <div className="text-center">Stopped Duration</div>
              </div>
              <div className="min-w-[14.5rem] max-w-[14.5rem] h-[7.5rem] rounded-lg border border-[#A9A9A9] p-4">
                <img src={IdleDurIcon} alt="IdleDurIcon" />
                <div className="mt-1 w-full text-center text-2xl font-[500]">
                  {trips[0].idleduration &&
                    Math.floor(trips[0].idleduration / 60)}{' '}
                  Min
                </div>
                <div className="text-center">Idle Duration</div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr>
                    <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Latitude
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Longitude
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Ignition
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {trips[0].gpsData.map((trip, index) => (
                    <tr key={index} className="hover:bg-gray-100">
                      <td className="px-6 py-4 whitespace-nowrap border-b border-gray-300 text-sm text-gray-700">
                        {trip.latitude}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border-b border-gray-300 text-sm text-gray-700">
                        {trip.longitude}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border-b border-gray-300 text-sm text-gray-700">
                        {new Date(trip.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border-b border-gray-300 text-sm text-gray-700">
                        {trip.ignition ? 'On' : 'Off'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Map;
