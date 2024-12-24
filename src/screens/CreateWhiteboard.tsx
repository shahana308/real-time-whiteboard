"use client";

export const CreateWhiteboard = () => {
  const handleStartWhiteboard = () => {
    const randomId = Math.random().toString(36).substring(2, 9);
    const newWhiteboardLink = `${window.location.origin}/whiteboard/${randomId}`;
    window.location.href = newWhiteboardLink;
  };

  const handleJoinWhiteboard = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const link = formData.get("whiteboardLink") as string;
    if (link) {
      window.location.href = link;
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Whiteboard Collaboration
        </h1>

        <button
          onClick={handleStartWhiteboard}
          className="w-full rounded-md bg-blue-500 py-2 text-white font-medium hover:bg-blue-600 transition duration-300"
        >
          Start New Whiteboard
        </button>

        <form onSubmit={handleJoinWhiteboard} className="space-y-4">
          <label
            htmlFor="whiteboardLink"
            className="block text-gray-700 font-medium"
          >
            Join a Whiteboard
          </label>
          <input
            type="text"
            name="whiteboardLink"
            id="whiteboardLink"
            placeholder="Paste your whiteboard link here"
            className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 px-4 py-2"
            required
          />
          <button
            type="submit"
            className="w-full rounded-md bg-green-500 py-2 text-white font-medium hover:bg-green-600 transition duration-300"
          >
            Join Whiteboard
          </button>
        </form>
      </div>
    </div>
  );
};
