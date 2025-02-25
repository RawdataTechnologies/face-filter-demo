import { useNavigate } from "react-router";
import filterStore from "../store/filterStore";

function PreviewPage() {
  const navigate = useNavigate();
  const { images } = filterStore();
  return (
    <div className="w-full bg-white h-screen font-[400] text-lg flex flex-col gap-5 items-center justify-center">
      <div className="w-9/12 text-pretty text-center text-primary">
        <span> </span>
      </div>
      <div className="w-fit h-fit  border-[4px] border-primary rounded-md">
        {!!images.length && (
          <img
            src={images.at(-1)?.url ?? ""}
            alt="Image preview"
            className="rounded-md w-[300px] h-[300px]"
          />
        )}
      </div>
      <button
        onClick={() => {
          navigate("/");
        }}
        className="bg-transparent hover:bg-slate-900  text-slate-900 font-semibold hover:cursor-pointer hover:text-white py-2 px-4 border border-slate-900 hover:border-transparent rounded"
      >
        Save
      </button>
    </div>
  );
}

export default PreviewPage;
