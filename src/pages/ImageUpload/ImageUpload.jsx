
import { useCallback, useEffect, useRef, useState } from "react";
import AppShell from "../../components/layout/AppShell.jsx";
import SectionTitle from "../../components/ui/SectionTitle.jsx";

async function uploadShelfImage(file, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open("POST", "/api/shelf-images");

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch {
          resolve({
            id: crypto.randomUUID(),
            status: "queued",
          });
        }
      } else {
        reject(new Error(`Upload failed (${xhr.status})`));
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error during upload"));
    };

    const form = new FormData();
    form.append("image", file);

    xhr.send(form);
  });
}


const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const MAX_SIZE_MB = 15;


function bytesToSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(0)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}


function validateFile(file) {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return "Unsupported format. Use JPG, PNG, or WEBP.";
  }

  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return `File exceeds ${MAX_SIZE_MB} MB.`;
  }

  return null;
}


let uid = 0;

const nextId = () =>
  `file_${++uid}_${Date.now()}`;



const Icon = {

  Upload: (props) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      {...props}
    >
      <path
        d="M12 16V4M12 4L7 9M12 4l5 5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),


  Image: (props) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      {...props}
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.5" cy="9.5" r="1.5" />
      <path
        d="M21 15l-5-5-9 9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),


  Check: (props) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...props}
    >
      <path
        d="M5 13l4 4L19 7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),


  Dot: (props) => (
    <svg
      viewBox="0 0 8 8"
      fill="currentColor"
      {...props}
    >
      <circle cx="4" cy="4" r="4" />
    </svg>
  ),
};



