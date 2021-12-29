import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import { useRecoilState } from "recoil";
import { currentTrackState, isPlayingState } from "../atom/songAtom";
import useEufy from "../hooks/useEufy";
import useSongInfo from "../hooks/useSongInfo";
import { debounce } from "lodash";
import {
  RewindIcon,
  SwitchHorizontalIcon,
  FastForwardIcon,
  PauseIcon,
  PlayIcon,
  ReplyIcon,
  VolumeUpIcon,
} from "@heroicons/react/solid";
import {
  HeartIcon,
  VolumeUpIcon as VolumeDownIcon,
} from "@heroicons/react/outline";


function Player() {
  const EufyApi = useEufy();
  const { data: session, status } = useSession();
  const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackState);
  const [isplaying, setIsplaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(50);

  const songInfo = useSongInfo();

  const fetchCurrentSong = () => {
    if (!songInfo) {
      EufyApi.getMyCurrentPlayingTrack().then((data) => {
        console.log("Now Playing: ", data?.body?.item);
        setCurrentTrackId(data.body?.item?.id);

        EufyApi.getMyCurrentPlaybackState().then((data) => {
          //console.log("Now Playing: " , data?.body)
          setIsplaying(data.body?.is_playing);
        });
      });
    }
  };

  // function debounce(func, timeout = 500) {
  //   let timer;
  //   return (...args) => {
  //     clearTimeout(timer);
  //     timer = setTimeout(() => {
  //       func.apply(this, args);
  //     }, timeout);
  //   };
  // }

  useEffect(() => {
    if (EufyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong();
      setVolume(50);
    }
  }, [currentTrackId, EufyApi, session]);

  // For volume 
  useEffect(() => {
    if( volume > 0 && volume < 100){
      debouncedAdjustVolume(volume);
    }
  }, [volume])

  const debouncedAdjustVolume = useCallback(
    debounce((volume) => {
      EufyApi.setVolume(volume).catch((err) => {});
    }, 500),
    []
  )

  const handlePlayPause = () => {
    EufyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body.is_playing) {
        EufyApi.pause();
        setIsplaying(false);
      } else {
        EufyApi.play();
        setIsplaying(true);
      }
    });
  };

  return (
    <div
      className="h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3
    text-xs md:text-base px-2 md:px-8"
    >
      {/* left */}
      <div className="flex items-center space-x-4">
        <img
          className="hidden md:inline h-10 w-10"
          src={songInfo?.album.images?.[0]?.url}
        ></img>

        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0]?.name}</p>
        </div>
      </div>

      {/* mid */}
      <div className="flex items-center justify-evenly ">
        <SwitchHorizontalIcon className="button" />
        <RewindIcon
          onClick={() => EufyApi.skipToPrevious()}
          className="button"
        />

        {isplaying ? (
          <PauseIcon onClick={handlePlayPause} className="button w-10 h-10" />
        ) : (
          <PlayIcon onClick={handlePlayPause} className="button w-10 h-10" />
        )}

        <FastForwardIcon
          onClick={() => EufyApi.skipToNext()}
          className="button"
        />

        <ReplyIcon className="button" />
      </div>

      {/* right */}

      <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
        <VolumeDownIcon
          onClick={() => volume > 0 && setVolume(Math.max(0, volume - 10))}
          className="button"
        />
        <input
          className="w-14 md:w-28"
          type="range"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          min={0}
          max={100}
        />
        <VolumeUpIcon
          onClick={() => volume < 100 && setVolume(Math.min(100, volume + 10))}
          className="button"
        />
      </div>
    </div>
  );
}

export default Player;
