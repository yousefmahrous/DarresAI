import Sidebar from "../../components/Sidebar";
import LessonPanel from "../../components/LessonPanel";
import ChatPanel from "../../components/ChatPanel";
import ChatInput from "../../components/ChatInput";

export default function ChatPage() {
  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />

      <main className="flex-1 p-8">

        <h1 className="text-4xl font-bold">
          AI Tutor
        </h1>

        <p className="text-gray-400 mt-2">
          Learn with your personal AI tutor.
        </p>

        <div className="grid grid-cols-2 gap-6 mt-8">

          <LessonPanel />

          <div className="flex flex-col">
            <ChatPanel />
            {/* <ChatInput /> */}
          </div>

        </div>

      </main>
    </div>
  );
}