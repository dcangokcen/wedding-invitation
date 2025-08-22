import React, { useState, useEffect } from "react";
import { storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL, listAll } from "firebase/storage";

function PhotoUpload() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    const filesArr = Array.from(e.target.files || []);
    setSelectedFiles(filesArr);
    setPreviewUrls(filesArr.map((f) => URL.createObjectURL(f)));
  };

  const handleRemove = (index) => {
    const nf = [...selectedFiles];
    const np = [...previewUrls];
    nf.splice(index, 1);
    np.splice(index, 1);
    setSelectedFiles(nf);
    setPreviewUrls(np);
  };

  const fetchAllPhotos = async () => {
    try {
      const folderRef = ref(storage, "uploads");
      const res = await listAll(folderRef);
      const urls = await Promise.all(res.items.map((item) => getDownloadURL(item)));
      setUploadedPhotos(urls);
    } catch (e) {
      console.error("List error:", e);
    }
  };

  useEffect(() => {
    fetchAllPhotos();
  }, []);

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert("Lütfen en az bir fotoğraf seçin!");
      return;
    }

    setIsUploading(true);
    setProgress(0);

    try {
      const urls = [];

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const filename = `${Date.now()}_${file.name}`;
        const objectRef = ref(storage, `uploads/${filename}`);
        const metadata = { contentType: file.type || "application/octet-stream" };
        const task = uploadBytesResumable(objectRef, file, metadata);

        await new Promise((resolve, reject) => {
          task.on(
            "state_changed",
            (snap) => {
              const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
              setProgress(pct);
            },
            (err) => reject(err),
            async () => {
              const url = await getDownloadURL(task.snapshot.ref);
              urls.push(url);
              resolve();
            }
          );
        });
      }

      setUploadedPhotos((prev) => [...prev, ...urls]);
      setSelectedFiles([]);
      setPreviewUrls([]);
      setProgress(100);
      await fetchAllPhotos();
      alert("Fotoğraflar başarıyla yüklendi!");
    } catch (err) {
      alert(`Yükleme sırasında hata oluştu.\n${err?.code || ""} ${err?.message || ""}`);
    } finally {
      setIsUploading(false);
      setTimeout(() => setProgress(0), 800);
    }
  };

  return (
    <div className="min-h-screen p-6" style={{ fontFamily: "Georgia, serif" }}>
      <h2 className="text-3xl font-extrabold mb-6 text-center text-[#9CAF88]">
        Düğün Hatırası Yükle
      </h2>

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="mb-4 block w-full text-sm text-gray-700 bg-[#E6F0E6] border border-[#9CAF88] rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#9CAF88]"
      />

      {previewUrls.length > 0 && (
        <>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {previewUrls.map((url, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={url}
                  alt={`preview-${idx}`}
                  className="w-full h-24 object-cover rounded-lg shadow-md transition-transform group-hover:scale-105"
                />
                <button
                  onClick={() => handleRemove(idx)}
                  className="absolute top-1 right-1 bg-[#9CAF88] text-white rounded-full w-6 h-6 text-xs opacity-80 hover:opacity-100"
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
                : "bg-[#9CAF88] hover:bg-[#7F9E72] shadow-lg hover:shadow-xl"
            }`}
          >
            {isUploading ? `Yükleniyor... %${progress}` : "Fotoğrafları Yükle"}
          </button>
        </>
      )}

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-[#476347] mb-3">Tüm Fotoğraflar</h3>
        {uploadedPhotos.length === 0 ? (
          <p className="text-sm text-gray-600">Henüz fotoğraf yok.</p>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {uploadedPhotos.map((url, idx) => (
              <a key={idx} href={url} target="_blank" rel="noreferrer">
                <img
                  src={url}
                  alt={`uploaded-${idx}`}
                  className="w-full h-24 object-cover rounded-lg shadow"
                  loading="lazy"
                />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PhotoUpload;
