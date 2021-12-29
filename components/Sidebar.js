import React, { useEffect, useState } from "react";
import {
  HomeIcon,
  SearchIcon,
  LibraryIcon,
  PlusCircleIcon,
  RssIcon,
} from "@heroicons/react/outline";
import { HeartIcon } from "@heroicons/react/solid";
import { signOut, useSession } from "next-auth/react";
import useEufy from "../hooks/useEufy";
import { useRecoilState } from "recoil";
import { playlistIdState } from "../atom/playlistAtom";

function Sidebar() {
  const EufyApi = useEufy();
  const { data: session, status } = useSession();
  const [playlist, setPlaylist] = useState([]);
  const [playlistid, setPlaylistId] = useRecoilState(playlistIdState);

  useEffect(() => {
    if (EufyApi.getAccessToken()) {
      EufyApi.getUserPlaylists().then((data) => {
        setPlaylist(data.body.items);
      });
    }
  }, [session, EufyApi]);

  //console.log(session);
  //console.log(playlist);
  //console.log(playlistid)
  return (
    <div
      className="text-gray-500 p-5 text-xs lg:text-sm border-r border-gray-900 overflow-y-scroll
    h-screen scrollbar-hide sm:max-w-[12rem] lg:max-w-[15rem] hidden md:inline-flex pb-36"
    >
      <div className="space-y-4">
        <button className="flex items-center space-x-2 hover:text-white">
          <HomeIcon className="h-5 w-5" />
          <p>Home</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <SearchIcon className="h-5 w-5" />
          <p>Search</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <LibraryIcon className="h-5 w-5" />
          <p>Your Library</p>
        </button>

        <hr className="border-t-[0.1px] border-gray-900" />

        <button className="flex items-center space-x-2 hover:text-white">
          <PlusCircleIcon className="h-5 w-5" />
          <p>Create Playlist</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <HeartIcon className="h-5 w-5 text-blue-500 " />
          <p>Liked Song</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <RssIcon className="h-5 w-5 text-green-500 " />
          <p>Your episodes</p>
        </button>

        <hr className="border-t-[0.1px] border-gray-900" />

        {/* Playlist */}

        {playlist.map((items) => (
          <p
            key={items.id}
            className="cursor-pointer hover:text-white"
            onClick={() => setPlaylistId(items.id)}
          >
            {items.name}
          </p>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
