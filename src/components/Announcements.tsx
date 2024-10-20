const Announcements = () => {
  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Announcements</h1>
        <span className="text-xs">View All</span>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        <div className="bg-yellow rounded-md p-4">
          <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-600">Hello </h2>
            <span className="text-sm text-gray-400 bg-white rounded-md px-1 py-1">
              2024-23-06
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi saepe
            perferendis animi officia, ratione, eius optio, a quia modi eos
          </p>
        </div>

        <div className="bg-lightGreen rounded-md p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-600">Hello </h2>
            <span className="text-sm text-gray-400 bg-white rounded-md px-1 py-1">
              2024-23-06
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi saepe
            perferendis animi officia, ratione, eius optio, a quia modi eos
          </p>
        </div>

        <div className="bg-yellow rounded-md p-4">
          <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-600">Hello </h2>
            <span className="text-sm text-gray-400 bg-white rounded-md px-1 py-1">
              2024-23-06
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi saepe
            perferendis animi officia, ratione, eius optio, a quia modi eos
          </p>
        </div>
      </div>
    </div>
  );
};

export default Announcements;
