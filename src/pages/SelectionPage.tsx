import { useNavigate } from "react-router";
import { CameraKitContext } from "../contexts/CameraKitContext";
import { useContext } from "react";
function SelectionPage() {
  const navigate = useNavigate();
  const camraKit = useContext(CameraKitContext);

  const switchLenses = (groupname: "hats" | "glasses" | "lipsticks") => {
    camraKit?.changeLensGroup(groupname).then(() => {
      navigate("/filters");
    });
  };
  return (
    <div className="w-full h-screen bg-zinc-50 flex items-center justify-center">
      <div className="w-full h-full md:w-72 border  text-slate-900 space-y-5 pt-5">
        <div className="w-full flex justify-center text-xl">
          <h1> Select Category</h1>
        </div>
        <div className=" h-full flex-row justify-center ">
          <div className="font-bold">
            <div
              onClick={() => switchLenses("glasses")}
              className="flex justify-end h-28  items-center bg-[#eed7d1]   flex-row md:max-w-xl  "
            >
              <div className=" w-2/4 text-bold text-2xl text-center">
                Glasses{" "}
              </div>
              <div className="flex w-2/4 h-full justify-centre items-center  ">
                <div
                  className="w-full h-full bg-[#dfcbca] text-white flex items-center justify-center 
            [clip-path:polygon(0%_0%,100%_0%,100%_100%,25%_100%,0%_0%)]"
                >
                  <img
                    className="  object-cover  h-full md:h-auto  "
                    src="glasses-man.png"
                  />
                </div>
              </div>
            </div>
            <div
              onClick={() => switchLenses("hats")}
              className="flex justify-end h-28  items-center bg-[#cce3eb]   flex-row md:max-w-xl  "
            >
              <div className=" w-2/4 text-bold text-2xl text-center">Hats </div>
              <div className="flex w-2/4 h-full justify-centre items-center  ">
                <div
                  className="w-full h-full bg-[#b4d9e9] text-white flex items-center justify-center 
            [clip-path:polygon(0%_0%,100%_0%,100%_100%,25%_100%,0%_0%)]"
                >
                  <img
                    className="  object-cover  h-full md:h-auto  "
                    src="glasses-man.png"
                  />
                </div>
              </div>
            </div>
            <div
              onClick={() => switchLenses("lipsticks")}
              className="flex justify-end h-28  items-center bg-[#ebebeb]   flex-row md:max-w-xl  "
            >
              <div className=" w-2/4 text-bold text-2xl text-center">
                Lipsticks{" "}
              </div>
              <div className="flex w-2/4 h-full justify-centre items-center  ">
                <div
                  className="w-full h-full bg-[#ebebeb] text-white flex items-center justify-center 
            [clip-path:polygon(0%_0%,100%_0%,100%_100%,25%_100%,0%_0%)]"
                >
                  <img
                    className="  object-cover  h-full md:h-auto  "
                    src="glasses-man.png"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelectionPage;
