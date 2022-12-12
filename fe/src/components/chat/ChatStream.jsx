import React, { useState } from "react";
import { useEffect } from "react";
import { StreamChat } from "stream-chat";
import {
  Chat,
  ChannelList,
  Channel,
  Window,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
} from "stream-chat-react";
// import "stream-chat-react/dist/css/index.css";
import "stream-chat-react/dist/css/v2/index.css";
import LoadingPage from "../loading/LoadingPage";
import DashboardHeading from "../../module/dashboard/DashboardHeding";
import { key } from "../../utils/constants/key";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ChatStream = () => {
  const { current } = useSelector((state) => state.user);
  const tokenStream = localStorage.getItem("tokenStream");
  const navigate = useNavigate();

  useEffect(() => {
    if (current === null) {
      toast.dismiss();
      toast.warning("Vui lòng đăng nhập");
      navigate("/sign-in");
    }
  }, [current]);

  const user = {
    name: current?.name,
    image: current?.avatar,
    id: current?._id,
    role: current?.role,
  };

  const admin = {
    name: "Admin",
    image:
      "https://decg5lu73tfmh.cloudfront.net/static/images/comprofiler/gallery/operator/operator_m.png",
    id: current?._id,
    role: current?.role,
  };

  const [client, setClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [role, setRole] = useState("user");

  useEffect(() => {
    async function init() {
      const chatClient = StreamChat.getInstance(key.REACT_APP_STREAM_API_KEY);
      if (user?.role === "user") {
        await chatClient.connectUser(user, tokenStream);
        const channel = chatClient.channel("messaging", {
          members: ["6370de3a54ea3d5abac936d7", user?.id],
        });
        await channel.watch();

        setChannel(channel);
      } else {
        await chatClient.connectUser(admin, tokenStream);
        setRole("admin");
      }

      setClient(chatClient);
    }
    init();

    if (client)
      return () => {
        setClient(null);
        client.disconnectUser();
      };
  }, [user.id, tokenStream]);

  if (!client)
    return (
      <>
        <div className="bg-white rounded-lg">
          <DashboardHeading
            title="Chat online"
            className="px-5 py-5"
          ></DashboardHeading>
          <LoadingPage />
        </div>
      </>
    );

  const filters = { type: "messaging", members: { $in: [user.id] } };
  const filtersAdmin = { type: "messaging", members: { $in: [admin.id] } };
  const sorts = { last_message_at: -1 };

  return (
    <>
      {" "}
      <div className="bg-white rounded-lg">
        <DashboardHeading
          title="Chat online"
          className="px-5 py-5"
        ></DashboardHeading>
        <div className="w-[1100px] h-[750px] rounded-lg mx-auto ">
          <Chat client={client} theme="messaging light">
            <div className="chat">
              {role === "user" && (
                <>
                  {" "}
                  <ChannelList filters={filters} sort={sorts} />
                  <Channel>
                    <Window>
                      <ChannelHeader />
                      <MessageList />
                      <MessageInput />
                    </Window>
                    <Thread />
                  </Channel>
                </>
              )}
              {role === "admin" && (
                <>
                  {" "}
                  <ChannelList filters={filtersAdmin} sort={sorts} />
                  <Channel>
                    <Window>
                      <ChannelHeader />
                      <MessageList />
                      <MessageInput />
                    </Window>
                    <Thread />
                  </Channel>
                </>
              )}
            </div>
          </Chat>
        </div>
      </div>
    </>
  );
};

export default ChatStream;
