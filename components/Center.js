import { ChevronDownIcon } from "@heroicons/react/outline";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { playlistIdState, playlistState } from "../atom/playlistAtom";
import useEufy from "../hooks/useEufy";
import Songs from "./Songs";

const colors = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500",
];

function Center() {
  const { data: session } = useSession();
  const EufyApi = useEufy();
  const [color, setColor] = useState(null);
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);

  // For color change whenever playlistId changes
  useEffect(() => {
    setColor(colors[Math.floor(Math.random() * colors.length)]);
  }, [playlistId]);

  // For playlist change
  useEffect(() => {
    if (EufyApi.getAccessToken()) {
      EufyApi.getPlaylist(playlistId)
        .then((data) => {
          setPlaylist(data.body);
        })
        .catch((err) => console.log("Something went wrong! ", err));
    }
  }, [EufyApi, playlistId]);

  //console.log(playlist);
  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide ">
      <header className="absolute top-5 right-8">
        <div
          className="flex items-center bg-black space-x-3 
                    opacity-90 hover:opacity-80 cursor-pointer rounded-full p-2 pr-2 text-white"
          onClick={signOut}
        >
          <img
            className="rounded-full w-10 h-10"
            src={session?.user.image}
            alt=""
          ></img>
          <h2 className="text-white">{session?.user.name}</h2>
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </header>

      <section
        className={`flex items-end space-x-7 bg-gradient-to-b ${color} to-black
                 h-80 text-white p-8`}
      >
        <img
          className="w-44 h-44 shadow-2xl"
          src={playlist?.images?.[0].url}
          alt=""
        />
        <div>
          <p>PLAYLIST</p>
          <h1 className=" text-2xl md:text-3xl lg:text-5xl text-white">{playlist?.name}</h1>
        </div>
      </section>

      {/* Songs */}
      <div>
        <Songs />
      </div>
    </div>
  );
}

export default Center;
