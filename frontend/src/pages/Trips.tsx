import Navbar from '../components/Navbar';
import MapImage from '../assets/uploadmap.svg';
import ButtonSolid from '../components/ButtonSolid';
import { useEffect, useRef, useState } from 'react';
import UploadIcon from '../assets/uploadicon.svg';
import CrossIcon from '../assets/cross.svg';
import ButtonHollow from '../components/ButtonHollow';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';
import { GpsPoint, Trip } from '../types';
import axios from 'axios';
import { BackendUrl } from '../config';

const Trips = () => {
  const navigate = useNavigate();

  const userid = localStorage.getItem('userid');
  const authToken = localStorage.getItem('token');

  const [tripName, setTripName] = useState<string>('');
  const [gpsData, setGpsData] = useState<GpsPoint[]>([]);

  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<Boolean>(false);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrips, setSelectedTrips] = useState<string[]>([]);
  const [selectedTripIds, setSelectedTripsIds] = useState<string[]>([]);

  const inputUploadRef = useRef<HTMLInputElement | null>(null);

  const onUploadClick = () => {
    inputUploadRef?.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target?.files?.[0];

    if (file) {
      setSelectedFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const data = new Uint8Array(event.target?.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        const mapdata = jsonData.map((point: any) => {
          const jsDate = new Date((point.timestamp - 25569) * 86400 * 1000); // Convert to milliseconds

          return {
            latitude: point.latitude,
            longitude: point.longitude,
            timestamp: jsDate,
            ignition: point.ignition === 'on', // Convert 'on'/'off' to true/false
          };
        });

        setGpsData([...mapdata]);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleSelectedTripChange = (
    id: string,
    actualId: string,
    checked: boolean
  ) => {
    let currentSelectedTrip = selectedTrips;
    let currentSelectedTripId = selectedTripIds;
    if (checked && !currentSelectedTrip.includes(id)) {
      currentSelectedTrip.push(id);
    } else if (!checked && currentSelectedTrip.includes(id)) {
      currentSelectedTrip = currentSelectedTrip.filter(
        (trip: any) => trip !== id
      );
    }

    if (checked && !currentSelectedTripId.includes(actualId)) {
      currentSelectedTripId.push(actualId);
    } else if (!checked && currentSelectedTripId.includes(actualId)) {
      currentSelectedTripId = currentSelectedTripId.filter(
        (trip: any) => trip !== actualId
      );
    }
    setSelectedTrips([...currentSelectedTrip]);
    setSelectedTripsIds([...currentSelectedTripId]);
  };

  const openTrips = () => {
    if (selectedTrips.length > 0)
      navigate(`/map?trips=${selectedTrips.join(',')}`);
  };

  const saveTrip = async () => {
    if (!tripName || !gpsData) return;
    setTripName('');
    await axios
      .post(
        `${BackendUrl}/trip/createTrip`,
        {
          gpsData,
          name: tripName,
        },
        { headers: { Authorization: `Bearer ${authToken}` } }
      )
      .then((res) => {
        if (res.status === 200) {
          setModalOpen(false);
          const tempTrips = [...trips];
          if (res.data.trip?.name) {
            tempTrips.push(res.data.trip);
            setTrips(tempTrips);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getAllTrips = async () => {
    await axios
      .get(`${BackendUrl}/trip/getAllTrips`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .then((res) => {
        if (res.status === 200) {
          setTrips(res.data);
        }
      });
  };

  const deleteTrip = async (id: string) => {
    await axios
      .post(
        `${BackendUrl}/trip/deleteTrip`,
        { tripid: id },
        { headers: { Authorization: `Bearer ${authToken}` } }
      )
      .then((res) => {
        if (res.status === 200) {
          console.log(`Trip: ${id} deleted`);
          setTrips((prevTrips) => prevTrips.filter((t) => t._id !== id));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteSelectedTrips = async () => {
    for (let i = 0; i < selectedTripIds.length; i++) {
      await deleteTrip(selectedTripIds[i]);
    }
    setSelectedTripsIds([]);
    setSelectedTrips([]);
  };

  useEffect(() => {
    if (!userid || !authToken) return navigate('/');
    getAllTrips();
  }, []);

  return (
    <div className="w-screen flex justify-center items-center flex-col">
      <Navbar />
      <div className="flex flex-col max-w-7xl py-6 w-full gap-4 px-4">
        <div className="w-full px-6 py-4 rounded-2xl border border-[rgba(169,169,169,1)] font-[500] text-2xl">
          <span className="text-3xl pr-2">👋</span> Welcome, User
        </div>

        {trips.length === 0 ? (
          <UploadBox setModalOpen={setModalOpen} />
        ) : (
          <>
            <div className="rounded-2xl border border-[rgba(169,169,169,1)] flex items-center p-6 gap-6 flex-wrap justify-center lg:justify-start">
              <ButtonSolid
                width="fit-content"
                text="Upload Trip"
                onClick={() => {
                  setModalOpen(true);
                }}
              />

              <div className="text-[rgba(156,156,156,1)]">
                Upload the <span className="font-[500] underline">Excel</span>{' '}
                sheet of your trip
              </div>
            </div>

            <div className="flex md:justify-between items-center flex-wrap gap-4 justify-center">
              <div className="text-2xl font-bold">Your Trips</div>
              <div className="flex gap-4 justify-center md:w-fit w-full">
                <div
                  onClick={deleteSelectedTrips}
                  className={`text-[rgba(22,45,58,1)] w-[8.5rem] text-center text-xl py-1.5 rounded-lg border border-[rgba(22,45,58,1)] cursor-pointer transition-all ${
                    selectedTrips.length === 0 ? 'opacity-50' : 'opacity-100'
                  }`}>
                  Delete
                </div>
                <div
                  onClick={openTrips}
                  className={`text-white w-[8.5rem] text-center text-xl py-1.5 rounded-lg border border-[rgba(22,45,58,1)] bg-[rgba(22,45,58,1)] cursor-pointer transition-all ${
                    selectedTrips.length === 0 ? 'opacity-50' : 'opacity-100'
                  }`}>
                  Open
                </div>
              </div>
            </div>

            <div className="flex flex-col mt-2 w-full">
              <div className="w-full flex items-center gap-4 bg-[#FAFAFA] p-3 border-b border-[#000] border-opacity-[6%]">
                <input
                  className="transition-all duration-500 ease-in-out w-4 h-4"
                  type="checkbox"
                  disabled
                />
                <label className="text-sm opacity-85 font-[500]">Trips</label>
              </div>

              {trips.map((trip) => {
                return (
                  <label
                    key={trip._id}
                    htmlFor={trip._id}
                    className="w-full flex items-center gap-4 p-3 border-b border-[#000] border-opacity-[6%]">
                    <input
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        handleSelectedTripChange(
                          trip.tripIndex.toString(),
                          trip._id,
                          event.target.checked
                        );
                      }}
                      id={trip._id}
                      className="transition-all duration-500 ease-in-out w-4 h-4"
                      type="checkbox"
                    />
                    <span className="text-sm opacity-85 font-[500]">
                      {trip.name}
                    </span>
                  </label>
                );
              })}
            </div>
          </>
        )}
      </div>

      {modalOpen && (
        <UploadModal
          setModalOpen={setModalOpen}
          inputUploadRef={inputUploadRef}
          handleFileChange={handleFileChange}
          onUploadClick={onUploadClick}
          tripName={tripName}
          setTripName={setTripName}
          saveTrip={saveTrip}
          selectedFileName={selectedFileName}
        />
      )}
    </div>
  );
};

const UploadModal = ({
  setModalOpen,
  inputUploadRef,
  handleFileChange,
  onUploadClick,
  tripName,
  setTripName,
  saveTrip,
  selectedFileName,
}: UploadModalType) => {
  return (
    <div className="w-screen h-screen bg-black bg-opacity-50 absolute top-0 left-0 flex justify-center items-center">
      <div className="w-[34rem] rounded-lg flex flex-col py-8 px-3 gap-5 bg-white items-center relative">
        <div
          onClick={() => {
            setModalOpen(false);
          }}
          className="absolute aspect-square w-6 top-4 right-4 cursor-pointer">
          <img src={CrossIcon} alt="Cross" className="w-full" />
        </div>

        <div className="w-full rounded-lg border border-[rgba(212,215,227,1)] overflow-hidden px-4 py-1.5 max-w-[24.5rem] mt-5">
          <input
            type="text"
            name="Trip"
            placeholder="Trip Name*"
            className="outline-none bg-transparent w-full text-sm"
            value={tripName}
            onChange={(e) => {
              e.preventDefault();
              setTripName(e.target.value);
            }}
          />
        </div>

        <div
          onClick={onUploadClick}
          className="flex items-center flex-col gap-2 py-4 px-6 max-w-[24.5rem] w-full border border-[rgba(0,178,255,1)] rounded-lg cursor-pointer">
          <div className="aspect-square w-[3.125rem]">
            <img src={UploadIcon} alt="Cross" className="w-full" />
          </div>
          <div className="text-[rgba(0,178,255,1)]">
            {selectedFileName ? (
              "You've selected " + selectedFileName
            ) : (
              <>
                Click here to upload the{' '}
                <span className="font-[500] underline">Excel</span> sheet of
                your trip
              </>
            )}
          </div>
          <input
            type="file"
            name="upload"
            id="uploadfile"
            ref={inputUploadRef}
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            hidden
          />
        </div>

        <div className="max-w-[24.5rem] w-full flex gap-4 md:flex-nowrap flex-wrap">
          <ButtonHollow
            text="Cancel"
            width="100%"
            onClick={() => {
              setModalOpen(false);
            }}
          />
          <ButtonSolid text="Save" width="100%" onClick={saveTrip} />
        </div>
      </div>
    </div>
  );
};

const UploadBox = ({ setModalOpen }: UploadBox) => {
  return (
    <div className="rounded-2xl border border-[rgba(169,169,169,1)] flex justify-center items-center py-9 flex-col">
      <div className="w-[12.5rem] mt-9 mb-14">
        <img src={MapImage} alt="MapImg" className="w-full" />
      </div>

      <ButtonSolid
        width="fit-content"
        text="Upload Trip"
        onClick={() => {
          setModalOpen(true);
        }}
      />

      <div className="mt-6 text-[rgba(156,156,156,1)]">
        Upload the <span className="font-[500] underline">Excel</span> sheet of
        your trip
      </div>
    </div>
  );
};
interface UploadBox {
  setModalOpen: (modalOpen: Boolean) => void;
}

interface UploadModalType {
  setModalOpen: (modalOpen: Boolean) => void;
  inputUploadRef: React.MutableRefObject<HTMLInputElement | null>;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUploadClick: () => void;
  tripName: string;
  setTripName: (name: string) => void;
  saveTrip: () => void;
  selectedFileName: string;
}

export default Trips;
