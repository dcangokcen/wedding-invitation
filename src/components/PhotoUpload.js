import React, { useState } from "react";

function PhotoUpload() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const handleRemove = (index) => {
    const newFiles = [...selectedFiles];
    const newPreviews = [...previewUrls];
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    setSelectedFiles(newFiles);
    setPreviewUrls(newPreviews);
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) {
      alert("Lütfen en az bir fotoğraf seçin!");
      return;
    }
    setIsUploading(true);

    setTimeout(() => {
      setUploadedPhotos(prev => [...prev, ...previewUrls]);
      setSelectedFiles([]);
      setPreviewUrls([]);
      setIsUploading(false);
      alert("Fotoğraflar başarıyla yüklendi (simülasyon).");
    }, 2000);
  };

  return (
    <div>
      <h2 className="text-3xl font-extrabold mb-6 text-center text-pink-700">
        Düğün Hatırası Yükle
      </h2>

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="mb-4 block w-full text-sm text-gray-700 bg-pink-50 border border-pink-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-pink-400"
      />

      {previewUrls.length > 0 && (
        <>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {previewUrls.map((url, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={url}
                  alt={`preview-${idx}`}
                  className="w-full h-24 object-cover rounded-lg shadow-md transition-transform transform group-hover:scale-105"
                />
                <button
                  onClick={() => handleRemove(idx)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs opacity-80 hover:opacity-100"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={handleUpload}
            disabled={isUploading}
            className={`px-6 py-3 rounded-lg text-white font-semibold w-full transition ${
              isUploading
                ? "bg-gray-400"
                : "bg-pink-500 hover:bg-pink-600 shadow-lg hover:shadow-xl"
            }`}
          >
            {isUploading ? "Yükleniyor..." : "Fotoğrafları Yükle"}
          </button>
        </>
      )}

      {uploadedPhotos.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-pink-800 mb-3">
            Yüklenen Fotoğraflar (Tarayıcıda)
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {uploadedPhotos.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`uploaded-${idx}`}
                className="w-full h-24 object-cover rounded-lg shadow"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PhotoUpload;
