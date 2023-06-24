import React from "react";
import { FileUploader } from "react-drag-drop-files";

const fileTypes = ["JPG", "PNG", "JFIF", "JPEG"];

function DragDrop(props) {

  const handleChange = (file) => {
    props.setFile(file);
  };
  
  return (
    <div className="upload-container">
      <FileUploader handleChange={handleChange} label="Upload or drop a file here" name="file" types={fileTypes} />
    </div>
  );
}

export default DragDrop;