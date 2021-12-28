import { data } from "autoprefixer";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { currentTrackState, isPlayingState } from "../atom/songAtom";
import useEufy from "../hooks/useEufy";
import useSongInfo from "../hooks/useSongInfo";

function Player() {
  const EufyApi = useEufy();
  const { data: session, status } = useSession();
  const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackState);
  const [isplaying, setIsplaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(50);

  const songInfo = useSongInfo();

  const fetchCurrentSong = () => {
      if(!songInfo){
          EufyApi.getMyCurrentPlayingTrack().then(data => {
              console.log("Now Playing: ", data?.body?.item)
              setCurrentTrackId(data.body?.item?.id)

              EufyApi.getMyCurrentPlaybackState().then(data =>{
                  //console.log("Now Playing: " , data?.body)
                  setIsplaying(data.body?.is_playing)
              })
          })
      }
  }

  useEffect(() => {

    if(EufyApi.getAccessToken() && !currentTrackId){
        fetchCurrentSong();
        setVolume(50)
    }
      
  }, [currentTrackId, EufyApi, session])

  return (
    <div>
      {/* left */}
      <div>
        <img
          className="hidden md:inline h-10 w-10"
          src={songInfo?.album.images?.[0]?.url}
        ></img>
      </div>

      {/* mid */}
      {/* right */}
    </div>
  );
}

export default Player;
