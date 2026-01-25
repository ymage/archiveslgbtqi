"use client";
import { useState, useEffect } from "react";


type Props = {
  item: {
    fileUrl: string
  }
 
};
const FileModule = ( {item} : Props) => {
   const [isMobile, setIsMobile] = useState(false);
   useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!item.fileUrl) return null;
  return isMobile ? (
    <div className="p-4 flex justify-center items-center">

      <a
        href={item.fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="linkButton"
      >
        Ouvrir le PDF
      </a>
    </div>
  ) : (
    <iframe
      src={item.fileUrl}
      width="100%"
      height="700px"
      style={{ border: "none" }}
    ></iframe>
  );
};

export default FileModule;