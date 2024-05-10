import React, { useState } from "react";
import axios from "axios";

const ASL = () => {
  const [predictions, setPrediction] = useState([]);
  const [isSubmitted, setisSubmitted] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const [msg, setmsg] = useState("");
  const [Ismsg, setIsmsg] = useState(false);

  const close_msg = () => {
    setIsmsg(false)
  }


  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles([...selectedFiles, ...files]);
    console.log("added files")
  };

  const removeFile = (index) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
    console.log("removed files")
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (selectedFiles.length === 0) {
      console.error("No files selected");
      setmsg("No files selected");
      setIsmsg(true);
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file, index) => {
      formData.append(`image${index}`, file);
    });

    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", formData);

      setPrediction(response.data.predictions);
      setisSubmitted(true);
    } catch (error) {
      console.error("Error occurred while making prediction:", error);
      setmsg("Error occurred while making prediction. See console for more details");
      setIsmsg(true);
    }
  };


  return (
    <div className="mx-12 h-screen flex items-center flex-col justify-center">
      
      <div className="flex flex-col items-center justify-center rounded-lg border-2 ring-2 ring-slate-400 w-[70%] h-40 my-8 bg-gradient-to-br from-SoftGreen to-PaleBlue shadow-lg">
        <h1 className="text-6xl text-center font-semibold text-slate-600">
          Gesture Guide
        </h1>
        <span className="text-2xl text-center font-semibold text-slate-500">
          Identify ASL Sign Language Gestures
        </span>
      </div>
      <form onSubmit={handleSubmit} className="my-8 w-full lg:w-[80%]">
        <div className="flex flex-row space-x-4 justify-between flex-wrap">
          <label htmlFor="uploadImage">
            <input
              type="file"
              id="uploadImage"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <Btn text="Upload Image" />
          </label>
          <div className="flex flex-wrap items-center justify-center">
          {selectedFiles.filter(file => file).map((file, index) => (
            <div key={index} className="relative">
              <img
                src={URL.createObjectURL(file)}
                alt={`Image ${index}`}
                className="w-24 h-24 object-cover rounded-lg mr-2"
              />
              <button
                className="absolute -top-1 right-1 bg-red-400 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                onClick={() => removeFile(index)}
              >
                &#x2715;
              </button>
            </div>
          ))}

          </div>
        </div>
        <button type="submit" className="rounded-2xl mt-12 px-4 py-2 text-4xl bg-green-200 border-2 border-slate-800 text-emerald-900">Predict</button>
      </form>
      {isSubmitted && (
        <div className="flex-row flex space-x-4">
          {predictions.map((prediction, index) => (
            <div key={index} className="mt-8 flex flex-col items-center justify-center">
              <img
                src={URL.createObjectURL(selectedFiles[index])}
                alt={`Image ${index}`}
                className="w-20 h-20 object-cover rounded-lg mr-2"
              />
              <p className="px-4 py-2 text-4xl font-semibold text-emerald-950 shadow-sm font">
                {prediction}
              </p>
            </div>
          ))}
        </div>
      )}
     {Ismsg && <ErrorMessage message={msg} onClose={close_msg} />}
    </div>
  );
};

export default ASL;


const Btn = (props) => {
  return (
    <span
      className="flex border-none bg-green-100 dark:bg-zinc-800 dark:text-white shadow-input rounded-md px-3 py-2
      placeholder:text-neutral-400 dark:placeholder-text-neutral-600 focus-visible:outline-none focus-visible:ring-[2px] 
      focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600 disabled:cursor-not-allowed disabled:opacity-50 dark:shadow-[0px_0px_1px_1px_var(--neutral-700)] group-hover/input:shadow-none transition duration-400
      items-center font-medium text-gray-600 hover:ring-2 cursor-pointer justify-center
      border-2 text-2xl border-slate-600 h-24 w-28 self-center ps-1 mt-3 ring-lime-950"
      onClick={props.onClick}
      style={{ transition: "all 0.3s" }}
    >
      {props.text}
    </span>
  );
};



const ErrorMessage = ({ message, onClose }) => {
 
  return (
    <div
      className={"fixed top-0 right-0 mr-4 mt-4 bg-red-100 border-2 border-red-400 text-red-700 px-4 py-2 rounded-md transition-opacity"}
    >
      <span className="mr-2">{message}</span>
      <button onClick={onClose} className="text-red-500 hover:text-red-700">
        &#x2715;
      </button>
    </div>
  );
};

