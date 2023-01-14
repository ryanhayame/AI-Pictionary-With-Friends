import React from "react";
import { FileUploader } from "react-drag-drop-files";

const fileTypes = ["JPG", "PNG", "JFIF"];

function DragDrop(props) {

  const handleChange = (file) => {
    props.setFile(file);
  };
  
  return (
    <FileUploader handleChange={handleChange} name="file" types={fileTypes} />
  );
}

export default DragDrop;