export default function ImageUpload({ onNavigateToResults }) {


  const navigate = (path) => {
    if (onNavigateToResults) {
      onNavigateToResults(path);
    } else {
      console.log("Navigate:", path);
    }
  };


  const [items, setItems] = useState([]);

  const [isDragging, setIsDragging] = useState(false);

  const dragCounter = useRef(0);

  const inputRef = useRef(null);



  useEffect(() => {

    return () => {
      items.forEach((item) =>
        URL.revokeObjectURL(item.previewUrl)
      );
    };

  }, []);



  const startUpload = useCallback(
    (id, file) => {

      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                status: "uploading",
                progress: 0,
              }
            : item
        )
      );


      uploadShelfImage(
        file,
        (progress) => {

          setItems((prev) =>
            prev.map((item) =>
              item.id === id
                ? {
                    ...item,
                    progress,
                  }
                : item
            )
          );

        }
      )

      .then((result) => {

        setItems((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  status: "done",
                  progress: 100,
                  resultId: result.id,
                }
              : item
          )
        );

      })


      .catch((error) => {

        setItems((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  status: "error",
                  error: error.message,
                }
              : item
          )
        );

      });


    },
    []
  );



  const addFiles = useCallback(
    (files) => {

      const prepared = Array.from(files).map((file) => {

        const error = validateFile(file);

        return {
          id: nextId(),
          file,
          previewUrl: URL.createObjectURL(file),
          status: error ? "rejected" : "queued",
          progress: 0,
          error,
        };

      });


      setItems((prev) => [
        ...prev,
        ...prepared,
      ]);


      prepared
        .filter((item) => item.status === "queued")
        .forEach((item) =>
          startUpload(item.id, item.file)
        );


    },
    [startUpload]
  );
    const retry = (id) => {
    const item = items.find((it) => it.id === id);

    if (item) {
      startUpload(id, item.file);
    }
  };


  const removeItem = (id) => {

    setItems((prev) => {

      const target = prev.find(
        (item) => item.id === id
      );

      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }

      return prev.filter(
        (item) => item.id !== id
      );

    });

  };


  const onDrop = (e) => {

    e.preventDefault();

    dragCounter.current = 0;

    setIsDragging(false);


    if (e.dataTransfer.files?.length) {
      addFiles(e.dataTransfer.files);
    }

  };


  const onDragEnter = (e) => {

    e.preventDefault();

    dragCounter.current += 1;

    setIsDragging(true);

  };


  const onDragLeave = (e) => {

    e.preventDefault();

    dragCounter.current -= 1;

    if (dragCounter.current <= 0) {
      setIsDragging(false);
    }

  };


  const doneCount = items.filter(
    (item) => item.status === "done"
  ).length;


  const errorCount = items.filter(
    (item) =>
      item.status === "error" ||
      item.status === "rejected"
  ).length;


  const hasUploading = items.some(
    (item) => item.status === "uploading"
  );


  const conformity = items.length
    ? Math.round((doneCount / items.length) * 100)
    : 0;



  return (

    <AppShell>

      <div className="space-y-8">


        <SectionTitle
          title="Upload Shelf Images"
          subtitle="Upload shelf images for AI-powered retail analysis."
        />



        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">


          {/* Upload Section */}

          <div className="card-glass p-8">


            <div
              className={`rounded-[24px] border border-dashed p-12 text-center cursor-pointer transition ${
                isDragging
                  ? "border-brand bg-white/10"
                  : "border-white/10"
              }`}
              
              onClick={() =>
                inputRef.current?.click()
              }

              onDrop={onDrop}

              onDragOver={(e) =>
                e.preventDefault()
              }

              onDragEnter={onDragEnter}

              onDragLeave={onDragLeave}

            >


              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-brand">

                <Icon.Upload className="h-6 w-6"/>

              </div>


              <h3 className="mt-5 text-xl font-semibold text-white">

                {isDragging
                  ? "Drop images here"
                  : "Drag shelf photos here"}

              </h3>


              <p className="mt-2 text-sm text-muted">

                JPG, PNG, WEBP • Maximum {MAX_SIZE_MB}MB

              </p>



              <input

                ref={inputRef}

                type="file"

                accept={ACCEPTED_TYPES.join(",")}

                multiple

                className="hidden"

                onChange={(e)=>{

                  if(e.target.files?.length){
                    addFiles(e.target.files);
                  }

                  e.target.value="";

                }}

              />


            </div>





            {/* Uploaded Images */}


            {items.length > 0 && (

              <div className="mt-8">


                <div className="mb-4 flex justify-between">

                  <p className="text-sm text-muted">

                    {items.length} Images • {doneCount} Uploaded

                  </p>


                  {doneCount > 0 && (

                    <button

                      onClick={() =>
                        navigate("/detection-results")
                      }

                      className="text-sm text-brand"

                    >

                      View Results →

                    </button>

                  )}

                </div>




                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">


                  {items.map((item)=>(


                    <div
                      key={item.id}
                      className="overflow-hidden rounded-[22px] border border-white/10 bg-white/5"
                    >


                      <img

                        src={item.previewUrl}

                        alt={item.file.name}

                        className="aspect-square w-full object-cover"

                      />



                      <div className="p-4">


                        <p className="truncate text-sm font-medium text-white">

                          {item.file.name}

                        </p>



                        <p className="mt-1 text-xs text-muted">

                          {bytesToSize(item.file.size)}

                        </p>




                        {item.status === "uploading" && (

                          <div className="mt-3 h-2 rounded-full bg-white/10">

                            <div

                              className="h-full rounded-full bg-gradient-to-r from-purple-400 to-pink-500"

                              style={{
                                width:`${item.progress}%`
                              }}

                            />

                          </div>

                        )}




                        <div className="mt-3 flex justify-between">


                          <span className="text-xs text-muted">

                            {item.status}

                          </span>



                          {item.status==="done" && (

                            <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">

                              Verified

                            </span>

                          )}



                        </div>




                        {item.status==="error" && (

                          <button

                            onClick={()=>retry(item.id)}

                            className="mt-2 text-xs text-brand"

                          >

                            Retry

                          </button>

                        )}




                        <button

                          onClick={()=>removeItem(item.id)}

                          className="mt-2 block text-xs text-muted"

                        >

                          Remove

                        </button>


                      </div>


                    </div>


                  ))}


                </div>


              </div>

            )}



            <button

              disabled={
                doneCount===0 ||
                hasUploading
              }

              onClick={() =>
                navigate("/detection-results")
              }

              className="mt-8 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 text-sm font-semibold text-white disabled:opacity-40"

            >

              {hasUploading
                ? "Uploading..."
                : `Continue to Results (${doneCount})`}

            </button>



          </div>







          {/* Summary Card */}


          <div className="card-glass p-8">


            <p className="text-sm uppercase tracking-[0.28em] text-lavender/80">

              Upload Snapshot

            </p>



            <h2 className="mt-3 text-2xl font-semibold text-white">

              Session Summary

            </h2>



            <p className="mt-3 text-sm leading-7 text-muted">

              Live information about uploaded shelf images and AI analysis readiness.

            </p>




            <div className="mt-6 space-y-4">


              <div className="rounded-[22px] border border-white/10 bg-white/5 p-5">

                <p className="text-sm text-muted">

                  Files uploaded

                </p>

                <p className="mt-2 text-3xl font-bold text-white">

                  {items.length}

                </p>

              </div>




              <div className="rounded-[22px] border border-white/10 bg-white/5 p-5">

                <p className="text-sm text-muted">

                  Upload conformity

                </p>


                <p className="mt-2 text-3xl font-bold text-white">

                  {conformity}%

                </p>


              </div>





              {errorCount > 0 && (

                <div className="rounded-[22px] border border-red-400/20 bg-red-400/10 p-5">

                  <p className="text-sm text-red-300">

                    Needs attention

                  </p>


                  <p className="mt-2 text-3xl font-bold text-white">

                    {errorCount}

                  </p>

                </div>

              )}



            </div>


          </div>



        </div>


      </div>


    </AppShell>

  );

}