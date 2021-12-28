import { currentTrackState } from "../atom/songAtom";
import { useEffect, useState } from "react";
import useEufy from "./useEufy";
import { useRecoilState } from "recoil";


function useSongInfo() {
    const EufyApi = useEufy();
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackState);
    const [songInfo, setSongInfo] = useState(null);

    useEffect(() => {

        const fetchSongInfo = async () => {
            if(currentTrackId){
                const trackInfo = await fetch(
                    `https://api.spotify.com/v1/tracks/${currentTrackId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${EufyApi.getAccessToken()}`,
                        },
                    }


                ).then(res => res.json());

                setSongInfo(trackInfo)
            }
        }
        fetchSongInfo();
        
    }, [EufyApi, currentTrackId])

    return songInfo;
}

export default useSongInfo
